import { renderHook, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useSplitActualMap } from './useSplitActualMap'
import type { UserData } from '@/types/user'

const users: UserData[] = [
    {uid: 'u1', name: 'Alice', email: 'test@test.com'},
    {uid: 'u2', name: 'Bob', email: 'test@test.com'},
];

describe('useSplitActualMap', () => {
    it('初始 inputAmountValue > 0 時，localMap 平均分配且 rawInputMap 格式正確', () => {
        const { result } = renderHook(() =>
            useSplitActualMap({
            currentProjectUsers: users,
            inputAmountValue: '100',
            initialMap: {},
            manualReset: false,
            })
        )
    
        expect(result.current.localMap).toEqual({
            u1: { fixed: 50, percent: 0, total: 50 },
            u2: { fixed: 50, percent: 0, total: 50 },
        })
        expect(result.current.rawInputMap).toEqual({ u1: '50.00', u2: '50.00' })
    })
  
    it('帶入 initialMap 時，忽略 inputAmountValue 平分，直接套用 initialMap', () => {
        const initial = { 
            u1: { fixed: 30, percent: 0.5, total: 65 },
            u2:  { fixed: 0, percent: 0.5, total: 35 } 
        }  
        const { result } = renderHook(() =>
            useSplitActualMap({
            currentProjectUsers: users,
            inputAmountValue: '100',
            initialMap: initial,
            manualReset: false,
            })
        )
    
        expect(result.current.localMap).toEqual({
            u1: { fixed: 65, percent: 0, total: 65 },
            u2: { fixed: 35, percent: 0, total: 35 },
        })
        expect(result.current.rawInputMap).toEqual({ u1: '65.00', u2: '35.00' })
    })
  
    it('handleChange: 傳入非數值時不更新 localMap，但更新 rawInputMap', () => {
        const { result } = renderHook(() =>
            useSplitActualMap({
            currentProjectUsers: users,
            inputAmountValue: '',
            initialMap: {},
            manualReset: false,
            })
        )
    
        act(() => {
            result.current.handleChange('u1', 'abc')  // 非數字
        })
        expect(result.current.rawInputMap.u1).toBe('NaN') //非數字
        expect(result.current.localMap.u1).toBeUndefined() // 因為 return
    })
  
    it('handleChange: 傳入正確數字時更新 localMap 及 rawInputMap', () => {
        const { result } = renderHook(() =>
            useSplitActualMap({
            currentProjectUsers: users,
            inputAmountValue: '',
            initialMap: {},
            manualReset: false,
            })
        )
    
        act(() => {
            result.current.handleChange('u2', '12.345')
        })
        expect(result.current.rawInputMap.u2).toBe('12.34') //formatNumber
        expect(result.current.localMap.u2).toMatchObject({
            fixed: expect.any(Number),
            percent: 0,
            total: expect.any(Number),
        })
    })
  
    it('initialMap.length === 0, computeFooterInfo: 準確計算剩餘並判定 isComplete', () => {
        const { result, rerender } = renderHook(
            ({ amount }) =>
            useSplitActualMap({
                currentProjectUsers: users,
                inputAmountValue: amount,
                initialMap: {},
                manualReset: false,
            }),
            { initialProps: { amount: '50' } } // 先分配 2 人，每人 25 => totalUsed = 50
        )
    
        expect(result.current.computeFooterInfo.isComplete).toBe(true)
        expect(result.current.computeFooterInfo.infoText).toContain('目前剩餘 0')
    
        rerender({ amount: '60' }) // 改成 60 再測一次
        expect(result.current.computeFooterInfo.isComplete).toBe(true) // 60/2=30 each => used 60 => remaining 0 → still complete
    })

    it('initialMap.length !== 0, 手動輸入 40 + 60 → 正好 100，判定 isComplete', () => {
        const { result } = renderHook(() =>
            useSplitActualMap({
              currentProjectUsers: users,
              inputAmountValue: '100',
              initialMap: {},
              manualReset: true,      // 跳過自動平均分配
            })
          )
      
        act(() => {
            result.current.handleChange('u1', '40')
        })
        expect(result.current.computeFooterInfo.isComplete).toBe(false)
        expect(result.current.computeFooterInfo.infoText).toContain('目前剩餘 10.00 元') //manualReset: true，會先均分，所以 u2 已經是 50.00

        // 再輸入 u2 = 60
        act(() => {
            result.current.handleChange('u2', '60')
        })
        expect(result.current.computeFooterInfo.isComplete).toBe(true)
        expect(result.current.computeFooterInfo.infoText).toContain('目前剩餘 0.00 元')
    })
  
    it('generateFinalMap: 過濾掉 total <= 0 的項目', () => {
        const { result } = renderHook(() =>
            useSplitActualMap({
            currentProjectUsers: users,
            inputAmountValue: '100',
            initialMap: {},
            manualReset: false,
            })
        )
        // initialMap 50/50
        const final = result.current.generateFinalMap()
        expect(final).toEqual({
            u1: expect.objectContaining({ total: 50 }),
            u2: expect.objectContaining({ total: 50 }),
        })
    })
})