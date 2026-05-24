// AI Drive-Through — Sales Funnel Frontend
import React, { useState, useEffect, useRef } from "react";
import "./index.css";

/* ─── TYPES ─────────────────────────────────────────────────────── */
interface Product {
  product_id: string;
  display_name: string;
  price_model: string;
  setup_fee: number;
  monthly_fee: number;
  required_customer_fields: string[];
  fulfilment_template_id: string;
  proof_requirements: string[];
  allowed_fulfilment_lanes: string[];
}

interface LaneStatus {
  lane_name: string;
  status: string;
  lane_input: Record<string, unknown>;
  allowed_actions: string[];
  blocked_actions: string[];
}

interface Task {
  task_type: string;
  task_id: string;
  customer_ref: string;
  product_id: string;
  fulfilment_template_id: string;
  status: string;
  lanes: {
    alpha_voice_comms?: LaneStatus;
    beta_build_deploy?: LaneStatus;
    gamma_dashboard_onboarding?: LaneStatus;
  };
  required_receipts: string[];
  created_at: string;
  audit_required: boolean;
}

interface Receipt {
  receipt_id: string;
  receipt_type: string;
  timestamp: string;
  payload: Record<string, unknown>;
  cryptographic_signature: string;
}

/* ─── FALLBACK CATALOG ───────────────────────────────────────────── */
const FALLBACK_CATALOG: Record<string, Product> = {
  AI_RECEPTIONIST: {
    product_id: "AI_RECEPTIONIST",
    display_name: "AI Receptionist",
    price_model: "SETUP_PLUS_SUBSCRIPTION",
    setup_fee: 49900,
    monthly_fee: 4900,
    required_customer_fields: ["business_name", "business_phone"],
    fulfilment_template_id: "tmpl_voice_receptionist_v1",
    proof_requirements: ["voice_number_provisioned", "receptionist_prompt_loaded"],
    allowed_fulfilment_lanes: ["alpha_voice_comms", "gamma_dashboard_onboarding"],
  },
  SMART_WEBSITE: {
    product_id: "SMART_WEBSITE",
    display_name: "Smart Website",
    price_model: "SETUP_PLUS_SUBSCRIPTION",
    setup_fee: 99900,
    monthly_fee: 9900,
    required_customer_fields: ["business_name", "business_phone"],
    fulfilment_template_id: "tmpl_smart_website_v1",
    proof_requirements: ["github_repo_created", "vercel_deployment_uri"],
    allowed_fulfilment_lanes: ["beta_build_deploy", "gamma_dashboard_onboarding"],
  },
  SMART_WEBSITE_PLUS_RECEPTIONIST: {
    product_id: "SMART_WEBSITE_PLUS_RECEPTIONIST",
    display_name: "Smart Website + AI Receptionist Bundle",
    price_model: "SETUP_PLUS_SUBSCRIPTION",
    setup_fee: 129900,
    monthly_fee: 12900,
    required_customer_fields: ["business_name", "business_phone"],
    fulfilment_template_id: "tmpl_bundle_website_voice_v1",
    proof_requirements: ["github_repo_created", "vercel_deployment_uri", "voice_number_provisioned"],
    allowed_fulfilment_lanes: ["alpha_voice_comms", "beta_build_deploy", "gamma_dashboard_onboarding"],
  },
};

/* ─── HELPERS ────────────────────────────────────────────────────── */
const gbp = (pence: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(pence / 100);

const lanePillClass = (status: string) => {
  if (status === "COMPLETED") return "lane-status-pill completed";
  if (status === "PROCESSING") return "lane-status-pill processing";
  return "lane-status-pill pending";
};

/* ─── APP ────────────────────────────────────────────────────────── */
export default function App() {
  const backendUrl = import.meta.env.VITE_DRIVETHRU_API_URL || "http://localhost:3001";

  /* connection state */
  const [backendStatus, setBackendStatus] = useState<"CONNECTED" | "UNAVAILABLE" | "CHECKING">("CHECKING");

  /* catalog */
  const [catalog, setCatalog] = useState<Record<string, Product>>(FALLBACK_CATALOG);

  /* form state */
  const [selectedProductId, setSelectedProductId] = useState("SMART_WEBSITE_PLUS_RECEPTIONIST");
  const [customerEmail, setCustomerEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  /* internal proof state */
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [taskData, setTaskData] = useState<Task | null>(null);
  const [receipts, setReceipts] = useState<Receipt[]>([]);

  const formRef = useRef<HTMLDivElement>(null);

  /* ── health check ── */
  useEffect(() => {
    fetch(`${backendUrl}/health`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(() => setBackendStatus("CONNECTED"))
      .catch(() => setBackendStatus("UNAVAILABLE"));
  }, [backendUrl]);

  /* ── catalog ── */
  useEffect(() => {
    fetch(`${backendUrl}/catalog`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => setCatalog(d))
      .catch(() => { /* keep fallback */ });
  }, [backendUrl]);

  /* ── task polling ── */
  useEffect(() => {
    if (!activeTaskId) return;
    const iv = setInterval(() => {
      fetch(`${backendUrl}/tasks/${activeTaskId}`)
        .then((r) => r.json())
        .then((d) => {
          setTaskData(d);
          if (["COMPLETED", "FAILED", "FAILED_AUDIT_VIOLATION"].includes(d.status)) clearInterval(iv);
        })
        .catch(() => {});

      fetch(`${backendUrl}/receipts/task/${activeTaskId}`)
        .then((r) => r.json())
        .then((d) => setReceipts(d))
        .catch(() => {});
    }, 2000);
    return () => clearInterval(iv);
  }, [activeTaskId, backendUrl]);

  const selectedProduct = catalog[selectedProductId];

  /* ── submit ── */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (backendStatus === "UNAVAILABLE") {
      setErrorMsg("We can't process requests right now — our system is offline. Please try again shortly.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    fetch(`${backendUrl}/proof/simulate-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerPayload: {
          customer_email: customerEmail,
          business_name: businessName,
          business_phone: businessPhone,
          product_id: selectedProductId,
        },
      }),
    })
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.errors ? d.errors.join(", ") : d.error || "Something went wrong.");
        return d;
      })
      .then((d) => {
        setActiveTaskId(d.task.task_id);
        setTaskData(d.task);
        setSubmitSuccess(true);
      })
      .catch((err) => setErrorMsg(err.message))
      .finally(() => setIsSubmitting(false));
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  /* ── RENDER ── */
  return (
    <>
      {/* ─ NAV ─ */}
      <nav className="nav">
        <div className="container nav-inner">
          <div className="nav-logo">
            <div
              className={`status-dot ${backendStatus === "CONNECTED" ? "dot-green" : backendStatus === "CHECKING" ? "dot-amber" : "dot-red"}`}
            />
            <span className="gradient-text">AI Drive-Through</span>
          </div>
          <button className="btn btn-primary" style={{ padding: "0.55rem 1.2rem", fontSize: "0.9rem" }} onClick={scrollToForm}>
            Get started →
          </button>
        </div>
      </nav>

      {/* ─ HERO ─ */}
      <section className="hero">
        <div className="container">
          <div className="hero-eyebrow fade-up">
            <span>🤖</span> AI-powered local business growth
          </div>

          <h1 className="display fade-up fade-up-d1" style={{ maxWidth: "860px", margin: "0 auto 1.25rem" }}>
            Your phone is ringing.<br />
            <span className="gradient-text-warm">Nobody's answering.</span>
          </h1>

          <p className="subhead fade-up fade-up-d2" style={{ maxWidth: "600px", margin: "0 auto" }}>
            Every missed call is a missed customer. AI Drive-Through gives your business an AI receptionist, a high-converting website, and an automated lead system — up and running in days, not months.
          </p>

          <div className="hero-actions fade-up fade-up-d3">
            <button className="btn btn-primary pulse-glow" onClick={scrollToForm} style={{ padding: "1rem 2.25rem", fontSize: "1.05rem" }}>
              Recover my missed leads →
            </button>
            <button className="btn btn-ghost" onClick={scrollToForm}>
              See pricing
            </button>
          </div>
        </div>
      </section>

      {/* ─ PROBLEM STATS ─ */}
      <section className="section-sm">
        <div className="container">
          <div className="problem-strip">
            <div className="problem-item">
              <div className="problem-stat gradient-text-warm">62%</div>
              <div className="problem-label">of customers won't call back if you miss them the first time</div>
            </div>
            <div className="problem-item">
              <div className="problem-stat gradient-text-warm">£8k+</div>
              <div className="problem-label">average annual revenue lost to missed calls per local business</div>
            </div>
            <div className="problem-item">
              <div className="problem-stat gradient-text-warm">3 min</div>
              <div className="problem-label">average response window — after that, conversion drops 80%</div>
            </div>
            <div className="problem-item">
              <div className="problem-stat gradient-text">24/7</div>
              <div className="problem-label">your AI receptionist never takes a day off, never misses a call</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─ PROBLEM / SOLUTION / OUTCOME ─ */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div className="label" style={{ marginBottom: "1rem" }}>What we solve</div>
            <h2 className="headline">
              Three problems costing you money <span className="gradient-text">right now</span>
            </h2>
          </div>

          <div className="features-grid">
            {/* Problem 1 */}
            <div className="card feature-card">
              <div className="feature-icon" style={{ background: "rgba(248, 113, 113, 0.12)" }}>📵</div>
              <div>
                <div className="label" style={{ marginBottom: "0.5rem", color: "var(--red)" }}>Problem</div>
                <div className="feature-title">Missed calls = missed revenue</div>
              </div>
              <div className="feature-body">
                You're out on a job, your phone goes to voicemail. The customer calls your competitor instead.
              </div>
              <div style={{ padding: "1rem", borderRadius: "var(--radius-sm)", background: "rgba(99, 102, 241, 0.08)", border: "1px solid rgba(99, 102, 241, 0.15)" }}>
                <div className="label" style={{ marginBottom: "0.5rem", color: "var(--accent-2)" }}>Our fix</div>
                <div style={{ fontSize: "0.925rem", color: "var(--ink-muted)" }}>
                  Your AI receptionist answers every call, qualifies the lead, books appointments and sends you a summary — while you're working.
                </div>
              </div>
            </div>

            {/* Problem 2 */}
            <div className="card feature-card">
              <div className="feature-icon" style={{ background: "rgba(245, 158, 11, 0.12)" }}>💸</div>
              <div>
                <div className="label" style={{ marginBottom: "0.5rem", color: "var(--amber)" }}>Problem</div>
                <div className="feature-title">Ad spend going to a broken website</div>
              </div>
              <div className="feature-body">
                You're paying for Google or Facebook ads but your website looks outdated and doesn't convert visitors into calls or bookings.
              </div>
              <div style={{ padding: "1rem", borderRadius: "var(--radius-sm)", background: "rgba(99, 102, 241, 0.08)", border: "1px solid rgba(99, 102, 241, 0.15)" }}>
                <div className="label" style={{ marginBottom: "0.5rem", color: "var(--accent-2)" }}>Our fix</div>
                <div style={{ fontSize: "0.925rem", color: "var(--ink-muted)" }}>
                  We build you a premium AI-enhanced website designed to convert visitors into paying customers, with local SEO built in.
                </div>
              </div>
            </div>

            {/* Problem 3 */}
            <div className="card feature-card">
              <div className="feature-icon" style={{ background: "rgba(56, 189, 248, 0.12)" }}>⏳</div>
              <div>
                <div className="label" style={{ marginBottom: "0.5rem", color: "var(--accent-3)" }}>Problem</div>
                <div className="feature-title">Hours wasted on follow-ups and admin</div>
              </div>
              <div className="feature-body">
                Chasing quotes, sending reminders, replying to the same questions over and over. It kills your day.
              </div>
              <div style={{ padding: "1rem", borderRadius: "var(--radius-sm)", background: "rgba(99, 102, 241, 0.08)", border: "1px solid rgba(99, 102, 241, 0.15)" }}>
                <div className="label" style={{ marginBottom: "0.5rem", color: "var(--accent-2)" }}>Our fix</div>
                <div style={{ fontSize: "0.925rem", color: "var(--ink-muted)" }}>
                  Automated follow-up sequences, quote reminders, and FAQ handling — all running in the background while you focus on the work.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─ HOW IT WORKS ─ */}
      <section className="section" style={{ background: "rgba(99, 102, 241, 0.03)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="label" style={{ marginBottom: "1rem" }}>How it works</div>
            <h2 className="headline">You're live in <span className="gradient-text">3 simple steps</span></h2>
          </div>

          <div className="steps-list">
            <div className="step">
              <div className="step-num">1</div>
              <div className="step-body">
                <h4>Tell us about your business</h4>
                <p>Takes 2 minutes. We need your name, number, and what you do. That's it.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <div className="step-body">
                <h4>We build and configure everything</h4>
                <p>Your AI receptionist, smart website, and lead system are set up and tested — you don't touch a single line of code.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <div className="step-body">
                <h4>Watch the leads come in</h4>
                <p>Your system is live. Every call answered, every lead captured, every follow-up sent — automatically.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─ PRICING ─ */}
      <section className="section" id="pricing">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div className="label" style={{ marginBottom: "1rem" }}>Pricing</div>
            <h2 className="headline">Simple pricing. <span className="gradient-text">No surprises.</span></h2>
            <p className="subhead" style={{ maxWidth: "520px", margin: "1rem auto 0" }}>
              No long-term contracts. Cancel any time. Prices in GBP.
            </p>
          </div>

          <div className="pricing-grid">
            {/* Tier 1 — Pay per lead */}
            <div className="card pricing-card">
              <div className="pricing-name">AI Receptionist</div>
              <div>
                <div className="pricing-price">
                  {gbp(49900)} <span>setup + {gbp(4900)}/mo</span>
                </div>
              </div>
              <div className="pricing-desc">
                For trades and services who are losing leads to voicemail. Your AI answers every call, qualifies the lead, and texts you a summary.
              </div>
              <ul className="pricing-features">
                <li>24/7 AI call answering</li>
                <li>Lead qualification &amp; booking</li>
                <li>SMS summary to your phone</li>
                <li>Connects to your existing number</li>
                <li>Live within 48 hours</li>
              </ul>
              <button className="btn btn-outline-accent" onClick={scrollToForm} style={{ marginTop: "auto" }}>
                Get started →
              </button>
            </div>

            {/* Tier 2 — Bundle (featured) */}
            <div className="card pricing-card featured">
              <div className="pricing-badge">Most popular</div>
              <div className="pricing-name">Smart Website + AI Receptionist</div>
              <div>
                <div className="pricing-price">
                  {gbp(129900)} <span>setup + {gbp(12900)}/mo</span>
                </div>
              </div>
              <div className="pricing-desc">
                The complete growth engine. A high-converting website, an AI receptionist, and automated lead follow-up — all in one package.
              </div>
              <ul className="pricing-features">
                <li>Everything in AI Receptionist</li>
                <li>Premium smart website (mobile-first)</li>
                <li>Local SEO optimisation</li>
                <li>Automated follow-up sequences</li>
                <li>Lead dashboard &amp; reporting</li>
                <li>Priority onboarding support</li>
              </ul>
              <button className="btn btn-primary" onClick={scrollToForm} style={{ marginTop: "auto" }}>
                Recover my leads →
              </button>
            </div>
          </div>

          {/* Proof badges */}
          <div className="proof-strip" style={{ marginTop: "3rem" }}>
            <div className="proof-badge">✅ No long-term contracts</div>
            <div className="proof-badge">🔒 No hidden fees</div>
            <div className="proof-badge">⚡ Live within 48–72 hours</div>
            <div className="proof-badge">🇬🇧 UK-based support</div>
            <div className="proof-badge">📊 Full audit trail</div>
          </div>
        </div>
      </section>

      {/* ─ LEAD CAPTURE FORM ─ */}
      <section className="section" id="get-started" ref={formRef}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div className="label" style={{ marginBottom: "1rem" }}>Get started</div>
            <h2 className="headline">
              Stop losing leads. <span className="gradient-text">Start today.</span>
            </h2>
            <p className="subhead" style={{ maxWidth: "520px", margin: "1rem auto 0" }}>
              Fill in your details and we'll set everything up for you. No technical knowledge needed.
            </p>
          </div>

          <div className="lead-form-wrap">
            <div className="card" style={{ padding: "2.5rem" }}>
              {submitSuccess ? (
                <div style={{ textAlign: "center", padding: "2rem 0" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
                  <h3 className="headline" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
                    You're in the queue!
                  </h3>
                  <p className="subhead" style={{ maxWidth: "400px", margin: "0 auto 1.5rem" }}>
                    We've received your details. Our team will be in touch within 24 hours to get everything set up.
                  </p>
                  <button
                    className="btn btn-ghost"
                    onClick={() => { setSubmitSuccess(false); setCustomerEmail(""); setBusinessName(""); setBusinessPhone(""); setErrorMsg(null); }}
                  >
                    Submit another enquiry
                  </button>
                </div>
              ) : (
                <form className="lead-form" onSubmit={handleSubmit}>
                  {backendStatus === "UNAVAILABLE" && (
                    <div className="alert alert-warn">
                      ⚠️ Our booking system is temporarily offline — please try again shortly or contact us directly.
                    </div>
                  )}

                  {errorMsg && (
                    <div className="alert alert-error">
                      ⛔ {errorMsg}
                    </div>
                  )}

                  <div className="field-group">
                    <label className="field-label" htmlFor="select-product">What do you need?</label>
                    <select
                      id="select-product"
                      className="field-input"
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                    >
                      {Object.values(catalog).map((p) => (
                        <option key={p.product_id} value={p.product_id}>
                          {p.display_name} — from {gbp(p.setup_fee)} setup
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="field-group">
                    <label className="field-label" htmlFor="input-business-name">Business name</label>
                    <input
                      id="input-business-name"
                      type="text"
                      required
                      className="field-input"
                      placeholder="e.g. Newton's Plumbing Ltd"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                    />
                  </div>

                  <div className="field-group">
                    <label className="field-label" htmlFor="input-phone">Your business phone number</label>
                    <input
                      id="input-phone"
                      type="tel"
                      required
                      className="field-input"
                      placeholder="+44 7700 900077"
                      value={businessPhone}
                      onChange={(e) => setBusinessPhone(e.target.value)}
                    />
                  </div>

                  <div className="field-group">
                    <label className="field-label" htmlFor="input-email">Email address</label>
                    <input
                      id="input-email"
                      type="email"
                      required
                      className="field-input"
                      placeholder="you@yourbusiness.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                    />
                  </div>

                  {selectedProduct && (
                    <div style={{ padding: "1rem 1.25rem", borderRadius: "var(--radius-sm)", background: "rgba(99, 102, 241, 0.08)", border: "1px solid rgba(99, 102, 241, 0.15)", fontSize: "0.875rem", color: "var(--ink-muted)" }}>
                      <strong style={{ color: "var(--ink)", display: "block", marginBottom: "0.25rem" }}>
                        {selectedProduct.display_name}
                      </strong>
                      <span style={{ color: "var(--accent-2)", fontWeight: 700 }}>
                        {gbp(selectedProduct.setup_fee)} setup
                        {selectedProduct.monthly_fee > 0 && ` + ${gbp(selectedProduct.monthly_fee)}/mo`}
                      </span>
                    </div>
                  )}

                  <button
                    id="btn-get-started"
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting || backendStatus === "UNAVAILABLE"}
                    style={{ width: "100%", padding: "1rem", fontSize: "1.05rem", marginTop: "0.5rem" }}
                  >
                    {isSubmitting ? "Submitting…" : "Claim my spot →"}
                  </button>

                  <p style={{ textAlign: "center", fontSize: "0.8rem", color: "var(--ink-faint)", marginTop: "0.25rem" }}>
                    No payment taken now. Our team will contact you within 24 hours.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─ INTERNAL PROOF (collapsed) ─ */}
      <section style={{ padding: "0 0 4rem" }}>
        <div className="container">
          <details className="proof-section">
            <summary className="proof-toggle">
              &nbsp;Internal proof view — for AG audit only
            </summary>

            <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Connection status */}
              <div className="card" style={{ padding: "1.25rem 1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div className={`status-dot ${backendStatus === "CONNECTED" ? "dot-green" : backendStatus === "CHECKING" ? "dot-amber" : "dot-red"}`} />
                  <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>Backend:</span>
                  <span style={{ fontSize: "0.875rem", color: "var(--ink-muted)" }}>
                    {backendStatus === "CONNECTED"
                      ? `Connected — ${backendUrl}`
                      : backendStatus === "CHECKING"
                      ? "Checking…"
                      : `Unavailable — ${backendUrl}`}
                  </span>
                </div>
              </div>

              {/* Task data */}
              {taskData ? (
                <div className="card" style={{ padding: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Task: {taskData.task_id}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--ink-faint)" }}>
                        Created: {new Date(taskData.created_at).toLocaleString()}
                      </div>
                    </div>
                    <span
                      className="lane-status-pill"
                      style={{
                        padding: "0.4rem 1rem",
                        borderRadius: "999px",
                        background:
                          taskData.status === "COMPLETED" ? "rgba(16,185,129,0.15)" :
                          taskData.status === "PROCESSING" ? "rgba(245,158,11,0.15)" :
                          "rgba(99,102,241,0.12)",
                        color:
                          taskData.status === "COMPLETED" ? "var(--green)" :
                          taskData.status === "PROCESSING" ? "var(--amber)" :
                          "var(--accent-2)",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                      }}
                    >
                      {taskData.status}
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {Object.values(taskData.lanes).map((lane: LaneStatus) => (
                      <div key={lane.lane_name} className="lane-row">
                        <div>
                          <div className="lane-name">{lane.lane_name}</div>
                          <div style={{ fontSize: "0.8rem", color: "var(--ink-faint)", marginTop: "0.25rem" }}>
                            Allowed: {lane.allowed_actions.join(", ")}
                          </div>
                        </div>
                        <span className={lanePillClass(lane.status)}>{lane.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: "0.875rem", color: "var(--ink-faint)" }}>
                  No task dispatched yet. Submit the form above to create a simulation task.
                </div>
              )}

              {/* Receipts */}
              {receipts.length > 0 && (
                <div className="card" style={{ padding: "1.5rem" }}>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "1rem" }}>Receipt logs ({receipts.length})</div>
                  <div className="receipt-panel">
                    {receipts.map((rcpt) => (
                      <details key={rcpt.receipt_id} className="receipt-item">
                        <summary className="receipt-summary">
                          {rcpt.receipt_type} — {rcpt.receipt_id}
                        </summary>
                        <div className="receipt-body">
                          <pre className="receipt-pre">{JSON.stringify(rcpt.payload, null, 2)}</pre>
                          <div style={{ marginTop: "0.75rem", fontFamily: "monospace", fontSize: "0.75rem", color: "var(--accent)" }}>
                            Sig: {rcpt.cryptographic_signature}
                          </div>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              )}

              {/* AG audit panel */}
              {taskData && (
                <div className="card" style={{ padding: "1.5rem" }}>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "1rem" }}>AG Audit verification</div>
                  {taskData.status === "COMPLETED" ? (
                    <div className="alert alert-success">✅ PASSED — Zero live credential leaks. Environment isolation confirmed.</div>
                  ) : taskData.status === "FAILED_AUDIT_VIOLATION" ? (
                    <div className="alert alert-error">⛔ FAILED — Blocked live-environment action caught in processing loop.</div>
                  ) : (
                    <div className="alert alert-warn">⏳ AWAITING — Processing lanes before audit compilation.</div>
                  )}
                </div>
              )}
            </div>
          </details>
        </div>
      </section>

      {/* ─ FOOTER ─ */}
      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} AI Drive-Through by Entreprenuity. All rights reserved.</p>
          <p style={{ marginTop: "0.5rem" }}>
            AI-powered growth tools for local businesses.&nbsp;
            <span style={{ color: "var(--accent)" }}>Trusted. Tested. Live in days.</span>
          </p>
        </div>
      </footer>
    </>
  );
}
