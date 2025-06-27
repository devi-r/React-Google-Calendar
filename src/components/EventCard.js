import React from "react";
import "./EventCard.css";
import { formatDate } from "../utils/dateUtils";

const EventCard = ({ event, onClose, onEdit, onDelete }) => {
  const formatEventTime = (event) => {
    if (event.startTime && event.endTime) {
      return `${event.startTime} - ${event.endTime}`;
    }
    return "All day";
  };

  const formatEventDate = (event) => {
    return formatDate(event.date);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(event);
    }
    onClose();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(event.id);
    }
    onClose();
  };

  return (
    <div className="event-card-overlay" onClick={handleOverlayClick}>
      <div className="event-card-modal">
        <div
          className="event-card-header"
          style={{ backgroundColor: event.color || "#4285f4" }}
        >
          <div className="event-card-title">
            <h2>{event.title}</h2>
            <div className="event-card-time">{formatEventTime(event)}</div>
            <div className="event-card-date">{formatEventDate(event)}</div>
          </div>
          <button className="event-card-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="event-card-content">
          {event.description && (
            <div className="event-card-description">
              <h4>Description</h4>
              <p>{event.description}</p>
            </div>
          )}

          <div className="event-card-details">
            <div className="detail-item">
              <span className="detail-label">Date:</span>
              <span className="detail-value">{formatEventDate(event)}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Time:</span>
              <span className="detail-value">{formatEventTime(event)}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Duration:</span>
              <span className="detail-value">
                {event.startTime && event.endTime
                  ? calculateDuration(event.startTime, event.endTime)
                  : "All day"}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Color:</span>
              <span className="detail-value">
                <div
                  className="color-preview"
                  style={{ backgroundColor: event.color || "#4285f4" }}
                ></div>
              </span>
            </div>
          </div>
        </div>

        <div className="event-card-actions">
          <button className="action-button edit-button" onClick={handleEdit}>
            Edit Event
          </button>
          <button
            className="action-button delete-button"
            onClick={handleDelete}
          >
            Delete Event
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate duration
const calculateDuration = (startTime, endTime) => {
  const start = new Date(`2000-01-01T${startTime}:00`);
  const end = new Date(`2000-01-01T${endTime}:00`);
  const diffMs = end - start;
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 60) {
    return `${diffMins} minutes`;
  } else if (diffMins === 60) {
    return "1 hour";
  } else {
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    if (mins === 0) {
      return `${hours} hour${hours > 1 ? "s" : ""}`;
    } else {
      return `${hours} hour${hours > 1 ? "s" : ""} ${mins} minutes`;
    }
  }
};

export default EventCard;
