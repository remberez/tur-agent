from fastapi import Depends, HTTPException, status
from models import Client, EmployeePositionEnum
from auth import get_current_client


async def admin_required(current_user: Client = Depends(get_current_client)):
    if not current_user.employee or current_user.employee.position != EmployeePositionEnum.admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Недостаточно прав")
    return current_user
