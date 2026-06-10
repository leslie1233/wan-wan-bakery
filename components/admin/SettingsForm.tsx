"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  parsePayNowInput,
  parsePhoneInput,
  type SiteContactSettings,
} from "../../lib/phone";

type SettingsFormProps = {
  initialValues: SiteContactSettings;
};

export default function SettingsForm({ initialValues }: SettingsFormProps) {
  const [phoneInput, setPhoneInput] = useState(initialValues.phone);
  const [paynowInput, setPaynowInput] = useState(initialValues.paynowNumber);
  const [preview, setPreview] = useState(initialValues);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const livePreview = useMemo(() => {
    const phone = parsePhoneInput(phoneInput) ?? preview;
    const paynowNumber = parsePayNowInput(paynowInput) ?? phone.paynowNumber;

    return {
      ...phone,
      paynowNumber,
    };
  }, [phoneInput, paynowInput, preview]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: phoneInput,
        paynowNumber: paynowInput,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      setError(data.error ?? "Unable to save contact settings.");
      setLoading(false);
      return;
    }

    setPreview(data.settings);
    setPhoneInput(data.settings.phone);
    setPaynowInput(data.settings.paynowNumber);
    setSuccess("Contact settings updated across the website.");
    setLoading(false);
  }

  return (
    <form className="admin-card admin-form" onSubmit={handleSubmit}>
      <h2>Contact settings</h2>
      <p className="admin-intro">
        Update the phone, WhatsApp, and PayNow numbers shown on your website,
        footer, contact page, cart checkout, and WhatsApp order links.
      </p>

      <label>
        Singapore phone number
        <input
          value={phoneInput}
          onChange={(event) => setPhoneInput(event.target.value)}
          placeholder="93855540"
          required
        />
      </label>

      <label>
        PayNow number
        <input
          value={paynowInput}
          onChange={(event) => setPaynowInput(event.target.value)}
          placeholder="93855540"
          required
        />
      </label>

      <div className="admin-card admin-tier-card">
        <p>
          <strong>Display:</strong> {livePreview.phone}
        </p>
        <p>
          <strong>Call link:</strong> {livePreview.phoneE164}
        </p>
        <p>
          <strong>WhatsApp:</strong> {livePreview.whatsappNumber}
        </p>
        <p>
          <strong>PayNow:</strong> {livePreview.paynowNumber}
        </p>
      </div>

      {error ? <p className="admin-error">{error}</p> : null}
      {success ? <p className="admin-success">{success}</p> : null}

      <button type="submit" className="button admin-button" disabled={loading}>
        {loading ? "Saving..." : "Save contact settings"}
      </button>
    </form>
  );
}
