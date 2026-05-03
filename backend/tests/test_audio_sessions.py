"""Backend tests for new audio upload/list/stream/delete & session mgmt endpoints."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ['REACT_APP_BACKEND_URL'].rstrip('/')
API = f"{BASE_URL}/api"
DEVICE_ID = f"TEST_device_{uuid.uuid4().hex[:8]}"


@pytest.fixture(scope="module")
def s():
    sess = requests.Session()
    yield sess


def _mk_audio_bytes(size=256):
    # Random bytes work fine; server is permissive about audio/* ct
    return os.urandom(size)


class TestAudioUpload:
    created_ids = []

    def test_upload_prayer(self, s):
        files = {"file": ("bapa.mp3", _mk_audio_bytes(300), "audio/mpeg")}
        data = {"kind": "prayer", "ref_id": "bapa-kami", "title": "TEST_bapa"}
        r = s.post(f"{API}/audio/upload", data=data, files=files, timeout=15)
        assert r.status_code == 200, r.text
        j = r.json()
        assert j["kind"] == "prayer"
        assert j["ref_id"] == "bapa-kami"
        assert j["content_type"] == "audio/mpeg"
        assert j["size"] == 300
        assert "id" in j
        TestAudioUpload.created_ids.append(j["id"])

    def test_upload_event(self, s):
        files = {"file": ("g1.mp3", _mk_audio_bytes(400), "audio/mpeg")}
        data = {"kind": "event", "ref_id": "gembira:1", "title": "TEST_g1"}
        r = s.post(f"{API}/audio/upload", data=data, files=files, timeout=15)
        assert r.status_code == 200, r.text
        j = r.json()
        assert j["kind"] == "event"
        assert j["ref_id"] == "gembira:1"
        TestAudioUpload.created_ids.append(j["id"])

    def test_upload_invalid_kind(self, s):
        files = {"file": ("x.mp3", _mk_audio_bytes(100), "audio/mpeg")}
        data = {"kind": "invalid", "ref_id": "xyz"}
        r = s.post(f"{API}/audio/upload", data=data, files=files, timeout=15)
        assert r.status_code == 400

    def test_upload_empty_file(self, s):
        files = {"file": ("empty.mp3", b"", "audio/mpeg")}
        data = {"kind": "prayer", "ref_id": "salam-maria"}
        r = s.post(f"{API}/audio/upload", data=data, files=files, timeout=15)
        assert r.status_code == 400

    def test_upload_non_audio_ct(self, s):
        files = {"file": ("doc.txt", b"not audio here", "text/plain")}
        data = {"kind": "prayer", "ref_id": "salam-maria"}
        r = s.post(f"{API}/audio/upload", data=data, files=files, timeout=15)
        assert r.status_code == 400

    def test_replace_on_same_kind_ref(self, s):
        # Upload a new one for same (prayer, bapa-kami) -> old one should be removed
        files = {"file": ("bapa2.mp3", _mk_audio_bytes(512), "audio/mpeg")}
        data = {"kind": "prayer", "ref_id": "bapa-kami", "title": "TEST_bapa_v2"}
        r = s.post(f"{API}/audio/upload", data=data, files=files, timeout=15)
        assert r.status_code == 200
        new_id = r.json()["id"]
        # list by filter — should have only one for this pair
        r2 = s.get(f"{API}/audio", params={"kind": "prayer", "ref_id": "bapa-kami"}, timeout=10)
        assert r2.status_code == 200
        items = r2.json()
        assert len(items) == 1
        assert items[0]["id"] == new_id
        # replace old id in tracking
        TestAudioUpload.created_ids = [
            i for i in TestAudioUpload.created_ids if i != TestAudioUpload.created_ids[0]
        ]
        TestAudioUpload.created_ids.append(new_id)


class TestAudioListStream:
    def test_list_all(self, s):
        r = s.get(f"{API}/audio", timeout=10)
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        assert len(items) >= 1

    def test_list_filtered(self, s):
        r = s.get(f"{API}/audio", params={"kind": "event", "ref_id": "gembira:1"}, timeout=10)
        assert r.status_code == 200
        items = r.json()
        assert len(items) >= 1
        assert all(i["kind"] == "event" and i["ref_id"] == "gembira:1" for i in items)

    def test_stream_ok(self, s):
        r = s.get(f"{API}/audio", params={"kind": "prayer", "ref_id": "bapa-kami"}, timeout=10)
        aid = r.json()[0]["id"]
        size = r.json()[0]["size"]
        r2 = s.get(f"{API}/audio/{aid}/stream", timeout=15)
        assert r2.status_code == 200
        assert r2.headers.get("content-type", "").startswith("audio/")
        assert len(r2.content) == size

    def test_stream_invalid_id(self, s):
        r = s.get(f"{API}/audio/not-a-valid-oid/stream", timeout=10)
        assert r.status_code == 400

    def test_stream_nonexistent_valid_id(self, s):
        # Valid ObjectId format but not in DB
        fake_oid = "507f1f77bcf86cd799439011"
        r = s.get(f"{API}/audio/{fake_oid}/stream", timeout=10)
        assert r.status_code == 404


class TestAudioDelete:
    def test_delete_cleanup(self, s):
        # Delete all TEST-created audios
        r = s.get(f"{API}/audio", timeout=10)
        for a in r.json():
            if a.get("title", "").startswith("TEST_") or a["ref_id"] in ("bapa-kami", "gembira:1"):
                dr = s.delete(f"{API}/audio/{a['id']}", timeout=10)
                assert dr.status_code == 200
        # verify gone
        r2 = s.get(f"{API}/audio", params={"kind": "prayer", "ref_id": "bapa-kami"}, timeout=10)
        assert all(i["ref_id"] != "bapa-kami" for i in r2.json())


class TestSessionMgmt:
    sid = None

    def test_create(self, s):
        r = s.post(f"{API}/sessions", json={"device_id": DEVICE_ID, "mystery_id": "sedih"}, timeout=10)
        assert r.status_code == 200
        TestSessionMgmt.sid = r.json()["id"]

    def test_list_sorted(self, s):
        # create a second session then list — newest first
        r = s.post(f"{API}/sessions", json={"device_id": DEVICE_ID, "mystery_id": "gembira"}, timeout=10)
        assert r.status_code == 200
        sid2 = r.json()["id"]
        r2 = s.get(f"{API}/sessions", params={"device_id": DEVICE_ID}, timeout=10)
        assert r2.status_code == 200
        items = r2.json()
        assert len(items) >= 2
        # newest first
        assert items[0]["id"] == sid2
        # cleanup
        s.delete(f"{API}/sessions/{sid2}", timeout=10)

    def test_stats_last_completed(self, s):
        # complete the one we have
        r = s.post(f"{API}/sessions/{TestSessionMgmt.sid}/complete", timeout=10)
        assert r.status_code == 200
        r2 = s.get(f"{API}/sessions/stats", params={"device_id": DEVICE_ID}, timeout=10)
        assert r2.status_code == 200
        j = r2.json()
        assert "last_completed_at" in j
        assert j["last_completed_at"] is not None

    def test_delete_session(self, s):
        r = s.delete(f"{API}/sessions/{TestSessionMgmt.sid}", timeout=10)
        assert r.status_code == 200
        r2 = s.get(f"{API}/sessions", params={"device_id": DEVICE_ID}, timeout=10)
        assert all(it["id"] != TestSessionMgmt.sid for it in r2.json())

    def test_delete_nonexistent(self, s):
        r = s.delete(f"{API}/sessions/nope-id", timeout=10)
        assert r.status_code == 404
