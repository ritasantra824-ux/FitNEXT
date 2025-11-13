import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Activity, Apple, Dumbbell, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-fitness.jpg";

const Home = () => {
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Check if profile exists
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", session.user.id)
          .maybeSingle();
        
        setHasProfile(!!profile);
      } else {
        setHasProfile(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setTimeout(async () => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("id")
            .eq("id", session.user.id)
            .maybeSingle();
          
          setHasProfile(!!profile);
        }, 0);
      } else {
        setHasProfile(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const features = [
    {
      icon: Activity,
      title: "BMI Calculator",
      description: "Track your body mass index and get personalized insights",
      link: "/bmi",
    },
    {
      icon: Apple,
      title: "Meal Plans",
      description: "Customized nutrition plans for your fitness goals",
      link: "/meals",
    },
    {
      icon: Dumbbell,
      title: "Workout Plans",
      description: "From beginner to advanced training programs",
      link: "/workouts",
    },
    {
      icon: MessageSquare,
      title: "AI Trainer",
      description: "Get instant answers from your personal AI fitness coach",
      link: "/ai-trainer",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Transform Your Body,
            <br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">Elevate Your Life</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your personal fitness journey starts here with AI-powered coaching, custom meal plans, and expert workouts
          </p>
          <div className="flex gap-4 justify-center">
            {!hasProfile && (
              <Link to="/login">
                <Button size="lg" className="bg-gradient-primary hover:shadow-glow-green transition-all">
                  Get Started Free
                </Button>
              </Link>
            )}
            <Link to="/about">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Everything You Need to <span className="text-primary">Succeed</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Link key={index} to={feature.link}>
                <Card className="p-6 hover:border-primary transition-all hover:shadow-glow-green cursor-pointer h-full">
                  <feature.icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6 text-white">Ready to Start Your Transformation?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of people achieving their fitness goals with FitNEXT
          </p>
          {!hasProfile && (
            <Link to="/login">
              <Button size="lg" variant="secondary" className="bg-fitness-orange hover:bg-fitness-orange/90">
                Sign Up Now
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
