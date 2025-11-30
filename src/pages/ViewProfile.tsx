import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../integrations/supabase/client";
import ProfileCard from "../components/ProfileCard";

export default function ViewProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      // If error (no profile) → send to setup
      if (error || !data) {
        navigate("/setup-profile");
        return;
      }

      if (!mounted) return;

      setProfile(data);
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  const handleDelete = async () => {
    if (!confirm("Delete your account permanently?")) return;

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    const token = (userData as any)?.session?.access_token;

    if (!user) return;

    // 1. Delete profile row
    await supabase.from("profiles").delete().eq("id", user.id);

    // 2. Call Edge Function (optional but recommended)
    const fnUrl = import.meta.env.VITE_DELETE_USER_FN;
    if (fnUrl) {
      await fetch(fnUrl, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    // 3. Log out
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!profile) return null;

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="flex items-center gap-4">
        <ProfileCard name={profile.name} size={80} />
        <div>
          <h1 className="text-2xl font-semibold">{profile.name}</h1>
          <p className="text-sm text-gray-500 font-mono">{profile.id}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        <div className="p-4 border rounded">
          <div className="text-sm text-gray-500">DOB (DDMMYY)</div>
          <div className="text-lg">{profile.dob}</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border rounded">
            <div className="text-sm text-gray-500">Height</div>
            <div className="text-lg">{profile.height} cm</div>
          </div>

          <div className="p-4 border rounded">
            <div className="text-sm text-gray-500">Weight</div>
            <div className="text-lg">{profile.weight} kg</div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/setup-profile")}
            className="px-4 py-2 rounded bg-slate-800 text-white"
          >
            Edit Profile
          </button>

          <Link to="/information" className="px-4 py-2 rounded border">
            Information
          </Link>

          <button
            onClick={handleDelete}
            className="ml-auto px-4 py-2 rounded bg-red-600 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
