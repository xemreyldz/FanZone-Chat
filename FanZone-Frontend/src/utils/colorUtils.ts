// src/utils/colorUtils.ts
export function adjustColorBrightness(hex: string, percent: number) {
  let R = parseInt(hex.substring(1,3),16);
  let G = parseInt(hex.substring(3,5),16);
  let B = parseInt(hex.substring(5,7),16);

  R = Math.min(255, Math.max(0, R + (R * percent/100)));
  G = Math.min(255, Math.max(0, G + (G * percent/100)));
  B = Math.min(255, Math.max(0, B + (B * percent/100)));

  const rHex = Math.round(R).toString(16).padStart(2,'0');
  const gHex = Math.round(G).toString(16).padStart(2,'0');
  const bHex = Math.round(B).toString(16).padStart(2,'0');

  return `#${rHex}${gHex}${bHex}`;
}
