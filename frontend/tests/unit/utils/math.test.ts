import { describe, it, expect } from 'vitest'

// Simple utility functions for testing
const add = (a: number, b: number): number => a + b
const multiply = (a: number, b: number): number => a * b
const divide = (a: number, b: number): number => {
  if (b === 0) throw new Error('Cannot divide by zero')
  return a / b
}

describe('Math Utilities', () => {
  describe('add', () => {
    it('should add two positive numbers correctly', () => {
      expect(add(2, 3)).toBe(5)
    })

    it('should add positive and negative numbers correctly', () => {
      expect(add(5, -3)).toBe(2)
    })

    it('should handle zero correctly', () => {
      expect(add(0, 5)).toBe(5)
      expect(add(5, 0)).toBe(5)
    })
  })

  describe('multiply', () => {
    it('should multiply two positive numbers correctly', () => {
      expect(multiply(3, 4)).toBe(12)
    })

    it('should handle multiplication by zero', () => {
      expect(multiply(5, 0)).toBe(0)
    })

    it('should handle negative numbers', () => {
      expect(multiply(-2, 3)).toBe(-6)
      expect(multiply(-2, -3)).toBe(6)
    })
  })

  describe('divide', () => {
    it('should divide two numbers correctly', () => {
      expect(divide(10, 2)).toBe(5)
    })

    it('should handle decimal results', () => {
      expect(divide(10, 3)).toBeCloseTo(3.333, 3)
    })

    it('should throw error when dividing by zero', () => {
      expect(() => divide(5, 0)).toThrow('Cannot divide by zero')
    })
  })
})
