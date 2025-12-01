import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../integrations/supabase/client";
import ProfileCard from "../components/ProfileCard";

export default function ViewProfile() {
  const navigate = useNavigate();
  // Using explicit type or any to match your preference; adding strict null checks
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        // 1. Get current user
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;

        if (!user) {
          if (mounted) navigate("/login");
          return;
        }

        // 2. Fetch profile
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle(); // Use maybeSingle to prevent 406 errors if 0 rows

        // If error or no data, redirect to setup
        if (error || !data) {
          console.log("No profile found or error:", error);
          if (mounted) navigate("/setup-profile");
          return;
        }

        if (mounted) {
          setProfile(data);
        }
      } catch (error) {
        console.error("Unexpected error in ViewProfile:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  const handleDelete = async () => {
    if (!window.confirm("Delete your account permanently?")) return;

    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      const token = (userData as any)?.session?.access_token;

      if (!user) return;

      // 1. Delete profile row
      const { error } = await supabase.from("profiles").delete().eq("id", user.id);
      if (error) {
        throw error;
      }

      // 2. Call Edge Function (optional but recommended)
      const fnUrl = import.meta.env.VITE_DELETE_USER_FN;
      if (fnUrl) {
        await fetch(fnUrl, {
          method: "POST",
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });
      }

      // 3. Log out and redirect
      await supabase.auth.signOut();
      navigate("/login");
      
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again.");
    }
  };

  if (loading) return <div className="p-6 pt-24 text-white">Loading...</div>;
  
  // If not loading and no profile, we likely redirected, but return null to be safe
  if (!profile) return null;

  return (
    // ADDED: pt-24 (padding-top) to clear navbar, min-h-screen for height
    <div className="min-h-screen pt-24 pb-12 px-6 max-w-xl mx-auto">
      <div className="flex items-center gap-4">
        {/* Ensure ProfileCard handles missing name gracefully if needed */}
        <ProfileCard name={profile.name || "User"} size={80} />
        <div>
          <h1 className="text-2xl font-semibold text-white">{profile.name || "Unnamed User"}</h1>
          <p className="text-sm text-gray-500 font-mono">{profile.id}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        <div className="p-4 border border-gray-700 rounded bg-gray-900">
          <div className="text-sm text-gray-500">DOB (DDMMYY)</div>
          <div className="text-lg text-white">{profile.dob || "Not set"}</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border border-gray-700 rounded bg-gray-900">
            <div className="text-sm text-gray-500">Height</div>
            <div className="text-lg text-white">{profile.height ? `${profile.height} cm` : "Not set"}</div>
          </div>

          <div className="p-4 border border-gray-700 rounded bg-gray-900">
            <div className="text-sm text-gray-500">Weight</div>
            <div className="text-lg text-white">{profile.weight ? `${profile.weight} kg` : "Not set"}</div>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={() => navigate("/setup-profile")}
            className="px-4 py-2 rounded bg-slate-800 text-white hover:bg-slate-700 transition-colors border border-slate-600"
          >
            Edit Profile
          </button>

          <Link to="/information" className="px-4 py-2 rounded border border-gray-600 text-white hover:bg-gray-800 transition-colors">
            Information
          </Link>

          <button
            onClick={handleDelete}
            className="ml-auto px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}