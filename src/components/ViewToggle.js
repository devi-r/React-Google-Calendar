import React from "react";
import { BsCalendarMonth, BsCalendarWeek, BsCalendarDay } from "react-icons/bs";
import "./ViewToggle.css";

const ViewToggle = ({ currentView, onViewChange }) => {
  const views = [
    {
      id: "month",
      label: "Month",
      icon: BsCalendarMonth,
    },
    {
      id: "week",
      label: "Week",
      icon: BsCalendarWeek,
    },
    {
      id: "day",
      label: "Day",
      icon: BsCalendarDay,
    },
  ];

  return (
    <div className="view-toggle">
      {views.map((view) => {
        const IconComponent = view.icon;
        return (
          <button
            key={view.id}
            className={`view-button ${currentView === view.id ? "active" : ""}`}
            onClick={() => onViewChange(view.id)}
          >
            <IconComponent />
            {view.label}
          </button>
        );
      })}
    </div>
  );
};

export default ViewToggle;
