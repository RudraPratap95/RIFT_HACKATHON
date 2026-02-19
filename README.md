# PharmaGuard 🧬💊
### AI-Powered Pharmacogenomic Risk Analysis

> **Preventing adverse drug reactions through personalized genetic insights — built for RIFT 2026**

---

## 🔗 Links

| Resource | URL |
|----------|-----|
| 🌐 Live Demo | `https://pharmaguard.vercel.app` *(replace with your URL)* |
| 🎥 LinkedIn Demo Video | `https://linkedin.com/posts/your-post-link` *(replace with your link)* |
| 📁 GitHub Repo | `https://github.com/your-username/pharmaguard` *(replace with your repo)* |

---

## 🧪 Problem Statement

Adverse drug reactions kill over **100,000 Americans annually** — and many are preventable. Pharmacogenomics studies how a patient's genetic variants affect how their body processes drugs. With this knowledge, clinicians can personalize dosing before a patient ever takes a pill.

**PharmaGuard** bridges the gap between raw genomic data (VCF files) and actionable clinical decisions — using AI to parse variants, predict drug risks, and generate plain-language explanations aligned with CPIC guidelines.

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

## 🏗️ Architecture

PharmaGuard is a modern, client-side heavy web application that leverages Google's Gemini 1.5 Flash for on-device clinical reasoning (via secure API).

```
┌─────────────────────────────────────────────────────────────┐
│                        PharmaGuard AI                       │
│                                                             │
│  ┌──────────┐    ┌────────────────┐    ┌─────────────────┐  │
│  │  VCF     │───▶│ Local Parsing  │───▶│ Context-Enriched│  │
│  │  Upload  │    │ (Web Worker/JS)│    │ Prompt Generation│  │
│  └──────────┘    └────────────────┘    └────────┬────────┘  │
│                                                 │           │
│  ┌──────────┐                         ┌─────────▼────────┐  │
│  │  Drug    │────────────────────────▶│  Gemini 1.5 Flash│  │
│  │  Input   │                         │  Genomic Engine  │  │
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

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + Tailwind CSS + Lucide Icons |
| AI Engine | Google Gemini 1.5 Flash (via @google/genai) |
| Runtime | Vite + ESM.sh (No-build compatible architecture) |
| VCF Parsing | Custom local stream parser for INFO/STAR alleles |
| Styling | Glassmorphism CSS + Premium Inter Typography |

---

## 🚀 Installation & Setup

### Prerequisites

- Node.js v18+ (or Python 3.10+)
- An Anthropic API key (or OpenAI)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/pharmaguard.git
cd pharmaguard
```

### 2. Install Dependencies

```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
ANTHROPIC_API_KEY=your_api_key_here
PORT=3001
NODE_ENV=development
```

### 4. Run Locally

```bash
# In /server
npm run dev

# In /client (separate terminal)
npm run dev
```

Visit `http://localhost:5173`

---

## 📖 Usage

### Step 1 — Upload a VCF File

Drag and drop a `.vcf` file (up to 5 MB) onto the upload zone, or click to browse. A sample file is provided in `/samples/sample_patient.vcf`.

### Step 2 — Enter Drug Name(s)

Type one or more drug names (comma-separated) in the input field:

```
CODEINE, CLOPIDOGREL, FLUOROURACIL
```

Supported drugs: `CODEINE`, `WARFARIN`, `CLOPIDOGREL`, `SIMVASTATIN`, `AZATHIOPRINE`, `FLUOROURACIL`

### Step 3 — Analyze

Click **Analyze** and wait ~5–10 seconds. Results are displayed with color-coded risk labels and expandable sections.

### Step 4 — Export

Download the structured JSON output or copy it to clipboard.

---

## 📡 API Documentation

### `POST /api/analyze`

Analyzes a VCF file against one or more drugs.

**Request** — `multipart/form-data`

| Field | Type | Description |
|-------|------|-------------|
| `vcf_file` | File | VCF file (.vcf, max 5MB) |
| `drugs` | String | Comma-separated drug names |
| `patient_id` | String | Optional patient identifier |

**Response** — `application/json`

```json
{
  "patient_id": "PATIENT_001",
  "drug": "CODEINE",
  "timestamp": "2026-02-19T14:30:00Z",
  "risk_assessment": {
    "risk_label": "Adjust Dosage",
    "confidence_score": 0.87,
    "severity": "moderate"
  },
  "pharmacogenomic_profile": {
    "primary_gene": "CYP2D6",
    "diplotype": "*1/*4",
    "phenotype": "IM",
    "detected_variants": [
      {
        "rsid": "rs3892097",
        "gene": "CYP2D6",
        "star_allele": "*4",
        "zygosity": "heterozygous",
        "functional_impact": "loss_of_function"
      }
    ]
  },
  "clinical_recommendation": {
    "action": "Use 75% of standard dose. Monitor for reduced analgesia.",
    "alternative_drugs": ["tramadol", "morphine"],
    "cpic_guideline": "CPIC Guideline for Codeine and CYP2D6"
  },
  "llm_generated_explanation": {
    "summary": "Patient carries one non-functional CYP2D6*4 allele, resulting in intermediate metabolizer status. Codeine is converted to morphine by CYP2D6; reduced enzyme activity means lower morphine production and potentially reduced pain relief.",
    "mechanism": "CYP2D6*4 contains a G>A splice site variant at position 1846 that disrupts normal mRNA splicing, producing a truncated, non-functional protein.",
    "clinical_implications": "Risk of inadequate analgesia at standard doses. Consider dose adjustment or alternative opioid with non-CYP2D6 metabolism pathway."
  },
  "quality_metrics": {
    "vcf_parsing_success": true,
    "variants_detected": 3,
    "genes_covered": ["CYP2D6"],
    "confidence_basis": "high_quality_genotype"
  }
}
```

**Error Response**

```json
{
  "error": "INVALID_VCF",
  "message": "File does not conform to VCF v4.2 format. Missing ##fileformat header.",
  "details": "Line 1 expected ##fileformat=VCFv4.x"
}
```

---

## 🧬 Sample VCF File

A demo VCF file is included at `/samples/sample_patient.vcf`. It encodes:

| Gene | Variant | Star Allele | Drug Impact |
|------|---------|-------------|-------------|
| CYP2D6 | rs3892097 (het) | *4 | Codeine → Adjust Dosage |
| CYP2C19 | rs4244285 (hom) | *2 | Clopidogrel → Ineffective |
| CYP2C9 | rs1799853 (het) | *2 | Warfarin → Adjust Dosage |
| SLCO1B1 | rs4149056 (het) | *5 | Simvastatin → Adjust Dosage |
| TPMT | all WT | *1/*1 | Azathioprine → Safe |
| DPYD | rs3918290 (het) | *2A | Fluorouracil → Toxic Risk |

---

## 📁 Repository Structure

```
pharmaguard/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/           # Main app pages
│   │   └── utils/           # Helpers
│   └── package.json
├── server/                  # Node.js backend
│   ├── routes/
│   │   └── analyze.js       # Main analysis endpoint
│   ├── services/
│   │   ├── vcfParser.js     # VCF parsing logic
│   │   ├── riskEngine.js    # CPIC-based risk rules
│   │   └── llmService.js    # Claude API integration
│   ├── data/
│   │   └── cpic_rules.json  # CPIC guideline mappings
│   └── package.json
├── samples/
│   └── sample_patient.vcf   # Demo VCF file
├── .env.example
├── README.md
└── LICENSE
```

---

## 🧠 LLM Integration Strategy

PharmaGuard uses a structured prompt approach to ensure clinically accurate explanations:

1. **Variant Context Injection** — Detected rsIDs, star alleles, and phenotype are injected into the prompt
2. **CPIC Grounding** — The LLM is instructed to align recommendations with CPIC guideline evidence levels
3. **Structured Output Enforcement** — System prompt mandates JSON-formatted response for reliable parsing
4. **Hallucination Mitigation** — LLM is only asked to explain; risk labels are determined by deterministic rule engine first

---

## 👥 Team Members

| Name | Role |
|------|------|
| *(Your Name)* | Full Stack + LLM Integration |
| *(Teammate)* | VCF Parsing + Risk Engine |
| *(Teammate)* | UI/UX + Deployment |

---

## 📜 License

MIT License — see `LICENSE` for details.

---

## 🏷️ Hashtags

`#RIFT2026` `#PharmaGuard` `#Pharmacogenomics` `#AIinHealthcare`
