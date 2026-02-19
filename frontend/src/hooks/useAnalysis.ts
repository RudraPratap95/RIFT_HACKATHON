import { useState, useCallback } from 'react';

const API_BASE = 'http://localhost:8000';

export function useAnalysis() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const STEPS = [
    'Validating VCF file format...',
    'Parsing genomic variants...',
    'Matching pharmacogenomic database...',
    'Building gene-diplotype profiles...',
    'Running CPIC risk assessment...',
    'Generating clinical explanation...',
    'Compiling final report...',
  ];

  const analyze = useCallback(async ({ vcfFile, drugs, patientId }: { vcfFile: File, drugs: string, patientId?: string }) => {
    setLoading(true);
    setError(null);
    setResults(null);
    setLoadingStep(0);

    // Simulate loading steps for UX
    const stepInterval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev < STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 800);

    try {
      const formData = new FormData();
      formData.append('vcf_file', vcfFile);
      formData.append('drugs', drugs);
      if (patientId) formData.append('patient_id', patientId);

      const response = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        body: formData,
      });

      clearInterval(stepInterval);
      setLoadingStep(STEPS.length - 1);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Server error: ${response.status}`);
      }

      const data = await response.json();

      // The backend returns a list of results
      setResults(data);
      return data;
    } catch (err: any) {
      clearInterval(stepInterval);
      setError(err.message || 'Analysis failed. Please check the VCF file and try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [STEPS.length]);

  const reset = useCallback(() => {
    setResults(null);
    setError(null);
    setLoadingStep(0);
  }, []);

  return { analyze, loading, results, error, loadingStep, STEPS, reset };
}

export async function fetchSupportedDrugs() {
  try {
    const res = await fetch(`${API_BASE}/drugs`);
    const data = await res.json();
    return data.drugs || [];
  } catch {
    return [
      { name: 'CODEINE', primary_gene: 'CYP2D6' },
      { name: 'WARFARIN', primary_gene: 'CYP2C9' },
      { name: 'CLOPIDOGREL', primary_gene: 'CYP2C19' },
      { name: 'SIMVASTATIN', primary_gene: 'SLCO1B1' },
      { name: 'AZATHIOPRINE', primary_gene: 'TPMT' },
      { name: 'FLUOROURACIL', primary_gene: 'DPYD' },
    ];
  }
}
