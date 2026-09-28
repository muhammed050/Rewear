"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { styles } from "@/lib/config";
import { Notice, request } from "@/components/ui";
export default function Page() {
  const [chosen, setChosen] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const router = useRouter();
  async function save() {
    try {
      await request("/api/profile", "PATCH", {
        style_preferences: chosen,
        goals,
        onboarding_completed: true,
      });
      router.push(
        sessionStorage.getItem("rewear_analysis") ? "/recreate" : "/closet",
      );
    } catch (e) {
      setMessage((e as Error).message);
    }
  }
  return (
    <>
      <span className="eyebrow">A QUICK HELLO</span>
      <h1>
        Make yourself
        <br />
        <em>at home.</em>
      </h1>
      <p className="page-intro">
        A few favorites help make your closet feel more like you. You can change
        these anytime.
      </p>
      <div className="panel">
        <h3>What styles do you love?</h3>
        <div className="toolbar">
          {styles.map((s) => (
            <button
              key={s}
              className={`chip ${chosen.includes(s) ? "active" : ""}`}
              onClick={() =>
                setChosen(
                  chosen.includes(s)
                    ? chosen.filter((t) => t !== s)
                    : [...chosen, s],
                )
              }
            >
              {s}
            </button>
          ))}
        </div>
        <h3>What brings you here?</h3>
        <div className="toolbar">
          {[
            "Recreate saved outfits",
            "Use more of my closet",
            "Stop buying duplicates",
            "Pack for trips",
            "Build better outfits",
          ].map((g) => (
            <button
              key={g}
              className={`chip ${goals.includes(g) ? "active" : ""}`}
              onClick={() =>
                setGoals(
                  goals.includes(g)
                    ? goals.filter((t) => t !== g)
                    : [...goals, g],
                )
              }
            >
              {g}
            </button>
          ))}
        </div>
        <button className="button" onClick={save}>
          Let’s build your closet →
        </button>{" "}
        <button className="text-link" onClick={() => router.push("/closet")}>
          Skip for now
        </button>
        <Notice message={message} />
      </div>
    </>
  );
}
