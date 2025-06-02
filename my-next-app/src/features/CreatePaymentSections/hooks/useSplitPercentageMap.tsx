import { useState, useMemo } from 'react';
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
    const [localMap, setLocalMap] = useState<SplitMap>(() => {
        return Object.fromEntries(
            currentProjectUsers.map(user => {
                const { percent = 0 } = initialMap[user.uid] || {};
                const totalAmount = parseFloat(inputAmountValue || '0');
                const fixed = 0;
                const total = parseFloat(formatNumberForData(percent * totalAmount)) || 0;
                return [user.uid, { fixed, percent, total }];
        })
        );
    });

    const [rawInputMap, setRawInputMap] = useState<Record<string, string>>(() => {
        return Object.fromEntries(
            currentProjectUsers.map(user => {
                const { percent = 0 } = initialMap[user.uid] || {};
                return [user.uid, parsePercentToInt(percent)];
            })
        );
    });

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
