import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Apple, TrendingDown, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import mealImage from "@/assets/meal-healthy.jpg";

const Meals = () => {
  const navigate = useNavigate();
  
  const weightLossMeals = [
    {
      meal: "Breakfast",
      title: "Greek Yogurt Parfait",
      calories: "320 kcal",
      protein: "25g",
      description: "Low-fat Greek yogurt with berries, almonds, and honey",
      goal: "weightloss",
      ingredients: [
        "1 cup low-fat Greek yogurt",
        "1/2 cup mixed berries (blueberries, strawberries)",
        "2 tablespoons sliced almonds",
        "1 tablespoon honey",
        "Optional: 1 tablespoon chia seeds"
      ],
      instructions: [
        "In a serving glass or bowl, add half of the Greek yogurt as the base layer",
        "Top with half of the mixed berries",
        "Add the remaining yogurt on top",
        "Layer the rest of the berries on the yogurt",
        "Drizzle honey over the top",
        "Sprinkle with sliced almonds and chia seeds if using",
        "Serve immediately or refrigerate for up to 2 hours before serving"
      ]
    },
    {
      meal: "Lunch",
      title: "Grilled Chicken Salad",
      calories: "380 kcal",
      protein: "35g",
      description: "Mixed greens, grilled chicken breast, cherry tomatoes, cucumber, olive oil dressing",
      goal: "weightloss",
      ingredients: [
        "6 oz grilled chicken breast, sliced",
        "3 cups mixed greens (spinach, arugula, lettuce)",
        "1 cup cherry tomatoes, halved",
        "1 cucumber, sliced",
        "1/4 red onion, thinly sliced",
        "2 tablespoons olive oil",
        "1 tablespoon balsamic vinegar",
        "Salt and pepper to taste"
      ],
      instructions: [
        "Season chicken breast with salt, pepper, and your favorite herbs",
        "Grill chicken over medium-high heat for 6-7 minutes per side until fully cooked",
        "Let chicken rest for 5 minutes, then slice into strips",
        "In a large bowl, combine mixed greens, cherry tomatoes, cucumber, and red onion",
        "Whisk together olive oil, balsamic vinegar, salt, and pepper for dressing",
        "Top the salad with sliced chicken",
        "Drizzle with dressing and toss gently before serving"
      ]
    },
    {
      meal: "Dinner",
      title: "Baked Salmon & Veggies",
      calories: "420 kcal",
      protein: "40g",
      description: "Baked salmon fillet with steamed broccoli and quinoa",
      goal: "weightloss",
      ingredients: [
        "6 oz salmon fillet",
        "2 cups broccoli florets",
        "1/2 cup cooked quinoa",
        "1 lemon, sliced",
        "2 cloves garlic, minced",
        "1 tablespoon olive oil",
        "Fresh dill or parsley",
        "Salt and pepper to taste"
      ],
      instructions: [
        "Preheat oven to 400°F (200°C)",
        "Place salmon on a baking sheet lined with parchment paper",
        "Season salmon with salt, pepper, and minced garlic",
        "Top with lemon slices and drizzle with olive oil",
        "Bake for 12-15 minutes until salmon flakes easily with a fork",
        "Meanwhile, steam broccoli for 5-7 minutes until tender-crisp",
        "Cook quinoa according to package directions",
        "Serve salmon over quinoa with steamed broccoli on the side",
        "Garnish with fresh herbs and extra lemon juice if desired"
      ]
    },
    {
      meal: "Snack",
      title: "Apple with Almond Butter",
      calories: "180 kcal",
      protein: "5g",
      description: "Sliced apple with 1 tbsp natural almond butter",
      goal: "weightloss",
      ingredients: [
        "1 medium apple (preferably Granny Smith or Honeycrisp)",
        "1 tablespoon natural almond butter",
        "Optional: sprinkle of cinnamon"
      ],
      instructions: [
        "Wash and core the apple",
        "Slice the apple into 8-10 wedges",
        "Place almond butter in a small bowl for dipping",
        "Optionally sprinkle cinnamon on the apple slices",
        "Dip apple slices in almond butter and enjoy as a quick, nutritious snack"
      ]
    },
  ];

  const muscleGainMeals = [
    {
      meal: "Breakfast",
      title: "Protein Pancakes",
      calories: "520 kcal",
      protein: "42g",
      description: "Whole grain pancakes with protein powder, topped with banana and peanut butter",
      goal: "musclegain",
      ingredients: [
        "1 cup whole grain flour",
        "1 scoop vanilla protein powder",
        "1 egg",
        "1 cup milk (dairy or plant-based)",
        "1 ripe banana, sliced",
        "2 tablespoons peanut butter",
        "1 teaspoon baking powder",
        "Optional: honey for drizzling"
      ],
      instructions: [
        "In a bowl, mix flour, protein powder, and baking powder",
        "In another bowl, whisk together egg and milk",
        "Combine wet and dry ingredients until just mixed (some lumps are okay)",
        "Heat a non-stick pan over medium heat",
        "Pour 1/4 cup batter for each pancake",
        "Cook until bubbles form on surface, then flip and cook until golden",
        "Stack pancakes and top with sliced banana",
        "Drizzle with peanut butter (warm it slightly for easier drizzling)",
        "Add honey if desired and serve immediately"
      ]
    },
    {
      meal: "Lunch",
      title: "Beef & Rice Bowl",
      calories: "680 kcal",
      protein: "52g",
      description: "Lean ground beef, brown rice, black beans, avocado, and salsa",
      goal: "musclegain",
      ingredients: [
        "6 oz lean ground beef (90% lean)",
        "1 cup cooked brown rice",
        "1/2 cup black beans, drained and rinsed",
        "1/2 avocado, sliced",
        "1/4 cup salsa",
        "1/4 cup shredded cheese (optional)",
        "Taco seasoning or cumin, paprika, garlic powder",
        "Fresh cilantro for garnish"
      ],
      instructions: [
        "Cook brown rice according to package directions and set aside",
        "In a pan over medium-high heat, cook ground beef until browned",
        "Drain excess fat and add taco seasoning with a splash of water",
        "Simmer for 2-3 minutes until seasoning is well incorporated",
        "Warm black beans in a small pot or microwave",
        "In a bowl, layer brown rice as the base",
        "Top with seasoned ground beef and black beans",
        "Add sliced avocado, salsa, and cheese if using",
        "Garnish with fresh cilantro and serve hot"
      ]
    },
    {
      meal: "Dinner",
      title: "Chicken Pasta",
      calories: "750 kcal",
      protein: "58g",
      description: "Grilled chicken breast with whole wheat pasta and marinara sauce",
      goal: "musclegain",
      ingredients: [
        "6 oz grilled chicken breast, sliced",
        "2 cups cooked whole wheat pasta",
        "1 cup marinara sauce",
        "2 cloves garlic, minced",
        "2 tablespoons olive oil",
        "Fresh basil leaves",
        "Parmesan cheese for topping",
        "Red pepper flakes (optional)"
      ],
      instructions: [
        "Cook whole wheat pasta according to package directions until al dente",
        "Season chicken breast with salt, pepper, and Italian herbs",
        "Grill chicken over medium-high heat for 6-7 minutes per side",
        "Let chicken rest, then slice into strips",
        "In a large pan, heat olive oil and sauté minced garlic until fragrant",
        "Add marinara sauce and simmer for 5 minutes",
        "Drain pasta and add to the sauce, tossing to combine",
        "Top pasta with sliced chicken",
        "Garnish with fresh basil, Parmesan cheese, and red pepper flakes",
        "Serve immediately while hot"
      ]
    },
    {
      meal: "Snack",
      title: "Protein Shake",
      calories: "380 kcal",
      protein: "35g",
      description: "Whey protein, banana, oats, peanut butter, and almond milk",
      goal: "musclegain",
      ingredients: [
        "1 scoop whey protein powder (vanilla or chocolate)",
        "1 ripe banana",
        "1/4 cup rolled oats",
        "2 tablespoons peanut butter",
        "1 cup almond milk (or milk of choice)",
        "1/2 cup ice cubes",
        "Optional: 1 tablespoon honey for extra sweetness"
      ],
      instructions: [
        "Add almond milk to blender first",
        "Add protein powder, banana, oats, and peanut butter",
        "Add ice cubes and honey if using",
        "Blend on high speed for 45-60 seconds until smooth and creamy",
        "If too thick, add more almond milk and blend again",
        "Pour into a large glass",
        "Consume within 30 minutes after workout for optimal muscle recovery",
        "Can be stored in refrigerator for up to 24 hours"
      ]
    },
  ];

  const MealCard = ({ recipe }: any) => (
    <Card 
      className="p-6 hover:border-primary transition-all cursor-pointer"
      onClick={() => navigate("/recipe", { state: { recipe } })}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-sm font-semibold text-primary">{recipe.meal}</span>
        <span className="text-sm text-muted-foreground">{recipe.calories}</span>
      </div>
      <h3 className="text-xl font-bold mb-2">{recipe.title}</h3>
      <p className="text-muted-foreground text-sm mb-3">{recipe.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
          {recipe.protein} protein
        </span>
        <span className="text-xs text-primary hover:underline">View Recipe →</span>
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
                <MealCard key={index} recipe={meal} />
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
                <MealCard key={index} recipe={meal} />
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
