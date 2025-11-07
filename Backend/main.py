from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.staticfiles import StaticFiles
from fastapi.security import HTTPBearer
from database import init_db
from routes import projects, workload, auth

# Initialize FastAPI app
app = FastAPI(
    title="Zenycon Insight - Project Intelligence Platform",
    version="1.0.0",
    description="AI-powered project management platform for software service companies"
)

# ✅ Use Bearer Token auth instead of OAuth2 password flow
security = HTTPBearer()

# Run database initialization at startup
@app.on_event("startup")
def on_startup():
    init_db()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8080"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files
app.mount("/public", StaticFiles(directory="public"), name="public")

# Include routers
app.include_router(projects.router)
app.include_router(workload.router)
app.include_router(auth.router)

@app.get("/")
def root():
    return {
        "message": "Zenycon Insight - Project Intelligence Platform is running 🚀",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
