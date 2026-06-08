"use client";

import { FormEvent, useState } from "react";
import type { SiteContactSettings } from "../../lib/phone";

type SettingsFormProps = {
  initialValues: SiteContactSettings;
};

export default function SettingsForm({ initialValues }: SettingsFormProps) {
  const [phoneInput, setPhoneInput] = useState(initialValues.phone);
  const [preview, setPreview] = useState(initialValues);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: phoneInput }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      setError(data.error ?? "Unable to save phone number.");
      setLoading(false);
      return;
    }

    setPreview(data.settings);
    setPhoneInput(data.settings.phone);
    setSuccess("Phone number updated across the website.");
    setLoading(false);
  }

  return (
    <form className="admin-card admin-form" onSubmit={handleSubmit}>
      <h2>Contact phone</h2>
      <p className="admin-intro">
        Update the phone and WhatsApp number shown on your website, footer,
        contact page, and WhatsApp order links.
      </p>

      <label>
        Singapore phone number
        <input
          value={phoneInput}
          onChange={(event) => setPhoneInput(event.target.value)}
          placeholder="81571573"
          required
        />
      </label>

      <div className="admin-card admin-tier-card">
        <p>
          <strong>Display:</strong> {preview.phone}
        </p>
        <p>
          <strong>Call link:</strong> {preview.phoneE164}
        </p>
        <p>
          <strong>WhatsApp:</strong> {preview.whatsappNumber}
        </p>
      </div>

      {error ? <p className="admin-error">{error}</p> : null}
      {success ? <p className="admin-success">{success}</p> : null}

      <button type="submit" className="button admin-button" disabled={loading}>
        {loading ? "Saving..." : "Save phone number"}
      </button>
    </form>
  );
}
