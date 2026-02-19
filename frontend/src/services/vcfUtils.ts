import { TARGET_GENES } from '../types';

/**
 * Basic VCF Parser to extract lines relevant to the target pharmacogenes.
 * This filters the large VCF file to only send relevant lines to the LLM context.
 */
export const parseAndFilterVCF = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) {
        reject(new Error("Empty file"));
        return;
      }

      const lines = text.split('\n');
      const relevantLines: string[] = [];

      // Always keep header information for context
      const headerLines = lines.filter(line => line.startsWith('#'));
      // Limit header to crucial meta-info to save tokens
      relevantLines.push(...headerLines.filter(l => l.startsWith('#CHROM') || l.includes('format') || l.length < 200));

      // Filter data lines for target genes
      // We look for the gene name in the INFO column or just general text match if annotations are messy
      const dataLines = lines.filter(line => {
        if (line.startsWith('#')) return false;

        // Check for common gene names or variants in the line
        const upperLine = line.toUpperCase();
        const hasTargetGene = TARGET_GENES.some(gene => upperLine.includes(gene));

        // Also include lines with RS IDs as they are high-value for PGx
        const hasRSID = line.includes('rs');

        // Also look for specific PGx markers like * alleles in INFO tags
        const hasStarAllele = line.includes('STAR=') || line.includes('RefGene=');

        return hasTargetGene || hasRSID || hasStarAllele;
      });

      if (dataLines.length === 0) {
        // Fallback: Grab first set of variants to avoid empty context
        relevantLines.push(...lines.filter(l => !l.startsWith('#')).slice(0, 50));
        relevantLines.push("# NOTE: No explicit pharmacogene markers found. Analyzing raw variant data.");
      } else {
        // Limit amount of data to keep context clean and relevant
        relevantLines.push(...dataLines.slice(0, 200));
      }

      resolve(relevantLines.join('\n'));
    };

    reader.onerror = (err) => reject(err);
    reader.readAsText(file);
  });
};

export const validateVCF = (file: File): string | null => {
  if (!file.name.toLowerCase().endsWith('.vcf')) {
    return "Invalid file format. Please upload a .vcf file.";
  }
  if (file.size > 5 * 1024 * 1024) { // 5MB
    return "File size exceeds 5MB limit.";
  }
  return null;
};