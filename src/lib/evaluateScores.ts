import { parameterMeta } from './parameters';

type RawScores = Record<string, number>;

export function evaluateScores(raw: RawScores) {
  const evaluated: Record<string, number> = {};

  for (const [key, value] of Object.entries(raw)) {
    const meta = parameterMeta[key as keyof typeof parameterMeta];

    if (!meta) continue;

    if (meta.inputType === "PASS_FAIL") {
      evaluated[key] = value >= 50 ? meta.weight : 0;
    } else if (meta.inputType === "SCORE") {
      evaluated[key] = Math.round((value / 100) * meta.weight);
    }
  }

  return evaluated;
}
