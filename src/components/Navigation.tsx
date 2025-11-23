import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navigation = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/bmi", label: "BMI Calculator" },
    { path: "/meals", label: "Meal Plans" },
    { path: "/workouts", label: "Workouts" },
    { path: "/ai-trainer", label: "AI Trainer" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Hide navbar on auth pages  
  if (
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/setup-profile" ||
    location.pathname === "/auth/callback"
  ) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* FIXED LOGO — no nested Link */}
          <Link to="/" className="flex items-center">
  <img
    src="/logo.png.png"
    alt="FitNEXT Logo"
    className="h-28 w-auto object-contain"
    style={{
      filter:
        "brightness(0%) saturate(100%) invert(56%) sepia(95%) saturate(1442%) hue-rotate(101deg) brightness(93%) contrast(89%)",
    }}
  />
</Link>


          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant="ghost"
                  className={
                    isActive(item.path)
                      ? "text-primary"
                      : "text-foreground hover:text-primary"
                  }
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${
                      isActive(item.path)
                        ? "text-primary"
                        : "text-foreground"
                    }`}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

