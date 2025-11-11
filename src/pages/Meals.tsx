import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Apple, TrendingDown, TrendingUp } from "lucide-react";
import mealImage from "@/assets/meal-healthy.jpg";

const Meals = () => {
  const weightLossMeals = [
    {
      meal: "Breakfast",
      title: "Greek Yogurt Parfait",
      calories: "320 kcal",
      protein: "25g",
      description: "Low-fat Greek yogurt with berries, almonds, and honey",
    },
    {
      meal: "Lunch",
      title: "Grilled Chicken Salad",
      calories: "380 kcal",
      protein: "35g",
      description: "Mixed greens, grilled chicken breast, cherry tomatoes, cucumber, olive oil dressing",
    },
    {
      meal: "Dinner",
      title: "Baked Salmon & Veggies",
      calories: "420 kcal",
      protein: "40g",
      description: "Baked salmon fillet with steamed broccoli and quinoa",
    },
    {
      meal: "Snack",
      title: "Apple with Almond Butter",
      calories: "180 kcal",
      protein: "5g",
      description: "Sliced apple with 1 tbsp natural almond butter",
    },
  ];

  const muscleGainMeals = [
    {
      meal: "Breakfast",
      title: "Protein Pancakes",
      calories: "520 kcal",
      protein: "42g",
      description: "Whole grain pancakes with protein powder, topped with banana and peanut butter",
    },
    {
      meal: "Lunch",
      title: "Beef & Rice Bowl",
      calories: "680 kcal",
      protein: "52g",
      description: "Lean ground beef, brown rice, black beans, avocado, and salsa",
    },
    {
      meal: "Dinner",
      title: "Chicken Pasta",
      calories: "750 kcal",
      protein: "58g",
      description: "Grilled chicken breast with whole wheat pasta and marinara sauce",
    },
    {
      meal: "Snack",
      title: "Protein Shake",
      calories: "380 kcal",
      protein: "35g",
      description: "Whey protein, banana, oats, peanut butter, and almond milk",
    },
  ];

  const MealCard = ({ meal, title, calories, protein, description }: any) => (
    <Card className="p-6 hover:border-primary transition-all">
      <div className="flex items-start justify-between mb-2">
        <span className="text-sm font-semibold text-primary">{meal}</span>
        <span className="text-sm text-muted-foreground">{calories}</span>
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm mb-3">{description}</p>
      <div className="flex items-center gap-2">
        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
          {protein} protein
        </span>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Apple className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Meal <span className="text-primary">Plans</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Fuel your fitness journey with nutrition plans designed for your goals
          </p>
        </div>

        <div className="mb-12">
          <img 
            src={mealImage} 
            alt="Healthy meal prep" 
            className="w-full h-64 object-cover rounded-lg shadow-glow-green"
          />
        </div>

        <Tabs defaultValue="weightloss" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="weightloss" className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Weight Loss
            </TabsTrigger>
            <TabsTrigger value="musclegain" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Muscle Gain
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weightloss">
            <div className="mb-6 p-6 bg-card rounded-lg">
              <h2 className="text-2xl font-bold mb-2">Weight Loss Plan</h2>
              <p className="text-muted-foreground mb-4">
                Daily target: 1,300-1,500 calories | High protein, low carb approach
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Focus on lean proteins and vegetables</li>
                <li>Moderate healthy fats from nuts and oils</li>
                <li>Limited complex carbohydrates</li>
                <li>Stay hydrated with 8-10 glasses of water daily</li>
              </ul>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {weightLossMeals.map((meal, index) => (
                <MealCard key={index} {...meal} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="musclegain">
            <div className="mb-6 p-6 bg-card rounded-lg">
              <h2 className="text-2xl font-bold mb-2">Muscle Gain Plan</h2>
              <p className="text-muted-foreground mb-4">
                Daily target: 2,330+ calories | High protein, high carb approach
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Emphasis on lean proteins (1.6-2.2g per kg body weight)</li>
                <li>Complex carbohydrates for energy and recovery</li>
                <li>Healthy fats for hormone production</li>
                <li>Post-workout nutrition within 30 minutes</li>
              </ul>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {muscleGainMeals.map((meal, index) => (
                <MealCard key={index} {...meal} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12 text-center">
          <Card className="p-8 bg-gradient-primary">
            <h3 className="text-2xl font-bold text-white mb-4">Want Personalized Meal Plans?</h3>
            <p className="text-white/90 mb-6">
              Get custom nutrition plans tailored to your body type, goals, and dietary preferences
            </p>
            <Button variant="secondary" size="lg">
              Get Custom Plan
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Meals;
