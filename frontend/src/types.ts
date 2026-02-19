export interface RiskAssessment {
  risk_label: "Safe" | "Adjust Dosage" | "Toxic" | "Ineffective" | "Unknown";
  confidence_score: number;
  severity: "none" | "low" | "moderate" | "high" | "critical";
}

export interface DetectedVariant {
  rsid: string;
  gene?: string;
  star_allele?: string;
  zygosity?: string;
  functional_impact?: string;
  genotype?: string;
  impact?: string;
}

export interface PharmacogenomicProfile {
  primary_gene: string;
  diplotype: string;
  phenotype: "PM" | "IM" | "NM" | "RM" | "URM" | "Unknown";
  detected_variants: DetectedVariant[];
}

export interface ClinicalRecommendation {
  action?: string;
  alternative_drugs?: string[];
  cpic_guideline?: string;
  dosing_guidance?: string;
  monitoring_requirements?: string;
}

export interface LLMExplanation {
  summary: string;
  mechanism?: string;
  biological_mechanism?: string;
  clinical_implications?: string;
  citations?: string[];
}

export interface QualityMetrics {
  vcf_parsing_success: boolean;
  variants_detected?: number;
  variants_found_count?: number;
  genes_covered?: string[];
  gene_coverage?: string;
  confidence_basis?: string;
}

export interface AnalysisResult {
  patient_id: string;
  drug: string;
  timestamp: string;
  risk_assessment: RiskAssessment;
  pharmacogenomic_profile: PharmacogenomicProfile;
  clinical_recommendation: ClinicalRecommendation;
  llm_generated_explanation: LLMExplanation;
  quality_metrics: QualityMetrics;
}

export const TARGET_GENES = [
  "CYP2D6",
  "CYP2C19",
  "CYP2C9",
  "SLCO1B1",
  "TPMT",
  "DPYD"
];

export const EXAMPLE_DRUGS = [
  "CODEINE",
  "WARFARIN",
  "CLOPIDOGREL",
  "SIMVASTATIN",
  "AZATHIOPRINE",
  "FLUOROURACIL"
];