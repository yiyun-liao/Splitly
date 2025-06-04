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

export function useSplitAdjustedMap({
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
        const percent = parseFloat(formatNumberForData(1 / count));
        const share = parseFloat(formatNumberForData(amount / count));

        if (share > 0 && isInitialMapEmpty && amount > 0) {
            const newMap: SplitMap = Object.fromEntries(
                currentProjectUsers.map(user => [ user.uid, { fixed: 0, percent, total: share } ])
            );
            setLocalMap(newMap);

            const newRawMap = Object.fromEntries(
              currentProjectUsers.map(user => [user.uid, "0"])
            );
        
            setRawInputMap(newRawMap);
        };

        if (share > 0 && !isInitialMapEmpty && amount > 0) {
            const fixedSum = Object.values(initialMap).reduce((sum, entry) => sum + (entry.fixed || 0), 0);

            const newMap: SplitMap = Object.fromEntries(
                currentProjectUsers.map(user => {
                    const fixed = initialMap[user.uid]?.fixed || 0;
                    const remaining = amount - fixedSum;
                    const total = fixed + parseFloat(formatNumberForData(remaining * percent));
                    return [ user.uid, { fixed, percent, total }]
                })
            );
            setLocalMap(newMap);

            const newRawMap = Object.fromEntries(
                currentProjectUsers.map(user => {
                    const fixed = initialMap[user.uid]?.fixed || 0;
                    return [user.uid, formatNumber(fixed)];
                })
            );
        
            setRawInputMap(newRawMap);
        };

        // console.log("[adjust]", isInitialMapEmpty, initialMap)
  
    }, [inputAmountValue, currentProjectUsers]);

    // useEffect(() => {
    //     console.log("[adjust localMap updated]", localMap);
    //   }, [localMap]);

    const handleChange = (uid: string, value: string) => {
        const raw = sanitizeDecimalInput(value);
        setRawInputMap(prev => ({ 
            ...prev, 
            [uid]: raw.toString()
        }));
        if (isNaN(raw) || raw < 0) return;
        updateAdjustedMap(uid, raw);
    };

    const updateAdjustedMap = (updatedUid: string, updatedFixed: number) => {
        const updated = {
            ...localMap,
            [updatedUid]: {
                ...localMap[updatedUid],
                fixed: updatedFixed,
            },
        };

        const totalAmount = parseFloat(inputAmountValue || '0');

        // 所有 fixed 的總和並均分
        const fixedSum = Object.values(updated).reduce((sum, entry) => sum + (entry.fixed || 0), 0);
        const remaining = totalAmount - fixedSum;

        // 更新每個人的 total 與 percent
        const nextMap: SplitMap = {};
        currentProjectUsers.forEach(user => {
            const entry = updated[user.uid] || { fixed: 0 };
            const fixed = entry.fixed;
            const percent = parseFloat(formatNumberForData(1 / currentProjectUsers.length));
            const total = fixed + parseFloat(formatNumberForData(remaining * percent));
            nextMap[user.uid] = { fixed, percent, total };
        });

        setLocalMap(nextMap);
    };

    const computeFooterInfo = useMemo(() => {
        const totalAmount = parseFloat(inputAmountValue || '0');
        const fixedSum = Object.values(localMap).reduce((sum, entry) => sum + (entry.fixed || 0), 0);
        const remaining = totalAmount - fixedSum;
        const isComplete = remaining > -0.015;
        return {
            isComplete,
            infoText: `剩餘 ${formatNumber(remaining)} 元將均分`,
        };
    }, [inputAmountValue, localMap]);

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