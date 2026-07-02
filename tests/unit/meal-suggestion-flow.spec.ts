import { describe, it, expect } from 'vitest';

describe('meal-suggestion-flow multiplier calculations', () => {
  const calculateFinalProtein = (baseProtein: number, multiplier: number): number => {
    if (multiplier <= 0) return 0;
    return Math.round(baseProtein * multiplier * 10) / 10;
  };

  it('should calculate protein correctly for 1.0x', () => {
    expect(calculateFinalProtein(30, 1.0)).toBe(30);
    expect(calculateFinalProtein(15.5, 1.0)).toBe(15.5);
  });

  it('should calculate protein correctly for fractional multipliers', () => {
    expect(calculateFinalProtein(30, 1.5)).toBe(45);
    expect(calculateFinalProtein(30, 0.5)).toBe(15);
  });

  it('should round to 1 decimal place correctly', () => {
    expect(calculateFinalProtein(7.5, 1.35)).toBe(10.1); // 7.5 * 1.35 = 10.125 -> rounds to 10.1
    expect(calculateFinalProtein(6, 1.22)).toBe(7.3); // 6 * 1.22 = 7.32 -> rounds to 7.3
  });

  it('should return 0 for zero or negative multipliers', () => {
    expect(calculateFinalProtein(30, 0)).toBe(0);
    expect(calculateFinalProtein(30, -1)).toBe(0);
  });
});
