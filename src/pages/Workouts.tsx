import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Play, Pause, RotateCcw, CheckCircle2 } from "lucide-react";

interface Exercise {
  name: string;
  duration: number;
  completed: boolean;
}

const Workouts = () => {
  const [exercises, setExercises] = useState<Exercise[]>([
    { name: "Push-ups", duration: 45, completed: false },
    { name: "Squats", duration: 60, completed: false },
    { name: "Lunges", duration: 45, completed: false },
    { name: "Plank", duration: 30, completed: false },
    { name: "Glute Bridges", duration: 45, completed: false },
  ]);

  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [workoutComplete, setWorkoutComplete] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning && currentIndex !== null) {
      handleCompleteExercise();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    const allCompleted = exercises.every((ex) => ex.completed);
    if (allCompleted && exercises.length > 0) {
      setWorkoutComplete(true);
      setIsRunning(false);
    }
  }, [exercises]);

  const handleStart = (index: number) => {
    setCurrentIndex(index);
    setTimeLeft(exercises[index].duration);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = (index: number) => {
    setTimeLeft(exercises[index].duration);
    setIsRunning(false);
  };

  const handleCompleteExercise = () => {
    if (currentIndex !== null) {
      const updatedExercises = [...exercises];
      updatedExercises[currentIndex].completed = true;
      setExercises(updatedExercises);
      setIsRunning(false);
      setCurrentIndex(null);
    }
  };

  const handleRestartWorkout = () => {
    setExercises(exercises.map((ex) => ({ ...ex, completed: false })));
    setWorkoutComplete(false);
    setCurrentIndex(null);
    setTimeLeft(0);
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (workoutComplete) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center">
          <CheckCircle2 className="w-20 h-20 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Great job!</h1>
          <p className="text-muted-foreground mb-6">
            You completed your workout 💪
          </p>
          <Button onClick={handleRestartWorkout} className="w-full">
            Restart Workout
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <Dumbbell className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Bodyweight <span className="text-primary">Workout</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            No equipment required - Start your fitness journey today
          </p>
        </div>

        <div className="space-y-4">
          {exercises.map((exercise, index) => (
            <Card
              key={index}
              className={`p-6 transition-all ${
                exercise.completed
                  ? "border-primary bg-primary/5"
                  : currentIndex === index
                  ? "border-primary shadow-lg"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {exercise.completed && (
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  )}
                  <h3 className="text-xl font-bold">{exercise.name}</h3>
                </div>
                <span className="text-sm text-muted-foreground">
                  {exercise.duration}s
                </span>
              </div>

              {currentIndex === index && (
                <div className="mb-4">
                  <div className="text-5xl font-bold text-center text-primary mb-4">
                    {formatTime(timeLeft)}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                {!exercise.completed && currentIndex !== index && (
                  <Button onClick={() => handleStart(index)} className="flex-1">
                    <Play className="w-4 h-4 mr-2" />
                    Start
                  </Button>
                )}

                {currentIndex === index && (
                  <>
                    {isRunning ? (
                      <Button
                        onClick={handlePause}
                        variant="secondary"
                        className="flex-1"
                      >
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setIsRunning(true)}
                        className="flex-1"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Resume
                      </Button>
                    )}
                    <Button
                      onClick={() => handleReset(index)}
                      variant="outline"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </>
                )}

                {exercise.completed && (
                  <Button disabled className="flex-1" variant="outline">
                    Completed
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Workouts;
