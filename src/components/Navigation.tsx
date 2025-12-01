import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../integrations/supabase/client";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [initial, setInitial] = useState<string>("?");

  // Load user session + profile initial
  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const authUser = userData?.user;
      if (!authUser || !mounted) {
        setUser(null);
        return;
      }

      setUser(authUser);

      // Fetch name to display initial
      const { data: profile } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", authUser.id)
        .single();

      if (profile?.name) {
        setInitial(profile.name[0].toUpperCase());
      }
    })();

    return () => {
      mounted = false;
    };
  }, [location.pathname]);

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

  // Hide navbar on pages where we don't want distractions
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

          {/* LOGO */}
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

            {/* Right-side auth section */}
            {!user ? (
              <Link to="/login">
                <Button className="ml-2">Login</Button>
              </Link>
            ) : (
              <div className="ml-4 relative group">
                <div
                  onClick={() => navigate("/profile")}
                  className="w-10 h-10 bg-primary text-white font-semibold rounded-full flex items-center justify-center cursor-pointer"
                >
                  {initial}
                </div>

                {/* Dropdown */}
                <div className="hidden group-hover:block absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border z-50">
                  <button
                    className="w-full text-left px-4 py-2 text-gray-900 hover:bg-gray-100"
                    onClick={() => navigate("/profile")}
                  >
                    Profile
                  </button>

                  <button
                    className="w-full text-left px-4 py-2 text-gray-900 hover:bg-gray-100"
                    onClick={() => navigate("/setup-profile")}
                  >
                    Edit Profile
                  </button>

                  <button
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    onClick={async () => {
                      await supabase.auth.signOut();
                      navigate("/login");
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
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

              {/* Mobile login/logout */}
              {!user ? (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button className="w-full mt-2">Login</Button>
                </Link>
              ) : (
                <>
                  <Button
                    className="w-full mt-2"
                    onClick={() => {
                      navigate("/profile");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Profile
                  </Button>

                  <Button
                    className="w-full mt-1 text-red-600"
                    variant="ghost"
                    onClick={async () => {
                      await supabase.auth.signOut();
                      setMobileMenuOpen(false);
                      navigate("/login");
                    }}
                  >
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;