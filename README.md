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

## 🏆 Judge's Executive Summary

**PharmaGuard** is a clinical-grade AI platform that bridges the gap between raw genomic data (VCF) and actionable medical prescriptions. While most health-tech projects are simple LLM wrappers, PharmaGuard implements a **multi-layered validation pipeline**:
1.  **Deterministic Engine**: Custom VCF parser and CPIC-aligned rule engine ensure 100% accuracy for known high-risk variants.
2.  **Probabilistic AI**: Generative AI (Gemini/Groq) provides the "Why" behind the data, explaining biological mechanisms to clinicians.
3.  **Visual Analytics**: A premium Glassmorphism dashboard translates complex diplotypes into intuitive risk visualizations.

> [!IMPORTANT]
> **Why we win:** We aren't just summarizing text. We are parsing REAL genomic files, calculating diplotypes locally, and cross-referencing global medical guidelines before the AI even touches the data.

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
- **6 Critical Genes Analyzed** — Deep analysis of CYP2D6, CYP2C19, CYP2C9, SLCO1B1, TPMT, DPYD
- **6 Drug Risk Predictions** — Real-time assessment for CODEINE, WARFARIN, CLOPIDOGREL, SIMVASTATIN, AZATHIOPRINE, FLUOROURACIL
- **CPIC-Aligned Logic** — Deterministic mapping of genotypes to phenotypes (PM, IM, NM, RM, URM) per medical guidelines
- **Multi-Client AI Strategy** — Primary analysis via Google Gemini 1.5 Flash with millisecond fallback to Groq/Llama-3
- **Professional PDF Reports** — One-click generation of clinical-grade reports for electronic health record (EHR) integration
- **High-Fidelity Dashboard** — Interactive risk distribution charts, gene heatmaps, and structured bioinformatics payloads

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
| **AI/LLM** | Google Gemini 1.5 Flash (Primary) + Groq Llama-3 (Fallback) |
| **Parsing** | Advanced Python VCF Stream Parser (30+ Variants) |
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
│   │   ├── vcf_parser.py   # Robust VCF parsing & Gene mapping
│   │   ├── risk_engine.py  # CPIC-aligned risk assessment engine
│   │   └── llm_service.py  # Multi-client LLM Clinical explanations
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

## 💡 Technical Breakthroughs (Explain this to Judges)

### 1. The VCF-to-Phenotype Pipeline
Most AI health apps ask the user to type in their "genotype." PharmaGuard takes raw **VCF files**. Our Python-based parser scans thousands of genomic variants, identifies high-impact rsIDs, calculates the **Activity Score**, and determines the **Clinical Phenotype** (e.g., Ultra-Rapid Metabolizer) *before* the AI is consulted.

### 2. Multi-Model LLM Orchestration
To ensure 100% uptime, we implemented an **Async Fallback System**.
- **Gemini 1.5 Flash**: Processes the high-context clinical summary.
- **Groq Llama-3 70B**: Automatically kicks in if Gemini hits rate limits or latency spikes.
- **Pydantic Guards**: Every AI response is validated against a strict medical schema; if the AI hallucinates, the system reverts to a rule-based clinical fallback.

### 3. "Clinician-First" Design
The UI doesn't just show data; it provides **Directives**. 
- **Green (Safe)**: Proceed with standard dosing.
- **Yellow (Adjust)**: Specific % dose reductions (calculated by our Risk Engine).
- **Red (Toxic/Ineffective)**: Strong contraindications with listed alternative medications.

---

## 📈 Future Horizon: PharmaGuard 2.0
- **Polygenic Risk Scores (PRS)**: Integrating hundreds of minor-impact variants for more nuanced risk curves.
- **EHR Integration**: FHIR API support for seamless connection to hospital systems.
- **Live Interaction**: A specialized medical chatbot for doctors to "chat" with the genetic report.

---

---

## 🌍 Deployment Guide (Step-by-Step)

To get PharmaGuard live, follow these specific configurations for the best performance.

### 1. Backend (Render / Railway)
- **Root Directory**: `backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 10000`
- **Environment Variables**:
  - `GEMINI_API_KEY`: *Your Google AI Key*
  - `GROQ_API_KEY`: *Your Groq API Key*
  - `PYTHON_VERSION`: `3.11` (Ensures compatibility with Pydantic v2 wheels)

### 2. Frontend (Vercel)
- **Framework Preset**: `Vite`
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: *The URL of your deployed Render backend* (e.g., `https://pharmaguard-api.onrender.com`)

---

## 📜 License

MIT License — see `LICENSE` for details.

---

## 🏷️ Submission Hashtags
`#RIFT2026` `#PharmaGuard` `#Pharmacogenomics` `#AIinHealthcare`
