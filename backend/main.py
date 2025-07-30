"""
FastAPI entry-point for the job-finder backend.
Run with:  uvicorn backend.main:app --reload
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import logging

# Local helpers
from agent import resume_based_job_search

# ────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s  %(levelname)s  %(message)s"
)
logger = logging.getLogger("backend")

app = FastAPI(title="Resume-Based Job Finder API", version="1.0.0")

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:5174", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", summary="Health-check")
async def health():
    """Kubernetes / load-balancer health-check."""
    return {"status": "ok"}


from fastapi import HTTPException
import traceback

@app.post("/search-jobs", summary="Upload resume → get jobs")
async def search_jobs(
    resume: UploadFile = File(..., description="PDF or DOCX resume"),
    location: str = "United States",
    limit: int = 50,
):
    if resume.content_type not in (
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
    ):
        raise HTTPException(
            status_code=415, detail="Only PDF or DOCX files are supported"
        )

    contents = await resume.read()
    logger.info("Received resume: %s (%d bytes)", resume.filename, len(contents))

    try:
        results = resume_based_job_search(contents, resume.filename, location, limit=limit)
        logger.info(f"Returning {len(results)} jobs for {resume.filename}")
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"INTERNAL ERROR: {str(e)}")


    if (
        results
        and isinstance(results, list)
        and isinstance(results[0], dict)
        and "error" in results[0]
    ):
        raise HTTPException(status_code=500, detail=results[0]["error"])

    return JSONResponse({"location": location, "results": results})
