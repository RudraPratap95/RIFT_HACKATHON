# 🧬 PharmaGuard — Pharmacogenomic Risk Intelligence

> AI-powered adverse drug reaction prevention through genetic variant analysis

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Click%20Here-00d4aa?style=for-the-badge)](https://your-deployed-url.vercel.app)
[![LinkedIn Video](https://img.shields.io/badge/Demo%20Video-LinkedIn-0077B5?style=for-the-badge&logo=linkedin)](https://linkedin.com/your-video-link)
[![CPIC Aligned](https://img.shields.io/badge/CPIC-Level%20A%20Aligned-blue?style=for-the-badge)](https://cpicpgx.org)

**RIFT 2026 Hackathon Submission** | #RIFT2026 #PharmaGuard #Pharmacogenomics #AIinHealthcare

---

## 🎯 Problem

**100,000+ Americans die annually from preventable adverse drug reactions.** The root cause: most clinicians don't know how a patient's genetics affect drug metabolism before prescribing. Pharmacogenomic testing exists — but the data sits in raw VCF files that clinicians can't interpret.

PharmaGuard bridges this gap: upload a VCF file, get instant AI-powered clinical guidance.

---

## 🚀 Live Demo

**→ [https://pharmaguard.vercel.app](https://pharmaguard.vercel.app)**

Test with the included `sample_patient.vcf` file and drugs: `CODEINE, WARFARIN, CLOPIDOGREL`

---

## 📹 Demo Video

**→ [LinkedIn Video Walkthrough](https://linkedin.com/your-video-link)**

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🧬 VCF Parsing | Full VCF v4.2 parser with INFO tag extraction, genotype calling, zygosity detection |
| 🎯 6-Gene Panel | CYP2D6, CYP2C19, CYP2C9, SLCO1B1, TPMT, DPYD — 30+ validated variants |
| ⚠️ Risk Assessment | 5-tier classification: Safe / Adjust Dosage / Toxic / Ineffective / Unknown |
| 🤖 LLM Explanations | Gemini/Groq-powered clinical explanations with variant citations |
| 📊 CPIC Alignment | Level A/B/C evidence badges, CPIC-recommended dosing adjustments |
| 📄 PDF Reports | Clinical-grade PDF with executive summary, variant table, dosing guidance |
| 📋 JSON Export | Schema-compliant JSON matching competition requirements exactly |
| 🔄 Rule-Based Fallback | Works without API keys — deterministic explanations always available |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│  ┌──────────┐  ┌──────────────┐  ┌──────────┐  ┌────────────┐  │
│  │VCF Upload│  │ Drug Selector│  │  Results │  │PDF/JSON    │  │
│  │+ Validate│  │ (6 drugs)    │  │Dashboard │  │Export      │  │
│  └────┬─────┘  └──────┬───────┘  └────▲─────┘  └─────▲──────┘  │
└───────┼───────────────┼───────────────┼───────────────┼─────────┘
        │ FormData      │               │               │
        ▼               ▼               │               │
┌───────────────────────────────────────┼───────────────┼─────────┐
│              BACKEND (FastAPI)        │               │         │
│  ┌─────────────┐   ┌───────────────┐  │               │         │
│  │  VCF Parser │   │  Risk Engine  │  │               │         │
│  │             │   │  (CPIC rules) │──┘               │         │
│  │ - Header    │   │               │                  │         │
│  │ - Variants  │──▶│ - Phenotype   │                  │         │
│  │ - Genotype  │   │ - Risk label  │                  │         │
│  │ - INFO tags │   │ - Dosing      │                  │         │
│  └─────────────┘   └──────┬────────┘                  │         │
│                            │                           │         │
│                    ┌───────▼────────┐                  │         │
│                    │   LLM Engine   │──────────────────┘         │
│                    │                │   JSON Response             │
│                    │ Gemini → Groq  │                             │
│                    │ → Rule-Based   │                             │
│                    └────────────────┘                             │
└───────────────────────────────────────────────────────────────────┘
        │                           │
        ▼                           ▼
┌───────────────┐         ┌──────────────────┐
│ Google Gemini │         │   Groq (Llama3)  │
│ 1.5 Flash API │         │   Fallback LLM   │
│ (1500/day)    │         │   (14400/day)    │
└───────────────┘         └──────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Tailwind CSS, jsPDF |
| Backend | Python 3.11, FastAPI, Uvicorn |
| LLM (Primary) | Google Gemini 1.5 Flash |
| LLM (Fallback) | Groq Llama3-70B |
| VCF Parsing | Custom Python parser (no external bioinformatics deps) |
| PDF Generation | jsPDF + jspdf-autotable |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 📦 Installation

### Backend

```bash
cd backend
pip install -r requirements.txt
cp ../.env.example .env
# Edit .env with your API keys (see below)
python main.py
```

### Frontend

```bash
cd frontend
npm install
cp ../.env.example .env
# Set REACT_APP_API_URL=http://localhost:8000
npm start
```

---

## 🔑 Getting Free API Keys

### Google Gemini (Recommended — 1500 free req/day, never expires)
1. Go to **https://aistudio.google.com/app/apikey**
2. Click "Create API Key"
3. Copy key → paste in `.env` as `GEMINI_API_KEY`

### Groq (Ultra-fast fallback — 14,400 free req/day)
1. Go to **https://console.groq.com**
2. Sign up → API Keys → Create
3. Copy key → paste as `GROQ_API_KEY`

> ⚠️ The app works without any API key using rule-based fallback explanations.

---

## 📋 API Documentation

### `POST /analyze`

Analyze VCF file for pharmacogenomic risks.

**Request (multipart/form-data):**
| Field | Type | Required | Description |
|---|---|---|---|
| `vcf_file` | File | ✅ | VCF v4.2 file (max 5MB) |
| `drugs` | String | ✅ | Comma-separated drug names |
| `patient_id` | String | ❌ | Override patient ID |

**Response Schema:**
```json
{
  "patient_id": "PATIENT_001",
  "drug": "CODEINE",
  "timestamp": "2024-01-15T10:30:00Z",
  "risk_assessment": {
    "risk_label": "Toxic",
    "confidence_score": 0.92,
    "severity": "critical"
  },
  "pharmacogenomic_profile": {
    "primary_gene": "CYP2D6",
    "diplotype": "*1/*4",
    "phenotype": "IM",
    "phenotype_description": "Intermediate Metabolizer...",
    "detected_variants": [...]
  },
  "clinical_recommendation": {
    "action": "Use non-opioid analgesic...",
    "dose_modifier": 0.0,
    "cpic_level": "A",
    "alternative_drugs": ["Acetaminophen", "Ibuprofen"],
    "monitoring_parameters": [...]
  },
  "llm_generated_explanation": {
    "summary": "...",
    "mechanism": "...",
    "variant_significance": "...",
    "clinical_implication": "...",
    "population_context": "...",
    "risk_rationale": "...",
    "alternatives_note": "..."
  },
  "quality_metrics": {
    "vcf_parsing_success": true,
    "vcf_version": "VCFv4.2",
    "total_variants_parsed": 9,
    "pharmacogenomic_variants_found": 9,
    "genes_analyzed": ["CYP2D6", "CYP2C19", "CYP2C9"]
  }
}
```

### `GET /drugs` — List supported drugs
### `POST /parse-vcf` — Parse VCF only (debug endpoint)
### `GET /health` — Health check

---

## 🧪 Usage Examples

```bash
# Test with sample VCF
curl -X POST http://localhost:8000/analyze \
  -F "vcf_file=@sample_patient.vcf" \
  -F "drugs=CODEINE,WARFARIN,SIMVASTATIN"

# Health check
curl http://localhost:8000/health
```

---

## 🧬 Supported Genes & Variants

| Gene | Drugs | Key Variants |
|---|---|---|
| CYP2D6 | Codeine, Tramadol | rs3892097 (*4), rs35742686 (*3), rs5030655 (*6) |
| CYP2C19 | Clopidogrel, PPIs | rs4244285 (*2), rs4986893 (*3), rs12248560 (*17) |
| CYP2C9 | Warfarin, NSAIDs | rs1799853 (*2), rs1057910 (*3) |
| SLCO1B1 | Simvastatin | rs4149056 (*5), rs74064213 (*15) |
| TPMT | Azathioprine | rs1800460 (*3B), rs1142345 (*3C), rs1800462 (*2) |
| DPYD | Fluorouracil | rs3918290 (*2A), rs55886062 (*13), rs67376798 (HapB3) |

---

## 👥 Team Members

| Name | Role |
|---|---|
| [Team Member 1] | Frontend / UX |
| [Team Member 2] | Backend / VCF Parsing |
| [Team Member 3] | LLM Integration / Prompt Engineering |

---

## 📜 References

- [CPIC Guidelines](https://cpicpgx.org/guidelines/)
- [PharmGKB Variant Annotations](https://www.pharmgkb.org/)
- [VCF Format Specification v4.2](https://samtools.github.io/hts-specs/VCFv4.2.pdf)
- [FDA Table of Pharmacogenomic Biomarkers](https://www.fda.gov/medical-devices/precision-medicine/table-pharmacogenomic-biomarkers-drug-labeling)

---

*Built for RIFT 2026 Hackathon | #RIFT2026 #PharmaGuard*
