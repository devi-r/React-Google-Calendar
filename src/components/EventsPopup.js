import React from "react";
import "./EventsPopup.css";
import { formatDate } from "../utils/dateUtils";

const EventsPopup = ({ events, date, onClose, onEventClick }) => {
  const formatEventTime = (event) => {
    if (event.startTime && event.endTime) {
      return `${event.startTime} - ${event.endTime}`;
    }
    return "All day";
  };

  // Sort events by start time
  const sortedEvents = events.sort((a, b) => {
    // Events without start time go to the end
    if (!a.startTime && !b.startTime) return 0;
    if (!a.startTime) return 1;
    if (!b.startTime) return -1;

    const timeA = new Date(`2000-01-01T${a.startTime}:00`);
    const timeB = new Date(`2000-01-01T${b.startTime}:00`);
    return timeA - timeB;
  });

  const handleEventClick = (event) => {
    if (onEventClick) {
      onEventClick(event);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="events-popup-overlay" onClick={handleOverlayClick}>
      <div className="events-popup-modal">
        <div className="events-popup-header">
          <h3>Events for {formatDate(date)}</h3>
          <button className="events-popup-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="events-popup-content">
          {sortedEvents.length === 0 ? (
            <div className="no-events">
              <p>No events scheduled for this time</p>
            </div>
          ) : (
            <div className="events-list">
              {sortedEvents.map((event) => (
                <div
                  key={event.id}
                  className="event-item"
                  onClick={() => handleEventClick(event)}
                >
                  <div
                    className="event-color-indicator"
                    style={{ backgroundColor: event.color || "#4285f4" }}
                  ></div>
                  <div className="event-details">
                    <div className="event-title">{event.title}</div>
                    <div className="event-time">{formatEventTime(event)}</div>
                    {event.description && (
                      <div className="event-description">
                        {event.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsPopup;
