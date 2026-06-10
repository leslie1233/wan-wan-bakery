"use client";

import { useEffect, useState } from "react";

type RewardsSettings = {
  active: boolean;
  ownerEmail: string;
  fromEmail: string;
  firstOrderDiscountPercent: number;
  referralDiscountPercent: number;
  referrerPointsReward: number;
  pointsPerDollar: number;
  pointsRedemptionRate: number;
  pointsRedemptionValueCents: number;
};

export default function RewardsForm() {
  const [settings, setSettings] = useState<RewardsSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/rewards")
      .then((response) => response.json())
      .then((data) => setSettings(data.settings))
      .catch(() => setSettings(null));
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!settings) {
      return;
    }

    setSaving(true);
    setMessage("");

    const response = await fetch("/api/admin/rewards", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    setSaving(false);

    if (response.ok) {
      setMessage("Rewards settings saved.");
    } else {
      setMessage("Failed to save settings.");
    }
  }

  if (!settings) {
    return <p>Loading rewards settings…</p>;
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <label>
        <input
          type="checkbox"
          checked={settings.active}
          onChange={(event) =>
            setSettings({ ...settings, active: event.target.checked })
          }
        />{" "}
        Rewards program active
      </label>

      <label>
        Owner notification email
        <input
          type="email"
          value={settings.ownerEmail}
          onChange={(event) =>
            setSettings({ ...settings, ownerEmail: event.target.value })
          }
        />
      </label>

      <label>
        From email (Resend)
        <input
          type="text"
          value={settings.fromEmail}
          onChange={(event) =>
            setSettings({ ...settings, fromEmail: event.target.value })
          }
        />
      </label>

      <label>
        First order discount (%)
        <input
          type="number"
          min="0"
          max="100"
          value={settings.firstOrderDiscountPercent}
          onChange={(event) =>
            setSettings({
              ...settings,
              firstOrderDiscountPercent: Number(event.target.value),
            })
          }
        />
      </label>

      <label>
        Referral discount for new customer (%)
        <input
          type="number"
          min="0"
          max="100"
          value={settings.referralDiscountPercent}
          onChange={(event) =>
            setSettings({
              ...settings,
              referralDiscountPercent: Number(event.target.value),
            })
          }
        />
      </label>

      <label>
        Referrer bonus points
        <input
          type="number"
          min="0"
          value={settings.referrerPointsReward}
          onChange={(event) =>
            setSettings({
              ...settings,
              referrerPointsReward: Number(event.target.value),
            })
          }
        />
      </label>

      <label>
        Points earned per $1 spent
        <input
          type="number"
          min="0"
          value={settings.pointsPerDollar}
          onChange={(event) =>
            setSettings({
              ...settings,
              pointsPerDollar: Number(event.target.value),
            })
          }
        />
      </label>

      <label>
        Points needed for redemption block
        <input
          type="number"
          min="1"
          value={settings.pointsRedemptionRate}
          onChange={(event) =>
            setSettings({
              ...settings,
              pointsRedemptionRate: Number(event.target.value),
            })
          }
        />
      </label>

      <label>
        Redemption block value (cents, e.g. 500 = $5)
        <input
          type="number"
          min="0"
          value={settings.pointsRedemptionValueCents}
          onChange={(event) =>
            setSettings({
              ...settings,
              pointsRedemptionValueCents: Number(event.target.value),
            })
          }
        />
      </label>

      <div className="cta">
        <button type="submit" className="button" disabled={saving}>
          {saving ? "Saving…" : "Save rewards settings"}
        </button>
      </div>

      {message ? <p className="admin-message">{message}</p> : null}
    </form>
  );
}
