from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from models import TourType, get_db
from permissions import admin_required

class TourTypeBase(BaseModel):
    name: str

class TourTypeCreate(TourTypeBase):
    pass

class TourTypeUpdate(TourTypeBase):
    pass

class TourTypeOut(TourTypeBase):
    id: int

    class Config:
        orm_mode = True

router = APIRouter(prefix="/tour-types", tags=["Типы туров"])

@router.get("/", response_model=List[TourTypeOut])
async def get_tour_types(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(TourType))
    return result.scalars().all()

@router.get("/{tour_type_id}", response_model=TourTypeOut)
async def get_tour_type(tour_type_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(TourType).where(TourType.id == tour_type_id))
    tour_type = result.scalar_one_or_none()
    if not tour_type:
        raise HTTPException(status_code=404, detail="Тип тура не найден")
    return tour_type

@router.post("/", response_model=TourTypeOut)
async def create_tour_type(
    tour_type: TourTypeCreate,
    db: AsyncSession = Depends(get_db),
    _: Depends = Depends(admin_required),
):
    new_tour_type = TourType(**tour_type.model_dump())
    db.add(new_tour_type)
    await db.commit()
    await db.refresh(new_tour_type)
    return new_tour_type

@router.put("/{tour_type_id}", response_model=TourTypeOut)
async def update_tour_type(
    tour_type_id: int,
    updated: TourTypeUpdate,
    db: AsyncSession = Depends(get_db),
    _: Depends = Depends(admin_required),
):
    result = await db.execute(select(TourType).where(TourType.id == tour_type_id))
    tour_type = result.scalar_one_or_none()
    if not tour_type:
        raise HTTPException(status_code=404, detail="Тип тура не найден")
    tour_type.name = updated.name
    await db.commit()
    await db.refresh(tour_type)
    return tour_type

@router.delete("/{tour_type_id}")
async def delete_tour_type(
    tour_type_id: int,
    db: AsyncSession = Depends(get_db),
    _: Depends = Depends(admin_required),
):
    result = await db.execute(select(TourType).where(TourType.id == tour_type_id))
    tour_type = result.scalar_one_or_none()
    if not tour_type:
        raise HTTPException(status_code=404, detail="Тип тура не найден")
    await db.delete(tour_type)
    await db.commit()
    return {"detail": "Тип тура удалён"}
