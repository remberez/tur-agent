import uvicorn
from fastapi import FastAPI
from auth import router as auth_router

app = FastAPI()
app.include_router(prefix="/api", router=auth_router)


if __name__ == '__main__':
    uvicorn.run("main:app", port=8000, host="localhost")
