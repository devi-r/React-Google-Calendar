import React from "react";

const CalendarWeekdays = () => (
  <div className="calendar-weekdays">
    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
      <div key={day} className="weekday-header">
        {day}
      </div>
    ))}
  </div>
);

export default CalendarWeekdays;
