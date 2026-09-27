/**
 * Safe clipboard copy utility with fallback for iframes and unfocused documents.
 */
export async function safeCopyToClipboard(text: string): Promise<boolean> {
  // Try Modern Async Clipboard API first
  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Failed (e.g. document not focused or permission denied), fallback to execCommand below
    }
  }

  // Fallback: create invisible textarea and use document.execCommand('copy')
  try {
    if (typeof document !== 'undefined' && document.body) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.setAttribute('readonly', '');
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '-9999px';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (err) {
    console.warn('Fallback clipboard copy failed:', err);
  }

  return false;
}
