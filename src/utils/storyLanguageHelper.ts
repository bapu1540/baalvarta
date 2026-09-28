import { Story, Language } from '../types';

/**
 * Checks if a string contains Devanagari script (Hindi, Marathi, Sanskrit, etc.)
 */
export function hasDevanagari(text?: string): boolean {
  if (!text) return false;
  return /[\u0900-\u097F]/.test(text);
}

/**
 * Determines whether a story was uploaded or written primarily in Hindi or English,
 * or if it is a dual-language (bilingual translated) story.
 *
 * User Rule:
 * 1. If uploaded in Hindi: Title, content, and moral stay in Hindi even when English is selected in the UI.
 * 2. If uploaded in English: Title, content, and moral stay in English.
 * 3. Pre-bundled bilingual stories (story-1 to story-26) switch according to UI language.
 */
export function getStoryLanguageMode(story: Story): 'hi' | 'en' | 'bilingual' {
  if (story.originalLanguage === 'hi') return 'hi';
  if (story.originalLanguage === 'en') return 'en';

  // Story IDs 1-26 are the pre-bundled bilingual stories with official English translations
  const isInitialBilingual =
    typeof story.id === 'string' &&
    /^story-([1-9]|1[0-9]|2[0-6])$/.test(story.id);

  if (
    isInitialBilingual &&
    story.contentEn &&
    story.contentHi &&
    story.contentEn.trim() !== story.contentHi.trim() &&
    !hasDevanagari(story.contentEn)
  ) {
    return 'bilingual';
  }

  // Check if content or title was written in Hindi/Devanagari
  const hasHindiChars =
    hasDevanagari(story.titleHi) ||
    hasDevanagari(story.contentHi) ||
    hasDevanagari(story.moralHi) ||
    hasDevanagari(story.titleEn);

  if (hasHindiChars) {
    // If it has distinct English content that was genuinely translated
    const hasRealEnglishContent =
      story.contentEn &&
      story.contentEn.trim() &&
      story.contentEn.trim() !== story.contentHi.trim() &&
      !hasDevanagari(story.contentEn) &&
      story.moralEn &&
      story.moralEn !== 'Always be truthful.' &&
      story.moralEn !== story.moralHi;

    if (hasRealEnglishContent) {
      return 'bilingual';
    }
    // Uploaded in Hindi!
    return 'hi';
  }

  // Otherwise, written/uploaded in English
  return 'en';
}

/**
 * Returns story title respecting the uploaded language
 */
export function getDisplayStoryTitle(story: Story, uiLang: Language): string {
  const mode = getStoryLanguageMode(story);
  if (mode === 'hi') {
    return story.titleHi || story.titleEn;
  }
  if (mode === 'en') {
    return story.titleEn || story.titleHi;
  }
  return uiLang === 'hi' ? (story.titleHi || story.titleEn) : (story.titleEn || story.titleHi);
}

/**
 * Returns story summary respecting the uploaded language
 */
export function getDisplayStorySummary(story: Story, uiLang: Language): string {
  const mode = getStoryLanguageMode(story);
  if (mode === 'hi') {
    return story.summaryHi || story.summaryEn || (story.contentHi ? story.contentHi.slice(0, 100) + '...' : '');
  }
  if (mode === 'en') {
    return story.summaryEn || story.summaryHi || (story.contentEn ? story.contentEn.slice(0, 100) + '...' : '');
  }
  return uiLang === 'hi'
    ? (story.summaryHi || story.summaryEn)
    : (story.summaryEn || story.summaryHi);
}

/**
 * Returns story content text respecting the uploaded language
 */
export function getDisplayStoryContent(story: Story, uiLang: Language): string {
  const mode = getStoryLanguageMode(story);
  if (mode === 'hi') {
    return story.contentHi || story.contentEn;
  }
  if (mode === 'en') {
    return story.contentEn || story.contentHi;
  }
  return uiLang === 'hi'
    ? (story.contentHi || story.contentEn)
    : (story.contentEn || story.contentHi);
}

/**
 * Returns story moral respecting the uploaded language.
 * NEVER returns empty or dummy text when a real moral exists!
 */
export function getDisplayStoryMoral(story: Story, uiLang: Language): string {
  const mode = getStoryLanguageMode(story);
  if (mode === 'hi') {
    return story.moralHi || story.moralEn || 'सदा सच और अच्छाई के मार्ग पर चलें।';
  }
  if (mode === 'en') {
    return story.moralEn || story.moralHi || 'Always walk on the path of truth and goodness.';
  }
  // Bilingual:
  if (uiLang === 'en') {
    if (
      story.moralEn &&
      story.moralEn.trim() &&
      story.moralEn !== 'Always be truthful.' &&
      story.moralEn !== story.moralHi
    ) {
      return story.moralEn;
    }
    return story.moralHi || story.moralEn || 'Always walk on the path of truth and goodness.';
  }
  return story.moralHi || story.moralEn || 'सदा सच और अच्छाई के मार्ग पर चलें।';
}
