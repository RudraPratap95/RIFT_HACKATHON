from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import time
import os

app = FastAPI(title="PharmaGuard AI API")

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "PharmaGuard AI Backend is running"}

@app.post("/analyze")
async def analyze_vcf(
    vcf_file: UploadFile = File(...),
    drugs: str = Form(...),
    patient_id: Optional[str] = Form(None)
):
    # This is the main orchestration endpoint
    # 1. Parse VCF (Person 1)
    # 2. Map Genetics to Risk (Person 1)
    # 3. Generate LLM explanations (Person 2)
    # 4. Return structured JSON (Person 3)
    
    drug_list = [d.strip() for d in drugs.split(",") if d.strip()]
    
    results = []
    for drug in drug_list:
        # Placeholder for real logic
        results.append({
            "patient_id": patient_id or "PATIENT_001",
            "drug": drug.upper(),
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "risk_assessment": {
                "risk_label": "Safe",
                "confidence_score": 0.95,
                "severity": "none"
            },
            "pharmacogenomic_profile": {
                "primary_gene": "CYP2D6",
                "diplotype": "*1/*1",
                "phenotype": "NM",
                "detected_variants": []
            },
            "clinical_recommendation": {
                "action": "Standard dosing recommended.",
                "alternative_drugs": [],
                "cpic_guideline": "CPIC Guideline for " + drug
            },
            "llm_generated_explanation": {
                "summary": "No high-risk variants detected.",
                "mechanism": "Normal metabolism metabolism.",
                "clinical_implications": "Standard care applies."
            },
            "quality_metrics": {
                "vcf_parsing_success": True,
                "variants_detected": 0
            }
        })
        
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
