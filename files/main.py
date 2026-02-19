"""
PharmaGuard FastAPI Backend
Main application entry point with all API endpoints.
"""

from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import json
import uuid
from datetime import datetime, timezone
from typing import Optional

from vcf_parser import parse_vcf
from risk_engine import assess_drug_risk, DRUG_GENE_RULES
from llm_engine import generate_clinical_explanation

app = FastAPI(
    title="PharmaGuard API",
    description="Pharmacogenomic risk assessment from VCF files",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, set to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SUPPORTED_DRUGS = list(DRUG_GENE_RULES.keys())
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


# ─────────────────────────────────────────────────────────────────────────────
# ROUTES
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/health")
async def health():
    return {"status": "ok", "version": "1.0.0", "supported_drugs": SUPPORTED_DRUGS}


@app.get("/drugs")
async def list_drugs():
    """List all supported drugs and their primary genes."""
    return {
        "drugs": [
            {
                "name": drug,
                "primary_gene": info["primary_gene"],
                "cpic_level": list(info["rules"].values())[0][4] if info["rules"] else "N/A",
            }
            for drug, info in DRUG_GENE_RULES.items()
        ]
    }


@app.post("/analyze")
async def analyze(
    vcf_file: UploadFile = File(..., description="VCF file (v4.2)"),
    drugs: str = Form(..., description="Comma-separated drug names"),
    patient_id: Optional[str] = Form(None, description="Optional patient ID override"),
):
    """
    Main analysis endpoint.
    Accepts a VCF file + drug list, returns complete pharmacogenomic risk report.
    """

    # ── Validate file ────────────────────────────────────────────────
    if not vcf_file.filename.endswith(".vcf"):
        raise HTTPException(400, "File must be a .vcf file")

    content = await vcf_file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(413, "File exceeds 5MB limit")

    try:
        vcf_text = content.decode("utf-8")
    except UnicodeDecodeError:
        raise HTTPException(400, "VCF file must be UTF-8 encoded text")

    # ── Parse VCF ────────────────────────────────────────────────────
    parse_result = parse_vcf(vcf_text)
    final_patient_id = patient_id or parse_result.patient_id or f"PATIENT_{uuid.uuid4().hex[:6].upper()}"

    # ── Parse drug list ──────────────────────────────────────────────
    drug_list = [d.strip().upper() for d in drugs.split(",") if d.strip()]
    if not drug_list:
        raise HTTPException(400, "At least one drug name is required")

    # ── Assess each drug ─────────────────────────────────────────────
    results = []
    for drug in drug_list:
        risk = assess_drug_risk(drug, parse_result.gene_profiles)

        # Generate LLM explanation
        explanation = await generate_clinical_explanation(
            drug=drug,
            risk_label=risk.risk_label,
            phenotype=risk.phenotype,
            diplotype=risk.diplotype,
            gene=risk.primary_gene,
            variants=risk.detected_variants,
            action=risk.action,
            severity=risk.severity,
            alternatives=risk.alternatives,
        )

        # Build output matching required schema
        result = {
            "patient_id": final_patient_id,
            "drug": drug,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "risk_assessment": {
                "risk_label": risk.risk_label,
                "confidence_score": risk.confidence_score,
                "severity": risk.severity,
            },
            "pharmacogenomic_profile": {
                "primary_gene": risk.primary_gene,
                "diplotype": risk.diplotype,
                "phenotype": risk.phenotype,
                "phenotype_description": risk.phenotype_description,
                "detected_variants": risk.detected_variants,
            },
            "clinical_recommendation": {
                "action": risk.action,
                "dose_modifier": risk.dose_modifier,
                "cpic_level": risk.cpic_level,
                "alternative_drugs": risk.alternatives,
                "monitoring_parameters": risk.monitoring,
            },
            "llm_generated_explanation": explanation,
            "quality_metrics": {
                "vcf_parsing_success": parse_result.success,
                "vcf_version": parse_result.vcf_version,
                "total_variants_parsed": parse_result.total_variants,
                "pharmacogenomic_variants_found": len(parse_result.pharmaco_variants),
                "genes_analyzed": list(parse_result.gene_profiles.keys()),
                "parsing_errors": parse_result.parsing_errors,
                "analysis_id": str(uuid.uuid4()),
            },
        }
        results.append(result)

    # Return single result or array
    if len(results) == 1:
        return JSONResponse(content=results[0])
    return JSONResponse(content={"patient_id": final_patient_id, "results": results, "drug_count": len(results)})


@app.post("/parse-vcf")
async def parse_vcf_only(vcf_file: UploadFile = File(...)):
    """Parse VCF and return detected variants without risk assessment. Useful for debugging."""
    content = await vcf_file.read()
    vcf_text = content.decode("utf-8")
    result = parse_vcf(vcf_text)

    profiles = {}
    for gene, p in result.gene_profiles.items():
        profiles[gene] = {
            "diplotype": p.diplotype,
            "phenotype": p.phenotype,
            "activity_score": p.activity_score,
            "variant_count": len(p.variants),
        }

    return {
        "patient_id": result.patient_id,
        "vcf_version": result.vcf_version,
        "total_variants": result.total_variants,
        "pharmaco_variants": len(result.pharmaco_variants),
        "gene_profiles": profiles,
        "parsing_errors": result.parsing_errors,
    }


# ─────────────────────────────────────────────────────────────────────────────
# RUN
# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
