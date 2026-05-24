import { describe, it, expect } from 'vitest';
import { INITIAL_DATA } from '../../constants';

describe('INITIAL_DATA integrity', () => {
  it('has required top-level fields', () => {
    expect(INITIAL_DATA.name).toBeTruthy();
    expect(INITIAL_DATA.title).toBeTruthy();
    expect(INITIAL_DATA.contact).toBeDefined();
    expect(INITIAL_DATA.fontSizes).toBeDefined();
  });

  it('fontSizes has all required keys', () => {
    const { fontSizes } = INITIAL_DATA;
    expect(fontSizes.name).toBeGreaterThan(0);
    expect(fontSizes.title).toBeGreaterThan(0);
    expect(fontSizes.content).toBeGreaterThan(0);
    expect(fontSizes.contact).toBeGreaterThan(0);
    expect(fontSizes.sectionHeaders).toBeGreaterThan(0);
    expect(fontSizes.summary).toBeGreaterThan(0);
  });

  it('has at least 1 experience entry with tasks', () => {
    expect(INITIAL_DATA.experience.length).toBeGreaterThan(0);
    expect(INITIAL_DATA.experience[0].tasks.length).toBeGreaterThan(0);
  });

  it('columnLayout has left and right arrays', () => {
    expect(Array.isArray(INITIAL_DATA.columnLayout?.left)).toBe(true);
    expect(Array.isArray(INITIAL_DATA.columnLayout?.right)).toBe(true);
  });

  it('template defaults to modern', () => {
    expect(INITIAL_DATA.template).toBe('modern');
  });

  it('pageFormat defaults to Letter', () => {
    expect(INITIAL_DATA.pageFormat).toBe('Letter');
  });
});
