from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from models.models import AnalysisResult, RiskAssessment, PharmacogenomicProfile, ClinicalRecommendation, LLMExplanation, QualityMetrics, RiskLabel, Severity, Phenotype, DetectedVariant
from services import genetics_logic, llm_service
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

@app.post("/analyze", response_model=List[AnalysisResult])
async def analyze_vcf(
    vcf_file: UploadFile = File(...),
    drugs: str = Form(...),
    patient_id: Optional[str] = Form(None)
):
    """
    Main orchestration endpoint (Person 3 Responsibility)
    """
    try:
        # 1. Read and Parse VCF (Person 1 Work Area: genetics_logic.py)
        vcf_content = await vcf_file.read()
        vcf_text = vcf_content.decode("utf-8")
        
        drug_list = [d.strip().upper() for d in drugs.split(",") if d.strip()]
        if not drug_list:
            raise HTTPException(status_code=400, detail="No drugs provided")

        all_results = []
        
        for drug in drug_list:
            # 2. Map Genetics to Risk (Person 1 Responsibility)
            # This calls the logic being built by the Core Logic Lead
            genetics_data = genetics_logic.map_genetics_to_risk(vcf_text, drug)
            
            # 3. Generate LLM explanations (Person 2 Responsibility)
            # This calls the service being built by the LLM Lead
            explanation_data = llm_service.generate_clinical_explanation(genetics_data, drug)
            
            # 4. Construct Final Mandatory JSON (Person 3 Responsibility)
            # We map the team results into our strict Pydantic model
            result = AnalysisResult(
                patient_id=patient_id or f"PATIENT_{int(time.time())}",
                drug=drug,
                timestamp=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                risk_assessment=RiskAssessment(
                    risk_label=genetics_data.get("risk_label", RiskLabel.UNKNOWN),
                    confidence_score=0.90, # Logic or LLM can provide this
                    severity=genetics_data.get("severity", Severity.NONE)
                ),
                pharmacogenomic_profile=PharmacogenomicProfile(
                    primary_gene=genetics_data.get("primary_gene", "UNKNOWN"),
                    diplotype=genetics_data.get("diplotype", "*1/*1"),
                    phenotype=genetics_data.get("phenotype", Phenotype.UNKNOWN),
                    detected_variants=[] # Person 1 will populate this list
                ),
                clinical_recommendation=ClinicalRecommendation(
                    action=explanation_data.get("clinical_implications", "Standard monitoring."),
                    alternative_drugs=[], # LLM or Logic can provide list
                    cpic_guideline=f"CPIC Guideline for {drug}"
                ),
                llm_generated_explanation=LLMExplanation(
                    summary=explanation_data.get("summary", "Analysis complete."),
                    mechanism=explanation_data.get("mechanism", "Biological context..."),
                    clinical_implications=explanation_data.get("clinical_implications", "Consult doctor.")
                ),
                quality_metrics=QualityMetrics(
                    vcf_parsing_success=True,
                    variants_detected=genetics_data.get("variants_detected", 0),
                    genes_covered=[genetics_data.get("primary_gene")] if genetics_data.get("primary_gene") else []
                )
            )
            all_results.append(result)
            
        return all_results

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)