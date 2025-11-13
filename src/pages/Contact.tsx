import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, MessageSquare } from "lucide-react";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  subject: z.string().trim().min(1, "Subject is required").max(200, "Subject must be less than 200 characters"),
  message: z.string().trim().min(1, "Message is required").max(2000, "Message must be less than 2000 characters")
});
const Contact = () => {
  const {
    toast
  } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      contactSchema.parse(formData);
      
      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24 hours."
      });
      
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive"
        });
      }
    }
  };
  return <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Contact <span className="text-primary">Us</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Have questions? We'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center hover:border-primary transition-all">
            <Mail className="w-10 h-10 text-primary mx-auto mb-3" />
            <h3 className="font-bold mb-2">Email</h3>
            <p className="text-sm text-muted-foreground">aritkumarsantra@gmail.com

          </p>
          </Card>
          
          
          
          <Card className="p-6 text-center hover:border-primary transition-all my-0 mx-[2px]">
            <MessageSquare className="w-10 h-10 text-primary mx-auto mb-3" />
            <h3 className="font-bold mb-2">Live Chat</h3>
            <p className="text-sm text-muted-foreground">Available 24/7</p>
          </Card>
        </div>

        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" type="text" placeholder="Your name" value={formData.name} onChange={e => setFormData({
                ...formData,
                name: e.target.value
              })} required className="mt-1" />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your@email.com" value={formData.email} onChange={e => setFormData({
                ...formData,
                email: e.target.value
              })} required className="mt-1" />
              </div>
            </div>
            
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" type="text" placeholder="How can we help?" value={formData.subject} onChange={e => setFormData({
              ...formData,
              subject: e.target.value
            })} required className="mt-1" />
            </div>
            
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Tell us more..." value={formData.message} onChange={e => setFormData({
              ...formData,
              message: e.target.value
            })} required rows={6} className="mt-1" />
            </div>
            
            <Button type="submit" className="w-full bg-gradient-primary" size="lg">
              Send Message
            </Button>
          </form>
        </Card>

        <Card className="p-6 mt-8 bg-muted">
          <h3 className="font-bold mb-3">Frequently Asked Questions</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">How quickly will I see results?</strong><br />
              Results vary, but most users see noticeable changes within 4-6 weeks of consistent training.
            </p>
            <p>
              <strong className="text-foreground">Do I need equipment for the workouts?</strong><br />
              Our beginner programs are equipment-free. Advanced programs recommend basic equipment like dumbbells.
            </p>
            <p>
              <strong className="text-foreground">Is the AI trainer personalized?</strong><br />
              Yes! Our AI learns from your goals, preferences, and progress to provide tailored advice.
            </p>
          </div>
        </Card>
      </div>
    </div>;
};
export default Contact;