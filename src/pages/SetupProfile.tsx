import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../integrations/supabase/client";

export default function SetupProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isExisting, setIsExisting] = useState(false);

  const [name, setName] = useState("");
  const [dob, setDob] = useState(""); // DDMMYY
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) {
        navigate("/login");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!mounted) return;

      if (profile && !error) {
        setIsExisting(true);
        setName(profile.name || "");
        setDob(profile.dob || "");
        setHeight(profile.height ? String(profile.height) : "");
        setWeight(profile.weight ? String(profile.weight) : "");
      }

      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  async function handleSave() {
    if (!name || name.trim().length < 2)
      return alert("Enter a valid name (min 2 chars).");

    if (!/^\d{6}$/.test(dob))
      return alert("DOB must be exactly 6 digits in DDMMYY format.");

    const h = Number(height);
    const w = Number(weight);

    if (Number.isNaN(h) || h < 50 || h > 250)
      return alert("Height must be between 50cm and 250cm.");

    if (Number.isNaN(w) || w < 20 || w > 300)
      return alert("Weight must be between 20kg and 300kg.");

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return alert("Not authenticated.");

    const payload = {
      id: user.id,
      name: name.trim(),
      dob,
      height: h,
      weight: w,
    };

    const { error } = await supabase
      .from("profiles")
      .upsert(payload, { onConflict: "id" });

    if (error) {
      console.error("Profile save error:", error);
      return alert("Failed to save profile.");
    }

    navigate("/profile");
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">
        {isExisting ? "Edit Profile" : "Setup Profile"}
      </h1>

      <div className="space-y-4">
        <label className="block">
          <span className="text-sm text-slate-600">Full Name</span>
          <input
            className="w-full border px-3 py-2 rounded-md mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
          />
        </label>

        <label className="block">
          <span className="text-sm text-slate-600">DOB (DDMMYY)</span>
          <input
            className="w-full border px-3 py-2 rounded-md mt-1"
            value={dob}
            onChange={(e) =>
              setDob(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            maxLength={6}
            placeholder="DDMMYY"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-slate-600">Height (cm)</span>
            <input
              className="w-full border px-3 py-2 rounded-md mt-1"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="170"
            />
          </label>

          <label className="block">
            <span className="text-sm text-slate-600">Weight (kg)</span>
            <input
              className="w-full border px-3 py-2 rounded-md mt-1"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="60"
            />
          </label>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-emerald-600 text-white py-2 rounded-md mt-4"
        >
          {isExisting ? "Update Profile" : "Save Profile"}
        </button>
      </div>
    </div>
  );
}