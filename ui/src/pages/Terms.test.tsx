import { describe, test, expect } from 'vitest'
import {MemoryRouter} from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import Terms from './Terms'

describe("unit tests", () => {
  test('show Terms', () => {
    render(<MemoryRouter><Terms /></MemoryRouter>)
    expect(screen.getByText(/myLearning Course IT-225724 - Ethical & Responsible AI/i)).toBeDefined()
  })
})