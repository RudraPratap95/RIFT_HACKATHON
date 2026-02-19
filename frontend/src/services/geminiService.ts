import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

export const analyzePharmacogenomics = async (
  vcfContext: string,
  drugName: string
): Promise<AnalysisResult> => {
  // Use 'gemini-1.5-flash' for fast, structured reasoning. 
  // If complex biological inference is needed, 'gemini-1.5-pro' is better.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemInstruction = `
    You are an expert Clinical Pharmacogenomics AI Assistant labeled 'PharmaGuard'.
    Your task is to analyze patient genetic data (VCF format) and a specified drug to predict pharmacogenomic risks.
    
    References:
    - CPIC (Clinical Pharmacogenetics Implementation Consortium) guidelines.
    - FDA Table of Pharmacogenomic Biomarkers.
    - DPWG guidelines.

    Genes of Interest: CYP2D6, CYP2C19, CYP2C9, SLCO1B1, TPMT, DPYD.

    Input:
    1. A subset of a VCF file containing genetic variants.
    2. A Drug Name.

    Task:
    1. Identify relevant variants in the VCF for the gene(s) associated with the drug.
    2. Determine the metabolizer phenotype (e.g., Poor Metabolizer, Ultrarapid Metabolizer) based on identified Star Alleles (deduce from rsIDs or variants if possible, assume *1 (Wild Type) if no variants are found).
    3. Assess the risk (Safe, Adjust Dosage, Toxic, Ineffective).
    4. Provide a clinical recommendation.

    IMPORTANT: If the VCF data is sparse or lacks specific variants for the gene, assume a "Normal Metabolizer" (*1/*1) phenotype but note the limitation in the explanation. Do not hallucinate variants that are not present in the text provided.
    
    Output must be strict JSON matching the exact schema provided below.
    
    Required JSON Schema:
    {
      "patient_id": "string (e.g., PATIENT_XXX)",
      "drug": "string",
      "timestamp": "ISO8601_timestamp",
      "risk_assessment": {
        "risk_label": "Safe|Adjust Dosage|Toxic|Ineffective|Unknown",
        "confidence_score": number,
        "severity": "none|low|moderate|high|critical"
      },
      "pharmacogenomic_profile": {
        "primary_gene": "GENE_SYMBOL",
        "diplotype": "*X/*Y",
        "phenotype": "PM|IM|NM|RM|URM|Unknown",
        "detected_variants": [
          {
            "rsid": "rsXXXX",
            "gene": "string",
            "star_allele": "string",
            "zygosity": "homozygous|heterozygous",
            "functional_impact": "string"
          }
        ]
      },
      "clinical_recommendation": {
        "action": "string",
        "alternative_drugs": ["string"],
        "cpic_guideline": "string"
      },
      "llm_generated_explanation": {
        "summary": "string",
        "mechanism": "string",
        "clinical_implications": "string"
      },
      "quality_metrics": {
        "vcf_parsing_success": boolean,
        "variants_detected": number,
        "genes_covered": ["string"],
        "confidence_basis": "string"
      }
    }
  `;

  const prompt = `
    Patient VCF Data (Snippet):
    \`\`\`
    ${vcfContext.slice(0, 30000)} 
    \`\`\`
    
    Target Drug for Analysis: "${drugName}"

    Analyze the genomic data for variants related to ${drugName} and return the JSON risk assessment.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            patient_id: { type: Type.STRING },
            drug: { type: Type.STRING },
            timestamp: { type: Type.STRING },
            risk_assessment: {
              type: Type.OBJECT,
              properties: {
                risk_label: { type: Type.STRING },
                confidence_score: { type: Type.NUMBER },
                severity: { type: Type.STRING }
              },
              required: ["risk_label", "confidence_score", "severity"]
            },
            pharmacogenomic_profile: {
              type: Type.OBJECT,
              properties: {
                primary_gene: { type: Type.STRING },
                diplotype: { type: Type.STRING },
                phenotype: { type: Type.STRING },
                detected_variants: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      rsid: { type: Type.STRING },
                      gene: { type: Type.STRING },
                      star_allele: { type: Type.STRING },
                      zygosity: { type: Type.STRING },
                      functional_impact: { type: Type.STRING }
                    }
                  }
                }
              },
              required: ["primary_gene", "diplotype", "phenotype", "detected_variants"]
            },
            clinical_recommendation: {
              type: Type.OBJECT,
              properties: {
                action: { type: Type.STRING },
                alternative_drugs: { type: Type.ARRAY, items: { type: Type.STRING } },
                cpic_guideline: { type: Type.STRING }
              },
              required: ["action", "alternative_drugs", "cpic_guideline"]
            },
            llm_generated_explanation: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING },
                mechanism: { type: Type.STRING },
                clinical_implications: { type: Type.STRING }
              },
              required: ["summary", "mechanism", "clinical_implications"]
            },
            quality_metrics: {
              type: Type.OBJECT,
              properties: {
                vcf_parsing_success: { type: Type.BOOLEAN },
                variants_detected: { type: Type.NUMBER },
                genes_covered: { type: Type.ARRAY, items: { type: Type.STRING } },
                confidence_basis: { type: Type.STRING }
              },
              required: ["vcf_parsing_success", "variants_detected", "genes_covered", "confidence_basis"]
            }
          },
          required: [
            "patient_id", "drug", "timestamp", "risk_assessment",
            "pharmacogenomic_profile", "clinical_recommendation",
            "llm_generated_explanation", "quality_metrics"
          ]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    } else {
      throw new Error("No response from AI model.");
    }
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};