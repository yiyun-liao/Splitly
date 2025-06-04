import { useState, useMemo, useEffect } from 'react';
import { UserData } from '@/types/user';
import { SplitMap } from '@/types/payment';
import { sanitizeDecimalInput } from '@/utils/parseAmount';
import { parsePercentToDecimal, parsePercentToInt, formatNumberForData} from '@/utils/parseNumber';

interface UseSplitMapProps {
    currentProjectUsers: UserData[];
    inputAmountValue: string;
    initialMap?: SplitMap;
  }

export function useSplitPercentageMap({
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
        const rawPercent = parseFloat(formatNumberForData(1 / count));
        
        if (count > 0 && isInitialMapEmpty && amount > 0) {
            const total = parseFloat(formatNumberForData(amount * rawPercent));
            
            const map: SplitMap = Object.fromEntries(
                currentProjectUsers.map((user) => [user.uid, { fixed: 0, percent: rawPercent, total }])
            );
            setLocalMap(map);
        
            const newRawMap = Object.fromEntries(
                currentProjectUsers.map(user => [user.uid, parsePercentToInt(rawPercent)])
            )
            setRawInputMap(newRawMap)
        }

        if (count > 0 && !isInitialMapEmpty && amount > 0) {
            const map: SplitMap = Object.fromEntries(
                currentProjectUsers.map((user) => {
                    const total = initialMap[user.uid]?.total || 0;
                    const percent = parseFloat(formatNumberForData(total / amount));
                    return [user.uid, { fixed: 0, percent, total }]
                })
            );
            setLocalMap(map);

            const newRawMap = Object.fromEntries(
                currentProjectUsers.map(user => {
                    const total = initialMap[user.uid]?.total || 0;
                    const percent = parseFloat(formatNumberForData(total / amount));
                    return [user.uid, parsePercentToInt(percent)]
                })
            )
            setRawInputMap(newRawMap)
        }

        // console.log("[percentage]", isInitialMapEmpty, initialMap)
        
    }, [inputAmountValue, currentProjectUsers]);

    // useEffect(() => {
    //     console.log("[percentage localMap updated]", localMap);
    //   }, [localMap]);

    const handleChange = (uid: string, percentInput: string) => {
        const raw = sanitizeDecimalInput(percentInput);
        setRawInputMap(prev => ({ 
            ...prev, 
            [uid]: raw.toString() 
        }));

        if (isNaN(raw) || raw < 0) return;
        const amount = parseFloat(inputAmountValue || '0');
        const percent = parsePercentToDecimal(raw);
        const fixed = 0;
        const total = parseFloat(formatNumberForData(amount * percent));

        setLocalMap(prev => ({ 
            ...prev, 
            [uid]: { fixed, percent, total } 
        }));
    };

    const computeFooterInfo = useMemo(() => {
        const EPSILON = 0.015;
        const usedPercent = Object.values(localMap).reduce((sum, entry) => sum + (entry.percent || 0), 0);
        const remainingPercent = 1 - usedPercent;
        const isComplete = Math.abs(remainingPercent) < EPSILON;
        return {
            isComplete,
            infoText: `目前剩餘 ${parsePercentToInt(remainingPercent)}%`,
        };
    }, [localMap]);

    const generateFinalMap = () => {
        const newPercentageMap = Object.fromEntries(
            Object.entries(localMap).filter(([, entry]) => entry.total > 0)
        );
        return newPercentageMap;
    };

    return {
        localMap,
        rawInputMap,
        handleChange,
        computeFooterInfo,
        generateFinalMap,
    };
}
