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
            # genetics_logic.analyze_genetics expects a file-like iterator (list of strings)
            genetics_data = genetics_logic.analyze_genetics(vcf_text.splitlines(), drug)
            
            # 3. Generate LLM explanations (Person 2 Responsibility)
            # This calls the service being built by the LLM Lead
            explanation_data = llm_service.generate_clinical_explanation(genetics_data, drug)

            # Helper for safe Enum lookup
            def safe_enum(enum_cls, value, default):
                # Try direct match
                for valid in enum_cls:
                    if valid.value == value:
                        return valid
                return default

            # Map raw strings to Enums
            risk_val = genetics_data.get("risk_label", "Unknown")
            severity_val = genetics_data.get("severity", "unknown")
            phenotype_val = genetics_data.get("phenotype", "Unknown")

            risk_enum = safe_enum(RiskLabel, risk_val, RiskLabel.UNKNOWN)
            severity_enum = safe_enum(Severity, severity_val, Severity.NONE)
            
            # Simple mapper for likely logic outputs to Phenotype Enum
            pheno_map = {
                "NM": Phenotype.NM, "Normal": Phenotype.NM, 
                "PM": Phenotype.PM, "Poor": Phenotype.PM,
                "IM": Phenotype.IM, "Intermediate": Phenotype.IM, "Decreased": Phenotype.IM,
                "RM": Phenotype.RM, "Rapid": Phenotype.RM,
                "URM": Phenotype.URM, "Ultra-Rapid": Phenotype.URM,
            }
            phenotype_enum = pheno_map.get(phenotype_val, Phenotype.UNKNOWN)
            
            # 4. Construct Final Mandatory JSON (Person 3 Responsibility)
            result = AnalysisResult(
                patient_id=patient_id or f"PATIENT_{int(time.time())}",
                drug=drug,
                timestamp=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                risk_assessment=RiskAssessment(
                    risk_label=risk_enum,
                    confidence_score=0.90,
                    severity=severity_enum
                ),
                pharmacogenomic_profile=PharmacogenomicProfile(
                    primary_gene=genetics_data.get("gene", "UNKNOWN"),
                    diplotype=genetics_data.get("diplotype", "*1/*1"),
                    phenotype=phenotype_enum,
                    detected_variants=[] 
                ),
                clinical_recommendation=ClinicalRecommendation(
                    action=explanation_data.get("clinical_implications", "Standard monitoring."),
                    alternative_drugs=[],
                    cpic_guideline=f"CPIC Guideline for {drug}"
                ),
                llm_generated_explanation=LLMExplanation(
                    summary=explanation_data.get("summary", "Analysis complete."),
                    mechanism=explanation_data.get("mechanism", "Biological context..."),
                    clinical_implications=explanation_data.get("clinical_implications", "Consult doctor.")
                ),
                quality_metrics=QualityMetrics(
                    vcf_parsing_success=True,
                    variants_detected=0,
                    genes_covered=[genetics_data.get("gene")] if genetics_data.get("gene") else []
                )
            )
            all_results.append(result)
            
        return all_results

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)