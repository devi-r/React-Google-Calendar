import React, { useState } from "react";
import CalendarHeader from "./CalendarHeader";
import CalendarWeekdays from "./CalendarWeekdays";
import CalendarGrid from "./CalendarGrid";
import DayView from "./DayView";
import WeekView from "./WeekView";
import ViewToggle from "./ViewToggle";
import EventForm from "./EventForm";
import "./Calendar.css";
import generateDummyEvents from "../data/dummyData";
import {
  getNextMonth,
  getPrevMonth,
  getNextWeek,
  getPrevWeek,
  getNextDay,
  getPrevDay,
  getNextYear,
  getPrevYear,
  getDaysInMonth,
  getFirstDayOfMonth,
} from "../utils/dateUtils";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("month");
  const [events, setEvents] = useState(generateDummyEvents());
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [prePopulatedEventData, setPrePopulatedEventData] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  const handlePrev = () => {
    switch (currentView) {
      case "month":
        setCurrentDate(getPrevMonth(currentDate));
        break;
      case "week":
        setCurrentDate(getPrevWeek(currentDate));
        break;
      case "day":
        setCurrentDate(getPrevDay(currentDate));
        break;
      case "year":
        setCurrentDate(getPrevYear(currentDate));
        break;
      default:
        setCurrentDate(getPrevMonth(currentDate));
    }
  };

  const handleNext = () => {
    switch (currentView) {
      case "month":
        setCurrentDate(getNextMonth(currentDate));
        break;
      case "week":
        setCurrentDate(getNextWeek(currentDate));
        break;
      case "day":
        setCurrentDate(getNextDay(currentDate));
        break;
      case "year":
        setCurrentDate(getNextYear(currentDate));
        break;
      default:
        setCurrentDate(getNextMonth(currentDate));
    }
  };

  const handleDateClick = (date, eventData = null) => {
    setSelectedDate(date);
    setShowEventForm(true);

    // If eventData is provided (from week/day view), store it for pre-population
    if (eventData) {
      setPrePopulatedEventData(eventData);
    } else {
      // For month view, set start time to current time and end time to +1 hour
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      const startTime = `${currentHour
        .toString()
        .padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;
      const endHour = currentHour + 1;
      const endTime = `${endHour.toString().padStart(2, "0")}:${currentMinute
        .toString()
        .padStart(2, "0")}`;

      setPrePopulatedEventData({
        startTime,
        endTime,
        date: date,
      });
    }
  };

  const handleAddEvent = (eventData) => {
    const newEvent = {
      id: Date.now(),
      ...eventData,
      date: selectedDate,
    };
    setEvents([...events, newEvent]);
    setShowEventForm(false);
    setSelectedDate(null);
    setPrePopulatedEventData(null);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setSelectedDate(event.date);
    setPrePopulatedEventData({
      title: event.title,
      description: event.description,
      startTime: event.startTime,
      endTime: event.endTime,
      color: event.color,
      date: event.date,
    });
    setShowEventForm(true);
  };

  const handleUpdateEvent = (eventData) => {
    const updatedEvents = events.map((event) => {
      if (event.id === editingEvent.id) {
        return {
          ...event,
          ...eventData,
          date: selectedDate,
        };
      }
      return event;
    });
    setEvents(updatedEvents);
    setShowEventForm(false);
    setSelectedDate(null);
    setPrePopulatedEventData(null);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (eventId) => {
    const updatedEvents = events.filter((event) => event.id !== eventId);
    setEvents(updatedEvents);
  };

  const handleCancelEvent = () => {
    setShowEventForm(false);
    setSelectedDate(null);
    setPrePopulatedEventData(null);
    setEditingEvent(null);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const getEventsForDate = (date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const renderCalendarView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);

    switch (currentView) {
      case "month":
        return (
          <>
            <CalendarWeekdays />
            <CalendarGrid
              daysInMonth={daysInMonth}
              firstDayOfMonth={firstDayOfMonth}
              currentDate={currentDate}
              selectedDate={selectedDate}
              onDateClick={handleDateClick}
              getEventsForDate={getEventsForDate}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          </>
        );
      case "week":
        return (
          <WeekView
            currentDate={currentDate}
            events={events}
            onDateClick={handleDateClick}
            getEventsForDate={getEventsForDate}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        );
      case "day":
        return (
          <DayView
            currentDate={currentDate}
            events={events}
            onDateClick={handleDateClick}
            getEventsForDate={getEventsForDate}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        );
      default:
        return (
          <>
            <CalendarWeekdays />
            <CalendarGrid
              daysInMonth={daysInMonth}
              firstDayOfMonth={firstDayOfMonth}
              currentDate={currentDate}
              selectedDate={selectedDate}
              onDateClick={handleDateClick}
              getEventsForDate={getEventsForDate}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          </>
        );
    }
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header-container">
        <CalendarHeader
          currentView={currentView}
          currentDate={currentDate}
          onPrev={handlePrev}
          onNext={handleNext}
        />
        <ViewToggle currentView={currentView} onViewChange={handleViewChange} />
      </div>
      <div className="calendar-body">{renderCalendarView()}</div>
      {showEventForm && (
        <EventForm
          selectedDate={selectedDate}
          onAddEvent={editingEvent ? handleUpdateEvent : handleAddEvent}
          onCancel={handleCancelEvent}
          existingEvents={events}
          prePopulatedData={prePopulatedEventData}
          isEditing={!!editingEvent}
        />
      )}
    </div>
  );
};

export default Calendar;
