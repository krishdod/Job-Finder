import os
import re
import itertools
from collections import Counter
import pdfplumber
import docx2txt
from transformers import pipeline

NER_MODEL = "dslim/bert-base-NER"

COMMON_TITLES = [
    "software engineer", "frontend developer", "backend developer",
    "full stack developer", "data analyst", "data engineer",
    "devops engineer", "it support", "technical support", "intern",
    "b.tech", "trainee", "graduate", "java developer", "react developer"
]

def _load_text_from_bytes(b: bytes, filename: str) -> str:
    path = f"_tmp_{filename}"
    with open(path, "wb") as f:
        f.write(b)

    if path.endswith(".pdf"):
        with pdfplumber.open(path) as pdf:
            return "\n".join(p.extract_text() or "" for p in pdf.pages)
    else:
        return docx2txt.process(path)

def _guess_title(lines):
    text = " ".join(lines[:50]).lower()

    patterns = {
        r"objective.*data analyst": "Data Analyst",
        r"objective.*software engineer": "Software Engineer",
        r"b\.tech.*computer": "Software Engineer",
        r"react|angular|typescript": "Frontend Developer",
        r"java|spring|api": "Backend Developer",
        r"service desk|help desk|itil": "IT Support",
        r"aws|docker|linux|devops": "DevOps Engineer",
        r"excel|power bi|sql": "Data Analyst",
    }

    for pat, role in patterns.items():
        if re.search(pat, text):
            return role

    for line in lines[:40]:
        for title in COMMON_TITLES:
            if title in line.lower():
                return title.title()

    return ""

def extract_resume_fields(b: bytes, filename: str) -> dict:
    raw_text = _load_text_from_bytes(b, filename)
    lines = [l.strip() for l in raw_text.splitlines() if l.strip()]

    ner = pipeline("ner", model=NER_MODEL, aggregation_strategy="simple")
    ner_out = ner(" ".join(lines[:300]))

    name = ""
    for ent in ner_out:
        if ent["entity_group"] == "PER":
            name = ent["word"].replace("##", "")
            break

    job_title = _guess_title(lines)

    skills = []
    for ent in ner_out:
        if ent["entity_group"] != "PER":
            token = ent["word"].replace("##", "")
            if token.istitle() and token not in skills:
                skills.append(token)
        if len(skills) >= 5:
            break

    return {
        "name": name,
        "job_title": job_title,
        "skills": skills
    }
