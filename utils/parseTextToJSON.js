function parseResultText(text) {
  const strengthMatch = text.match(/Strength\s*:\s*(.*?)\n\n/s);
  const weaknessMatch = text.match(/Weakness\s*:\s*(.*?)\n\n/s);
  const suggestionMatch = text.match(/Suggestion\s*:\s*(.*?)\n\n?/s);
  const scoreMatch = text.match(/Score\s*:\s*(\d+)/);

  return [
    strengthMatch?.[1]?.trim() || "",
    weaknessMatch?.[1]?.trim() || "",
    suggestionMatch?.[1]?.trim() || "",
    scoreMatch?.[1] || ""
  ];
}

module.exports = { parseResultText };