
export default class DateUtil {
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
}
