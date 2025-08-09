/**
 * Utility functions for formatting numbers, currency, dates, and other data types
 * Used across the application for consistent data presentation
 */

/**
 * Format a number with thousand separators
 * @param value - The number to format
 * @param locale - The locale to use for formatting (default: 'en-US')
 * @returns Formatted number string
 */
export const formatNumber = (value: number, locale: string = 'en-US'): string => {
  if (isNaN(value)) return '0';

  return new Intl.NumberFormat(locale).format(value);
};

/**
 * Format a number as currency
 * @param value - The number to format
 * @param currency - The currency code (default: 'USD')
 * @param locale - The locale to use for formatting (default: 'en-US')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  if (isNaN(value)) return '$0.00';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

/**
 * Format a number as a percentage
 * @param value - The number to format (as decimal, e.g., 0.25 for 25%)
 * @param decimals - Number of decimal places (default: 1)
 * @param locale - The locale to use for formatting (default: 'en-US')
 * @returns Formatted percentage string
 */
export const formatPercentage = (
  value: number,
  decimals: number = 1,
  locale: string = 'en-US'
): string => {
  if (isNaN(value)) return '0%';

  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
};

/**
 * Format a date string or Date object
 * @param date - The date to format
 * @param options - Formatting options
 * @param locale - The locale to use for formatting (default: 'en-US')
 * @returns Formatted date string
 */
export const formatDate = (
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  },
  locale: string = 'en-US'
): string => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return '';

  return new Intl.DateTimeFormat(locale, options).format(dateObj);
};

/**
 * Format a date with time
 * @param date - The date to format
 * @param locale - The locale to use for formatting (default: 'en-US')
 * @returns Formatted date and time string
 */
export const formatDateTime = (date: string | Date, locale: string = 'en-US'): string => {
  return formatDate(
    date,
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
    locale
  );
};

/**
 * Format a relative time (e.g., "2 hours ago", "in 3 days")
 * @param date - The date to compare
 * @param locale - The locale to use for formatting (default: 'en-US')
 * @returns Formatted relative time string
 */
export const formatRelativeTime = (date: string | Date, locale: string = 'en-US'): string => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return '';

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (Math.abs(diffInSeconds) < 60) {
    return rtf.format(-diffInSeconds, 'second');
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (Math.abs(diffInMinutes) < 60) {
    return rtf.format(-diffInMinutes, 'minute');
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (Math.abs(diffInHours) < 24) {
    return rtf.format(-diffInHours, 'hour');
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (Math.abs(diffInDays) < 30) {
    return rtf.format(-diffInDays, 'day');
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (Math.abs(diffInMonths) < 12) {
    return rtf.format(-diffInMonths, 'month');
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return rtf.format(-diffInYears, 'year');
};

/**
 * Format file size in bytes to human readable format
 * @param bytes - The number of bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Format a phone number
 * @param phone - The phone number to format
 * @param format - The format pattern (default: US format)
 * @returns Formatted phone number string
 */
export const formatPhoneNumber = (phone: string, format: string = '(###) ###-####'): string => {
  if (!phone) return '';

  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length !== 10) return phone;

  return format.replace(/#+/g, match => {
    const digits = cleaned.slice(0, match.length);
    cleaned.replace(digits, '');
    return digits;
  });
};

/**
 * Truncate text to a specified length
 * @param text - The text to truncate
 * @param maxLength - Maximum length (default: 50)
 * @param suffix - Suffix to add when truncated (default: '...')
 * @returns Truncated text string
 */
export const truncateText = (
  text: string,
  maxLength: number = 50,
  suffix: string = '...'
): string => {
  if (!text || text.length <= maxLength) return text;

  return text.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Capitalize the first letter of each word
 * @param text - The text to capitalize
 * @returns Capitalized text string
 */
export const toTitleCase = (text: string): string => {
  if (!text) return '';

  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format a duration in seconds to human readable format
 * @param seconds - Duration in seconds
 * @returns Formatted duration string
 */
export const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m ${Math.round(seconds % 60)}s`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ${minutes % 60}m`;
  }

  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h`;
};

/**
 * Format a grade or score with appropriate styling context
 * @param score - The numerical score
 * @param maxScore - The maximum possible score (default: 100)
 * @returns Formatted score with grade context
 */
export const formatGrade = (
  score: number,
  maxScore: number = 100
): { value: string; grade: string; color: string } => {
  const percentage = (score / maxScore) * 100;

  let grade: string;
  let color: string;

  if (percentage >= 90) {
    grade = 'A';
    color = 'success';
  } else if (percentage >= 80) {
    grade = 'B';
    color = 'info';
  } else if (percentage >= 70) {
    grade = 'C';
    color = 'warning';
  } else if (percentage >= 60) {
    grade = 'D';
    color = 'error';
  } else {
    grade = 'F';
    color = 'error';
  }

  return {
    value: `${Math.round(percentage)}%`,
    grade,
    color,
  };
};

/**
 * Format attendance percentage with appropriate status
 * @param attended - Number of days attended
 * @param total - Total number of days
 * @returns Formatted attendance with status
 */
export const formatAttendance = (
  attended: number,
  total: number
): { percentage: string; status: string; color: string } => {
  if (total === 0) {
    return { percentage: '0%', status: 'No Data', color: 'default' };
  }

  const percentage = (attended / total) * 100;

  let status: string;
  let color: string;

  if (percentage >= 95) {
    status = 'Excellent';
    color = 'success';
  } else if (percentage >= 85) {
    status = 'Good';
    color = 'info';
  } else if (percentage >= 75) {
    status = 'Average';
    color = 'warning';
  } else {
    status = 'Poor';
    color = 'error';
  }

  return {
    percentage: formatPercentage(percentage),
    status,
    color,
  };
};
