# PharmaGuard 🧬💊
### AI-Powered Pharmacogenomic Risk Analysis

> **Preventing adverse drug reactions through personalized genetic insights — built for RIFT 2026**

---

## 🔗 Links

| Resource | URL |
|----------|-----|
| 🌐 Live Demo | `https://pharmaguard.vercel.app` |
| 🎥 LinkedIn Demo Video | `https://linkedin.com/posts/your-post-link` |
| 📁 GitHub Repo | `https://github.com/your-username/pharmaguard` |

---

## 🧪 Problem Overview

Adverse drug reactions kill over **100,000 Americans annually**. Many of these deaths are preventable through **pharmacogenomic testing** — analyzing how genetic variants affect drug metabolism.

**Core Challenge:**
Build an AI-powered system that:
1. **Parses authentic VCF files** (Variant Call Format v4.2).
2. **Identifies variants** across 6 critical genes: `CYP2D6`, `CYP2C19`, `CYP2C9`, `SLCO1B1`, `TPMT`, `DPYD`.
3. **Predicts drug-specific risks**: Safe, Adjust Dosage, Toxic, Ineffective, Unknown.
4. **Generates clinical explanations** using LLMs with specific citations and biological mechanisms.
5. **Provides dosing recommendations** aligned with CPIC guidelines.

---

## ✨ Features

- **VCF File Parsing** — Supports standard VCF v4.2 format with `GENE`, `STAR`, and `RS` INFO tags
- **6 Critical Genes Analyzed** — CYP2D6, CYP2C19, CYP2C9, SLCO1B1, TPMT, DPYD
- **6 Drug Risk Predictions** — CODEINE, WARFARIN, CLOPIDOGREL, SIMVASTATIN, AZATHIOPRINE, FLUOROURACIL
- **5 Risk Labels** — Safe · Adjust Dosage · Toxic · Ineffective · Unknown
- **LLM-Generated Explanations** — Clinical summaries with specific variant citations and biological mechanisms
- **CPIC-Aligned Recommendations** — Dosing guidance matched to PharmGKB / CPIC guidelines
- **Structured JSON Output** — Downloadable, schema-compliant results
- **Color-Coded UI** — Green / Yellow / Red risk visualization

---

## 👥 Team Structure (4-Person Battle Plan)

To win in a 10-hour sprint, we divide responsibilities to avoid overlap and maximize execution.

### 👤 Person 1: Core Logic Lead (Genomics Brain)
- **Focus:** VCF Parsing & Genetic Logic.
- **Tasks:** Build the Python VCF parser; Implement Diplotype/Phenotype mapping; Map Phenotypes to Drug Risks.
- **Goal:** Input (VCF+Drug) → Output (Risk Profile).

### 👤 Person 2: LLM & Clinical Lead (Explainable AI)
- **Focus:** Medical Intelligence.
- **Tasks:** Prompt Engineering; LLM Service integration (OpenAI/ChatGPT); Structured JSON explanation generator.
- **Goal:** Transform data into clinically sound text.

### 👤 Person 3: Backend Integration Lead (The Architect)
- **Focus:** System Orchestration.
- **Tasks:** FastAPI setup; `/analyze` endpoint; Data flow between Person 1 & 2; Error handling & Schemas.
- **Goal:** A robust API connecting all parts.

### 👤 Person 4: Frontend & Deployment Lead (The Presenter)
- **Focus:** UI/UX & Live Success.
- **Tasks:** React UI (Upload, Search, Results); Color-coded risk display; Live deployment (Vercel/Render); LinkedIn Demo capture.
- **Goal:** Make it look premium and work live.

---

## ⏳ 10-Hour Sprint Roadmap

| Time | Phase | Objectives |
|------|-------|------------|
| **0-1h** | **Setup** | Initialize `/backend` (FastAPI) and `/frontend` (Vite). |
| **1-4h** | **Core Build** | Build VCF parser, LLM prompts, and UI components. |
| **4-6h** | **Integration** | Connect FE to BE. Verify data flow: Upload -> AI -> Display. |
| **6-8h** | **Polish** | **Crucial:** Match JSON Schema exactly. Add Glassmorphism UI. |
| **8-9h** | **Deployment** | Deploy to Vercel/Render. Fix CORS/Env issues. |
| **9-10h**| **Submission**| Record Demo video, final README polish, submit to RIFT. |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19 + Tailwind CSS + Lucide Icons |
| **Backend** | FastAPI (Python 3.10+) |
| **AI/LLM** | OpenAI API (GPT-4o or ChatGPT-3.5) |
| **Parsing** | Custom Python VCF Stream Parser |
| **Deployment**| Vercel (Frontend) + Render/Railway (Backend) |

---

## 📁 Project Structure

```text
PHARMA_GUARD/
├── backend/                # FastAPI Application (Person 1, 2, 3)
│   ├── main.py             # Entry point & API routes
│   ├── requirements.txt    # Python dependencies
│   ├── .env                # OpenAI API Key
│   ├── services/           
│   │   ├── genetics_logic.py # VCF parsing & Risk rules (Person 1)
│   │   └── llm_service.py    # LLM Clinical explanations (Person 2)
│   └── models/             # Pydantic models for JSON schema (Person 3)
├── frontend/               # Vite + React Application (Person 4)
│   ├── src/
│   │   ├── components/     # UI elements (DrugInput, ResultsDisplay)
│   │   ├── App.tsx         # Main interactive UI
│   │   ├── api.ts          # Logic to call backend /analyze
│   │   └── types.ts        # TypeScript interfaces
│   ├── package.json
│   └── vite.config.ts
├── samples/                # Sample .vcf files for testing
├── .gitignore
└── README.md               # Team Battle Plan & Docs
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        PharmaGuard AI                       │
│                                                             │
│  ┌──────────┐    ┌────────────────┐    ┌─────────────────┐  │
│  │  VCF     │───▶│ FastAPI Backend│───▶│ Genetics Engine │  │
│  │  Upload  │    │ (Python)       │    │ (Rule-based)    │  │
│  └──────────┘    └────────────────┘    └────────┬────────┘  │
│                                                 │           │
│  ┌──────────┐                         ┌─────────▼────────┐  │
│  │  Drug    │────────────────────────▶│  LLM (OpenAI)    │  │
│  │  Input   │                         │  Explanations    │  │
│  └──────────┘                         └─────────┬────────┘  │
│                                                 │           │
│                                       ┌─────────▼────────┐  │
│                                       │  Structured JSON │  │
│                                       │  Output Schema   │  │
│                                       └─────────┬────────┘  │
│                                                 │           │
│                                       ┌─────────▼────────┐  │
│                                       │  Premium React UI│  │
│                                       │  (Glassmorphism) │  │
│                                       └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Mandatory JSON Schema (EXACT Match)

```json
{
  "patient_id": "PATIENT_XXX",
  "drug": "DRUG_NAME",
  "timestamp": "ISO8601_timestamp",
  "risk_assessment": {
    "risk_label": "Safe|Adjust Dosage|Toxic|Ineffective|Unknown",
    "confidence_score": 0.0,
    "severity": "none|low|moderate|high|critical"
  },
  "pharmacogenomic_profile": {
    "primary_gene": "GENE_SYMBOL",
    "diplotype": "*X/*Y",
    "phenotype": "PM|IM|NM|RM|URM|Unknown",
    "detected_variants": [ { "rsid": "rsXXXX", "gene": "...", "star_allele": "..." } ]
  },
  "clinical_recommendation": { "action": "...", "alternative_drugs": [], "cpic_guideline": "..." },
  "llm_generated_explanation": { "summary": "...", "mechanism": "...", "clinical_implications": "..." },
  "quality_metrics": { "vcf_parsing_success": true, "variants_detected": 0 }
}
```

---

---

## 🎯 Simplified Risk Rules (Rule Engine Logic)

To ensure clinical accuracy during the 10-hour sprint, we use these established mappings for the 6 target genes:

| Gene | Phenotype | Drug Risk Prediction |
|------|-----------|----------------------|
| **CYP2D6** | PM (Poor Metabolizer) | **Ineffective** (for Codeine) |
| | URM (Ultra-Rapid) | **Toxic** |
| | IM (Intermediate) | **Adjust Dosage** |
| **CYP2C9** | Reduced Function | **Adjust Dosage** (for Warfarin) |
| | Severe Deficiency | **Toxic** |
| **CYP2C19** | PM (Poor) | **Ineffective** (for Clopidogrel) |
| | IM (Intermediate) | **Adjust Dosage** |
| **SLCO1B1** | Reduced Function | **Toxic Risk** (for Simvastatin) |
| **TPMT** | Low Activity | **Toxic** (for Azathioprine) |
| **DPYD** | Deficiency | **Toxic** (for Fluorouracil) |

---

## 🚨 Critical Winning Factors (Judge-Proofing)

Follow these rules to ensure a high evaluation score:

1. **Schema Compliance**: JSON **MUST** match the exact fields in the provided output spec. No extra or missing fields.
2. **Clinical Authenticity**: Explanations must sound professional and include the biological mechanism (e.g., "CYP2D6 converts Codeine to Morphine...").
3. **Live Success**: The deployment must work on the first try. Fix CORS and environment variables early (Hour 8).
4. **Visual "WOW"**: Risk labels must be color-coded (Green: Safe, Yellow: Adjust, Red: Toxic/Ineffective).

---

## 🚀 Installation & Setup

### 🖥️ Backend (FastAPI)
1. **Navigate to backend:** `cd backend`
2. **Setup Virtual Env:** `python -m venv venv` and `source venv/bin/activate` (or `venv\Scripts\activate` on Windows)
3. **Install dependencies:** `pip install -r requirements.txt`
4. **Environment:** Create a `.env` file with `OPENAI_API_KEY`.
5. **Run:** `uvicorn main:app --reload`

### 💻 Frontend (React + Vite)
1. **Navigate to frontend:** `cd frontend`
2. **Install dependencies:** `npm install`
3. **Run:** `npm run dev`

---

## 📜 License

MIT License — see `LICENSE` for details.

---

## 🏷️ Submission Hashtags
`#RIFT2026` `#PharmaGuard` `#Pharmacogenomics` `#AIinHealthcare`
