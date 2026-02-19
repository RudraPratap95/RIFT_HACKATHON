import os
import json
from openai import OpenAI
from dotenv import load_dotenv


load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))



def build_prompt(data):
    return f"""
You are a clinical pharmacogenomics expert.

Patient Genetic Data:
Gene: {data['gene']}
Diplotype: {data['diplotype']}
Phenotype: {data['phenotype']}
Drug: {data['drug']}
Risk: {data['risk']}
Detected Variants: {data['variants']}

Explain clearly:

1. Short clinical summary
2. Biological mechanism
3. Clinical impact
4. Recommendation reasoning

Return ONLY valid JSON in this exact format:
{{
  "summary": "",
  "mechanism": "",
  "clinical_impact": "",
  "recommendation_rationale": ""
}}

Do not include any extra text outside JSON.
"""


def generate_explanation(genetic_data):

    return {
        "summary": f"Patient carries {genetic_data['gene']} {genetic_data['diplotype']} associated with {genetic_data['phenotype']} phenotype.",
        
        "mechanism": f"The {genetic_data['gene']} enzyme metabolizes {genetic_data['drug']}. Genetic variation may alter drug metabolism.",
        
        "clinical_impact": f"This can lead to a {genetic_data['risk']} response to {genetic_data['drug']}.",
        
        "recommendation_rationale": "Clinical monitoring or dose adjustment should be considered according to pharmacogenomic guidelines."
    }
