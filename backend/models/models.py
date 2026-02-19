from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class RiskLabel(str, Enum):
    SAFE = "Safe"
    ADJUST_DOSAGE = "Adjust Dosage"
    TOXIC = "Toxic"
    INEFFECTIVE = "Ineffective"
    UNKNOWN = "Unknown"

class Severity(str, Enum):
    NONE = "none"
    LOW = "low"
    MODERATE = "moderate"
    HIGH = "high"
    CRITICAL = "critical"

class Phenotype(str, Enum):
    PM = "PM"
    IM = "IM"
    NM = "NM"
    RM = "RM"
    URM = "URM"
    UNKNOWN = "Unknown"

class DetectedVariant(BaseModel):
    rsid: str
    gene: str
    star_allele: Optional[str] = None
    zygosity: Optional[str] = None
    functional_impact: Optional[str] = None

class RiskAssessment(BaseModel):
    risk_label: RiskLabel
    confidence_score: float = Field(..., ge=0, le=1)
    severity: Severity

class PharmacogenomicProfile(BaseModel):
    primary_gene: str
    diplotype: str
    phenotype: Phenotype
    detected_variants: List[DetectedVariant]

class ClinicalRecommendation(BaseModel):
    action: str
    alternative_drugs: List[str]
    cpic_guideline: str

class LLMExplanation(BaseModel):
    summary: str
    mechanism: str
    clinical_implications: str
    citations: Optional[List[str]] = None

class QualityMetrics(BaseModel):
    vcf_parsing_success: bool
    variants_detected: int
    genes_covered: Optional[List[str]] = None
    confidence_basis: Optional[str] = None

class AnalysisResult(BaseModel):
    patient_id: str
    drug: str
    timestamp: str
    risk_assessment: RiskAssessment
    pharmacogenomic_profile: PharmacogenomicProfile
    clinical_recommendation: ClinicalRecommendation
    llm_generated_explanation: LLMExplanation
    quality_metrics: QualityMetrics
