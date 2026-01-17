import { describe, it, expect } from 'vitest'

describe('セットアップ確認', () => {
  it('Vitestが正常に動作すること', () => {
    expect(1 + 1).toBe(2)
  })

  it('文字列の比較が正常に動作すること', () => {
    const appName = 'My Wardrobe Deck'
    expect(appName).toContain('Wardrobe')
  })
})
