// src/components/Applications/Clock/Clock.tsx
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export const Clock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timerValue, setTimerValue] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [stopwatchValue, setStopwatchValue] = useState(0);
  const [stopwatchActive, setStopwatchActive] = useState(false);
  const [activeTab, setActiveTab] = useState<"clock" | "timer" | "stopwatch">(
    "clock",
  );
  const [alarmHour, setAlarmHour] = useState(7);
  const [alarmMinute, setAlarmMinute] = useState(0);
  const [alarmSet, setAlarmSet] = useState(false);

  // Update clock every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Timer logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (timerActive && timerValue > 0) {
      interval = setInterval(() => {
        setTimerValue((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            toast.success("⏰ Timer finished!");
            playAlarmSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timerValue]);

  // Stopwatch logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (stopwatchActive) {
      interval = setInterval(() => {
        setStopwatchValue((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [stopwatchActive]);

  const playAlarmSound = () => {
    try {
      const audioContext = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = 880;
      gainNode.gain.value = 0.3;
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(
        0.00001,
        audioContext.currentTime + 1,
      );
      oscillator.stop(audioContext.currentTime + 1);
      audioContext.resume();
    } catch (e) {
      console.log("Audio not supported");
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatSeconds = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const setTimer = (minutes: number) => {
    setTimerValue(minutes * 60);
    toast.info(`Timer set for ${minutes} minutes`);
  };

  const checkAlarm = () => {
    const now = new Date();
    if (
      alarmSet &&
      now.getHours() === alarmHour &&
      now.getMinutes() === alarmMinute &&
      now.getSeconds() === 0
    ) {
      playAlarmSound();
      setAlarmSet(false);
      toast.warning("⏰ Alarm! Time to wake up!");
    }
  };

  useEffect(() => {
    const alarmInterval = setInterval(checkAlarm, 1000);
    return () => clearInterval(alarmInterval);
  }, [alarmSet, alarmHour, alarmMinute]);

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-gradient-to-b from-primary to-secondary dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-2xl mx-auto w-full p-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white/20 backdrop-blur-md rounded-xl p-1">
          <button
            onClick={() => setActiveTab("clock")}
            className={`flex-1 py-2 rounded-lg font-medium transition-all ${
              activeTab === "clock"
                ? "bg-white text-gray-800 shadow-md"
                : "text-gray-700 dark:text-white hover:bg-white/30"
            }`}
          >
            🕐 Clock
          </button>
          <button
            onClick={() => setActiveTab("timer")}
            className={`flex-1 py-2 rounded-lg font-medium transition-all ${
              activeTab === "timer"
                ? "bg-white text-gray-800 shadow-md"
                : "text-gray-700 dark:text-white hover:bg-white/30"
            }`}
          >
            ⏲️ Timer
          </button>
          <button
            onClick={() => setActiveTab("stopwatch")}
            className={`flex-1 py-2 rounded-lg font-medium transition-all ${
              activeTab === "stopwatch"
                ? "bg-white text-gray-800 shadow-md"
                : "text-gray-700 dark:text-white hover:bg-white/30"
            }`}
          >
            ⏱️ Stopwatch
          </button>
        </div>

        {/* Clock Tab */}
        {activeTab === "clock" && (
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center">
            <div className="text-7xl font-bold text-gray-800 dark:text-white mb-4 font-mono">
              {formatTime(currentTime)}
            </div>
            <div className="text-2xl text-gray-600 dark:text-gray-300 mb-6">
              {formatDate(currentTime)}
            </div>

            {/* Alarm Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-4">
              <h3 className="text-gray-700 dark:text-gray-300 font-medium mb-4">
                ⏰ Set Alarm
              </h3>
              <div className="flex justify-center gap-4 mb-4">
                <select
                  value={alarmHour}
                  onChange={(e) => setAlarmHour(parseInt(e.target.value))}
                  className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white text-center"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>
                      {i.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
                <span className="text-gray-700 dark:text-white text-2xl">
                  :
                </span>
                <select
                  value={alarmMinute}
                  onChange={(e) => setAlarmMinute(parseInt(e.target.value))}
                  className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white text-center"
                >
                  {Array.from({ length: 60 }, (_, i) => (
                    <option key={i} value={i}>
                      {i.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => {
                  setAlarmSet(true);
                  toast.success(
                    `Alarm set for ${alarmHour.toString().padStart(2, "0")}:${alarmMinute.toString().padStart(2, "0")}`,
                  );
                }}
                className="px-6 py-2 bg-primary text-gray-800 rounded-lg font-medium hover:opacity-80"
              >
                Set Alarm
              </button>
              {alarmSet && (
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-3">
                  Alarm active for {alarmHour.toString().padStart(2, "0")}:
                  {alarmMinute.toString().padStart(2, "0")}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Timer Tab */}
        {activeTab === "timer" && (
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl font-bold text-gray-800 dark:text-white mb-6 font-mono">
              {formatSeconds(timerValue)}
            </div>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <button
                onClick={() => setTimer(1)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                1 min
              </button>
              <button
                onClick={() => setTimer(5)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                5 min
              </button>
              <button
                onClick={() => setTimer(10)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                10 min
              </button>
              <button
                onClick={() => setTimer(15)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                15 min
              </button>
              <button
                onClick={() => setTimer(30)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                30 min
              </button>
              <button
                onClick={() => setTimer(60)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                60 min
              </button>
            </div>
            <div className="flex gap-3 justify-center">
              {timerValue > 0 && (
                <button
                  onClick={() => setTimerActive(!timerActive)}
                  className="px-6 py-2 bg-primary text-gray-800 rounded-lg font-medium hover:opacity-80"
                >
                  {timerActive ? "Pause" : "Start"}
                </button>
              )}
              <button
                onClick={() => {
                  setTimerActive(false);
                  setTimerValue(0);
                }}
                className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Stopwatch Tab */}
        {activeTab === "stopwatch" && (
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl font-bold text-gray-800 dark:text-white mb-6 font-mono">
              {formatSeconds(stopwatchValue)}
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setStopwatchActive(!stopwatchActive)}
                className="px-6 py-2 bg-primary text-gray-800 rounded-lg font-medium hover:opacity-80"
              >
                {stopwatchActive ? "Pause" : "Start"}
              </button>
              <button
                onClick={() => {
                  setStopwatchActive(false);
                  setStopwatchValue(0);
                }}
                className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
              >
                Reset
              </button>
              {stopwatchValue > 0 && !stopwatchActive && (
                <button
                  onClick={() => setStopwatchActive(true)}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600"
                >
                  Resume
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
