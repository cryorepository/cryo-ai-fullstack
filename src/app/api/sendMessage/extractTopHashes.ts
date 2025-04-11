/**
 * Extracts up to 3 unique article hashes from vector search results, applying similarity gap logic.
 * @param results - Array of objects with { article: { hash: string }, similarity: number, details: object }
 * @returns Array of top unique hashes (up to 3)
 */
export function extractTopHashes(results: Array<{
  article: { hash: string };
  similarity: number;
  details?: object;
}>): string[] {
  if (!Array.isArray(results) || !results.length) {
    return [];
  }

  // Filter unique results by hash
  const seen = new Set<string>();
  const uniqueResults: Array<{
    article: { hash: string };
    similarity: number;
    details?: object;
  }> = [];
  for (const result of results) {
    const hash = result.article?.hash;
    if (hash && !seen.has(hash)) {
      uniqueResults.push(result);
      seen.add(hash);
    }
    if (uniqueResults.length >= 3) break;
  }

  // Apply similarity gap logic
  const topHashes: string[] = [];
  if (uniqueResults.length > 1) {
    const first = uniqueResults[0].similarity;
    const second = uniqueResults[1]?.similarity ?? 0;
    const third = uniqueResults[2]?.similarity ?? 0;

    // Case 1: Top similarity is significantly higher than second
    if (first - second > 0.2) {
      topHashes.push(uniqueResults[0].article.hash);
    } else {
      // Case 2: Check gaps within top 3
      topHashes.push(uniqueResults[0].article.hash);
      if (second - third > 0.2) {
        topHashes.push(uniqueResults[1].article.hash);
      } else {
        if (uniqueResults[1]) topHashes.push(uniqueResults[1].article.hash);
        if (uniqueResults[2]) topHashes.push(uniqueResults[2].article.hash);
      }
    }
  } else if (uniqueResults.length === 1) {
    topHashes.push(uniqueResults[0].article.hash);
  }

  return topHashes;
}

// No need for module.exports in ES Modules; export is used above