export const getDaysInMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

export const getFirstDayOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

export const formatDate = (date) => {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatTime = (date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const getTimeSlots = () => {
  const slots = [];
  for (let hour = 0; hour < 24; hour++) {
    const time = new Date();
    time.setHours(hour, 0, 0, 0);
    slots.push(formatTime(time));
  }
  return slots;
};

export const createTimeSlot = (hour, minute = 0) => {
  const time = new Date();
  time.setHours(hour, minute, 0, 0);
  return time;
};

export const isToday = (date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const isCurrentMonth = (date) => {
  const today = new Date();
  return (
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const getNextMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
};

export const getPrevMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() - 1, 1);
};

export const getNextYear = (date) => {
  return new Date(date.getFullYear() + 1, date.getMonth(), 1);
};

export const getPrevYear = (date) => {
  return new Date(date.getFullYear() - 1, date.getMonth(), 1);
};

export const getNextWeek = (date) => {
  const result = new Date(date);
  result.setDate(result.getDate() + 7);
  return result;
};

export const getPrevWeek = (date) => {
  const result = new Date(date);
  result.setDate(result.getDate() - 7);
  return result;
};

export const getNextDay = (date) => {
  const result = new Date(date);
  result.setDate(result.getDate() + 1);
  return result;
};

export const getPrevDay = (date) => {
  const result = new Date(date);
  result.setDate(result.getDate() - 1);
  return result;
};

export const getDayName = (date) => {
  return date.toLocaleDateString("en-US", { weekday: "long" });
};

export const getShortDayName = (date) => {
  return date.toLocaleDateString("en-US", { weekday: "short" });
};

export const getMonthName = (date) => {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

export const getYearName = (date) => {
  return date.getFullYear().toString();
};

export const getFullDayName = (date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

export const isSameWeek = (date1, date2) => {
  if (!date1 || !date2) return false;
  const week1 = getWeekNumber(date1);
  const week2 = getWeekNumber(date2);
  return week1 === week2 && date1.getFullYear() === date2.getFullYear();
};

export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const subtractDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
};

export const getWeekNumber = (date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

export const getWeekDays = (date) => {
  const days = [];
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  startOfWeek.setDate(startOfWeek.getDate() - day);

  for (let i = 0; i < 7; i++) {
    days.push(new Date(startOfWeek));
    startOfWeek.setDate(startOfWeek.getDate() + 1);
  }
  return days;
};

export const getDayHours = () => {
  const hours = [];
  for (let hour = 0; hour < 24; hour++) {
    hours.push(hour);
  }
  return hours;
};

export const formatHour = (hour) => {
  const time = new Date();
  time.setHours(hour, 0, 0, 0);
  return time.toLocaleTimeString("en-US", {
    hour: "numeric",
    hour12: true,
  });
};

export const parseTime = (timeString) => {
  if (!timeString) {
    return { hours: 0, minutes: 0 };
  }
  const [hours, minutes] = timeString.split(":").map(Number);
  return { hours, minutes };
};

export const isTimeOverlapping = (start1, end1, start2, end2) => {
  if (!start1 || !end1 || !start2 || !end2) {
    return false;
  }

  const start1Time = parseTime(start1);
  const end1Time = parseTime(end1);
  const start2Time = parseTime(start2);
  const end2Time = parseTime(end2);

  const start1Minutes = start1Time.hours * 60 + start1Time.minutes;
  const end1Minutes = end1Time.hours * 60 + end1Time.minutes;
  const start2Minutes = start2Time.hours * 60 + start2Time.minutes;
  const end2Minutes = end2Time.hours * 60 + end2Time.minutes;

  return start1Minutes < end2Minutes && start2Minutes < end1Minutes;
};

export const getOverlappingEvents = (events, newEvent) => {
  return events.filter((event) => {
    if (!isSameDay(event.date, newEvent.date)) return false;

    // Handle all-day events (null startTime and endTime)
    if (!event.startTime || !event.endTime) {
      // All-day events overlap with any timed event
      return !newEvent.startTime || !newEvent.endTime || true;
    }

    // Handle new all-day event
    if (!newEvent.startTime || !newEvent.endTime) {
      return true; // All-day events overlap with any timed event
    }

    // Both events have times, check for overlap
    return isTimeOverlapping(
      event.startTime,
      event.endTime,
      newEvent.startTime,
      newEvent.endTime
    );
  });
};
