

export function getProjectStyle(style: string):string{
    switch (style) {
    case "travel":
        return "旅遊";
    case "daily":
        return "日常";
    case "other":
        return "其他";
    default:
        return "未知類型";
    }

}
