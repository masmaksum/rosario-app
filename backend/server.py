from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorGridFSBucket
from bson import ObjectId
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]
audio_bucket = AsyncIOMotorGridFSBucket(db, bucket_name="audio")

app = FastAPI(title="Rosario API")
api_router = APIRouter(prefix="/api")


# ---------- Models ----------

class Intention(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    device_id: str
    text: str
    category: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class IntentionCreate(BaseModel):
    device_id: str
    text: str
    category: Optional[str] = None


class IntentionUpdate(BaseModel):
    text: Optional[str] = None
    category: Optional[str] = None


class PrayerSession(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    device_id: str
    mystery_id: str
    completed: bool = False
    started_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    completed_at: Optional[datetime] = None


class SessionCreate(BaseModel):
    device_id: str
    mystery_id: str


class AudioMeta(BaseModel):
    id: str
    kind: str  # "prayer" | "event"
    ref_id: str  # prayer_id e.g. "bapa-kami"  OR  "{mystery_id}:{order}" e.g. "gembira:1"
    title: Optional[str] = None
    content_type: str
    size: int
    uploaded_at: Optional[str] = None


# ---------- Helpers ----------

def _serialize_dt(doc: dict) -> dict:
    for k, v in list(doc.items()):
        if isinstance(v, datetime):
            doc[k] = v.isoformat()
    return doc


def _parse_dt(doc: dict) -> dict:
    for k in ("created_at", "updated_at", "started_at", "completed_at"):
        if k in doc and isinstance(doc[k], str):
            try:
                doc[k] = datetime.fromisoformat(doc[k])
            except Exception:
                pass
    return doc


# ---------- Routes ----------

@api_router.get("/")
async def root():
    return {"message": "Rosario API", "status": "ok"}


@api_router.get("/health")
async def health():
    return {"status": "healthy"}


# --- Intentions CRUD ---
@api_router.post("/intentions", response_model=Intention)
async def create_intention(payload: IntentionCreate):
    obj = Intention(**payload.model_dump())
    doc = _serialize_dt(obj.model_dump())
    await db.intentions.insert_one(doc)
    return obj


@api_router.get("/intentions", response_model=List[Intention])
async def list_intentions(device_id: str):
    cursor = db.intentions.find({"device_id": device_id}, {"_id": 0}).sort("created_at", -1)
    items = await cursor.to_list(1000)
    return [Intention(**_parse_dt(it)) for it in items]


@api_router.put("/intentions/{intention_id}", response_model=Intention)
async def update_intention(intention_id: str, payload: IntentionUpdate):
    update = {k: v for k, v in payload.model_dump().items() if v is not None}
    update["updated_at"] = datetime.now(timezone.utc).isoformat()
    result = await db.intentions.find_one_and_update(
        {"id": intention_id},
        {"$set": update},
        return_document=True,
        projection={"_id": 0},
    )
    if not result:
        raise HTTPException(status_code=404, detail="Intention not found")
    return Intention(**_parse_dt(result))


@api_router.delete("/intentions/{intention_id}")
async def delete_intention(intention_id: str):
    result = await db.intentions.delete_one({"id": intention_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Intention not found")
    return {"deleted": True, "id": intention_id}


# --- Prayer Sessions ---
@api_router.post("/sessions", response_model=PrayerSession)
async def start_session(payload: SessionCreate):
    obj = PrayerSession(**payload.model_dump())
    doc = _serialize_dt(obj.model_dump())
    await db.sessions.insert_one(doc)
    return obj


@api_router.post("/sessions/{session_id}/complete", response_model=PrayerSession)
async def complete_session(session_id: str):
    now = datetime.now(timezone.utc).isoformat()
    result = await db.sessions.find_one_and_update(
        {"id": session_id},
        {"$set": {"completed": True, "completed_at": now}},
        return_document=True,
        projection={"_id": 0},
    )
    if not result:
        raise HTTPException(status_code=404, detail="Session not found")
    return PrayerSession(**_parse_dt(result))


@api_router.get("/sessions", response_model=List[PrayerSession])
async def list_sessions(device_id: str, limit: int = 100):
    cursor = db.sessions.find({"device_id": device_id}, {"_id": 0}).sort("started_at", -1)
    items = await cursor.to_list(limit)
    return [PrayerSession(**_parse_dt(it)) for it in items]


@api_router.delete("/sessions/{session_id}")
async def delete_session(session_id: str):
    result = await db.sessions.delete_one({"id": session_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"deleted": True, "id": session_id}


@api_router.get("/sessions/stats")
async def session_stats(device_id: str):
    total = await db.sessions.count_documents({"device_id": device_id})
    completed = await db.sessions.count_documents({"device_id": device_id, "completed": True})
    # Last completed session (for "last prayed" info)
    last = await db.sessions.find_one(
        {"device_id": device_id, "completed": True},
        {"_id": 0},
        sort=[("completed_at", -1)],
    )
    return {
        "total": total,
        "completed": completed,
        "last_completed_at": (last or {}).get("completed_at"),
    }


# --- Audio (GridFS) ---

ALLOWED_AUDIO_TYPES = {
    "audio/mpeg", "audio/mp3", "audio/ogg", "audio/wav",
    "audio/webm", "audio/mp4", "audio/aac", "audio/x-m4a",
}


def _audio_doc_to_meta(doc: dict) -> dict:
    md = doc.get("metadata") or {}
    return {
        "id": str(doc["_id"]),
        "kind": md.get("kind", ""),
        "ref_id": md.get("ref_id", ""),
        "title": md.get("title"),
        "content_type": md.get("content_type", "audio/mpeg"),
        "size": int(doc.get("length", 0)),
        "uploaded_at": md.get("uploaded_at"),
    }


@api_router.post("/audio/upload", response_model=AudioMeta)
async def upload_audio(
    kind: str = Form(...),
    ref_id: str = Form(...),
    title: Optional[str] = Form(None),
    file: UploadFile = File(...),
):
    if kind not in ("prayer", "event"):
        raise HTTPException(status_code=400, detail="kind must be 'prayer' or 'event'")
    if not ref_id:
        raise HTTPException(status_code=400, detail="ref_id required")

    content_type = (file.content_type or "audio/mpeg").lower()
    if content_type not in ALLOWED_AUDIO_TYPES:
        # Don't reject based only on content-type; be permissive for common variants.
        if not content_type.startswith("audio/"):
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported content-type: {content_type}",
            )

    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="Empty file")
    # 25MB limit (soft)
    if len(data) > 25 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File too large (max 25MB)")

    # Replace-style: if an audio already exists for (kind, ref_id), delete previous.
    cursor = db["audio.files"].find({"metadata.kind": kind, "metadata.ref_id": ref_id})
    async for prev in cursor:
        try:
            await audio_bucket.delete(prev["_id"])
        except Exception:
            pass

    metadata = {
        "kind": kind,
        "ref_id": ref_id,
        "title": title,
        "content_type": content_type,
        "uploaded_at": datetime.now(timezone.utc).isoformat(),
    }
    file_id = await audio_bucket.upload_from_stream(
        file.filename or f"{ref_id}.audio",
        data,
        metadata=metadata,
    )

    return AudioMeta(
        id=str(file_id),
        kind=kind,
        ref_id=ref_id,
        title=title,
        content_type=content_type,
        size=len(data),
        uploaded_at=metadata["uploaded_at"],
    )


@api_router.get("/audio", response_model=List[AudioMeta])
async def list_audio(kind: Optional[str] = None, ref_id: Optional[str] = None):
    q: dict = {}
    if kind:
        q["metadata.kind"] = kind
    if ref_id:
        q["metadata.ref_id"] = ref_id
    cursor = db["audio.files"].find(q).sort("uploadDate", -1)
    items: list[dict] = []
    async for doc in cursor:
        items.append(_audio_doc_to_meta(doc))
    return [AudioMeta(**it) for it in items]


@api_router.get("/audio/{audio_id}/stream")
async def stream_audio(audio_id: str):
    try:
        oid = ObjectId(audio_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid id")

    # Fetch metadata for content-type
    doc = await db["audio.files"].find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Audio not found")
    ct = (doc.get("metadata") or {}).get("content_type", "audio/mpeg")
    size = int(doc.get("length", 0))

    try:
        grid_out = await audio_bucket.open_download_stream(oid)
    except Exception:
        raise HTTPException(status_code=404, detail="Audio not found")

    async def iter_chunks():
        try:
            while True:
                chunk = await grid_out.readchunk()
                if not chunk:
                    break
                yield chunk
        finally:
            # open_download_stream doesn't strictly need close, but keep for clarity
            pass

    headers = {
        "Accept-Ranges": "none",
        "Content-Length": str(size),
        "Cache-Control": "public, max-age=86400",
    }
    return StreamingResponse(iter_chunks(), media_type=ct, headers=headers)


@api_router.delete("/audio/{audio_id}")
async def delete_audio(audio_id: str):
    try:
        oid = ObjectId(audio_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid id")
    try:
        await audio_bucket.delete(oid)
    except Exception:
        raise HTTPException(status_code=404, detail="Audio not found")
    return {"deleted": True, "id": audio_id}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
