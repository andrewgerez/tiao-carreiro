import { AxiosError, AxiosRequestHeaders, AxiosResponse } from 'axios'
import { getErrorMessage, isApiError } from '../errors'
import { describe, expect, it } from 'vitest'

describe('getErrorMessage', () => {
  it('extracts message from AxiosError with API error', () => {
    const error = new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, undefined, {
      status: 400,
      statusText: 'Bad Request',
      data: {
        message: 'Validation failed',
        errors: {
          email: ['Email is required'],
        },
      },
      config: {
        headers: {} as AxiosRequestHeaders,
      },
    } as AxiosResponse)

    expect(getErrorMessage(error)).toBe('Email is required')
  })

  it('extracts main message when no validation errors', () => {
    const error = new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, undefined, {
      status: 400,
      statusText: 'Bad Request',
      data: {
        message: 'Something went wrong',
      },
      config: {
        headers: {} as AxiosRequestHeaders,
      },
    } as AxiosResponse)

    expect(getErrorMessage(error)).toBe('Something went wrong')
  })

  it('handles regular Error objects', () => {
    const error = new Error('Regular error')
    expect(getErrorMessage(error)).toBe('Regular error')
  })

  it('handles unknown error types', () => {
    expect(getErrorMessage('string error')).toBe('Erro desconhecido')
    expect(getErrorMessage(null)).toBe('Erro desconhecido')
  })
})

describe('isApiError', () => {
  it('identifies AxiosError correctly', () => {
    const error = new AxiosError('Test error')
    expect(isApiError(error)).toBe(true)
  })

  it('identifies non-AxiosError correctly', () => {
    const error = new Error('Regular error')
    expect(isApiError(error)).toBe(false)
  })
})
