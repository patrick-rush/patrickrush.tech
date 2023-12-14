class DateUtils {
    static daysIntoYear(date: string | Date) {
      if (typeof date === 'string') date = new Date(date);
      return (
        (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
          Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000
      );
    }

    static getPastDate (subtrahend: number) {
        let date = new Date();
        date.setMonth(date.getMonth() - subtrahend);
        return date
    };
    
    static getPastDateString (subtrahend: number) {
        return this.getPastDate(subtrahend).toISOString();
    };
  
    static dateFromDayOfYear(dayOfYear: number, year?: number) {
      const baseDate = new Date(year ?? new Date().getFullYear(), 0, 1);
      const targetDate = new Date(
        baseDate.getTime() + dayOfYear * 24 * 60 * 60 * 1000
      );
  
      return {
        year: targetDate.getFullYear(),
        month: targetDate.getMonth(),
        day: targetDate.getDate(),
      };
    }
  
    static generateMonths() {
      const months = [];
  
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
  
      const currentMonth = new Date().getMonth();
      const orderedMonths = [
        ...monthNames.slice(currentMonth + 1),
        ...monthNames.slice(0, currentMonth + 1),
      ];
  
      for (let i = 0; i < 12; i++) {
        const monthName = orderedMonths[i];
        const monthAbbr = monthName.slice(0, 3);
        const monthIndex = monthNames.findIndex((entry) => entry === monthName);
        const yearOfMonth = this.getPastDate(11 - i).getFullYear();
        const daysInMonth = new Date(yearOfMonth, monthIndex + 1, 0).getDate();
        const dateOfFirstDayOfMonth = new Date(yearOfMonth, monthIndex, 1);
        const dayOfFirstDayOfMonth = dateOfFirstDayOfMonth.getDay();
        const numberOfFirstDayOfMonth = this.daysIntoYear(
          dateOfFirstDayOfMonth
        );
  
        months.push({
          name: monthName,
          abbr: monthAbbr,
          index: monthIndex,
          days: daysInMonth,
          year: yearOfMonth,
          firstDay: dayOfFirstDayOfMonth,
          daysIntoYear: numberOfFirstDayOfMonth,
        });
      }
  
      return months;
    }
  }
  
  export default DateUtils;