import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Dumbbell, Loader2, User, CalendarIcon, Ruler, Weight, Users, Target } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

/**
 * PROFILE SETUP PAGE - WHEN IT SHOWS:
 * 
 * ✅ Shows when:
 * - User signs up (new account) and has NO profile in database
 * - User logs in with existing account but has NO profile
 * 
 * ❌ Does NOT show when:
 * - User already has a complete profile (redirects to home)
 * - User is not authenticated (redirects to login)
 * 
 * REDIRECT FLOW:
 * 1. AuthContext checks if user is authenticated
 * 2. If authenticated, checks if profile exists in "profiles" table
 * 3. If NO profile → Shows this page
 * 4. If profile EXISTS → Redirects to home page "/"
 * 5. After user completes this form → Saves profile → Redirects to home
 */

const SetupProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [name, setName] = useState("");
  const [dob, setDob] = useState<Date>();
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("");
  const [fitnessGoal, setFitnessGoal] = useState("");

  const fitnessGoals = [
    { value: "lose_weight", label: "Lose Weight" },
    { value: "gain_muscle", label: "Gain Muscle" },
    { value: "stay_fit", label: "Stay Fit" },
    { value: "improve_endurance", label: "Improve Endurance" },
  ];

  // Check if user already has a profile - if so, redirect to home
  useEffect(() => {
    const checkExistingProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/login');
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .maybeSingle();

        // If profile already exists, redirect to home
        if (profile) {
          navigate('/');
        } else {
          setCheckingProfile(false);
        }
      } catch (error) {
        console.error('Error checking profile:', error);
        setCheckingProfile(false);
      }
    };

    checkExistingProfile();
  }, [navigate]);

  if (checkingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !dob || !height || !weight) {
      toast({
        title: "Missing required fields",
        description: "Please fill in name, date of birth, height, and weight",
        variant: "destructive",
      });
      return;
    }

    // Validate height and weight
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    if (isNaN(heightNum) || heightNum <= 0 || heightNum > 300) {
      toast({
        title: "Invalid height",
        description: "Please enter a valid height between 1 and 300 cm",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(weightNum) || weightNum <= 0 || weightNum > 500) {
      toast({
        title: "Invalid weight",
        description: "Please enter a valid weight between 1 and 500 kg",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No user found. Please log in again.");
      }

      // Format date as YYYY-MM-DD
      const formattedDob = format(dob, "yyyy-MM-dd");

      const { error } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          name: name.trim(),
          dob: formattedDob,
          height: heightNum,
          weight: weightNum,
        });

      if (error) throw error;

      toast({
        title: "Profile created! 🎉",
        description: "Welcome to FitNEXT. Let's start your fitness journey!",
      });

      navigate("/");
    } catch (error: any) {
      console.error("Profile setup error:", error);
      toast({
        title: "Error creating profile",
        description: error.message || "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background to-primary/10">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Dumbbell className="w-12 h-12 text-primary" />
            <span className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              FitNEXT
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
          <p className="text-muted-foreground text-lg">
            Help us personalize your fitness experience
          </p>
          <Progress value={33} className="mt-4 h-2" />
          <p className="text-sm text-muted-foreground mt-2">Step 1 of 3</p>
        </div>

        {/* Form Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              This information helps us create a personalized fitness plan for you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-semibold flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Full Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 text-base"
                  disabled={loading}
                  required
                />
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  Date of Birth *
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-12 justify-start text-left font-normal text-base",
                        !dob && "text-muted-foreground"
                      )}
                      disabled={loading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dob ? format(dob, "MMMM dd, yyyy") : <span>Select your date of birth</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dob}
                      onSelect={setDob}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      captionLayout="dropdown-buttons"
                      fromYear={1900}
                      toYear={new Date().getFullYear()}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Height and Weight - Side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height" className="text-base font-semibold flex items-center gap-2">
                    <Ruler className="h-5 w-5 text-primary" />
                    Height (cm) *
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="175"
                    step="0.1"
                    min="1"
                    max="300"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="h-12 text-base"
                    disabled={loading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-base font-semibold flex items-center gap-2">
                    <Weight className="h-5 w-5 text-primary" />
                    Weight (kg) *
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="70"
                    step="0.1"
                    min="1"
                    max="500"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="h-12 text-base"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Gender (Optional) */}
              <div className="space-y-3">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Gender <span className="text-sm text-muted-foreground font-normal">(Optional)</span>
                </Label>
                <RadioGroup value={gender} onValueChange={setGender} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" disabled={loading} />
                    <Label htmlFor="male" className="font-normal cursor-pointer">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" disabled={loading} />
                    <Label htmlFor="female" className="font-normal cursor-pointer">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" disabled={loading} />
                    <Label htmlFor="other" className="font-normal cursor-pointer">Other</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Fitness Goal (Optional) */}
              <div className="space-y-3">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Fitness Goal <span className="text-sm text-muted-foreground font-normal">(Optional)</span>
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {fitnessGoals.map((goal) => (
                    <Button
                      key={goal.value}
                      type="button"
                      variant={fitnessGoal === goal.value ? "default" : "outline"}
                      className="h-12"
                      onClick={() => setFitnessGoal(goal.value)}
                      disabled={loading}
                    >
                      {goal.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="space-y-3 pt-4">
                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg font-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating your profile...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <span className="ml-2">→</span>
                    </>
                  )}
                </Button>
                
                <p className="text-center text-sm text-muted-foreground">
                  * Required fields
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Box */}
        <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-sm text-center text-muted-foreground">
            <strong>Privacy:</strong> Your information is secure and will only be used to personalize your fitness experience
          </p>
        </div>
      </div>
    </div>
  );
};

export default SetupProfile;
