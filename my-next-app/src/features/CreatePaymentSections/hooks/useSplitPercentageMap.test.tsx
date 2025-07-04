import { renderHook, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useSplitPercentageMap } from './useSplitPercentageMap'
import type { UserData } from '@/types/user'

const users: UserData[] = [
    { uid: 'u1', name: 'Alice', email: 'a@example.com' },
    { uid: 'u2', name: 'Bob',   email: 'b@example.com' },
]

describe('useSplitPercentageMap', () => {
  it('自動平均分配 (manualReset=false, 無 initialMap)', () => {
    const { result } = renderHook(() =>
        useSplitPercentageMap({
            currentProjectUsers: users,
            inputAmountValue: '100',
            initialMap: {},
            manualReset: false,
        })
    )

    expect(result.current.localMap).toEqual({
        u1: { fixed: 0, percent: 0.5, total: 50 },
        u2: { fixed: 0, percent: 0.5, total: 50 },
    })
    expect(result.current.rawInputMap).toEqual({ u1: '50.00', u2: '50.00' })
  })

  it('帶入 initialMap (manualReset=false)，percent = total/amount，rawInputMap = parsePercentToInt', () => {
    const initial = {
      u1: { fixed: 10, percent: 0.5, total: 45 },
      u2: { fixed: 20, percent: 0.5, total: 55 },
    }
    // amount = 100 → percent1 = 10/100 = 0.1，percent2 = 20/100 = 0.2
    const { result } = renderHook(() =>
        useSplitPercentageMap({
            currentProjectUsers: users,
            inputAmountValue: '100',
            initialMap: initial,
            manualReset: false,
        })
    )

    expect(result.current.localMap).toEqual({
        u1: { fixed: 0, percent: 0.45, total: 45 },
        u2: { fixed: 0, percent: 0.55, total: 55 },
    })
    expect(result.current.rawInputMap).toEqual({ u1: '45.00', u2: '55.00' })
  })

  it('handleChange: 非數值輸入只更新 rawInputMap，不變更 localMap', () => {
    const { result } = renderHook(() =>
      useSplitPercentageMap({
        currentProjectUsers: users,
        inputAmountValue: '100',
        initialMap: {},
        manualReset: false,
      })
    )

    act(() => {
      result.current.handleChange('u1', 'abc') // 非數字
    })
    expect(result.current.rawInputMap.u1).toBe('NaN') //非數字
    expect(result.current.localMap.u1).toEqual({"fixed": 0, "percent": 0.5, "total": 50}) // 因為 return，但有 default
  })

  it('handleChange: 正確數值更新 rawInputMap 及 localMap', () => {
    const { result } = renderHook(() =>
      useSplitPercentageMap({
        currentProjectUsers: users,
        inputAmountValue: '100',
        initialMap: {},
        manualReset: false,
      })
    )

    act(() => {
      result.current.handleChange('u1', '20')
    })
    expect(result.current.rawInputMap.u1).toBe('20')
    expect(result.current.localMap.u1).toEqual({fixed: 0, percent: 0.2, total: 20,})
  })

  it('computeFooterInfo: 初始即 complete，並在 handleChange 後更新 isComplete/infoText', () => {
    const { result } = renderHook(() =>
      useSplitPercentageMap({
        currentProjectUsers: users,
        inputAmountValue: '100',
        initialMap: {},
        manualReset: false,
      })
    )
    expect(result.current.computeFooterInfo.isComplete).toBe(true) // 初始兩人各 50%
    expect(result.current.computeFooterInfo.infoText).toContain('目前剩餘 0.00%')

    act(() => {
      result.current.handleChange('u1', '80')
    })
    // sumPercent = 0.2 + 0.5 = 0.7 → remainingPercent = 0.3 → isComplete=false
    expect(result.current.localMap.u1).toEqual({
        fixed: 0,
        percent: 0.8,
        total: 80,
    })
    expect(result.current.computeFooterInfo.isComplete).toBe(false)
    expect(result.current.computeFooterInfo.infoText).toContain('目前剩餘 -30.00%')

    act(() => {
      result.current.handleChange('u2', '20')
    })
    // sumPercent = 0.2 + 0.8 = 1 → remainingPercent = 0 → isComplete=true
    expect(result.current.computeFooterInfo.isComplete).toBe(true)
    expect(result.current.computeFooterInfo.infoText).toContain('目前剩餘 0.00%')
  })

  it('generateFinalMap: 過濾掉 total <= 0 的項目', () => {
    const { result } = renderHook(() =>
      useSplitPercentageMap({
        currentProjectUsers: users,
        inputAmountValue: '100',
        initialMap: {},
        manualReset: false,
      })
    )

    // 自動分配後每人 total=50，都保留
    const final = result.current.generateFinalMap()
    expect(final).toEqual({
      u1: expect.objectContaining({ total: 50 }),
      u2: expect.objectContaining({ total: 50 }),
    })
  })
})
