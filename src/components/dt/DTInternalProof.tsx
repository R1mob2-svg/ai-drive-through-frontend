interface Receipt {
  receipt_id?: string;
  status?: string;
  [key: string]: unknown;
}

interface DTInternalProofProps {
  backendUrl: string;
  backendStatus: "CONNECTED" | "UNAVAILABLE" | "CHECKING";
  taskData: unknown;
  receipts: Receipt[];
}

const DTInternalProof = ({
  backendUrl,
  backendStatus,
  taskData,
  receipts,
}: DTInternalProofProps) => {
  const statusColor =
    backendStatus === "CONNECTED"
      ? "bg-green-500"
      : backendStatus === "UNAVAILABLE"
      ? "bg-red-500"
      : "bg-yellow-500";

  const auditVerdict = (() => {
    if (backendStatus === "CONNECTED" && taskData) return "PASSED";
    if (backendStatus === "UNAVAILABLE") return "AWAITING";
    return "AWAITING";
  })();

  return (
    <div className="border-t border-border py-4 px-4 sm:px-6">
      <div className="container mx-auto">
        <details className="text-xs text-muted-foreground">
          <summary className="cursor-pointer select-none hover:text-foreground transition-colors py-1">
            ▸ Internal proof view — AG audit only
          </summary>

          <div className="mt-3 space-y-3 font-mono">
            {/* Backend status */}
            <div className="flex items-center gap-2">
              <span
                className={`inline-block w-2 h-2 rounded-full ${statusColor}`}
              />
              <span>
                Backend: <strong>{backendStatus}</strong> — {backendUrl}
              </span>
            </div>

            {/* Task data */}
            <details className="ml-4">
              <summary className="cursor-pointer hover:text-foreground">
                Last submitted task data
              </summary>
              <pre className="mt-2 p-3 bg-card/60 rounded-lg overflow-x-auto text-xs leading-relaxed max-h-40">
                {taskData
                  ? JSON.stringify(taskData, null, 2)
                  : "No task submitted yet"}
              </pre>
            </details>

            {/* Receipts */}
            <details className="ml-4">
              <summary className="cursor-pointer hover:text-foreground">
                Receipts ({receipts.length})
              </summary>
              {receipts.length === 0 ? (
                <p className="mt-2 ml-2">No receipts yet</p>
              ) : (
                <div className="mt-2 space-y-2">
                  {receipts.map((receipt, i) => (
                    <details key={i} className="ml-2">
                      <summary className="cursor-pointer hover:text-foreground">
                        Receipt {i + 1}
                        {receipt.receipt_id ? ` — ${receipt.receipt_id}` : ""}
                        {receipt.status ? ` [${receipt.status}]` : ""}
                      </summary>
                      <pre className="mt-1 p-2 bg-card/60 rounded overflow-x-auto text-xs max-h-32">
                        {JSON.stringify(receipt, null, 2)}
                      </pre>
                    </details>
                  ))}
                </div>
              )}
            </details>

            {/* AG audit verdict */}
            <div className="flex items-center gap-2">
              <span>AG audit verdict:</span>
              <strong
                className={
                  auditVerdict === "PASSED"
                    ? "text-green-400"
                    : auditVerdict === "FAILED"
                    ? "text-red-400"
                    : "text-yellow-400"
                }
              >
                {auditVerdict}
              </strong>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};

export default DTInternalProof;
