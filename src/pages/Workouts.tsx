import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dumbbell, Clock, Zap } from "lucide-react";
import workoutImage from "@/assets/workout-home.jpg";

const Workouts = () => {
  const beginnerWorkouts = [
    {
      day: "Day 1",
      focus: "Full Body",
      duration: "30 min",
      exercises: [
        "Bodyweight Squats - 3x12",
        "Push-ups (knee) - 3x8",
        "Lunges - 3x10 each leg",
        "Plank - 3x20 seconds",
        "Glute Bridges - 3x12",
      ],
    },
    {
      day: "Day 2",
      focus: "Cardio & Core",
      duration: "25 min",
      exercises: [
        "Jumping Jacks - 3x30 seconds",
        "Mountain Climbers - 3x20",
        "Bicycle Crunches - 3x15 each side",
        "High Knees - 3x30 seconds",
        "Dead Bug - 3x10 each side",
      ],
    },
    {
      day: "Day 3",
      focus: "Upper Body",
      duration: "30 min",
      exercises: [
        "Wall Push-ups - 3x12",
        "Dumbbell Rows - 3x10",
        "Shoulder Press - 3x10",
        "Bicep Curls - 3x12",
        "Tricep Dips - 3x8",
      ],
    },
  ];

  const advancedWorkouts = [
    {
      day: "Day 1",
      focus: "Chest & Triceps",
      duration: "60 min",
      exercises: [
        "Barbell Bench Press - 4x8",
        "Incline Dumbbell Press - 4x10",
        "Cable Flyes - 3x12",
        "Tricep Pushdowns - 4x12",
        "Overhead Tricep Extension - 3x12",
      ],
    },
    {
      day: "Day 2",
      focus: "Back & Biceps",
      duration: "60 min",
      exercises: [
        "Deadlifts - 4x6",
        "Pull-ups - 4x8",
        "Barbell Rows - 4x10",
        "Barbell Curls - 4x10",
        "Hammer Curls - 3x12",
      ],
    },
    {
      day: "Day 3",
      focus: "Legs & Shoulders",
      duration: "60 min",
      exercises: [
        "Barbell Squats - 4x8",
        "Leg Press - 4x12",
        "Romanian Deadlifts - 3x10",
        "Military Press - 4x8",
        "Lateral Raises - 3x15",
      ],
    },
  ];

  const WorkoutCard = ({ day, focus, duration, exercises }: any) => (
    <Card className="p-6 hover:border-primary transition-all">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold">{day}</h3>
          <p className="text-primary font-semibold">{focus}</p>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{duration}</span>
        </div>
      </div>
      <ul className="space-y-2">
        {exercises.map((exercise: string, index: number) => (
          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            {exercise}
          </li>
        ))}
      </ul>
      <Button className="w-full mt-4" variant="outline">
        Start Workout
      </Button>
    </Card>
  );

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Dumbbell className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Workout <span className="text-primary">Plans</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Home workout programs designed to build strength and transform your body
          </p>
        </div>

        <div className="mb-12">
          <img 
            src={workoutImage} 
            alt="Home workout" 
            className="w-full h-64 object-cover rounded-lg shadow-glow-orange"
          />
        </div>

        <Tabs defaultValue="beginner" className="w-full">
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
            <div className="mb-6 p-6 bg-card rounded-lg">
              <h2 className="text-2xl font-bold mb-2">Beginner Program</h2>
              <p className="text-muted-foreground mb-4">
                3 days per week | Perfect for starting your fitness journey
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Focus on proper form and technique</li>
                <li>Build foundational strength</li>
                <li>Rest 48 hours between sessions</li>
                <li>Gradually increase intensity</li>
              </ul>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {beginnerWorkouts.map((workout, index) => (
                <WorkoutCard key={index} {...workout} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="advanced">
            <div className="mb-6 p-6 bg-card rounded-lg">
              <h2 className="text-2xl font-bold mb-2">Advanced Program</h2>
              <p className="text-muted-foreground mb-4">
                3-6 days per week | For experienced lifters seeking muscle growth
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Progressive overload principles</li>
                <li>Compound and isolation exercises</li>
                <li>Higher training volume</li>
                <li>Structured split routine</li>
              </ul>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {advancedWorkouts.map((workout, index) => (
                <WorkoutCard key={index} {...workout} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-3">💡 Pro Tips</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Always warm up for 5-10 minutes before starting</li>
              <li>• Focus on controlled movements, not speed</li>
              <li>• Listen to your body and rest when needed</li>
              <li>• Stay hydrated throughout your workout</li>
              <li>• Track your progress weekly</li>
            </ul>
          </Card>
          
          <Card className="p-6 bg-gradient-secondary">
            <h3 className="text-xl font-bold text-white mb-3">Need Equipment?</h3>
            <p className="text-white/90 text-sm mb-4">
              Recommended: Dumbbells, resistance bands, yoga mat, and a pull-up bar for home workouts
            </p>
            <Button variant="outline" className="bg-white text-secondary hover:bg-white/90">
              View Equipment Guide
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Workouts;
