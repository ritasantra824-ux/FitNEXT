import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Send, Bot, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AITrainer = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  
  const getInitialMessage = () => {
    if (mode === 'meal-plan') {
      return "Hi! I'm your AI nutrition advisor. I'll help you create a personalized meal plan. To get started, please tell me:\n\n1. Your daily calorie requirement (or your goal: weight loss, maintenance, or muscle gain)\n2. Any dietary preferences or restrictions\n3. Your preferred cuisine style (Western, Indian, Mediterranean, etc.)\n\nWhat are your nutritional goals?";
    }
    return "Hi! I'm your AI fitness trainer. I can help you with workout advice, nutrition questions, form tips, and motivation. What would you like to know?";
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: getInitialMessage(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Client-side validation
    const trimmedInput = input.trim();
    if (trimmedInput.length > 2000) {
      toast({
        title: "Message too long",
        description: "Please keep your message under 2000 characters.",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = { role: "user", content: trimmedInput };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-trainer", {
        body: { 
          message: trimmedInput,
          mode: mode || 'general'
        },
      });

      if (error) {
        throw error;
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response || "I'm sorry, I couldn't process that. Please try again.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("AI Trainer error:", error);
      const errorMessage = error.message || "Failed to get response. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <MessageSquare className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            AI Fitness <span className="text-primary">Trainer</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Get personalized fitness advice powered by AI
          </p>
        </div>

        <Card className="flex flex-col h-[600px]">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-lg p-4 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === "user" && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-secondary" />
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary animate-pulse" />
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-100" />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ask me anything about fitness..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-gradient-primary"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              AI responses are for informational purposes only. Consult professionals for medical advice.
            </p>
          </div>
        </Card>

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <Card className="p-4 hover:border-primary transition-all cursor-pointer"
            onClick={() => setInput("What exercises help build core strength?")}>
            <p className="text-sm font-semibold mb-1">Core Strength</p>
            <p className="text-xs text-muted-foreground">What exercises help build core strength?</p>
          </Card>
          <Card className="p-4 hover:border-primary transition-all cursor-pointer"
            onClick={() => setInput("How much protein should I eat daily?")}>
            <p className="text-sm font-semibold mb-1">Nutrition</p>
            <p className="text-xs text-muted-foreground">How much protein should I eat daily?</p>
          </Card>
          <Card className="p-4 hover:border-primary transition-all cursor-pointer"
            onClick={() => setInput("Tips for staying motivated?")}>
            <p className="text-sm font-semibold mb-1">Motivation</p>
            <p className="text-xs text-muted-foreground">Tips for staying motivated?</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AITrainer;
