/**
 * Date Formatting Utilities
 * Consistent date formatting across the entire application
 * Format: DD/MM/YYYY for dates, DD/MM/YYYY HH:MM for dates with time
 */

/**
 * Format a date string to DD/MM/YYYY
 * @param dateString - Date string or Date object
 * @returns Formatted date string in DD/MM/YYYY format
 */
export const formatDate = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Format a datetime string to DD/MM/YYYY HH:MM
 * @param dateTimeString - DateTime string or Date object
 * @returns Formatted datetime string in DD/MM/YYYY HH:MM format
 */
export const formatDateTime = (dateTimeString: string | Date): string => {
  const date = typeof dateTimeString === 'string' ? new Date(dateTimeString) : dateTimeString;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

/**
 * Get current date in DD/MM/YYYY format
 * @returns Current date string in DD/MM/YYYY format
 */
export const getCurrentDate = (): string => {
  return formatDate(new Date());
};

/**
 * Get current datetime in DD/MM/YYYY HH:MM format
 * @returns Current datetime string in DD/MM/YYYY HH:MM format
 */
export const getCurrentDateTime = (): string => {
  return formatDateTime(new Date());
};
