from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from models import Hotel, get_db
from permissions import staff_required

class HotelBase(BaseModel):
    name: str
    stars: int
    city_id: int

class HotelCreate(HotelBase):
    pass

class HotelUpdate(HotelBase):
    pass

class HotelOut(HotelBase):
    id: int

    class Config:
        orm_mode = True

router = APIRouter(prefix="/hotels", tags=["Отели"])

@router.get("/", response_model=List[HotelOut])
async def get_hotels(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Hotel))
    return result.scalars().all()

@router.get("/{hotel_id}", response_model=HotelOut)
async def get_hotel(hotel_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Hotel).where(Hotel.id == hotel_id))
    hotel = result.scalar_one_or_none()
    if not hotel:
        raise HTTPException(status_code=404, detail="Отель не найден")
    return hotel

@router.post("/", response_model=HotelOut)
async def create_hotel(
    hotel: HotelCreate,
    db: AsyncSession = Depends(get_db),
    _: Depends = Depends(staff_required),
):
    new_hotel = Hotel(**hotel.model_dump())
    db.add(new_hotel)
    await db.commit()
    await db.refresh(new_hotel)
    return new_hotel

@router.put("/{hotel_id}", response_model=HotelOut)
async def update_hotel(
    hotel_id: int,
    updated: HotelUpdate,
    db: AsyncSession = Depends(get_db),
    _: Depends = Depends(staff_required),
):
    result = await db.execute(select(Hotel).where(Hotel.id == hotel_id))
    hotel = result.scalar_one_or_none()
    if not hotel:
        raise HTTPException(status_code=404, detail="Отель не найден")
    hotel.name = updated.name
    hotel.stars = updated.stars
    hotel.city_id = updated.city_id
    await db.commit()
    await db.refresh(hotel)
    return hotel

@router.delete("/{hotel_id}")
async def delete_hotel(
    hotel_id: int,
    db: AsyncSession = Depends(get_db),
    _: Depends = Depends(staff_required),
):
    result = await db.execute(select(Hotel).where(Hotel.id == hotel_id))
    hotel = result.scalar_one_or_none()
    if not hotel:
        raise HTTPException(status_code=404, detail="Отель не найден")
    await db.delete(hotel)
    await db.commit()
    return {"detail": "Отель удалён"}
