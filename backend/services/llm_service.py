# Person 2 Work Area: LLM Lead
import os
import json
import google.generativeai as genai
from typing import Dict, Any, List
from dotenv import load_dotenv

load_dotenv()

# Configure the Gemini API
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

def generate_clinical_explanation(genetic_data: Dict[str, Any], drug_name: str) -> Dict[str, Any]:
    """
    Uses Gemini 1.5 Flash to generate clinical summaries and mechanisms.
    Translates the logic from the frontend geminiService.ts to the backend.
    """
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        system_instruction="""
            You are an expert Clinical Pharmacogenomics AI Assistant labeled 'PharmaGuard'.
            Your task is to analyze patient genetic data and a specified drug to predict pharmacogenomic risks.
            
            References:
            - CPIC (Clinical Pharmacogenetics Implementation Consortium) guidelines.
            - FDA Table of Pharmacogenomic Biomarkers.

            Input:
            1. Genetic context (rsIDs, genotypes, phenotype).
            2. A Drug Name.

            Task:
            1. Identify relevant variants for the gene(s) associated with the drug.
            2. Assess the risk (Safe, Adjust Dosage, Toxic, Ineffective).
            3. Provide a clinical recommendation.

            Output must be strict JSON with these keys: 
            summary, mechanism, clinical_implications.
        """
    )

    # Context construction from the data provided by Person 1
    vcf_context = genetic_data.get("vcf_context", "No context provided.")
    
    prompt = f"""
    Genetic Data Context:
    {vcf_context}
    
    Target Drug for Analysis: "{drug_name}"

    Analyze and return JSON with keys: 'summary', 'mechanism', 'clinical_implications'.
    """

    try:
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        
        if response.text:
            return json.loads(response.text)
        return {
            "summary": "Analysis failed.",
            "mechanism": "N/A",
            "clinical_implications": "Contact system admin."
        }
    except Exception as e:
        print(f"Gemini Error: {e}")
        return {
            "summary": f"Error: {str(e)}",
            "mechanism": "Error",
            "clinical_implications": "Check API configuration."
        }
