/**
 * Extracts protein value from FatSecret food description string.
 * Handles both English ("Protein: 10g") and Portuguese ("Proteína: 10g").
 * Also handles different decimal separators (. and ,).
 */
export const extractProteinFromDescription = (description: string): number => {
  const proteinMatch = description.match(/(?:Protein|Proteína):\s*([\d,.]+)/i);
  if (proteinMatch) {
    const proteinValue = proteinMatch[1].replace(',', '.');
    return Math.round(parseFloat(proteinValue));
  }
  return 0;
};
