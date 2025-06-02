import { useState, useMemo } from 'react';
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
    const [localMap, setLocalMap] = useState<SplitMap>(() => {
        return Object.fromEntries(
            currentProjectUsers.map(user => {
                const total = initialMap[user.uid]?.total || 0;
                return [user.uid, { fixed: total, percent: 0, total }];
            })
        );
    });

    const [rawInputMap, setRawInputMap] = useState<Record<string, string>>(() => {
        return Object.fromEntries(
            currentProjectUsers.map(user => {
                const total = initialMap[user.uid]?.total || 0;
                return [user.uid, formatNumber(total)];
            })
        );
    });

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
