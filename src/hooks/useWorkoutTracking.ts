import { useState, useEffect } from "react";

export interface WorkoutRecord {
  date: string; // ISO date string
  level: "beginner" | "advanced";
}

const STORAGE_KEY = "workout_history";

export const useWorkoutTracking = () => {
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutRecord[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setWorkoutHistory(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse workout history", e);
      }
    }
  }, []);

  const addWorkout = (level: "beginner" | "advanced") => {
    const today = new Date().toISOString().split("T")[0];
    const newRecord: WorkoutRecord = { date: today, level };
    
    const updated = [...workoutHistory, newRecord];
    setWorkoutHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const getWorkoutsThisWeek = () => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);

    return workoutHistory.filter((record) => {
      const recordDate = new Date(record.date);
      return recordDate >= weekStart && recordDate <= today;
    }).length;
  };

  const hasWorkoutOnDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return workoutHistory.some((record) => record.date === dateStr);
  };

  return {
    workoutHistory,
    addWorkout,
    getWorkoutsThisWeek,
    hasWorkoutOnDate,
  };
};
