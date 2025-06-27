import React, { useState } from "react";
import { isToday } from "../utils/dateUtils";
import EventsPopup from "./EventsPopup";
import EventCard from "./EventCard";
import "./CalendarDay.css";

const CalendarDay = ({
  date,
  events,
  isCurrentMonth,
  onClick,
  onEditEvent,
  onDeleteEvent,
}) => {
  const dayEvents = events || [];
  const isTodayDate = isToday(date);

  // State for popup
  const [showPopup, setShowPopup] = useState(false);
  // State for event card
  const [selectedEvent, setSelectedEvent] = useState(null);

  const formatEventTime = (event) => {
    if (event.startTime && event.endTime) {
      return `${event.startTime} - ${event.endTime}`;
    }
    return "All day";
  };

  // Sort events by start time
  const sortedEvents = dayEvents.sort((a, b) => {
    // Events without start time go to the end
    if (!a.startTime && !b.startTime) return 0;
    if (!a.startTime) return 1;
    if (!b.startTime) return -1;

    const timeA = new Date(`2000-01-01T${a.startTime}:00`);
    const timeB = new Date(`2000-01-01T${b.startTime}:00`);
    return timeA - timeB;
  });

  const handleMoreEventsClick = (e) => {
    e.stopPropagation();
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
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
    <>
      <div
        className={`calendar-day ${!isCurrentMonth ? "other-month" : ""} ${
          isTodayDate ? "today" : ""
        }`}
        onClick={() => onClick(date)}
      >
        <div className="day-number">{date.getDate()}</div>
        <div className="day-events">
          {sortedEvents.slice(0, 3).map((event) => (
            <div
              key={event.id}
              className="day-event"
              style={{ backgroundColor: event.color || "#4285f4" }}
              title={`${event.title} (${formatEventTime(event)})`}
              onClick={(e) => handleEventCardClick(event, e)}
            >
              <div className="event-title">{event.title}</div>
              {event.startTime && (
                <div className="event-time">{event.startTime}</div>
              )}
            </div>
          ))}
          {sortedEvents.length > 3 && (
            <div
              className="more-events"
              onClick={handleMoreEventsClick}
              style={{ cursor: "pointer" }}
            >
              +{sortedEvents.length - 3} more
            </div>
          )}
        </div>
      </div>

      {/* Events Popup */}
      {showPopup && (
        <EventsPopup
          events={sortedEvents}
          date={date}
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
    </>
  );
};

export default CalendarDay;
