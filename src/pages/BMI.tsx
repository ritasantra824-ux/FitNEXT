import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";

const BMI = () => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState("");

  const calculateBMI = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100; // convert cm to m
    
    if (w > 0 && h > 0) {
      const bmiValue = w / (h * h);
      setBmi(parseFloat(bmiValue.toFixed(1)));
      
      if (bmiValue < 18.5) setCategory("Underweight");
      else if (bmiValue < 25) setCategory("Normal Weight");
      else if (bmiValue < 30) setCategory("Overweight");
      else setCategory("Obese");
    }
  };

  const getBMIColor = () => {
    if (!bmi) return "text-foreground";
    if (bmi < 18.5) return "text-blue-500";
    if (bmi < 25) return "text-primary";
    if (bmi < 30) return "text-secondary";
    return "text-destructive";
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            BMI <span className="text-primary">Calculator</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Calculate your Body Mass Index and understand your health status
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-8">
            <div className="flex items-center gap-2 mb-6">
              <Calculator className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Calculate Your BMI</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="Enter your weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="Enter your height"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <Button 
                onClick={calculateBMI} 
                className="w-full bg-gradient-primary"
                disabled={!weight || !height}
              >
                Calculate BMI
              </Button>
            </div>

            {bmi !== null && (
              <div className="mt-8 p-6 bg-muted rounded-lg text-center animate-fade-in">
                <p className="text-muted-foreground mb-2">Your BMI is</p>
                <p className={`text-5xl font-bold mb-2 ${getBMIColor()}`}>{bmi}</p>
                <p className={`text-xl font-semibold ${getBMIColor()}`}>{category}</p>
              </div>
            )}
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">BMI Categories</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="font-semibold text-blue-500">Underweight</p>
                <p className="text-sm text-muted-foreground">BMI less than 18.5</p>
              </div>
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="font-semibold text-primary">Normal Weight</p>
                <p className="text-sm text-muted-foreground">BMI 18.5 - 24.9</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                <p className="font-semibold text-secondary">Overweight</p>
                <p className="text-sm text-muted-foreground">BMI 25 - 29.9</p>
              </div>
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="font-semibold text-destructive">Obese</p>
                <p className="text-sm text-muted-foreground">BMI 30 or greater</p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> BMI is a useful indicator but doesn't account for muscle mass, 
                bone density, or overall body composition. Consult with healthcare professionals for 
                personalized advice.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BMI;
