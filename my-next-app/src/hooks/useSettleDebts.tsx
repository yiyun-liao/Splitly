// hooks/useSettleDebts.ts
import { useCurrentProjectData } from "@/contexts/CurrentProjectContext";
import { GetPaymentData } from "@/types/payment";
import { formatNumberForData, formatNumber } from "@/utils/parseNumber";
import { useMemo } from "react";


interface DebtMap {
  [uid: string]: number;
}

interface Settlement {
  from: string;
  to: string;
  amount: number;
}

  
// 所有分帳狀況
export function useAllSettlements(): Settlement[] {
    const { currentPaymentList } = useCurrentProjectData();
  
    return useMemo(() => {
        if (!currentPaymentList) return [];
    
        const allSettlements: Settlement[] = [];
    
        currentPaymentList.forEach((payment) => {
            const payerMap = payment.payer_map || {};
            const splitMap = payment.split_map || {};
    
            // 建立每個人淨額 map（正表示需付，負表示多付）
            const userIds = new Set([
                ...Object.keys(payerMap),
                ...Object.keys(splitMap),
            ]);
    
            const debtMap: DebtMap = {};
            userIds.forEach((uid) => {
                const paid = payerMap[uid] || 0;
                const shouldPay = splitMap[uid]?.total || 0;
                const net = +parseFloat(formatNumberForData(shouldPay - paid));
                debtMap[uid] = net;
            });
    
            const debtors = Object.entries(debtMap)
                .filter(([, net]) => net > 0)
                .map(([uid, amount]) => ({ uid, amount }));
    
            const creditors = Object.entries(debtMap)
                .filter(([, net]) => net < 0)
                .map(([uid, amount]) => ({ uid, amount: -amount }));
    
            debtors.forEach((debtor) => {
                let debt = debtor.amount;
                for (const creditor of creditors) {
                    if (debt === 0) break;
                    const payAmount = Math.min(debt, creditor.amount);
                    allSettlements.push({
                        from: debtor.uid,
                        to: creditor.uid,
                        amount: parseFloat(formatNumberForData(payAmount)),
                    });
                    debt -= payAmount;
                    creditor.amount -= payAmount;
                }
            });
        });
  
      return allSettlements;
    }, [currentPaymentList]);
}
// [
//     { from: "B", to: "A", amount: 50 },
//     { from: "B", to: "C", amount: 50 },
//   ]

export function useMergedSettlements(settlements: Settlement[]) {
    const mergedMap: Record<string, number> = {};
  
    settlements.forEach(({ from, to, amount }) => {
        const forwardKey = `${from}->${to}`;
        const reverseKey = `${to}->${from}`;

        // 若已有相反方向，先做相抵
        if (mergedMap[reverseKey]) {
            const reverseAmount = mergedMap[reverseKey];
            if (reverseAmount > amount) {
                mergedMap[reverseKey] = (reverseAmount - amount);
            } else if (reverseAmount < amount) {
                delete mergedMap[reverseKey];
                mergedMap[forwardKey] = (amount - reverseAmount);
            } else {
                delete mergedMap[reverseKey]; // reverseAmount = amount
            }
        } else {
                mergedMap[forwardKey] = (mergedMap[forwardKey] || 0) + amount;
        }
    });
  
    const mergedSettlements: Settlement[] = Object.entries(mergedMap).map(
        ([key, amount]) => {
            const [from, to] = key.split("->");
            return {
                from,
                to,
                amount: parseFloat(formatNumber(amount)),
            };
        }
    );
  
    return mergedSettlements;
  }