import sys
import os

# Add project root to path
sys.path.append(os.getcwd())

from backend.services import genetics_logic

# Mock parse_vcf to return fixed variants without reading a file
original_parse_vcf = genetics_logic.parse_vcf

def mock_parse_vcf(file):
    return [
        {"gene": "CYP2D6", "rsid": "rs123", "star": "*4"},
        {"gene": "DPYD", "rsid": "rs456", "star": "*2A"},
        {"gene": "TPMT", "rsid": "rs789", "star": "*1"}
    ]

# Apply mock
genetics_logic.parse_vcf = mock_parse_vcf

def test_gene_selection():
    print("Testing gene selection logic...")

    # Case 1: Codeine should select CYP2D6
    result_codeine = genetics_logic.analyze_genetics(None, "Codeine")
    print(f"Drug: Codeine -> Gene: {result_codeine['gene']}")
    assert result_codeine['gene'] == "CYP2D6", f"Expected CYP2D6, got {result_codeine['gene']}"

    # Case 2: Fluorouracil should select DPYD
    result_fluoro = genetics_logic.analyze_genetics(None, "Fluorouracil")
    print(f"Drug: Fluorouracil -> Gene: {result_fluoro['gene']}")
    assert result_fluoro['gene'] == "DPYD", f"Expected DPYD, got {result_fluoro['gene']}"

    # Case 3: Azathioprine should select TPMT
    result_azathio = genetics_logic.analyze_genetics(None, "Azathioprine")
    print(f"Drug: Azathioprine -> Gene: {result_azathio['gene']}")
    assert result_azathio['gene'] == "TPMT", f"Expected TPMT, got {result_azathio['gene']}"

    # Case 4: Unsupported Drug
    result_unknown = genetics_logic.analyze_genetics(None, "MysteryPill")
    print(f"Drug: MysteryPill -> Message: {result_unknown.get('message')}")
    assert "not supported" in result_unknown.get('message', ""), "Expected not supported message"

    print("\nALL TESTS PASSED ✅")

if __name__ == "__main__":
    test_gene_selection()
