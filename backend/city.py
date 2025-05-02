from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from sqlalchemy.orm import selectinload

from country import CountryOut
from models import City, get_db
from permissions import staff_required

class CityBase(BaseModel):
    name: str
    country_id: int

class CityCreate(CityBase):
    pass

class CityUpdate(CityBase):
    pass

class CityOut(CityBase):
    id: int
    country: CountryOut

    class Config:
        orm_mode = True

class CityShortOut(CityBase):
    id: int

    class Config:
        orm_mode = True

router = APIRouter(prefix="/cities", tags=["Города"])

@router.get("/", response_model=List[CityOut])
async def get_cities(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(City).options(selectinload(City.country)))
    return result.scalars().all()

@router.get("/{city_id}", response_model=CityOut)
async def get_city(city_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(City).where(City.id == city_id).options(selectinload(City.country)))
    city = result.scalar_one_or_none()
    if not city:
        raise HTTPException(status_code=404, detail="Город не найден")
    return city

@router.post("/", response_model=CityShortOut)
async def create_city(
    city: CityCreate,
    db: AsyncSession = Depends(get_db),
    _: Depends = Depends(staff_required),
):
    new_city = City(name=city.name, country_id=city.country_id)
    db.add(new_city)
    await db.commit()
    await db.refresh(new_city)
    return new_city

@router.put("/{city_id}", response_model=CityShortOut)
async def update_city(
    city_id: int,
    updated: CityUpdate,
    db: AsyncSession = Depends(get_db),
    _: Depends = Depends(staff_required),
):
    result = await db.execute(select(City).where(City.id == city_id))
    city = result.scalar_one_or_none()
    if not city:
        raise HTTPException(status_code=404, detail="Город не найден")
    city.name = updated.name
    city.country_id = updated.country_id
    await db.commit()
    await db.refresh(city)
    return city

@router.delete("/{city_id}")
async def delete_city(
    city_id: int,
    db: AsyncSession = Depends(get_db),
    _: Depends = Depends(staff_required),
):
    result = await db.execute(select(City).where(City.id == city_id))
    city = result.scalar_one_or_none()
    if not city:
        raise HTTPException(status_code=404, detail="Город не найден")
    await db.delete(city)
    await db.commit()
    return {"detail": "Город удалён"}
