import React, { useState, useEffect } from "react";
import "./EventForm.css";
import { formatDate, getOverlappingEvents } from "../utils/dateUtils";

const EventForm = ({
  selectedDate,
  onAddEvent,
  onCancel,
  existingEvents = [],
  prePopulatedData = null,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState({
    title: prePopulatedData?.title || "",
    description: prePopulatedData?.description || "",
    startTime: prePopulatedData?.startTime || "09:00",
    endTime: prePopulatedData?.endTime || "10:00",
    color: prePopulatedData?.color || "#4285f4",
  });
  const [overlappingEvents, setOverlappingEvents] = useState([]);

  // Update form data when prePopulatedData changes
  useEffect(() => {
    if (prePopulatedData) {
      setFormData({
        title: prePopulatedData.title || "",
        description: prePopulatedData.description || "",
        startTime: prePopulatedData.startTime || "09:00",
        endTime: prePopulatedData.endTime || "10:00",
        color: prePopulatedData.color || "#4285f4",
      });
    }
  }, [prePopulatedData]);

  const colorOptions = [
    { value: "#4285f4", label: "Blue" },
    { value: "#ea4335", label: "Red" },
    { value: "#fbbc04", label: "Yellow" },
    { value: "#34a853", label: "Green" },
    { value: "#ff6d01", label: "Orange" },
    { value: "#46bdc6", label: "Teal" },
    { value: "#7b1fa2", label: "Purple" },
    { value: "#e91e63", label: "Pink" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim()) {
      // Check for overlapping events (exclude the current event if editing)
      const newEvent = {
        id: Date.now(),
        title: formData.title,
        description: formData.description,
        date: selectedDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        color: formData.color || "#4285f4",
      };

      // Filter out the current event from existing events when checking overlaps
      const eventsToCheck = isEditing
        ? existingEvents.filter((event) => event.id !== prePopulatedData?.id)
        : existingEvents;

      const overlapping = getOverlappingEvents(eventsToCheck, newEvent);

      if (overlapping.length > 0) {
        setOverlappingEvents(overlapping);
        return;
      }

      onAddEvent(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear overlapping events when user changes time
    if (name === "startTime" || name === "endTime") {
      setOverlappingEvents([]);
    }
  };

  const handleConfirmOverlap = () => {
    onAddEvent(formData);
  };

  return (
    <div className="event-form-overlay">
      <div className="event-form-modal">
        <div className="event-form-header">
          <h3>{isEditing ? "Edit Event" : "Add Event"}</h3>
          <button onClick={onCancel} className="close-button">
            ×
          </button>
        </div>

        <div className="selected-date">{formatDate(selectedDate)}</div>

        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-group">
            <label htmlFor="title">Event Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter event title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter event description"
              rows="3"
            />
          </div>

          <div className="time-group">
            <div className="form-group">
              <label htmlFor="startTime">Start Time</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endTime">End Time</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Color</label>
            <div className="color-options">
              {colorOptions.map((color) => (
                <label key={color.value} className="color-option">
                  <input
                    type="radio"
                    name="color"
                    value={color.value}
                    checked={formData.color === color.value}
                    onChange={handleChange}
                  />
                  <span
                    className="color-preview"
                    style={{ backgroundColor: color.value }}
                    title={color.label}
                  ></span>
                </label>
              ))}
            </div>
          </div>

          {overlappingEvents.length > 0 && (
            <div className="overlap-warning">
              <h4>⚠️ Time Conflict Detected</h4>
              <p>The following events overlap with your selected time:</p>
              <ul>
                {overlappingEvents.map((event) => (
                  <li key={event.id}>
                    {event.title}{" "}
                    {event.startTime && event.endTime
                      ? `(${event.startTime} - ${event.endTime})`
                      : "(All-day event)"}
                  </li>
                ))}
              </ul>
              <div className="overlap-actions">
                <button
                  type="button"
                  onClick={() => setOverlappingEvents([])}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmOverlap}
                  className="save-button"
                >
                  Save Anyway
                </button>
              </div>
            </div>
          )}

          {overlappingEvents.length === 0 && (
            <div className="form-actions">
              <button
                type="button"
                onClick={onCancel}
                className="cancel-button"
              >
                Cancel
              </button>
              <button type="submit" className="save-button">
                {isEditing ? "Update Event" : "Save Event"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EventForm;
