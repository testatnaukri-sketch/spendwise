import '@testing-library/jest-dom'
import { vi } from 'vitest'

global.matchMedia = global.matchMedia || function() {
  return {
    addListener: vi.fn(),
    removeListener: vi.fn(),
  }
}
