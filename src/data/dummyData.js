// Event title templates for dynamic generation
const EVENT_TITLES = [
  // Meetings
  "Team Standup",
  "Client Meeting",
  "Sprint Planning",
  "Code Review",
  "Architecture Review",
  "Product Demo",
  "All Hands Meeting",
  "Performance Review",
  "Team Retrospective",
  "Client Demo",
  "Design Review",
  "Security Review",
  "UI/UX Review",
  "Workshop",
  "Team Building",
  "Early Bird Meeting",
  "Global Team Sync",
  "Quick Sync",
  "Follow-up Meeting",
  "Status Update",

  // Technical Tasks
  "Database Backup",
  "System Maintenance",
  "Security Scan",
  "Performance Test",
  "Data Sync",
  "API Integration",
  "Deployment Prep",
  "Bug Fix Sprint",
  "Code Refactoring",
  "Testing Session",
  "Infrastructure Setup",
  "Monitoring Setup",
  "Backup Strategy",
  "Database Migration",
  "Nightly Build",
  "Pre-dawn Deployment",
  "Backup Verification",
  "Pre-launch Check",
  "Emergency Fix",
  "Load Testing",

  // Planning & Documentation
  "Product Planning",
  "Documentation Update",
  "Requirements Discussion",
  "Roadmap Planning",
  "Sprint Retrospective",
  "Project Kickoff",
  "Release Planning",
  "Feature Planning",

  // All-day Events
  "Company Holiday",
  "Tech Conference",
  "Team Offsite",
  "Training Day",
  "Hackathon",
  "Release Day",
  "System Maintenance Day",
  "Team Retreat",
  "Annual Meeting",
  "Conference Day",
];

const EVENT_DESCRIPTIONS = [
  "Daily team sync",
  "Project status review",
  "Plan next sprint",
  "Review pull requests",
  "System design review",
  "Demo new features",
  "Company-wide update",
  "Quarterly review",
  "End of sprint review",
  "Show progress to client",
  "Review new UI designs",
  "Security audit meeting",
  "Design system review",
  "Team workshop",
  "Virtual team activity",
  "Early morning planning",
  "Global team sync",
  "Brief team sync",
  "Follow-up discussion",
  "Project status",
  "Automated backup process",
  "Scheduled maintenance",
  "Vulnerability assessment",
  "Load testing",
  "Cross-region sync",
  "Third-party API setup",
  "Prepare for production",
  "Critical bug fixes",
  "Legacy code cleanup",
  "QA testing round",
  "Cloud infrastructure setup",
  "Application monitoring",
  "Data backup planning",
  "Production database update",
  "Low-traffic deployment",
  "Verify backup integrity",
  "Final pre-launch checks",
  "Critical bug fix",
  "Automated build process",
  "Office closed",
  "Annual tech conference",
  "Annual team retreat",
  "Team training session",
  "Internal hackathon",
  "Major version release",
  "Scheduled maintenance",
  "Requirements discussion",
  "Q4 roadmap planning",
];

const EVENT_COLORS = [
  "#4285f4",
  "#ea4335",
  "#34a853",
  "#fbbc04",
  "#7b1fa2",
  "#46bdc6",
  "#ff6d01",
  "#e91e63",
];

// Time slots for different periods
const TIME_SLOTS = {
  early_morning: [
    "00:00",
    "00:30",
    "01:00",
    "01:30",
    "02:00",
    "02:30",
    "03:00",
    "03:30",
    "04:00",
    "04:30",
    "05:00",
    "05:30",
    "06:00",
    "06:30",
    "07:00",
  ],
  morning: [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
  ],
  afternoon: [
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
  ],
  evening: [
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30",
  ],
};

// Duration options in minutes
const DURATIONS = [15, 30, 45, 60, 90, 120, 180, 240];

// Helper function to get random item from array
const getRandomItem = (array) =>
  array[Math.floor(Math.random() * array.length)];

// Helper function to get random number between min and max
const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Helper function to add minutes to time string
const addMinutesToTime = (timeStr, minutes) => {
  const [hours, mins] = timeStr.split(":").map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60);
  const newMins = totalMinutes % 60;

  // Prevent overflow to next day by capping at 23:59
  if (newHours >= 24) {
    return "23:59";
  }

  return `${newHours.toString().padStart(2, "0")}:${newMins
    .toString()
    .padStart(2, "0")}`;
};

// Helper function to get random time slot
const getRandomTimeSlot = (period = null) => {
  if (!period) {
    const periods = Object.keys(TIME_SLOTS);
    period = getRandomItem(periods);
  }
  return getRandomItem(TIME_SLOTS[period]);
};

// Generate a single event
const generateEvent = (id, date, options = {}) => {
  const isAllDay = options.isAllDay || Math.random() < 0.1; // 10% chance of all-day event

  if (isAllDay) {
    return {
      id,
      title: getRandomItem(
        EVENT_TITLES.filter(
          (title) =>
            title.includes("Holiday") ||
            title.includes("Conference") ||
            title.includes("Day") ||
            title.includes("Offsite") ||
            title.includes("Retreat") ||
            title.includes("Meeting")
        )
      ),
      description: getRandomItem(EVENT_DESCRIPTIONS),
      startTime: null,
      endTime: null,
      date,
      color: getRandomItem(EVENT_COLORS),
    };
  }

  const startTime = options.startTime || getRandomTimeSlot();
  let duration = options.duration || getRandomItem(DURATIONS);

  // Calculate end time and ensure it doesn't overflow to next day
  let endTime = addMinutesToTime(startTime, duration);

  // If end time is 23:59, it means we hit the cap, so adjust duration
  if (endTime === "23:59") {
    const [startHours, startMins] = startTime.split(":").map(Number);
    const startMinutes = startHours * 60 + startMins;
    const maxEndMinutes = 23 * 60 + 59; // 23:59 in minutes
    duration = maxEndMinutes - startMinutes;
    endTime = addMinutesToTime(startTime, duration);
  }

  return {
    id,
    title: getRandomItem(EVENT_TITLES),
    description: getRandomItem(EVENT_DESCRIPTIONS),
    startTime,
    endTime,
    date,
    color: getRandomItem(EVENT_COLORS),
  };
};

// Generate events for a specific date range with smart distribution
const generateEventsForDateRange = (startDate, endDate, eventsPerDay = {}) => {
  const events = [];
  let eventId = 1;

  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const today = new Date();
    const isCurrentDay = currentDate.toDateString() === today.toDateString();

    // Determine how many events for this day - make it random
    let numEvents = getRandomInt(2, 6); // Random between 2-6 events per day

    // Add some variation
    if (Math.random() < 0.2) numEvents += 1; // 20% chance of extra event
    if (Math.random() < 0.1) numEvents -= 1; // 10% chance of fewer events

    // Ensure at least 2 events per day
    numEvents = Math.max(2, numEvents);

    // Generate events for this day
    for (let i = 0; i < numEvents; i++) {
      const eventDate = new Date(currentDate);

      // Create some overlapping events (20% chance)
      const isOverlapping = Math.random() < 0.2 && i > 0;

      let eventOptions = {};

      if (isCurrentDay) {
        // For current day, prioritize early morning events (12am-7am)
        if (i < 3) {
          // First 3 events should be early morning
          eventOptions.startTime = getRandomTimeSlot("early_morning");
          eventOptions.duration = getRandomItem([30, 45, 60, 90]); // Shorter durations for early events
        } else {
          // Remaining events can be any time
          const timePeriod = getRandomItem([
            "early_morning",
            "morning",
            "afternoon",
            "evening",
          ]);
          eventOptions.startTime = getRandomTimeSlot(timePeriod);
        }
      } else if (isOverlapping) {
        // Create overlapping event with similar time
        const baseTime = getRandomTimeSlot();
        const overlapOffset = getRandomInt(-15, 15); // Overlap by 15 minutes
        eventOptions.startTime = addMinutesToTime(baseTime, overlapOffset);
        eventOptions.duration = getRandomItem([15, 30, 45]); // Shorter duration for overlaps
      } else {
        // Normal event distribution
        const timePeriod = getRandomItem([
          "early_morning",
          "morning",
          "afternoon",
          "evening",
        ]);
        eventOptions.startTime = getRandomTimeSlot(timePeriod);
      }

      events.push(generateEvent(eventId++, eventDate, eventOptions));
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return events;
};

// Generate dummy events for the current month, week, and day
const generateDummyEvents = () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  // Create date range for past 6 weeks to future 2 weeks
  const startDate = new Date(
    currentYear,
    currentMonth,
    Math.max(1, currentDay - 42)
  );
  const endDate = new Date(currentYear, currentMonth, currentDay + 14);

  // Generate events for the date range (eventsPerDay is now handled randomly in the function)
  const events = generateEventsForDateRange(startDate, endDate);

  // Ensure current day has specific early morning events starting from 12am
  const currentDayEvents = events.filter(
    (event) => event.date.toDateString() === today.toDateString()
  );

  // If current day has too few early morning events, add some
  const earlyMorningEvents = currentDayEvents.filter((event) => {
    if (!event.startTime) return false;
    const hour = parseInt(event.startTime.split(":")[0]);
    return hour >= 0 && hour < 7;
  });

  if (earlyMorningEvents.length < 4) {
    const additionalEarlyEvents = [
      generateEvent(events.length + 1, today, {
        startTime: "00:00",
        duration: 60,
      }),
      generateEvent(events.length + 2, today, {
        startTime: "02:00",
        duration: 90,
      }),
      generateEvent(events.length + 3, today, {
        startTime: "04:00",
        duration: 45,
      }),
      generateEvent(events.length + 4, today, {
        startTime: "06:00",
        duration: 60,
      }),
    ];
    events.push(...additionalEarlyEvents);
  }

  return events;
};

export default generateDummyEvents;
