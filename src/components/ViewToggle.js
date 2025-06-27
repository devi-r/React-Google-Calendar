import React from "react";
import "./ViewToggle.css";

const ViewToggle = ({ currentView, onViewChange }) => {
  const views = [
    { id: "month", label: "Month" },
    { id: "week", label: "Week" },
    { id: "day", label: "Day" },
  ];

  return (
    <div className="view-toggle">
      {views.map((view) => (
        <button
          key={view.id}
          className={`view-button ${currentView === view.id ? "active" : ""}`}
          onClick={() => onViewChange(view.id)}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
};

export default ViewToggle;
