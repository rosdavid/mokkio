/**
 * Validation utilities for user inputs
 */

/**
 * Validates if a string is a valid URL
 * @param url - The URL string to validate
 * @returns true if valid, false otherwise
 */
export function isValidUrl(url: string): boolean {
  if (!url || url.trim().length === 0) return false;

  try {
    const urlObj = new URL(url);
    // Only allow http and https protocols
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Sanitizes a mockup name by removing dangerous characters
 * and limiting length
 * @param name - The mockup name to sanitize
 * @param maxLength - Maximum length (default: 100)
 * @returns Sanitized name
 */
export function sanitizeMockupName(name: string, maxLength = 100): string {
  return name
    .trim()
    .replace(/[<>"'&]/g, "") // Remove potentially dangerous characters
    .replace(/\s+/g, " ") // Normalize whitespace
    .substring(0, maxLength);
}

/**
 * Validates mockup name
 * @param name - The mockup name to validate
 * @returns Error message if invalid, null if valid
 */
export function validateMockupName(name: string): string | null {
  const trimmed = name.trim();

  if (trimmed.length === 0) {
    return "Mockup name cannot be empty";
  }

  if (trimmed.length < 3) {
    return "Mockup name must be at least 3 characters";
  }

  if (trimmed.length > 100) {
    return "Mockup name must be less than 100 characters";
  }

  // Check for potentially dangerous patterns
  if (/<script|javascript:|onerror=/i.test(trimmed)) {
    return "Mockup name contains invalid characters";
  }

  return null;
}
