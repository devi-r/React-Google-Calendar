import React, { useState } from "react";
import "./DayView.css";
import EventsPopup from "./EventsPopup";
import EventCard from "./EventCard";
import {
  getDayHours,
  formatHour,
  isToday,
  formatDate,
} from "../utils/dateUtils";

const DayView = ({
  currentDate,
  events,
  onDateClick,
  getEventsForDate,
  onEditEvent,
  onDeleteEvent,
}) => {
  const hours = getDayHours();
  const dayEvents = getEventsForDate(currentDate);
  const MAX_VISIBLE_EVENTS = 3; // Maximum events to show before showing "+X more"

  // State for popup
  const [popupData, setPopupData] = useState(null);
  // State for event card
  const [selectedEvent, setSelectedEvent] = useState(null);

  const getEventsForHour = (hour) => {
    const events = dayEvents.filter((event) => {
      if (!event.startTime) return false;
      const eventHour = parseInt(event.startTime.split(":")[0]);
      return eventHour === hour;
    });

    // Sort events by start time
    return events.sort((a, b) => {
      if (!a.startTime || !b.startTime) return 0;
      const timeA = new Date(`2000-01-01T${a.startTime}:00`);
      const timeB = new Date(`2000-01-01T${b.startTime}:00`);
      return timeA - timeB;
    });
  };

  const calculateEventHeight = (event) => {
    if (!event.startTime || !event.endTime) return 60; // Default height

    const startTime = new Date(`2000-01-01T${event.startTime}:00`);
    const endTime = new Date(`2000-01-01T${event.endTime}:00`);
    const durationMinutes = (endTime - startTime) / (1000 * 60);

    // Base height is 60px per hour, minimum 30px
    const height = Math.max(30, (durationMinutes / 60) * 60);
    return height;
  };

  const calculateEventTop = (event) => {
    if (!event.startTime) return 0;

    const startTime = new Date(`2000-01-01T${event.startTime}:00`);
    const startMinute = startTime.getMinutes();

    // Calculate position within the hour slot
    const topOffset = (startMinute / 60) * 60;
    return topOffset;
  };

  const calculateEventPosition = (events, eventIndex) => {
    const overlappingEvents = events.filter((e, index) => {
      if (index === eventIndex) return false;

      const currentEvent = events[eventIndex];
      const otherEvent = e;

      if (
        !currentEvent.startTime ||
        !currentEvent.endTime ||
        !otherEvent.startTime ||
        !otherEvent.endTime
      ) {
        return false;
      }

      const currentStart = new Date(`2000-01-01T${currentEvent.startTime}:00`);
      const currentEnd = new Date(`2000-01-01T${currentEvent.endTime}:00`);
      const otherStart = new Date(`2000-01-01T${otherEvent.startTime}:00`);
      const otherEnd = new Date(`2000-01-01T${otherEvent.endTime}:00`);

      // Check if events overlap
      return currentStart < otherEnd && currentEnd > otherStart;
    });

    if (overlappingEvents.length === 0) {
      return {
        left: "10px",
        right: "10px",
        width: "calc(100% - 20px)",
        zIndex: 1,
      };
    }

    // Calculate position for overlapping events
    const totalOverlapping = overlappingEvents.length + 1;
    const width = `calc((100% - 20px) / ${totalOverlapping})`;
    const left = `calc(10px + (${eventIndex} * (100% - 20px) / ${totalOverlapping}))`;

    return {
      left,
      width,
      zIndex: eventIndex + 1,
    };
  };

  const handleTimeSlotClick = (hour) => {
    const clickedTime = new Date(currentDate);
    clickedTime.setHours(hour, 0, 0, 0);

    // Create a custom event object with start and end times
    const eventData = {
      startTime: `${hour.toString().padStart(2, "0")}:00`,
      endTime: `${(hour + 1).toString().padStart(2, "0")}:00`,
      date: clickedTime,
    };

    onDateClick(clickedTime, eventData);
  };

  const handleMoreEventsClick = (hour, events) => {
    setPopupData({
      events,
      date: new Date(currentDate),
      hour,
    });
  };

  const handleClosePopup = () => {
    setPopupData(null);
  };

  const handleEventCardClick = (event, e) => {
    e.stopPropagation();
    setSelectedEvent(event);
  };

  const handleCloseEventCard = () => {
    setSelectedEvent(null);
  };

  const handleEditEvent = (event) => {
    if (onEditEvent) {
      onEditEvent(event);
    }
    handleCloseEventCard();
  };

  const handleDeleteEvent = (eventId) => {
    if (onDeleteEvent) {
      onDeleteEvent(eventId);
    }
    handleCloseEventCard();
  };

  return (
    <div className="day-view">
      <div className="day-view-header">
        <h3 className="day-title">
          {formatDate(currentDate)}
          {isToday(currentDate) && <span className="today-badge">Today</span>}
        </h3>
      </div>

      <div className="day-view-content">
        <div className="time-column">
          {hours.map((hour) => (
            <div key={hour} className="time-slot-label">
              {formatHour(hour)}
            </div>
          ))}
        </div>

        <div className="events-column">
          {hours.map((hour) => {
            const hourEvents = getEventsForHour(hour);
            const visibleEvents = hourEvents.slice(0, MAX_VISIBLE_EVENTS);
            const hiddenEventsCount = hourEvents.length - MAX_VISIBLE_EVENTS;

            return (
              <div
                key={hour}
                className="time-slot"
                onClick={() => handleTimeSlotClick(hour)}
              >
                {visibleEvents.map((event, eventIndex) => {
                  const eventHeight = calculateEventHeight(event);
                  const eventTop = calculateEventTop(event);
                  const eventPosition = calculateEventPosition(
                    visibleEvents,
                    eventIndex
                  );

                  return (
                    <div
                      key={event.id}
                      className="day-event"
                      style={{
                        backgroundColor: event.color || "#4285f4",
                        height: `${eventHeight}px`,
                        top: `${eventTop}px`,
                        position: "absolute",
                        left: eventPosition.left,
                        width: eventPosition.width,
                        zIndex: eventPosition.zIndex,
                      }}
                      title={`${event.title} - ${event.startTime}${
                        event.endTime ? ` to ${event.endTime}` : ""
                      }`}
                      onClick={(e) => handleEventCardClick(event, e)}
                    >
                      <div className="event-title">{event.title}</div>
                      {event.description && (
                        <div className="event-description">
                          {event.description}
                        </div>
                      )}
                    </div>
                  );
                })}

                {hiddenEventsCount > 0 && (
                  <div
                    className="more-events-indicator"
                    style={{
                      position: "absolute",
                      top: "2px",
                      right: "10px",
                      backgroundColor: "#666",
                      color: "white",
                      padding: "2px 6px",
                      borderRadius: "3px",
                      fontSize: "10px",
                      fontWeight: "500",
                      zIndex: 100,
                      cursor: "pointer",
                    }}
                    title={`${hiddenEventsCount} more events`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoreEventsClick(hour, hourEvents);
                    }}
                  >
                    +{hiddenEventsCount} more
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Events Popup */}
      {popupData && (
        <EventsPopup
          events={popupData.events}
          date={popupData.date}
          onClose={handleClosePopup}
          onEventClick={handleEventCardClick}
        />
      )}

      {/* Event Card */}
      {selectedEvent && (
        <EventCard
          event={selectedEvent}
          onClose={handleCloseEventCard}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
        />
      )}
    </div>
  );
};

export default DayView;
