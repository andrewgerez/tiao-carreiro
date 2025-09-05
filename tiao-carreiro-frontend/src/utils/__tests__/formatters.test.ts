import { describe, expect, it } from 'vitest'
import { formatViews, getYouTubeVideoId } from '../formatters'

describe('formatViews', () => {
  it('formats billions correctly', () => {
    expect(formatViews(1500000000)).toBe('1.5B')
    expect(formatViews(2000000000)).toBe('2.0B')
  })

  it('formats millions correctly', () => {
    expect(formatViews(1500000)).toBe('1.5M')
    expect(formatViews(2500000)).toBe('2.5M')
  })

  it('formats thousands correctly', () => {
    expect(formatViews(1500)).toBe('1.5K')
    expect(formatViews(2500)).toBe('2.5K')
  })

  it('formats regular numbers correctly', () => {
    expect(formatViews(500)).toBe('500')
    expect(formatViews(999)).toBe('999')
  })
})

describe('getYouTubeVideoId', () => {
  it('extracts video ID from regular YouTube URL', () => {
    expect(getYouTubeVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('extracts video ID from short YouTube URL', () => {
    expect(getYouTubeVideoId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('extracts video ID from embed URL', () => {
    expect(getYouTubeVideoId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('returns null for invalid URLs', () => {
    expect(getYouTubeVideoId('https://example.com')).toBeNull()
    expect(getYouTubeVideoId('not-a-url')).toBeNull()
  })
})
