from pydantic import BaseModel
from typing import List, Optional

from sqlalchemy.orm import selectinload
from models import TransportEnum


class TourTypeOut(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True

class HotelOut(BaseModel):
    id: int
    name: str
    stars: int

    class Config:
        orm_mode = True

class TourDateOut(BaseModel):
    id: int
    date: str
    tour_id: int

    class Config:
        orm_mode = True

class BookingOut(BaseModel):
    id: int
    user_id: int
    tour_id: int
    created_at: str

    class Config:
        orm_mode = True


class TourBase(BaseModel):
    name: str
    description: Optional[str] = None
    tour_type_id: int
    hotel_id: int
    transport: TransportEnum
    base_price: float

class TourCreate(TourBase):
    pass

class TourUpdate(TourBase):
    pass

class TourOut(TourBase):
    id: int
    tour_type: TourTypeOut
    hotel: HotelOut
    dates: List[TourDateOut]
    bookings: List[BookingOut]

    class Config:
        orm_mode = True


class TourShortOut(TourBase):
    id: int


from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from models import Tour, get_db
from permissions import staff_required

router = APIRouter(prefix="/tours", tags=["Туры"])


@router.get("/", response_model=List[TourOut])
async def get_tours(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Tour).options(
        selectinload(Tour.tour_type),
        selectinload(Tour.hotel),
        selectinload(Tour.dates),
        selectinload(Tour.bookings)
    ))
    return result.scalars().all()


@router.get("/{tour_id}", response_model=TourOut)
async def get_tour(tour_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Tour).where(Tour.id == tour_id).options(
        selectinload(Tour.tour_type),
        selectinload(Tour.hotel),
        selectinload(Tour.dates),
        selectinload(Tour.bookings)
    ))
    tour = result.scalar_one_or_none()
    if not tour:
        raise HTTPException(status_code=404, detail="Тур не найден")
    return tour


@router.post("/", response_model=TourShortOut)
async def create_tour(
        tour: TourCreate,
        db: AsyncSession = Depends(get_db),
        _: Depends = Depends(staff_required),
):
    new_tour = Tour(**tour.model_dump())
    db.add(new_tour)
    await db.commit()
    await db.refresh(new_tour)
    return new_tour


@router.put("/{tour_id}", response_model=TourShortOut)
async def update_tour(
        tour_id: int,
        updated: TourUpdate,
        db: AsyncSession = Depends(get_db),
        _: Depends = Depends(staff_required),
):
    result = await db.execute(select(Tour).where(Tour.id == tour_id))
    tour = result.scalar_one_or_none()
    if not tour:
        raise HTTPException(status_code=404, detail="Тур не найден")

    tour.name = updated.name
    tour.description = updated.description
    tour.tour_type_id = updated.tour_type_id
    tour.hotel_id = updated.hotel_id
    tour.transport = updated.transport
    tour.base_price = updated.base_price
    await db.commit()
    await db.refresh(tour)
    return tour


@router.delete("/{tour_id}")
async def delete_tour(
        tour_id: int,
        db: AsyncSession = Depends(get_db),
        _: Depends = Depends(staff_required),
):
    result = await db.execute(select(Tour).where(Tour.id == tour_id))
    tour = result.scalar_one_or_none()
    if not tour:
        raise HTTPException(status_code=404, detail="Тур не найден")
    await db.delete(tour)
    await db.commit()
    return {"detail": "Тур удалён"}
