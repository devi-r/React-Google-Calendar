import React from "react";
import { formatDate } from "../utils/dateUtils";

const EventsList = ({ events, onDelete }) => (
  <div className="events-list">
    <h3>All Events</h3>
    {events.length === 0 ? (
      <p>No events scheduled</p>
    ) : (
      events
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map((event) => (
          <div key={event.id} className="event-item">
            <div
              className="event-color"
              style={{ backgroundColor: event.color }}
            ></div>
            <div className="event-details">
              <h4>{event.title}</h4>
              <p>
                {formatDate(event.date)} at {event.time}
              </p>
              {event.description && <p>{event.description}</p>}
            </div>
            <button onClick={() => onDelete(event.id)} className="delete-event">
              ×
            </button>
          </div>
        ))
    )}
  </div>
);

export default EventsList;
