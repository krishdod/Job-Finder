"""
All résumé parsing + job-search helpers.
"""

from __future__ import annotations
import json, os, re, tempfile, urllib.parse, http.client, logging
from typing import List

import pdfplumber, docx2txt, httpx
from ddgs import DDGS
from transformers import pipeline
# from serpapi import GoogleSearch  # type: ignore[import-not-found]

log = logging.getLogger("agent")
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s  %(levelname)s  %(message)s"
)

# ── ENV
RAPIDAPI_KEY = "747d9fb20cmsh41a3e6c8b23b606p1b7ffdjsn02f916ed95bb"
SERPAPI_KEY = "0fa3494b475c8b42f2ad60faf9477b6340452842dcb3548b29779826e614ff3d"
NER_MODEL = "dslim/bert-base-NER"
if not RAPIDAPI_KEY:
    raise EnvironmentError("RAPIDAPI_KEY missing – set it in .env")

# ── NER pipeline
_ner = pipeline("ner", model=NER_MODEL, aggregation_strategy="simple")

_exact_titles = [
    "software engineer",
    "software developer",
    "backend developer",
    "frontend developer",
    "full stack developer",
    "data analyst",
    "data engineer",
    "machine learning engineer",
    "devops engineer",
    "cloud engineer",
]
_regex_titles = [
    re.compile(p, re.I)
    for p in [
        r"(full[\s\-]?stack)?.*software (engineer|developer)",
        r"(back[\s\-]?end|backend).*developer",
        r"(front[\s\-]?end|frontend).*developer",
        r"(data|business).*analyst",
        r"data.*engineer",
        r"machine learning.*engineer",
        r"devops.*engineer",
    ]
]


# ─────────── PARSE RESUME ───────────
def _pdf_docx_to_text(b: bytes, fname: str) -> str:
    suffix = ".pdf" if fname.lower().endswith(".pdf") else ".docx"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(b)
        path = tmp.name
    if suffix == ".pdf":
        with pdfplumber.open(path) as pdf:
            return "\n".join(p.extract_text() or "" for p in pdf.pages)
    return docx2txt.process(path)


def _first(iterable):
    return next((x for x in iterable if x), "")


def _extract_fields(buf: bytes, fname: str) -> dict:
    text = _pdf_docx_to_text(buf, fname)
    lines = [ln.strip() for ln in text.splitlines() if ln.strip()][:400]

    ner = _ner(" ".join(lines[:120]))
    name = _first(
        e["word"].replace("##", "") for e in ner if e["entity_group"] == "PER"
    )

    # title via exact, regex, filename
    title = ""
    for ln in lines[:60]:
        title = _first(t.title() for t in _exact_titles if t in ln.lower())
        # exact
        if title:
            break
    if not title:
        for ln in lines[:80]:
            for rx in _regex_titles:
                m = rx.search(ln)
                if m:
                    title = m.group(0).title()
                    break
            if title:
                break
    if not title:
        title = _first(
            t.title() for t in _exact_titles if t in fname.replace("_", " ").lower()
        )

    # Improved skill extraction
    skills = []
    
    # Common technical skills to look for
    tech_skills = [
        "JavaScript", "Python", "Java", "C++", "C#", "PHP", "Ruby", "Go", "Rust", "Swift", "Kotlin",
        "React", "Angular", "Vue", "Node.js", "Express", "Django", "Flask", "Spring", "Laravel",
        "HTML", "CSS", "SASS", "LESS", "Bootstrap", "Tailwind", "Material-UI",
        "MongoDB", "MySQL", "PostgreSQL", "Redis", "Elasticsearch", "DynamoDB",
        "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Jenkins", "Git", "GitHub",
        "REST", "GraphQL", "API", "Microservices", "CI/CD", "DevOps", "Agile",
        "Machine Learning", "AI", "Data Science", "TensorFlow", "PyTorch", "Pandas",
        "TypeScript", "ES6", "Webpack", "Babel", "Jest", "Mocha", "JUnit", "Selenium"
    ]
    
    # Look for skills in the text
    text_lower = text.lower()
    for skill in tech_skills:
        if skill.lower() in text_lower and skill not in skills:
            skills.append(skill)
            if len(skills) >= 10:  # Limit to 10 most relevant skills
                break
    
    # If we don't have enough skills, try to extract from NER results
    if len(skills) < 5:
        for e in ner:
            tok = e["word"].replace("##", "")
            if (e["entity_group"] != "PER" and 
                tok.istitle() and 
                len(tok) > 2 and  # Only words longer than 2 characters
                tok not in skills):
                skills.append(tok)
            if len(skills) >= 10:
                break

    return {"name": name, "job_title": title, "skills": skills}


# ─────────── SEARCH HELPERS ───────────
def _is_en(txt: str) -> bool:
    try:
        txt.encode("ascii")
        return True
    except UnicodeEncodeError:
        return False


def ddg_search(query: str, max_: int = 80) -> list[dict]:
    q = f"{query} (site:linkedin.com/jobs OR site:indeed.com OR site:glassdoor.com OR site:monster.com OR site:careerbuilder.com OR site:ziprecruiter.com)"
    out = []
    with DDGS() as d:
        for hit in d.text(q, max_results=max_ * 5):  # Increased multiplier for more raw results
            if not hit.get("href"):
                continue
            # Relaxed language filter to get more results
            if not _is_en(hit["title"] + hit["body"]):
                continue
            if not any(
                dom in hit["href"]
                for dom in ("linkedin", "indeed", "glassdoor", "monster", "careerbuilder", "ziprecruiter")
            ):
                continue
            out.append(
                {
                    "title": hit["title"],
                    "company": "N/A",
                    "location": "N/A",
                    "posted": None,
                    "description": hit["body"][:200] + ".",
                    "apply_link": hit["href"],
                    "source": "DuckDuckGo",
                }
            )
            if len(out) >= max_:
                break
    return out


def rapid_search(job: str, loc: str, pages: int = 1) -> list[dict]:
    conn = http.client.HTTPSConnection("jsearch.p.rapidapi.com")
    head = {"x-rapidapi-key": RAPIDAPI_KEY, "x-rapidapi-host": "jsearch.p.rapidapi.com"}
    path = f"/search?query={urllib.parse.quote_plus(job+' jobs in '+loc)}&page=1&num_pages={pages}"
    try:
        conn.request("GET", path, headers=head)
        res = conn.getresponse()
        data = json.loads(res.read().decode())
    except Exception as e:
        return [{"error": f"RapidAPI error: {e}"}]
    jobs = []
    for j in data.get("data", []):
        loc2 = ", ".join(filter(None, [j.get("job_city"), j.get("job_state")])) or "N/A"
        jobs.append(
            {
                "title": j.get("job_title", "N/A"),
                "company": j.get("employer_name", "N/A"),
                "location": loc2,
                "posted": j.get("job_posted_at_datetime_utc", "N/A"),
                "description": (j.get("job_description") or "")[:200] + ".",
                "apply_link": j.get("job_apply_link", "#"),
                "source": "RapidAPI",
            }
        )
    return jobs


def serp_search(
    job: str, loc: str, exp: str, cat: str, recency: str = "2024"
) -> list[dict]:
    if not SERPAPI_KEY:
        return []
    params = {
        "engine": "google_jobs",
        "q": f"{job} in {loc} {exp} {cat}",
        "hl": "en",
        "api_key": SERPAPI_KEY,
        "date_posted": recency,
    }
    try:
        # data = GoogleSearch(params).get_dict()  # Commented out due to missing import
        return []  # Return empty list since GoogleSearch is not available
    except Exception as e:
        return [{"error": f"SerpAPI error: {e}"}]
    out = []
    for j in data.get("jobs_results", []):
        out.append(
            {
                "title": j["title"],
                "company": j["company_name"],
                "location": j["location"],
                "posted": j.get("detected_extensions", {}).get("posted_at", ""),
                "description": j.get("description", "")[:200] + ".",
                "apply_link": j.get("related_links", [{"link": ""}])[0]["link"],
                "source": "SerpAPI",
            }
        )
    return out


def _dedupe(rows: list[dict]) -> list[dict]:
    seen, uniq = set(), []
    for r in rows:
        k = (r.get("title"), r.get("company"), r.get("location"))
        if k not in seen:
            seen.add(k)
            uniq.append(r)
    return uniq


# ─────────── PUBLIC HELPERS ───────────
def resume_based_job_search(buf: bytes, fname: str, loc: str = "United States", limit: int = 50) -> List[dict]:
    try:
        parsed = _extract_fields(buf, fname)
        title = parsed["job_title"]
        if not title:
            return [{"error": "Could not detect job title"}]

        log.info("Parsed résumé – title='%s' · skills=%s", title, parsed["skills"])

        # Increase search results for more comprehensive results
        rapid = rapid_search(title, loc, pages=5)  # Get 5 pages from RapidAPI
        ddg = ddg_search(f"{title} jobs in {loc}", max_=100)  # Increase DuckDuckGo results even more
        merged = _dedupe(rapid + ddg)[:limit]
        
        # Log the results for debugging
        log.info(f"Found {len(rapid)} RapidAPI jobs, {len(ddg)} DuckDuckGo jobs, {len(merged)} total after deduplication")

        return merged

    except Exception as e:
        import traceback
        log.error("❌ Exception in resume_based_job_search: %s", str(e))
        traceback.print_exc()
        return [{"error": f"resume_based_job_search failed: {str(e)}"}]



def manual_job_search(job: str, loc: str, exp: str, cat: str) -> List[dict]:
    rapid = rapid_search(job, loc)
    serp = serp_search(job, loc, exp, cat) if SERPAPI_KEY else []
    return _dedupe(rapid + serp)
