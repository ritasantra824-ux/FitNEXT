import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../integrations/supabase/client";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Redirect logged-in users away from login page
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) navigate("/profile");
    })();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      // Supabase will redirect automatically
    } catch (err) {
      console.error("Google sign-in error:", err);
      alert("Google sign-in failed. Check console.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow">
        <h1 className="text-xl font-semibold mb-4 text-center">Sign in</h1>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M21 12.3c0-.7-.1-1.4-.3-2.1H12v3.9h5.6c-.2 1.1-.9 2-1.8 2.6v2.1h2.9c1.7-1.6 2.7-3.8 2.7-6.5z" fill="#4285F4"/>
                <path d="M12 22c2.4 0 4.4-.8 5.9-2.2l-2.9-2.1c-.8.5-1.9.9-3 .9-2.3 0-4.3-1.6-5-3.7H3.9v2.3C5.5 19.9 8.6 22 12 22z" fill="#34A853"/>
                <path d="M7 13.8c-.2-.5-.3-1-.3-1.8s.1-1.3.3-1.8V8H3.9C3.4 9.2 3 10.5 3 12s.4 2.8.9 4l3.1-2.2z" fill="#FBBC05"/>
                <path d="M12 6.5c1.3 0 2.4.5 3.3 1.4l2.5-2.5C16.2 3.9 14.4 3 12 3 8.6 3 5.5 5.1 3.9 8L7 10.5c.7-1.9 2.7-4 5-4z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </>
          )}
        </button>

        <p className="text-sm text-gray-500 mt-4 text-center">
          New users will be redirected to setup profile.
        </p>
      </div>
    </div>
  );
}
