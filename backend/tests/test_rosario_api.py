"""Backend API tests for Rosario app - intentions, sessions, health"""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://khusyuk-doa.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"
DEVICE_ID = f"TEST_device_{uuid.uuid4().hex[:8]}"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    yield s
    # cleanup: delete any TEST intentions
    try:
        r = s.get(f"{API}/intentions", params={"device_id": DEVICE_ID}, timeout=10)
        if r.status_code == 200:
            for item in r.json():
                s.delete(f"{API}/intentions/{item['id']}", timeout=10)
    except Exception:
        pass


# Health
def test_health(session):
    r = session.get(f"{API}/health", timeout=10)
    assert r.status_code == 200
    assert r.json().get("status") == "healthy"


# Intentions CRUD
class TestIntentions:
    created_id = None

    def test_create(self, session):
        r = session.post(f"{API}/intentions", json={
            "device_id": DEVICE_ID, "text": "TEST_doa keluarga", "category": "keluarga"
        }, timeout=10)
        assert r.status_code == 200
        data = r.json()
        assert data["text"] == "TEST_doa keluarga"
        assert data["device_id"] == DEVICE_ID
        assert data["category"] == "keluarga"
        assert "id" in data
        TestIntentions.created_id = data["id"]

    def test_list(self, session):
        r = session.get(f"{API}/intentions", params={"device_id": DEVICE_ID}, timeout=10)
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        assert any(it["id"] == TestIntentions.created_id for it in items)

    def test_update(self, session):
        assert TestIntentions.created_id
        r = session.put(f"{API}/intentions/{TestIntentions.created_id}", json={
            "text": "TEST_updated text"
        }, timeout=10)
        assert r.status_code == 200
        assert r.json()["text"] == "TEST_updated text"
        # verify persistence via GET list
        r2 = session.get(f"{API}/intentions", params={"device_id": DEVICE_ID}, timeout=10)
        assert any(it["id"] == TestIntentions.created_id and it["text"] == "TEST_updated text" for it in r2.json())

    def test_delete(self, session):
        assert TestIntentions.created_id
        r = session.delete(f"{API}/intentions/{TestIntentions.created_id}", timeout=10)
        assert r.status_code == 200
        # verify removed
        r2 = session.get(f"{API}/intentions", params={"device_id": DEVICE_ID}, timeout=10)
        assert not any(it["id"] == TestIntentions.created_id for it in r2.json())

    def test_update_nonexistent(self, session):
        r = session.put(f"{API}/intentions/nonexistent-id", json={"text": "x"}, timeout=10)
        assert r.status_code == 404

    def test_delete_nonexistent(self, session):
        r = session.delete(f"{API}/intentions/nonexistent-id", timeout=10)
        assert r.status_code == 404


# Sessions
class TestSessions:
    session_id = None

    def test_create_session(self, session):
        r = session.post(f"{API}/sessions", json={
            "device_id": DEVICE_ID, "mystery_id": "gembira"
        }, timeout=10)
        assert r.status_code == 200
        data = r.json()
        assert data["mystery_id"] == "gembira"
        assert data["completed"] is False
        assert "id" in data
        TestSessions.session_id = data["id"]

    def test_stats_before_complete(self, session):
        r = session.get(f"{API}/sessions/stats", params={"device_id": DEVICE_ID}, timeout=10)
        assert r.status_code == 200
        data = r.json()
        assert data["total"] >= 1
        completed_before = data["completed"]
        assert isinstance(completed_before, int)

    def test_complete_session(self, session):
        assert TestSessions.session_id
        r = session.post(f"{API}/sessions/{TestSessions.session_id}/complete", timeout=10)
        assert r.status_code == 200
        data = r.json()
        assert data["completed"] is True
        assert data["completed_at"] is not None

    def test_stats_after_complete(self, session):
        r = session.get(f"{API}/sessions/stats", params={"device_id": DEVICE_ID}, timeout=10)
        assert r.status_code == 200
        data = r.json()
        assert data["completed"] >= 1
        assert data["total"] >= data["completed"]

    def test_complete_nonexistent(self, session):
        r = session.post(f"{API}/sessions/nonexistent-id/complete", timeout=10)
        assert r.status_code == 404
