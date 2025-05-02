from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from models import Country, get_db
from permissions import admin_required

class CountryBase(BaseModel):
    name: str


class CountryCreate(CountryBase):
    pass


class CountryUpdate(CountryBase):
    pass


class CountryOut(CountryBase):
    id: int

    class Config:
        orm_mode = True

router = APIRouter(prefix="/countries", tags=["Страны"])


@router.get("/", response_model=List[CountryOut])
async def get_countries(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Country))
    return result.scalars().all()


@router.get("/{country_id}", response_model=CountryOut)
async def get_country(country_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Country).where(Country.id == country_id))
    country = result.scalar_one_or_none()
    if not country:
        raise HTTPException(status_code=404, detail="Страна не найдена")
    return country


@router.post("/", response_model=CountryOut)
async def create_country(
        country: CountryCreate,
        db: AsyncSession = Depends(get_db),
        _: Depends = Depends(admin_required),
):
    new_country = Country(name=country.name)
    db.add(new_country)
    await db.commit()
    await db.refresh(new_country)
    return new_country


@router.put("/{country_id}", response_model=CountryOut)
async def update_country(
        country_id: int,
        updated: CountryUpdate,
        db: AsyncSession = Depends(get_db),
        _: Depends = Depends(admin_required),
):
    result = await db.execute(select(Country).where(Country.id == country_id))
    country = result.scalar_one_or_none()
    if not country:
        raise HTTPException(status_code=404, detail="Страна не найдена")
    country.name = updated.name
    await db.commit()
    await db.refresh(country)
    return country


@router.delete("/{country_id}")
async def delete_country(
        country_id: int,
        db: AsyncSession = Depends(get_db),
        _: Depends = Depends(admin_required),
):
    result = await db.execute(select(Country).where(Country.id == country_id))
    country = result.scalar_one_or_none()
    if not country:
        raise HTTPException(status_code=404, detail="Страна не найдена")
    await db.delete(country)
    await db.commit()
    return {"detail": "Страна удалена"}
