import type { OnValidateHandler } from '@devvit/public-api';

export function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function removeRanksFromFlair(ranks: { [key: string]: number }, userFlairText: string): string {
  let result = userFlairText;
  for (const rank of Object.keys(ranks)) {
    const escapedRank = escapeRegExp(rank);
    const pattern = new RegExp(`(?:\\s|^)${escapedRank}(?=\\s|$)`, 'gu');
    result = result.replace(pattern, '');
  }
  return result.trim().replace(/\s{2,}/g, ' ');
}

export function removeOldFromFlair(ranks: string[], userFlairText: string): string {
  let result = userFlairText;
  for (const rank of ranks) {
    const escapedRank = escapeRegExp(rank);
    const pattern = new RegExp(`(?:\\s|^)${escapedRank}(?=\\s|$)`, 'gu');
    result = result.replace(pattern, '');
  }
  return result.trim().replace(/\s{2,}/g, ' ');
}

export function getRank(ranks: { [key: string]: number }, totalKarma: number): string {
  let bestRank = '';
  let highestThreshold = -1000000;
  for (const [rank, threshold] of Object.entries(ranks)) {
    if (totalKarma >= threshold && threshold > highestThreshold) {
      highestThreshold = threshold;
      bestRank = rank;
    }
  }
  return bestRank;
}

export function replacePlaceholders(template: string, values: Record<string, string | number>) {
  return template.replace(/\$\{(\w+)\}/g, (_, key) => values[key] !== undefined ? String(values[key]) : '');
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getRandomDelay(minSeconds: number, maxSeconds: number): number {
  const minMs = minSeconds * 1000;
  const maxMs = maxSeconds * 1000;
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
}