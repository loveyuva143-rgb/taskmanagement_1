"""
Quick initialization script to set up the database and seed data.
Run this once before starting the server.
"""
from app.seed_data import seed_data

if __name__ == "__main__":
    print("🚀 Initializing Zenycon Insight database...")
    seed_data()
    print("✅ Ready! You can now start the server with: uvicorn main:app --reload")

