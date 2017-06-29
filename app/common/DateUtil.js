
export default class DateUtil {
  static chineseWeekDay = {
    0: '星期日',
    1: '星期一',
    2: '星期二',
    3: '星期三',
    4: '星期四',
    5: '星期五',
    6: '星期六',
  };
  static toDate = (dateStr) => {
    if (dateStr == null) return null;
    const dateComp = dateStr.split('-');
    const d = new Date();
    d.setFullYear(parseInt(dateComp[0], 10));
    d.setMonth(parseInt((dateComp[1]) - 1), 10);
    d.setDate(parseInt(dateComp[2], 10));
    return d;
  }
  static toStr = (date) => {
    if (date == null) return null;
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) {
      month = `0${month}`;
    }
    let dateStr = date.getDate();
    if (dateStr < 10) {
      dateStr = `0${dateStr}`;
    }
    return `${year}-${month}-${dateStr}`;
  }
  static getCurrentDateStr = () => {
    const data = new Date();
    const year = data.getFullYear();
    const mon = data.getMonth() + 1;
    const monStr = mon < 10 ? `0${mon}` : `${mon}`;
    const day = data.getDate();
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    return `${year}-${monStr}-${dayStr}`;
  }
  static getTimeStamp = () => {
    const data = new Date();
    const year = data.getFullYear();
    const mon = data.getMonth() + 1;
    const monStr = mon < 10 ? `0${mon}` : `${mon}`;
    const day = data.getDate();
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const hour = data.getHours();
    const hourStr = hour < 10 ? `0${hour}` : `${hour}`;
    const minutes = data.getMinutes();
    const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = data.getSeconds();
    const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
    const milliseconds = data.getMilliseconds();
    const millisecondsStr = milliseconds < 100 ? (milliseconds < 10 ? `00${milliseconds}` : `0${milliseconds}`) : `${milliseconds}`;
    return `${year}${monStr}${dayStr}${hourStr}${minutesStr}${secondsStr}${millisecondsStr}`;
  }
  static dataStrToSmartDate = (fullDateStr) => { //2017-01-01 14:12:30 -> 下午2:12 / 昨天 / 星期一
    if (fullDateStr.length >= 19) {
      const dateStr = fullDateStr.substr(0, 10);
      if (DateUtil.getCurrentDateStr() == dateStr) { //当天
        const timeStr = fullDateStr.substr(11);
        const timeComp = timeStr.split(':');
        if (parseInt(timeComp[0], 10) >= 12) {
          return `下午${parseInt(timeComp[0], 10) - 12}:${parseInt(timeComp[1], 10)}`;
        } else {
          return `上午${parseInt(timeComp[0], 10)}:${parseInt(timeComp[1], 10)}`;
        }
      } else { //非当天
        const date = DateUtil.toDate(dateStr);
        var now = new Date();
        var today = (new Date).setFullYear(now.getFullYear(), now.getMonth(), now.getDate());
        var numberOfDays = (today - date) / 86400000;
        if (numberOfDays == 1) {
          return '昨天';
        } else if (numberOfDays < 7 && numberOfDays > 1) {
          const day = date.getDay();
          return DateUtil.chineseWeekDay[day];
        } else {
          return dateStr;
        }
      }
      return fullDateStr;
    }
  }
}
