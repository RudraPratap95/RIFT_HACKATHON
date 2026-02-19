TARGET_GENES = {
    "CYP2D6",
    "CYP2C19",
    "CYP2C9",
    "SLCO1B1",
    "TPMT",
    "DPYD"
}


# STEP 1: Parse VCF file
def parse_vcf(file):
    """
    Reads VCF file and extracts gene, rsid, and star allele.
    """
    variants = []
    for line in file:
        # convert bytes to string
        if isinstance(line, bytes):
            line = line.decode("utf-8")
        line = line.strip()
        # skip headers
        if line.startswith("#"):
            continue
        columns = line.split("\t")
        if len(columns) < 8:
            continue
        rsid = columns[2]
        info = columns[7]
        gene = None
        star = None

        for part in info.split(";"):
            if part.startswith("GENE="):
                gene = part.split("=")[1]

            elif part.startswith("STAR="):
                star = part.split("=")[1]

        # keep only target genes
        if gene in TARGET_GENES:

            variants.append({
                "gene": gene,
                "rsid": rsid,
                "star": star if star else "*1"
            })

    return variants

# STEP 2: Determine diplotype
def get_diplotype(star):

    if star is None or star == "*1":
        return "*1/*1"

    return f"*1/{star}"


# STEP 3: Determine phenotype
def get_phenotype(gene, diplotype):

    phenotype_map = {

        "CYP2D6": {
            "*1/*1": "NM",
            "*1/*4": "IM",
            "*4/*4": "PM"
        },

        "CYP2C19": {
            "*1/*1": "NM",
            "*1/*2": "IM",
            "*2/*2": "PM"
        },

        "CYP2C9": {
            "*1/*1": "NM",
            "*1/*2": "IM"
        },

        "SLCO1B1": {
            "*1/*1": "Normal",
            "*1/*5": "Decreased"
        },

        "TPMT": {
            "*1/*1": "Normal"
        },

        "DPYD": {
            "*1/*1": "Normal",
            "*1/*2A": "Intermediate"
        }
    }

    return phenotype_map.get(gene, {}).get(diplotype, "Unknown")


# STEP 4: Determine drug risk
def get_risk(gene, phenotype, drug):

    drug = drug.upper()

    risk_map = {

        # CODEINE - CYP2D6
        ("CYP2D6", "NM", "CODEINE"): ("Safe", "low"),
        ("CYP2D6", "IM", "CODEINE"): ("Adjust Dosage", "moderate"),
        ("CYP2D6", "PM", "CODEINE"): ("Ineffective", "high"),
        ("CYP2D6", "UM", "CODEINE"): ("Toxic", "critical"),

        # WARFARIN - CYP2C9
        ("CYP2C9", "NM", "WARFARIN"): ("Safe", "low"),
        ("CYP2C9", "IM", "WARFARIN"): ("Adjust Dosage", "moderate"),
        ("CYP2C9", "PM", "WARFARIN"): ("Toxic", "high"),

        # CLOPIDOGREL - CYP2C19
        ("CYP2C19", "NM", "CLOPIDOGREL"): ("Safe", "low"),
        ("CYP2C19", "IM", "CLOPIDOGREL"): ("Adjust Dosage", "moderate"),
        ("CYP2C19", "PM", "CLOPIDOGREL"): ("Ineffective", "high"),

        # SIMVASTATIN - SLCO1B1
        ("SLCO1B1", "Normal", "SIMVASTATIN"): ("Safe", "low"),
        ("SLCO1B1", "Decreased", "SIMVASTATIN"): ("Adjust Dosage", "moderate"),
        ("SLCO1B1", "Poor", "SIMVASTATIN"): ("Toxic", "high"),

        # AZATHIOPRINE - TPMT
        ("TPMT", "Normal", "AZATHIOPRINE"): ("Safe", "low"),
        ("TPMT", "Intermediate", "AZATHIOPRINE"): ("Adjust Dosage", "moderate"),
        ("TPMT", "Poor", "AZATHIOPRINE"): ("Toxic", "critical"),

        # FLUOROURACIL - DPYD
        ("DPYD", "Normal", "FLUOROURACIL"): ("Safe", "low"),
        ("DPYD", "Intermediate", "FLUOROURACIL"): ("Adjust Dosage", "moderate"),
        ("DPYD", "Poor", "FLUOROURACIL"): ("Toxic", "critical"),
    }

    return risk_map.get((gene, phenotype, drug), ("Unknown", "unknown"))



# Drug to Gene Mapping
DRUG_TO_GENE = {
    "CODEINE": "CYP2D6",
    "CLOPIDOGREL": "CYP2C19",
    "WARFARIN": "CYP2C9",
    "SIMVASTATIN": "SLCO1B1",
    "FLUOROURACIL": "DPYD",
    "AZATHIOPRINE": "TPMT"
}


# STEP 5: Main function (Person 1 primary function)
def analyze_genetics(file, drug):

    variants = parse_vcf(file)
    drug = drug.upper()

    target_gene = DRUG_TO_GENE.get(drug)

    if not target_gene:
        return {
            "gene": "Unknown",
            "diplotype": "Unknown",
            "phenotype": "Unknown",
            "risk_label": "Unknown",
            "severity": "unknown",
            "message": f"Drug {drug} not supported"
        }

    # Find matching gene in variants
    selected_variant = None
    for v in variants:
        if v["gene"] == target_gene:
            selected_variant = v
            break

    if not selected_variant:
        return {
            "gene": target_gene,
            "diplotype": "Unknown",
            "phenotype": "Unknown",
            "risk_label": "Unknown",
            "severity": "unknown",
            "message": f"Gene {target_gene} not found in VCF"
        }

    gene = selected_variant["gene"]
    star = selected_variant["star"]

    diplotype = get_diplotype(star)
    phenotype = get_phenotype(gene, diplotype)
    risk_label, severity = get_risk(gene, phenotype, drug)

    return {
        "gene": gene,
        "diplotype": diplotype,
        "phenotype": phenotype,
        "risk_label": risk_label,
        "severity": severity
    }
