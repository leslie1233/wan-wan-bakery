"use client";

import { useState } from "react";
import { useDictionary } from "./LocaleProvider";

type CustomerProfile = {
  id: string;
  email: string;
  name: string;
  phone: string;
  referralCode: string;
  loyaltyPoints: number;
  orderCount: number;
};

type RewardsInfo = {
  firstOrderDiscountPercent: number;
  referralDiscountPercent: number;
  pointsRedemptionRate: number;
  pointsRedemptionValueCents: number;
  referrerPointsReward: number;
  pointsPerDollar: number;
};

type AccountPanelProps = {
  initialCustomer: CustomerProfile | null;
  initialRewards: RewardsInfo | null;
};

export default function AccountPanel({
  initialCustomer,
  initialRewards,
}: AccountPanelProps) {
  const dict = useDictionary();
  const [customer, setCustomer] = useState(initialCustomer);
  const [rewards] = useState(initialRewards);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    referralCode: "",
  });

  async function refreshProfile() {
    const response = await fetch("/api/customer/me");
    const data = await response.json();
    setCustomer(data.customer);
  }

  async function handleAuthSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = mode === "login" ? "/api/customer/login" : "/api/customer/register";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? dict.account.errorGeneric);
      return;
    }

    await refreshProfile();
  }

  async function handleLogout() {
    await fetch("/api/customer/logout", { method: "POST" });
    setCustomer(null);
  }

  async function copyReferralCode() {
    if (!customer?.referralCode) {
      return;
    }

    try {
      await navigator.clipboard.writeText(customer.referralCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  if (customer) {
    return (
      <div className="account-panel">
        <h2>{dict.account.welcome.replace("{{name}}", customer.name)}</h2>
        <p>{dict.account.memberIntro}</p>

        <dl className="account-stats">
          <div>
            <dt>{dict.account.loyaltyPoints}</dt>
            <dd>{customer.loyaltyPoints}</dd>
          </div>
          <div>
            <dt>{dict.account.ordersPlaced}</dt>
            <dd>{customer.orderCount}</dd>
          </div>
        </dl>

        <div className="referral-box">
          <h3>{dict.account.referralTitle}</h3>
          <p>{dict.account.referralIntro}</p>
          <p className="referral-code">
            <strong>{customer.referralCode}</strong>
          </p>
          <p className="referral-note">
            {dict.account.referralReward
              .replace("{{percent}}", String(rewards?.referralDiscountPercent ?? 10))
              .replace("{{points}}", String(rewards?.referrerPointsReward ?? 500))}
          </p>
          <button type="button" className="button secondary" onClick={copyReferralCode}>
            {copied ? dict.account.referralCopied : dict.account.copyReferral}
          </button>
        </div>

        {customer.orderCount === 0 && rewards ? (
          <p className="account-benefit">
            {dict.account.firstOrderBenefit.replace(
              "{{percent}}",
              String(rewards.firstOrderDiscountPercent)
            )}
          </p>
        ) : null}

        <div className="cta">
          <button type="button" className="button secondary" onClick={handleLogout}>
            {dict.account.signOut}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="account-panel">
      <h2>{dict.account.title}</h2>
      <p>{dict.account.intro}</p>

      <div className="account-tabs">
        <button
          type="button"
          className={mode === "login" ? "button" : "button secondary"}
          onClick={() => setMode("login")}
        >
          {dict.account.signIn}
        </button>
        <button
          type="button"
          className={mode === "register" ? "button" : "button secondary"}
          onClick={() => setMode("register")}
        >
          {dict.account.register}
        </button>
      </div>

      <form className="account-form" onSubmit={handleAuthSubmit}>
        {mode === "register" ? (
          <>
            <label>
              {dict.account.name}
              <input
                type="text"
                required
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
            </label>
            <label>
              {dict.account.phone}
              <input
                type="tel"
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
              />
            </label>
            <label>
              {dict.account.referralCodeOptional}
              <input
                type="text"
                value={form.referralCode}
                onChange={(event) =>
                  setForm({ ...form, referralCode: event.target.value.toUpperCase() })
                }
              />
            </label>
          </>
        ) : null}

        <label>
          {dict.account.email}
          <input
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </label>
        <label>
          {dict.account.password}
          <input
            type="password"
            required
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
        </label>

        {error ? <p className="form-error">{error}</p> : null}

        <div className="cta">
          <button type="submit" className="button" disabled={loading}>
            {loading
              ? dict.account.loading
              : mode === "login"
                ? dict.account.signIn
                : dict.account.createAccount}
          </button>
        </div>
      </form>
    </div>
  );
}
