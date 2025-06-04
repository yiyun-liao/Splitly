import { useState, useMemo, useEffect } from 'react';
import { UserData } from '@/types/user';
import { SplitMap } from '@/types/payment';
import { sanitizeDecimalInput } from '@/utils/parseAmount';
import { formatNumberForData, formatNumber} from '@/utils/parseNumber';

interface UseSplitMapProps {
    currentProjectUsers: UserData[];
    inputAmountValue: string;
    initialMap?: SplitMap;
}

export function useSplitActualMap({
    currentProjectUsers,
    inputAmountValue,
    initialMap = {},
}: UseSplitMapProps) {

    const [localMap, setLocalMap] = useState<SplitMap>({});
    const [rawInputMap, setRawInputMap] = useState<Record<string, string>>({});  
  
    useEffect(() => {
        const isInitialMapEmpty = Object.keys(initialMap).length === 0;

        const amount = parseFloat(inputAmountValue || "0");
        const count = currentProjectUsers.length;
    
        if (count > 0 && isInitialMapEmpty && amount > 0) {
            const share = parseFloat(formatNumberForData(amount / count));
    
            const map: SplitMap = Object.fromEntries(
                currentProjectUsers.map((user) => [user.uid, { fixed: share, percent: 0, total: share }])
            );
            setLocalMap(map);
    
            setRawInputMap(
                Object.fromEntries(
                    currentProjectUsers.map((user) => [user.uid, formatNumber(share)])
                )
            );
        }
        if (count > 0 && !isInitialMapEmpty && amount > 0) {
            const map: SplitMap = Object.fromEntries(
                currentProjectUsers.map((user) => {
                    const fixed = initialMap[user.uid]?.total || 0;
                    return [user.uid, { fixed: fixed, percent: 0, total: fixed }]
            }));
            setLocalMap(map);

            const newRawMap = Object.fromEntries(
                currentProjectUsers.map(user => {
                    const total = initialMap[user.uid]?.total || 0;
                    return [user.uid, formatNumber(total)];
                })
            )
            setRawInputMap(newRawMap);
        }
        console.log("[actual]", isInitialMapEmpty, initialMap)

    }, [inputAmountValue, currentProjectUsers]);

    useEffect(() => {
        console.log("[actual localMap updated]", localMap);
      }, [localMap]);

    // const [localMap, setLocalMap] = useState<SplitMap>(() => {
    //     return Object.fromEntries(
    //         currentProjectUsers.map(user => {
    //             const total = initialMap[user.uid]?.total || 0;
    //             return [user.uid, { fixed: total, percent: 0, total }];
    //         })
    //     );
    // });

    // const [rawInputMap, setRawInputMap] = useState<Record<string, string>>(() => {
    //     return Object.fromEntries(
    //         currentProjectUsers.map(user => {
    //             const total = initialMap[user.uid]?.total || 0;
    //             return [user.uid, formatNumber(total)];
    //         })
    //     );
    // });

    const handleChange = (uid: string, value: string) => {
        const raw = sanitizeDecimalInput(value);
        setRawInputMap(prev => ({ 
            ...prev, 
            [uid]: raw.toString() 
        }));

        if (isNaN(raw) || raw < 0) return;

        const fixed = parseFloat(formatNumberForData(raw));
        const total = fixed;
        const percent = 0;

        setLocalMap(prev => ({ 
            ...prev, 
            [uid]: { fixed, percent, total } 
        }));
    };

    const computeFooterInfo = useMemo(() => {
        const EPSILON = 0.015;
        const totalAmount = parseFloat(inputAmountValue || '0');
        const usedAmount = Object.values(localMap).reduce((sum, entry) => sum + (entry.total || 0), 0);
        const remaining = totalAmount - usedAmount;
        const isComplete = Math.abs(remaining) < EPSILON;
        return {
            isComplete,
            infoText: `目前剩餘 ${formatNumber(remaining)} 元`,
        };
        }, [localMap, inputAmountValue]);

    const generateFinalMap = () => {
        return Object.fromEntries(
            Object.entries(localMap).filter(([, entry]) => entry.total > 0)
        );
    };

    return {
        localMap,
        rawInputMap,
        handleChange,
        computeFooterInfo,
        generateFinalMap,
    };
}
