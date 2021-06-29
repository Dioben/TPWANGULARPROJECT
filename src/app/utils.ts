export default class Utils {
    public static formatDate(date: Date | string) {
        if (typeof date == "string") {
            let parsedDate = Date.parse(date);
            if (isNaN(parsedDate))
                return date;
            date = new Date(parsedDate);
        }
        let monthStr:string = "";
        switch (date.getMonth()) {
            case 1: monthStr = "January"; break;
            case 2: monthStr = "February"; break;
            case 3: monthStr = "March"; break;
            case 4: monthStr = "April"; break;
            case 5: monthStr = "May"; break;
            case 6: monthStr = "June"; break;
            case 7: monthStr = "July"; break;
            case 8: monthStr = "August"; break;
            case 9: monthStr = "September"; break;
            case 10: monthStr = "October"; break;
            case 11: monthStr = "November"; break;
            case 12: monthStr = "December"; break;
        }
        return monthStr + " " + date.getDay() + ", " + date.getFullYear() + ", " + date.getHours() + ":" + date.getMinutes();
    }
}