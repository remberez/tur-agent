from typing import List

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from models import Employee, get_db, EmployeePositionEnum
from permissions import admin_required


class EmployeeBase(BaseModel):
    position: EmployeePositionEnum
    user_id: int


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeUpdate(BaseModel):
    position: EmployeePositionEnum | None = None


class EmployeeOut(EmployeeBase):
    id: int

    class Config:
        orm_mode = True


router = APIRouter(prefix="/employees", tags=["Сотрудники"])


@router.get("/", response_model=List[EmployeeOut])
async def get_employees(db: AsyncSession = Depends(get_db), _=Depends(admin_required)):
    result = await db.execute(select(Employee))
    return result.scalars().all()


@router.post("/", response_model=EmployeeOut)
async def create_employee(data: EmployeeCreate, db: AsyncSession = Depends(get_db), _=Depends(admin_required)):
    new_emp = Employee(**data.model_dump())
    db.add(new_emp)
    await db.commit()
    await db.refresh(new_emp)
    return new_emp


@router.get("/{employee_id}", response_model=EmployeeOut)
async def get_employee(employee_id: int, db: AsyncSession = Depends(get_db), _=Depends(admin_required)):
    employee = await db.get(Employee, employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Сотрудник не найден")
    return employee


@router.put("/{employee_id}", response_model=EmployeeOut)
async def update_employee(employee_id: int, data: EmployeeUpdate, db: AsyncSession = Depends(get_db),
                          _=Depends(admin_required)):
    employee = await db.get(Employee, employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Сотрудник не найден")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(employee, field, value)
    await db.commit()
    await db.refresh(employee)
    return employee


@router.delete("/{employee_id}", status_code=204)
async def delete_employee(employee_id: int, db: AsyncSession = Depends(get_db), _=Depends(admin_required)):
    employee = await db.get(Employee, employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Сотрудник не найден")
    await db.delete(employee)
    await db.commit()
