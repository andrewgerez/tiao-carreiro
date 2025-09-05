import { describe, expect, it } from 'vitest'
import { loginSchema, registerSchema } from '../auth'

describe('loginSchema', () => {
  it('validates correct login data', () => {
    const validData = {
      email: 'test@example.com',
      password: '123456',
    }

    expect(() => loginSchema.parse(validData)).not.toThrow()
  })

  it('rejects invalid email', () => {
    const invalidData = {
      email: 'invalid-email',
      password: '123456',
    }

    expect(() => loginSchema.parse(invalidData)).toThrow()
  })

  it('rejects short password', () => {
    const invalidData = {
      email: 'test@example.com',
      password: '123',
    }

    expect(() => loginSchema.parse(invalidData)).toThrow()
  })
})

describe('registerSchema', () => {
  it('validates correct register data', () => {
    const validData = {
      name: 'Test User',
      email: 'test@example.com',
      password: '123456',
      password_confirmation: '123456',
    }

    expect(() => registerSchema.parse(validData)).not.toThrow()
  })

  it('rejects mismatched passwords', () => {
    const invalidData = {
      name: 'Test User',
      email: 'test@example.com',
      password: '123456',
      password_confirmation: '654321',
    }

    expect(() => registerSchema.parse(invalidData)).toThrow()
  })
})
