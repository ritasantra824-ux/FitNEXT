import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, ChefHat, Flame } from "lucide-react";

const RecipeDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const recipe = location.state?.recipe;

  if (!recipe) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">Recipe not found</p>
          <Button onClick={() => navigate("/meals")}>Back to Meals</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/meals")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Meals
        </Button>

        <Card className="overflow-hidden">
          <div className="p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-sm font-semibold text-primary mb-2 block">
                  {recipe.meal}
                </span>
                <h1 className="text-4xl font-bold mb-2">{recipe.title}</h1>
                <p className="text-muted-foreground text-lg">{recipe.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 my-8">
              <Card className="p-4 text-center bg-card/50">
                <Flame className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Calories</p>
                <p className="text-xl font-bold">{recipe.calories}</p>
              </Card>
              <Card className="p-4 text-center bg-card/50">
                <ChefHat className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Protein</p>
                <p className="text-xl font-bold">{recipe.protein}</p>
              </Card>
              <Card className="p-4 text-center bg-card/50">
                <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Prep Time</p>
                <p className="text-xl font-bold">15-20 min</p>
              </Card>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
                <ul className="space-y-2">
                  {recipe.ingredients?.map((ingredient: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span className="text-muted-foreground">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Instructions</h2>
                <ol className="space-y-4">
                  {recipe.instructions?.map((instruction: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary font-bold mr-3 min-w-[1.5rem]">
                        {index + 1}.
                      </span>
                      <span className="text-muted-foreground">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Nutritional Tips</h2>
                <Card className="p-4 bg-primary/10 border-primary/20">
                  <p className="text-sm text-muted-foreground">
                    This meal is {recipe.goal === 'weightloss' ? 'designed for weight loss with controlled portions and high protein content to keep you satisfied while maintaining a caloric deficit.' : 'optimized for muscle gain with high protein and complex carbohydrates to fuel your workouts and support muscle recovery.'}
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RecipeDetail;
