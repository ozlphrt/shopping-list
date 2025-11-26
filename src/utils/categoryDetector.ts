import { groceryDatabase, categoryEmojis } from '../data/groceryDatabase';

/**
 * Normalizes Turkish characters for matching
 * Converts Turkish characters to ASCII equivalents for comparison
 */
function normalizeTurkish(text: string): string {
  return text.toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c');
}

/**
 * Calculates Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];
  
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[len1][len2];
}

/**
 * Calculates similarity score between two strings (0-1, where 1 is identical)
 */
function similarityScore(str1: string, str2: string): number {
  const maxLen = Math.max(str1.length, str2.length);
  if (maxLen === 0) return 1;
  return 1 - levenshteinDistance(str1, str2) / maxLen;
}

/**
 * Finds the best matching item from the grocery database using Levenshtein distance
 * Returns the matched text, category, and score, or null if no good match found
 */
function findBestMatch(input: string): { text: string; category: string; score: number } | null {
  const normalizedInput = normalizeTurkish(input.trim());
  if (!normalizedInput) return null;
  
  let bestMatch: { text: string; category: string; score: number } | null = null;
  let bestScore = 0;
  const threshold = 0.6; // Minimum similarity score to accept a match (lowered from 0.65 for better matching)
  
  // First, check for exact matches (case-insensitive, normalized)
  for (const item of groceryDatabase) {
    for (const trWord of item.tr) {
      const normalizedTr = normalizeTurkish(trWord);
      if (normalizedInput === normalizedTr) {
        // Exact match found - return immediately
        return { text: trWord, category: item.category, score: 1.0 };
      }
    }
    for (const enWord of item.en) {
      const normalizedEn = normalizeTurkish(enWord);
      if (normalizedInput === normalizedEn) {
        // Exact match found - return immediately
        return { text: enWord, category: item.category, score: 1.0 };
      }
    }
  }
  
  // If no exact match, do fuzzy matching
  groceryDatabase.forEach(item => {
    // Check Turkish variants
    item.tr.forEach(trWord => {
      const score = similarityScore(normalizedInput, normalizeTurkish(trWord));
      if (score > bestScore && score >= threshold) {
        bestScore = score;
        bestMatch = { text: trWord, category: item.category, score };
      }
    });
    
    // Check English variants
    item.en.forEach(enWord => {
      const score = similarityScore(normalizedInput, normalizeTurkish(enWord));
      if (score > bestScore && score >= threshold) {
        bestScore = score;
        bestMatch = { text: enWord, category: item.category, score };
      }
    });
  });
  
  return bestMatch;
}

/**
 * Detects category for a product name using fuzzy matching
 * Returns the category name (e.g., "Produce", "Meat & Seafood", etc.)
 */
export const detectCategory = async (productName: string, _useOnline: boolean = false): Promise<string> => {
  if (!productName || productName.trim().length === 0) {
    return 'Other';
  }

  const match = findBestMatch(productName);
  
  if (match) {
    return match.category;
  }

  return 'Other';
};

/**
 * Finds the best matching product name and category
 * Returns both the normalized product name and category
 */
export const findProductMatch = (productName: string): { name: string; category: string } | null => {
  if (!productName || productName.trim().length === 0) {
    return null;
  }

  const match = findBestMatch(productName);
  
  if (match) {
    return {
      name: match.text,
      category: match.category
    };
  }

  return null;
};

/**
 * Gets emoji for a category
 */
export const getCategoryEmoji = (category: string): string => {
  return categoryEmojis[category] || '📦';
};
