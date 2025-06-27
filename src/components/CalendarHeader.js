import React from "react";
import { getMonthName, getYearName, getFullDayName } from "../utils/dateUtils";

const CalendarHeader = ({ currentView, currentDate, onPrev, onNext }) => {
  const getHeaderTitle = () => {
    switch (currentView) {
      case "month":
        return getMonthName(currentDate);
      case "year":
        return getYearName(currentDate);
      case "day":
        return getFullDayName(currentDate);
      case "week":
        return getMonthName(currentDate);
      default:
        return getMonthName(currentDate);
    }
  };

  return (
    <div className="calendar-header">
      <button onClick={onPrev} className="nav-button">
        &lt;
      </button>
      <h2 className="month-title">{getHeaderTitle()}</h2>
      <button onClick={onNext} className="nav-button">
        &gt;
      </button>
    </div>
  );
};

export default CalendarHeader;
