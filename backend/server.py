from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
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

app = FastAPI(title="Rosario API")
api_router = APIRouter(prefix="/api")


# ---------- Models ----------

class Intention(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    device_id: str
    text: str
    category: Optional[str] = None  # e.g., "keluarga", "kesehatan", "umum"
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


class SessionComplete(BaseModel):
    completed_at: Optional[datetime] = None


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


# Intentions CRUD
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


# Prayer sessions (history)
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
async def list_sessions(device_id: str, limit: int = 50):
    cursor = db.sessions.find({"device_id": device_id}, {"_id": 0}).sort("started_at", -1)
    items = await cursor.to_list(limit)
    return [PrayerSession(**_parse_dt(it)) for it in items]


@api_router.get("/sessions/stats")
async def session_stats(device_id: str):
    total = await db.sessions.count_documents({"device_id": device_id})
    completed = await db.sessions.count_documents({"device_id": device_id, "completed": True})
    return {"total": total, "completed": completed}


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
