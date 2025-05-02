import uvicorn
from fastapi import FastAPI

from auth import router as auth_router
from employee import router as employee_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.include_router(prefix="/api", router=auth_router)
app.include_router(prefix="/api", router=employee_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins="http://localhost:5173",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == '__main__':
    uvicorn.run("main:app", port=8000, host="localhost")
