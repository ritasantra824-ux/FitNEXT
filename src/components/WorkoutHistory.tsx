import { Card } from "@/components/ui/card";
import { Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { WorkoutRecord } from "@/hooks/useWorkoutTracking";

interface WorkoutHistoryProps {
  workoutHistory: WorkoutRecord[];
  workoutsThisWeek: number;
}

export const WorkoutHistory = ({ workoutHistory, workoutsThisWeek }: WorkoutHistoryProps) => {
  const meetsWeeklyGoal = workoutsThisWeek >= 3;

  const getRecentWorkouts = () => {
    return [...workoutHistory]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 7);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    });
  };

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-card/50 border-border">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Workout History</h2>
        </div>

        {/* Weekly Progress */}
        <div className={`p-4 rounded-lg mb-4 ${meetsWeeklyGoal ? 'bg-primary/10 border border-primary/30' : 'bg-muted/50 border border-border'}`}>
          <div className="flex items-center gap-2 mb-2">
            {meetsWeeklyGoal ? (
              <CheckCircle2 className="w-5 h-5 text-primary" />
            ) : (
              <AlertCircle className="w-5 h-5 text-muted-foreground" />
            )}
            <span className="font-semibold">This Week: {workoutsThisWeek}/3 workouts</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Minimum 3 workout days per week recommended for optimal results.
          </p>
        </div>

        {/* Recent Workouts List */}
        {workoutHistory.length > 0 ? (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Recent Workouts</h3>
            {getRecentWorkouts().map((record, index) => (
              <div
                key={`${record.date}-${index}`}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{formatDate(record.date)}</span>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary-foreground capitalize">
                  {record.level}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No workouts completed yet.</p>
            <p className="text-sm mt-1">Start your first workout to begin tracking!</p>
          </div>
        )}
      </Card>
    </div>
  );
};
