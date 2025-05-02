from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from pydantic import BaseModel, EmailStr
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models import Client, get_db

SECRET_KEY = "SECRET_TOKEN_340924U3207Y4BJIADAWDARTAW"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


class ClientCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    password: str

class ClientLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class ClientOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr

    class Config:
        orm_mode = True


async def get_client_by_email(db: AsyncSession, email: str) -> Client | None:
    result = await db.execute(select(Client).where(Client.email == email))
    return result.scalar_one_or_none()

async def create_client(db: AsyncSession, full_name: str, email: str, phone: str, password: str) -> Client:
    hashed_password = get_password_hash(password)
    client = Client(full_name=full_name, email=email, phone=phone, password_hash=hashed_password)
    db.add(client)
    await db.commit()
    await db.refresh(client)
    return client

async def authenticate_client(db: AsyncSession, email: str, password: str) -> Client | None:
    client = await get_client_by_email(db, email)
    if client and verify_password(password, client.password_hash):
        return client
    return None


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

async def get_current_client(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)) -> Client:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))
    except (JWTError, ValueError, TypeError):
        raise HTTPException(status_code=401, detail="Invalid token")

    result = await db.execute(select(Client).where(Client.id == user_id))
    client = result.scalar_one_or_none()

    if not client:
        raise HTTPException(status_code=404, detail="User not found")

    return client


router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=ClientOut)
async def register(data: ClientCreate, db: AsyncSession = Depends(get_db)):
    if await get_client_by_email(db, str(data.email)):
        raise HTTPException(status_code=400, detail="Email уже зарегистрирован")
    return await create_client(db, data.full_name, str(data.email), data.phone, data.password)

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    client = await authenticate_client(db, form_data.username, form_data.password)
    if not client:
        raise HTTPException(status_code=401, detail="Неверные данные")
    token = create_access_token({"sub": str(client.id)})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me", response_model=ClientOut)
async def read_me(current_user: Client = Depends(get_current_client)):
    return current_user
