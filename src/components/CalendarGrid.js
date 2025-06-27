import React from "react";
import CalendarDay from "./CalendarDay";
import { isCurrentMonth } from "../utils/dateUtils";

const CalendarGrid = ({
  daysInMonth,
  firstDayOfMonth,
  currentDate,
  selectedDate,
  getEventsForDate,
  onDateClick,
  onEditEvent,
  onDeleteEvent,
}) => {
  const days = [];
  // Empty cells before the first day
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    const dayEvents = getEventsForDate(date);
    const isCurrentMonthDate = isCurrentMonth(date);
    days.push(
      <CalendarDay
        key={day}
        date={date}
        events={dayEvents}
        isCurrentMonth={isCurrentMonthDate}
        onClick={onDateClick}
        onEditEvent={onEditEvent}
        onDeleteEvent={onDeleteEvent}
      />
    );
  }
  return <div className="calendar-grid">{days}</div>;
};

export default CalendarGrid;
