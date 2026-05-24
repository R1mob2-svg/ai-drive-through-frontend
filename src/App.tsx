import { useState, useEffect } from "react";
import DTNavbar from "@/components/dt/DTNavbar";
import DTHero from "@/components/dt/DTHero";
import DTProofStrip from "@/components/dt/DTProofStrip";
import DTProducts from "@/components/dt/DTProducts";
import DTHowItWorks from "@/components/dt/DTHowItWorks";
import DTPricing from "@/components/dt/DTPricing";
import DTFAQ from "@/components/dt/DTFAQ";
import DTLeadForm from "@/components/dt/DTLeadForm";
import DTInternalProof from "@/components/dt/DTInternalProof";
import DTFooter from "@/components/dt/DTFooter";

const backendUrl =
  import.meta.env.VITE_DRIVETHRU_API_URL || "http://localhost:3001";

interface Receipt {
  receipt_id?: string;
  status?: string;
  [key: string]: unknown;
}

const App = () => {
  const [backendStatus, setBackendStatus] = useState<
    "CONNECTED" | "UNAVAILABLE" | "CHECKING"
  >("CHECKING");
  const [taskData, setTaskData] = useState<unknown>(null);
  const [receipts, setReceipts] = useState<Receipt[]>([]);

  // Health check on load
  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(`${backendUrl}/health`, {
          signal: AbortSignal.timeout(5000),
        });
        if (res.ok) {
          setBackendStatus("CONNECTED");
        } else {
          setBackendStatus("UNAVAILABLE");
        }
      } catch {
        setBackendStatus("UNAVAILABLE");
      }
    };
    check();
  }, []);

  const handleLeadSuccess = (data: unknown) => {
    setTaskData(data);
    if (data && typeof data === "object") {
      const d = data as Record<string, unknown>;
      if (Array.isArray(d.receipts)) {
        setReceipts((prev) => [...prev, ...(d.receipts as Receipt[])]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DTNavbar />
      <main>
        <DTHero />
        <DTProofStrip />
        <DTProducts />
        <DTHowItWorks />
        <DTPricing />
        <DTFAQ />
        <DTLeadForm
          backendUrl={backendUrl}
          onSuccess={handleLeadSuccess}
        />
      </main>
      <DTFooter />
      {/* Internal proof panel — AG audit only, not buyer-facing */}
      <DTInternalProof
        backendUrl={backendUrl}
        backendStatus={backendStatus}
        taskData={taskData}
        receipts={receipts}
      />
    </div>
  );
};

export default App;
