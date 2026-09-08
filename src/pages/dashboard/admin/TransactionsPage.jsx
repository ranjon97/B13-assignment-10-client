import { useEffect, useState } from "react";
import { Receipt } from "lucide-react";
import { transactionApi } from "@/api/index";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { EmptyState } from "@/components/ui/States";
import { PageSpinner } from "@/components/ui/Spinner";
import { Pagination } from "@/components/ui/Pagination";
import { formatCurrency, formatDate } from "@/utils/format";

export function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    transactionApi
      .getAll({ page })
      .then((res) => {
        setTransactions(res.data);
        setMeta(res.meta);
      })
      .finally(() => setIsLoading(false));
  }, [page]);

  if (isLoading) return <PageSpinner />;

  return (
    <div>
      <DashboardHeader title="Transactions" description="Read-only Stripe payment history." />

      {transactions.length === 0 ? (
        <EmptyState icon={Receipt} title="No transactions yet" />
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-border-subtle">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-raised text-xs uppercase tracking-widest text-muted">
                <tr>
                  <th className="px-5 py-3">User Email</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Transaction ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle bg-surface">
                {transactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td className="px-5 py-4 text-muted">{transaction.userEmail}</td>
                    <td className="px-5 py-4 text-paper">{formatCurrency(transaction.amount)}</td>
                    <td className="px-5 py-4 text-muted">{formatDate(transaction.createdAt)}</td>
                    <td className="px-5 py-4 font-mono text-xs text-muted">{transaction.stripeSessionId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination meta={meta} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
