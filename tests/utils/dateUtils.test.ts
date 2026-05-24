import { describe, it, expect } from 'vitest';
import { formatDate } from '../../utils/dateUtils';

describe('formatDate', () => {
  it('returns empty string for empty input', () => {
    expect(formatDate('', 'MM/YYYY')).toBe('');
  });

  it('returns original string for invalid date', () => {
    expect(formatDate('not-a-date', 'MM/YYYY')).toBe('not-a-date');
  });

  it('formats as MM/YYYY', () => {
    expect(formatDate('2024-03-15', 'MM/YYYY')).toBe('03/2024');
  });

  it('formats as YYYY-MM', () => {
    expect(formatDate('2024-03-15', 'YYYY-MM')).toBe('2024-03');
  });

  it('formats as MMM YYYY with Spanish month names', () => {
    const result = formatDate('2024-06-15', 'MMM YYYY');
    expect(result).toBe('Jun 2024');
  });

  it('formats as DD/MM/YYYY', () => {
    // Use day 15 to avoid timezone UTC-offset shifting to previous day
    expect(formatDate('2024-03-15', 'DD/MM/YYYY')).toBe('15/03/2024');
  });

  it('defaults to MM/YYYY for unknown format', () => {
    expect(formatDate('2024-03-15', 'UNKNOWN')).toBe('03/2024');
  });
});
