import { Card } from "@/components/ui/card";
import { Award, Heart, Target, Users } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Goal-Focused",
      description: "We help you set realistic goals and provide the tools to achieve them",
    },
    {
      icon: Heart,
      title: "Health First",
      description: "Sustainable fitness through balanced nutrition and smart training",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Join a supportive community of fitness enthusiasts",
    },
    {
      icon: Award,
      title: "Expert Guidance",
      description: "AI-powered coaching backed by fitness science",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="text-primary">FitNEXT</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Transforming lives through intelligent fitness solutions
          </p>
        </div>

        <Card className="p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-4">
            At FitNEXT, we believe fitness should be accessible, personalized, and effective. 
            Our mission is to empower individuals to take control of their health through 
            cutting-edge AI technology, expert guidance, and comprehensive fitness solutions.
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Whether you're just starting your fitness journey or you're an experienced athlete, 
            FitNEXT provides the tools, knowledge, and support you need to reach your goals and 
            maintain a healthy lifestyle for life.
          </p>
        </Card>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Our Core Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="p-6 hover:border-primary transition-all">
                <value.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>

        <Card className="p-8 bg-gradient-primary">
          <h2 className="text-3xl font-bold text-white mb-4">Why Choose FitNEXT?</h2>
          <div className="space-y-3 text-white/90">
            <p className="flex items-start gap-2">
              <span className="text-white font-bold mt-1">✓</span>
              <span>AI-powered personalized fitness coaching available 24/7</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-white font-bold mt-1">✓</span>
              <span>Science-backed meal plans and workout programs</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-white font-bold mt-1">✓</span>
              <span>Comprehensive tools including BMI calculator and progress tracking</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-white font-bold mt-1">✓</span>
              <span>Flexible home workout plans requiring minimal equipment</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-white font-bold mt-1">✓</span>
              <span>Regular updates with latest fitness trends and research</span>
            </p>
          </div>
        </Card>

        <Card className="p-8 mt-8 text-center">
          <h2 className="text-3xl font-bold mb-4">We Value Your Feedback</h2>
          <p className="text-muted-foreground text-lg mb-4">
            Your suggestions help us improve and serve you better. Feel free to share your thoughts!
          </p>
          <p className="text-muted-foreground mb-6">
            Email us at: <a href="mailto:aritkumarsantra@gmail.com" className="text-primary font-semibold hover:underline">aritkumarsantra@gmail.com</a>
          </p>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=aritkumarsantra@gmail.com&su=Website Feedback"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 text-lg font-semibold transition-colors"
          >
            Send Feedback
          </a>
        </Card>
      </div>
    </div>
  );
};

export default About;
