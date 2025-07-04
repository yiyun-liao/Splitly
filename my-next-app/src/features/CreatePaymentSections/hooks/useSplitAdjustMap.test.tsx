import { renderHook, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useSplitAdjustedMap } from './useSplitAdjustMap'
import type { UserData } from '@/types/user'

const users: UserData[] = [
  { uid: 'u1', name: 'Alice', email: 'a@example.com' },
  { uid: 'u2', name: 'Bob',   email: 'b@example.com' },
]

describe('useSplitAdjustedMap', () => {
  it('初始 inputAmountValue > 0 & manualReset=false 時，自動平均分配 percent 且 total = share，rawInputMap 全部 "0"', () => {
    const { result } = renderHook(() =>
      useSplitAdjustedMap({
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
    expect(result.current.rawInputMap).toEqual({ u1: '0', u2: '0' })
  })

  it('帶入 initialMap 時（manualReset=false），fixed 來自 initialMap，total 依剩餘均分，rawInputMap 用 initial fixed', () => {
    const initial = {
      u1: { fixed: 70, percent: 0, total: 70 },
      u2: { fixed: 30, percent: 0, total: 30 },
    }
    // totalAmount = 100, fixedSum = 30+10=40, 剩餘60 均分 → 每人 extra = 60*0.5=30
    // u1.total = 30+30=60, u2.total =10+30=40
    const { result } = renderHook(() =>
      useSplitAdjustedMap({
        currentProjectUsers: users,
        inputAmountValue: '100',
        initialMap: initial,
        manualReset: false,
      })
    )

    expect(result.current.localMap).toEqual({
      u1: { fixed: 70, percent: 0.5, total: 70 },
      u2: { fixed: 30, percent: 0.5, total: 30 },
    })
    // rawInputMap 用 formatNumber(initial.fixed)
    expect(result.current.rawInputMap).toEqual({ u1: '70.00', u2: '30.00' })
  })

  it('handleChange: 非數值輸入只更新 rawInputMap，但不改 localMap', () => {
    const { result } = renderHook(() =>
      useSplitAdjustedMap({
        currentProjectUsers: users,
        inputAmountValue: '',
        initialMap: {},
        manualReset: false,
      })
    )

    act(() => {
      result.current.handleChange('u1', 'abc') // 非數字
    })
    expect(result.current.rawInputMap.u1).toBe('NaN')
    expect(result.current.localMap.u1).toBeUndefined() // 因為 return
  })

  it('handleChange: 數值輸入更新 rawInputMap 與 localMap (fixed 更新，其它人均分)', () => {
    const { result } = renderHook(() =>
      useSplitAdjustedMap({
        currentProjectUsers: users,
        inputAmountValue: '100',
        initialMap: {},
        manualReset: false,
      })
    )

    act(() => {
      result.current.handleChange('u1', '20')
    })
    // rawInputMap.u1 = "20"
    expect(result.current.rawInputMap.u1).toBe('20')
    expect(result.current.localMap).toEqual({
      u1: { fixed: 20, percent: 0.5, total: 60 },
      u2: { fixed: 0,  percent: 0.5, total: 40 },
    })
  })

  it('computeFooterInfo: 計算剩餘 fixedSum 並判定 isComplete', () => {
    // 初始只有 auto 分配，不測 auto 部分，直接測手動後的算式
    const { result } = renderHook(() =>
      useSplitAdjustedMap({
        currentProjectUsers: users,
        inputAmountValue: '50',
        initialMap: {},
        manualReset: true,
      })
    )

    act(() => {
      result.current.handleChange('u1', '20')
    })
    expect(result.current.computeFooterInfo.isComplete).toBe(true) 
    expect(result.current.computeFooterInfo.infoText).toContain('剩餘 30.00 元將均分')

    act(() => {
      result.current.handleChange('u2', '30')
    })
    // fixedSum = 20+30=50 → remaining=0
    expect(result.current.computeFooterInfo.isComplete).toBe(true)
    expect(result.current.computeFooterInfo.infoText).toContain('剩餘 0.00 元將均分')
  })

  it('generateFinalMap: 過濾掉 total <= 0 的項目', () => {
    const { result } = renderHook(() =>
      useSplitAdjustedMap({
        currentProjectUsers: users,
        inputAmountValue: '100',
        initialMap: {},
        manualReset: false,
      })
    )
    // auto 分配 → 每人 total = 50
    const final = result.current.generateFinalMap()
    expect(final).toEqual({
      u1: expect.objectContaining({ total: 50 }),
      u2: expect.objectContaining({ total: 50 }),
    })
  })
})
