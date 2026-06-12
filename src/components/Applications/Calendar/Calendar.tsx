import { useState } from "react";

export const Calendar = () => {
  const [date, setDate] = useState(new Date());

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const handlePrevMonth = () => {
    setDate(new Date(year, month - 1));
  };

  const handleNextMonth = () => {
    setDate(new Date(year, month + 1));
  };

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handlePrevMonth}
            className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            ◀
          </button>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {months[month]} {year}
          </h2>
          <button
            onClick={handleNextMonth}
            className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            ▶
          </button>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {days.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-500 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`h-12 flex items-center justify-center rounded-lg ${
                day
                  ? "hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  : ""
              } ${day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear() ? "bg-primary/30 font-bold" : ""}`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          📅 Calendar View
        </div>
      </div>
    </div>
  );
};
