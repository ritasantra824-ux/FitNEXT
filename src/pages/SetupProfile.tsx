import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Dumbbell, Loader2, User, Calendar, Ruler, Weight } from "lucide-react";

const SetupProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    day: "",
    month: "",
    year: "",
    height: "",
    weight: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.day || !formData.month || !formData.year || !formData.height || !formData.weight) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // Validate date
    const day = parseInt(formData.day);
    const month = parseInt(formData.month);
    const year = parseInt(formData.year);

    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > new Date().getFullYear()) {
      toast({
        title: "Invalid date",
        description: "Please enter a valid date of birth",
        variant: "destructive",
      });
      return;
    }

    // Validate height and weight
    const height = parseFloat(formData.height);
    const weight = parseFloat(formData.weight);

    if (isNaN(height) || height <= 0 || isNaN(weight) || weight <= 0) {
      toast({
        title: "Invalid measurements",
        description: "Please enter valid height and weight",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No user found");
      }

      // Format date as YYYY-MM-DD
      const dob = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

      const { error } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          name: formData.name,
          dob,
          height,
          weight,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile created successfully",
      });

      navigate("/");
    } catch (error: any) {
      console.error("Profile setup error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background to-primary/5">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Dumbbell className="w-10 h-10 text-primary" />
            <span className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              FitNEXT
            </span>
          </div>
          <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
          <CardDescription>Tell us a bit about yourself to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date of Birth</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="Day"
                    min="1"
                    max="31"
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
                <Input
                  type="number"
                  placeholder="Month"
                  min="1"
                  max="12"
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                  className="flex-1"
                  disabled={loading}
                />
                <Input
                  type="number"
                  placeholder="Year"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="flex-1"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="height" className="text-sm font-medium">
                Height (cm)
              </label>
              <div className="relative">
                <Ruler className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="height"
                  type="number"
                  placeholder="175"
                  step="0.1"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="weight" className="text-sm font-medium">
                Weight (kg)
              </label>
              <div className="relative">
                <Weight className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="weight"
                  type="number"
                  placeholder="70"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving profile...
                </>
              ) : (
                "Save Profile"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetupProfile;
