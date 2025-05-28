type BudgetStatus = {
    text: string;
    icon: string;
    bgColor: string;
    textColor: string;
  };
  
  export function getBudgetStatus(total: number, budget?: number): BudgetStatus {
    if (budget === undefined || 0) {
      return {
        text: "未設定預算",
        icon: "solar:info-square-bold",
        bgColor: "bg-sf-green-200",
        textColor: "text-gray-700",
      };
    }
  
    const diff = budget - total;
    const percentageRemaining = diff / budget;
  
    if (percentageRemaining >= 0.2) {
      return {
        text: "有錢！放心花！",
        icon: "solar:rocket-2-bold",
        bgColor: "bg-sp-blue-200",
        textColor: "text-sp-blue-500",
      };
    } else if (percentageRemaining >= 0) {
      return {
        text: "小心點用，快見底了！",
        icon: "solar:confounded-square-bold",
        bgColor: "bg-sp-green-300",
        textColor: "text-sp-blue-500",
      };
    } else if (percentageRemaining >= -0.2) {
      return {
        text: "小爆預算...應該沒關係吧",
        icon: "solar:emoji-funny-square-bold",
        bgColor: "bg-sp-yellow-400",
        textColor: "text-sp-blue-500",
      };
    } else {
      return {
        text: "爆炸了！這趟直接燒破天！",
        icon: "solar:fire-bold-duotone",
        bgColor: "bg-red-400",
        textColor: "text-white",
      };
    }
  }
  