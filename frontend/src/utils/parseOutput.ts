import { AppMode } from '../models/types';

export const parseOutput = (text: string, mode: AppMode) => {
  const lines = text.split("\n").map(line => line.trim()).filter(Boolean);

  if (mode === 'translate') {
    return { mistake: "", correct: text, explanation: null };
  }

  if (mode === 'level-assessment') {
    const match = text.match(/(A1|A2|B1|B2|C1|C2)/i);
    return {
      mistake: '',
      correct: `Your level is: ${match?.[0] || 'Unknown'}`,
      explanation: text, // AI recomendation
    };
  }
  
  const mistake = lines.find(line => line.startsWith("❌")) || "";
  const correct = lines.find(line => line.startsWith("✅")) || "";
  const explanationRaw = lines.find(line => line.startsWith("🧠")) || "";

  const lower = explanationRaw.toLowerCase();
  const explanation =
    !explanationRaw ||
      lower.includes("no mistake") ||
      lower.startsWith("✅ correct")
      ? null
      : explanationRaw;

  return { mistake, correct, explanation };
};