import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dumbbell, Play, Pause, RotateCcw, CheckCircle2, Zap, Coffee, Youtube } from "lucide-react";
import { useWorkoutTracking } from "@/hooks/useWorkoutTracking";
import { WorkoutHistory } from "@/components/WorkoutHistory";

interface Exercise {
  name: string;
  reps: string;
  duration: number;
  completed: boolean;
  tutorialUrl: string;
}

const beginnerExercises: Exercise[] = [
  { name: "Push-ups", reps: "5-10 reps", duration: 30, completed: false, tutorialUrl: "https://youtu.be/WDIpL0pjun0?si=prO_91tOEOwbHTkE" },
  { name: "Squats", reps: "10-15 reps", duration: 40, completed: false, tutorialUrl: "https://youtu.be/iMlkdnZ_01k?si=svcqtkKAj_OnHmxN" },
  { name: "Plank", reps: "10 sec hold", duration: 10, completed: false, tutorialUrl: "https://youtu.be/pvIjsG5Svck?si=XcD-hV1j6KSsC-Tb" },
  { name: "Glute Bridges", reps: "10-12 reps", duration: 35, completed: false, tutorialUrl: "https://youtu.be/yJIyyubEawc?si=ZJ1XTuJkwSFVVPtS" },
];

const advancedExercises: Exercise[] = [
  { name: "Push-ups", reps: "15-20 reps", duration: 50, completed: false, tutorialUrl: "https://youtu.be/WDIpL0pjun0?si=prO_91tOEOwbHTkE" },
  { name: "Squats", reps: "20-25 reps", duration: 60, completed: false, tutorialUrl: "https://youtu.be/iMlkdnZ_01k?si=svcqtkKAj_OnHmxN" },
  { name: "Plank", reps: "30 sec hold", duration: 30, completed: false, tutorialUrl: "https://youtu.be/pvIjsG5Svck?si=XcD-hV1j6KSsC-Tb" },
  { name: "Lunges", reps: "12-15 reps each leg", duration: 55, completed: false, tutorialUrl: "https://youtu.be/qbPLDFf9LfI?si=XEEPFFCGj5SBJcZF" },
];

const Workouts = () => {
  const [activeTab, setActiveTab] = useState<"beginner" | "advanced">("beginner");
  const [beginnerWorkout, setBeginnerWorkout] = useState<Exercise[]>(beginnerExercises);
  const [advancedWorkout, setAdvancedWorkout] = useState<Exercise[]>(advancedExercises);
  
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [workoutComplete, setWorkoutComplete] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(0);

  const { workoutHistory, addWorkout, getWorkoutsThisWeek, hasWorkoutOnDate } = useWorkoutTracking();

  const currentExercises = activeTab === "beginner" ? beginnerWorkout : advancedWorkout;
  const setCurrentExercises = activeTab === "beginner" ? setBeginnerWorkout : setAdvancedWorkout;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0 && !isResting) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning && !isResting) {
      handleCompleteExercise();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isResting]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isResting && restTime > 0) {
      interval = setInterval(() => {
        setRestTime((prev) => prev - 1);
      }, 1000);
    } else if (restTime === 0 && isResting) {
      setIsResting(false);
      setIsRunning(true);
    }

    return () => clearInterval(interval);
  }, [isResting, restTime]);

  useEffect(() => {
    const allCompleted = currentExercises.every((ex) => ex.completed);
    if (allCompleted && workoutStarted) {
      setWorkoutComplete(true);
      setIsRunning(false);
      addWorkout(activeTab);
    }
  }, [currentExercises, workoutStarted]);

  const handleStartWorkout = () => {
    setWorkoutStarted(true);
    setCurrentIndex(0);
    setTimeLeft(currentExercises[0].duration);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleResume = () => {
    setIsRunning(true);
  };

  const handleReset = () => {
    setTimeLeft(currentExercises[currentIndex].duration);
    setIsRunning(false);
  };

  const handleCompleteExercise = () => {
    const updatedExercises = [...currentExercises];
    updatedExercises[currentIndex].completed = true;
    setCurrentExercises(updatedExercises);
    setIsRunning(false);

    // Move to next exercise with rest timer
    const nextIndex = currentIndex + 1;
    if (nextIndex < currentExercises.length) {
      setCurrentIndex(nextIndex);
      setTimeLeft(currentExercises[nextIndex].duration);
      setIsResting(true);
      setRestTime(20);
    }
  };

  const handleSkipExercise = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < currentExercises.length) {
      setCurrentIndex(nextIndex);
      setTimeLeft(currentExercises[nextIndex].duration);
      setIsRunning(false);
    }
  };

  const handleRestartWorkout = () => {
    const resetExercises = currentExercises.map((ex) => ({ ...ex, completed: false }));
    setCurrentExercises(resetExercises);
    setWorkoutComplete(false);
    setWorkoutStarted(false);
    setCurrentIndex(0);
    setTimeLeft(0);
    setIsRunning(false);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as "beginner" | "advanced");
    setWorkoutStarted(false);
    setWorkoutComplete(false);
    setCurrentIndex(0);
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
            You finished your <span className="font-semibold text-foreground">{activeTab === "beginner" ? "Beginner" : "Advanced"}</span> workout 💪
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
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <Dumbbell className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Home <span className="text-primary">Workout</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            No equipment required - Choose your level and start training
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="beginner" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Beginner
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4" />
              Advanced
            </TabsTrigger>
          </TabsList>

          <TabsContent value="beginner">
            <WorkoutContent
              exercises={beginnerWorkout}
              currentIndex={currentIndex}
              timeLeft={timeLeft}
              isRunning={isRunning}
              workoutStarted={workoutStarted}
              isResting={isResting}
              restTime={restTime}
              onStart={handleStartWorkout}
              onPause={handlePause}
              onResume={handleResume}
              onReset={handleReset}
              onComplete={handleCompleteExercise}
              onSkip={handleSkipExercise}
              formatTime={formatTime}
              level="Beginner"
            />
          </TabsContent>

          <TabsContent value="advanced">
            <WorkoutContent
              exercises={advancedWorkout}
              currentIndex={currentIndex}
              timeLeft={timeLeft}
              isRunning={isRunning}
              workoutStarted={workoutStarted}
              isResting={isResting}
              restTime={restTime}
              onStart={handleStartWorkout}
              onPause={handlePause}
              onResume={handleResume}
              onReset={handleReset}
              onComplete={handleCompleteExercise}
              onSkip={handleSkipExercise}
              formatTime={formatTime}
              level="Advanced"
            />
          </TabsContent>
        </Tabs>

        {/* Workout History Section */}
        <div className="mt-12">
          <WorkoutHistory 
            workoutHistory={workoutHistory} 
            workoutsThisWeek={getWorkoutsThisWeek()} 
          />
        </div>
      </div>
    </div>
  );
};

interface WorkoutContentProps {
  exercises: Exercise[];
  currentIndex: number;
  timeLeft: number;
  isRunning: boolean;
  workoutStarted: boolean;
  isResting: boolean;
  restTime: number;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onComplete: () => void;
  onSkip: () => void;
  formatTime: (seconds: number) => string;
  level: string;
}

const WorkoutContent = ({
  exercises,
  currentIndex,
  timeLeft,
  isRunning,
  workoutStarted,
  isResting,
  restTime,
  onStart,
  onPause,
  onResume,
  onReset,
  onComplete,
  onSkip,
  formatTime,
  level,
}: WorkoutContentProps) => {
  if (!workoutStarted) {
    return (
      <div className="space-y-6">
        <Card className="p-6 bg-card/50">
          <h2 className="text-2xl font-bold mb-2">{level} Workout</h2>
          <p className="text-muted-foreground mb-4">
            {level === "Beginner" 
              ? "Perfect for starting your fitness journey with manageable exercises"
              : "Challenge yourself with longer holds and more repetitions"}
          </p>
          <ul className="space-y-2 mb-6">
            {exercises.map((exercise, index) => (
              <li key={index} className="flex items-center justify-between gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-primary">•</span>
                  <span className="font-medium">{exercise.name}</span>
                  <span className="text-muted-foreground">- {exercise.reps}</span>
                </div>
                <a
                  href={exercise.tutorialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <Youtube className="w-4 h-4" />
                  Tutorial
                </a>
              </li>
            ))}
          </ul>
          <Button onClick={onStart} className="w-full" size="lg">
            <Play className="w-5 h-5 mr-2" />
            Start {level} Workout
          </Button>
        </Card>
      </div>
    );
  }

  const currentExercise = exercises[currentIndex];

  // Show rest timer if resting
  if (isResting) {
    return (
      <div className="space-y-6">
        <Card className="p-8 border-secondary shadow-lg bg-gradient-to-br from-card to-secondary/10">
          <div className="text-center">
            <Coffee className="w-16 h-16 text-secondary mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-2">Rest Time</h3>
            <p className="text-muted-foreground text-lg mb-6">
              Get ready for: {exercises[currentIndex].name}
            </p>
            
            <div className="text-7xl font-bold text-secondary mb-8">
              {formatTime(restTime)}
            </div>

            <p className="text-sm text-muted-foreground">
              Next exercise will start automatically...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <Card className="p-4 bg-card/50">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Exercise {currentIndex + 1} of {exercises.length}</span>
          <span>{exercises.filter(e => e.completed).length} completed</span>
        </div>
        <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((currentIndex) / exercises.length) * 100}%` }}
          />
        </div>
      </Card>

      {/* Current exercise card */}
      <Card className="p-8 border-primary shadow-lg">
        <div className="text-center">
          <h3 className="text-3xl font-bold mb-2">{currentExercise.name}</h3>
          <p className="text-muted-foreground text-lg mb-4">{currentExercise.reps}</p>
          <a
            href={currentExercise.tutorialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-6"
          >
            <Youtube className="w-5 h-5" />
            Watch Tutorial
          </a>
          
          <div className="text-7xl font-bold text-primary mb-8">
            {formatTime(timeLeft)}
          </div>

          <div className="flex gap-3 justify-center mb-6">
            {!isRunning ? (
              <Button onClick={onResume} size="lg" className="flex-1 max-w-xs">
                <Play className="w-5 h-5 mr-2" />
                {timeLeft === currentExercise.duration ? "Start" : "Resume"}
              </Button>
            ) : (
              <Button onClick={onPause} variant="secondary" size="lg" className="flex-1 max-w-xs">
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </Button>
            )}
            <Button onClick={onReset} variant="outline" size="lg">
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex gap-3 justify-center">
            <Button onClick={onComplete} variant="outline" size="sm">
              Mark Complete
            </Button>
            {currentIndex < exercises.length - 1 && (
              <Button onClick={onSkip} variant="ghost" size="sm">
                Skip Exercise
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Exercise list */}
      <div className="grid gap-3">
        {exercises.map((exercise, index) => (
          <Card
            key={index}
            className={`p-4 transition-all ${
              exercise.completed
                ? "border-primary/50 bg-primary/5"
                : index === currentIndex
                ? "border-primary"
                : "opacity-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {exercise.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                ) : index === currentIndex ? (
                  <div className="w-5 h-5 rounded-full border-2 border-primary" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-muted" />
                )}
                <div>
                  <p className="font-semibold">{exercise.name}</p>
                  <p className="text-sm text-muted-foreground">{exercise.reps}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={exercise.tutorialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <Youtube className="w-4 h-4" />
                  Tutorial
                </a>
                {index === currentIndex && (
                  <span className="text-xs font-medium text-primary ml-2">Current</span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Workouts;
