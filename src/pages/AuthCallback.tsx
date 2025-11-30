import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../integrations/supabase/client";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // Wait a moment so Supabase writes session cookie fully
        await new Promise((res) => setTimeout(res, 150));

        // Get authenticated user
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;

        if (!user) {
          navigate("/login");
          return;
        }

        // Check if profile already exists
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single();

        if (!mounted) return;

        // Case 1: Profile exists
        if (profile) {
          navigate("/profile");
          return;
        }

        // Case 2: Supabase's "no rows" error → new user
        if (error && error.code === "PGRST116") {
          navigate("/setup-profile");
          return;
        }

        // Any other error → fallback
        navigate("/setup-profile");
      } catch (err) {
        console.error("AuthCallback error:", err);
        navigate("/login");
      }
    })();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-indigo-600 rounded-full mx-auto mb-4" />
        <div className="text-sm text-gray-600">Completing authentication…</div>
      </div>
    </div>
  );
}
