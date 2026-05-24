import React, { useState, useEffect } from "react";

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
  lane_input: any;
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
  payload: any;
  cryptographic_signature: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<"landing" | "checkout" | "status">("landing");
  const [catalog, setCatalog] = useState<Record<string, Product>>({});
  const [selectedProductId, setSelectedProductId] = useState<string>("SMART_WEBSITE_PLUS_RECEPTIONIST");
  const [customerEmail, setCustomerEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [taskData, setTaskData] = useState<Task | null>(null);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [backendUrl] = useState("http://localhost:3001");

  // Load catalog
  useEffect(() => {
    fetch(`${backendUrl}/catalog`)
      .then((res) => {
        if (!res.ok) throw new Error("Catalog load failed");
        return res.json();
      })
      .then((data) => setCatalog(data))
      .catch((err) => {
        console.error(err);
        // Fallback mock catalog if API is offline
        setCatalog({
          AI_RECEPTIONIST: {
            product_id: "AI_RECEPTIONIST",
            display_name: "AI Receptionist",
            price_model: "SETUP_PLUS_SUBSCRIPTION",
            setup_fee: 49900,
            monthly_fee: 4900,
            required_customer_fields: ["business_name", "business_phone"],
            fulfilment_template_id: "tmpl_voice_receptionist_v1",
            proof_requirements: ["voice_number_provisioned", "receptionist_prompt_loaded"],
            allowed_fulfilment_lanes: ["alpha_voice_comms", "gamma_dashboard_onboarding"]
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
            allowed_fulfilment_lanes: ["beta_build_deploy", "gamma_dashboard_onboarding"]
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
            allowed_fulfilment_lanes: ["alpha_voice_comms", "beta_build_deploy", "gamma_dashboard_onboarding"]
          }
        });
      });
  }, []);

  // Poll task status
  useEffect(() => {
    if (!activeTaskId) return;
    const interval = setInterval(() => {
      fetch(`${backendUrl}/tasks/${activeTaskId}`)
        .then((res) => res.json())
        .then((data) => {
          setTaskData(data);
          if (data.status === "COMPLETED" || data.status === "FAILED" || data.status === "FAILED_AUDIT_VIOLATION") {
            clearInterval(interval);
          }
        })
        .catch(console.error);

      fetch(`${backendUrl}/receipts/task/${activeTaskId}`)
        .then((res) => res.json())
        .then((data) => setReceipts(data))
        .catch(console.error);
    }, 2000);

    return () => clearInterval(interval);
  }, [activeTaskId]);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const payload = {
      customerPayload: {
        customer_email: customerEmail,
        business_name: businessName,
        business_phone: businessPhone,
        product_id: selectedProductId
      }
    };

    fetch(`${backendUrl}/proof/simulate-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.errors ? data.errors.join(", ") : data.error || "Simulation failed");
        }
        return data;
      })
      .then((data) => {
        setActiveTaskId(data.task.task_id);
        setTaskData(data.task);
        setActiveTab("status");
      })
      .catch((err) => {
        setErrorMsg(err.message);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const selectedProduct = catalog[selectedProductId];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      {/* Navigation bar */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#6366f1" }}></div>
          <span style={{ fontSize: "1.25rem", fontWeight: "700", letterSpacing: "-0.025em" }} className="gradient-text">
            AI Drive-Through
          </span>
        </div>
        <nav style={{ display: "flex", gap: "1.5rem" }}>
          <button
            onClick={() => setActiveTab("landing")}
            style={{
              background: "none",
              border: "none",
              color: activeTab === "landing" ? "#6366f1" : "#94a3b8",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Catalog
          </button>
          <button
            onClick={() => setActiveTab("checkout")}
            style={{
              background: "none",
              border: "none",
              color: activeTab === "checkout" ? "#6366f1" : "#94a3b8",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Simulate checkout
          </button>
          {activeTaskId && (
            <button
              onClick={() => setActiveTab("status")}
              style={{
                background: "none",
                border: "none",
                color: activeTab === "status" ? "#6366f1" : "#94a3b8",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              Fulfillment status
            </button>
          )}
        </nav>
      </header>

      {/* Main sections */}
      {activeTab === "landing" && (
        <section>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h1 style={{ fontSize: "3rem", fontWeight: "800", marginBottom: "1rem" }}>
              Accelerate local setups with <span className="gradient-text">Smart Builders</span>
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "1.125rem", maxWidth: "600px", margin: "0 auto" }}>
              Provision communications, configure websites, and onboard databases in seconds.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
            {Object.values(catalog).map((prod) => (
              <div key={prod.product_id} className="glass-panel" style={{ padding: "2rem", display: "flex", flexDirection: "column", justifyContent: "between", transition: "border-color 0.2s" }}>
                <div>
                  <h3 style={{ fontSize: "1.5rem", fontWeight: "700", marginTop: 0, marginBottom: "0.5rem" }}>
                    {prod.display_name}
                  </h3>
                  <div style={{ fontSize: "1.25rem", fontWeight: "600", color: "#818cf8", marginBottom: "1.5rem" }}>
                    ${(prod.setup_fee / 100).toFixed(2)} setup fee
                    {prod.monthly_fee > 0 && ` + $${(prod.monthly_fee / 100).toFixed(2)}/mo`}
                  </div>
                  <ul style={{ paddingLeft: "1.25rem", color: "#94a3b8", fontSize: "0.95rem", marginBottom: "2rem" }}>
                    <li>Fulfilment template: <code>{prod.fulfilment_template_id}</code></li>
                    <li>Lanes: {prod.allowed_fulfilment_lanes.join(", ")}</li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    setSelectedProductId(prod.product_id);
                    setActiveTab("checkout");
                  }}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    background: "#4f46e5",
                    color: "#fff",
                    border: "none",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Configure setup
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === "checkout" && (
        <section style={{ maxWidth: "600px", margin: "0 auto" }} className="glass-panel">
          <div style={{ padding: "2.5rem" }}>
            <h2 style={{ fontSize: "1.75rem", fontWeight: "700", marginTop: 0, marginBottom: "1.5rem" }}>
              Configure simulated order
            </h2>
            {errorMsg && (
              <div style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "8px", padding: "1rem", color: "#f87171", marginBottom: "1.5rem" }}>
                {errorMsg}
              </div>
            )}
            <form onSubmit={handleCheckoutSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", color: "#94a3b8", marginBottom: "0.375rem" }}>
                  Product
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    background: "#1f2937",
                    border: "1px solid #374151",
                    color: "#f8fafc"
                  }}
                >
                  {Object.values(catalog).map((prod) => (
                    <option key={prod.product_id} value={prod.product_id}>
                      {prod.display_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", color: "#94a3b8", marginBottom: "0.375rem" }}>
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@business.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    background: "#1f2937",
                    border: "1px solid #374151",
                    color: "#f8fafc"
                  }}
                />
              </div>

              {selectedProduct?.required_customer_fields.includes("business_name") && (
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", color: "#94a3b8", marginBottom: "0.375rem" }}>
                    Business name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder=" Newton Burgers Ltd"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      background: "#1f2937",
                      border: "1px solid #374151",
                      color: "#f8fafc"
                    }}
                  />
                </div>
              )}

              {selectedProduct?.required_customer_fields.includes("business_phone") && (
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", color: "#94a3b8", marginBottom: "0.375rem" }}>
                    Business phone
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+447700900077"
                    value={businessPhone}
                    onChange={(e) => setBusinessPhone(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      background: "#1f2937",
                      border: "1px solid #374151",
                      color: "#f8fafc"
                    }}
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  padding: "0.875rem",
                  borderRadius: "8px",
                  background: "#4f46e5",
                  color: "#fff",
                  border: "none",
                  fontWeight: "700",
                  cursor: "pointer",
                  marginTop: "1rem"
                }}
              >
                {isSubmitting ? "Dispatching..." : "Simulate payment webhook"}
              </button>
            </form>
          </div>
        </section>
      )}

      {activeTab === "status" && taskData && (
        <section>
          <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: "2rem" }}>
            <div>
              <div className="glass-panel" style={{ padding: "2rem", marginBottom: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                  <div>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "700", margin: 0 }}>
                      Task: {taskData.task_id}
                    </h2>
                    <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
                      Created at: {new Date(taskData.created_at).toLocaleString()}
                    </span>
                  </div>
                  <span
                    className="status-active"
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "9999px",
                      background:
                        taskData.status === "COMPLETED"
                          ? "#065f46"
                          : taskData.status === "PROCESSING"
                          ? "#854d0e"
                          : "#1f2937",
                      color: "#f8fafc",
                      fontSize: "0.875rem",
                      fontWeight: "700"
                    }}
                  >
                    {taskData.status}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  {Object.values(taskData.lanes).map((lane: any) => (
                    <div key={lane.lane_name} style={{ borderLeft: "4px solid #4f46e5", paddingLeft: "1.5rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                        <span style={{ fontWeight: "700" }}>{lane.lane_name}</span>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: "700",
                            color: lane.status === "COMPLETED" ? "#10b981" : "#fbbf24"
                          }}
                        >
                          {lane.status}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
                        <strong>Input parameters:</strong>
                        <pre style={{ margin: "0.25rem 0", background: "#0f172a", padding: "0.5rem", borderRadius: "4px" }}>
                          {JSON.stringify(lane.lane_input, null, 2)}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel" style={{ padding: "2rem" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginTop: 0, marginBottom: "1rem" }}>
                  Receipt logs
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {receipts.map((rcpt) => (
                    <details key={rcpt.receipt_id} style={{ background: "#0f172a", padding: "1rem", borderRadius: "8px" }}>
                      <summary style={{ cursor: "pointer", fontWeight: "600" }}>
                        {rcpt.receipt_type} ({rcpt.receipt_id})
                      </summary>
                      <div style={{ marginTop: "1rem", fontSize: "0.85rem" }}>
                        <pre>{JSON.stringify(rcpt.payload, null, 2)}</pre>
                        <hr style={{ borderColor: "#1e293b", margin: "1rem 0" }} />
                        <span style={{ fontFamily: "monospace", color: "#6366f1" }}>
                          Signature: {rcpt.cryptographic_signature}
                        </span>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="glass-panel" style={{ padding: "2rem" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginTop: 0, marginBottom: "1rem" }}>
                  AG Audit verification
                </h3>
                {taskData.status === "COMPLETED" ? (
                  <div style={{ color: "#10b981" }}>
                    <div style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "0.5rem" }}>PASSED</div>
                    <p style={{ fontSize: "0.9rem", color: "#94a3b8" }}>
                      Verification checks complete. Zero live credential leaks detected. Environments matches isolation settings.
                    </p>
                  </div>
                ) : taskData.status === "FAILED_AUDIT_VIOLATION" ? (
                  <div style={{ color: "#ef4444" }}>
                    <div style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "0.5rem" }}>FAILED</div>
                    <p style={{ fontSize: "0.9rem", color: "#94a3b8" }}>
                      Audit failure: Blocked live environments action caught inside processing loop.
                    </p>
                  </div>
                ) : (
                  <div style={{ color: "#fbbf24" }}>
                    <div style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "0.5rem" }}>AWAITING COMPILATION</div>
                    <p style={{ fontSize: "0.9rem", color: "#94a3b8" }}>
                      Processing lanes before compilation checks.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
