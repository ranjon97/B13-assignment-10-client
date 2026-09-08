import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Users, Search } from "lucide-react";
import { userApi } from "@/api/index";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { EmptyState } from "@/components/ui/States";
import { PageSpinner } from "@/components/ui/Spinner";
import { Input } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { RoleBadge } from "@/components/ui/Brand";

export function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);

  const loadUsers = () => {
    setIsLoading(true);
    userApi
      .getUsers({ page, search })
      .then((res) => {
        setUsers(res.data);
        setMeta(res.meta);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleToggleBlock = async (targetUser) => {
    setActioningId(targetUser.id);
    try {
      if (targetUser.status === "blocked") {
        await userApi.unblock(targetUser.id);
        toast.success("User unblocked");
      } else {
        await userApi.block(targetUser.id);
        toast.success("User blocked");
      }
      loadUsers();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActioningId(null);
    }
  };

  const handlePromote = async (targetUser) => {
    setActioningId(targetUser.id);
    try {
      await userApi.promote(targetUser.id);
      toast.success("User promoted to admin");
      loadUsers();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div>
      <DashboardHeader title="Manage Users" description="View and moderate all registered users." />

      <div className="relative mb-6 max-w-sm">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <Input
          className="pl-11"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (setPage(1), loadUsers())}
        />
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : users.length === 0 ? (
        <EmptyState icon={Users} title="No users found" />
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-border-subtle">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-raised text-xs uppercase tracking-widest text-muted">
                <tr>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle bg-surface">
                {users.map((targetUser) => (
                  <tr key={targetUser.id}>
                    <td className="px-5 py-4 font-medium text-paper">{targetUser.name}</td>
                    <td className="px-5 py-4 text-muted">{targetUser.email}</td>
                    <td className="px-5 py-4"><RoleBadge role={targetUser.role} /></td>
                    <td className="px-5 py-4">
                      <span className={targetUser.status === "blocked" ? "text-signal" : "text-pulse"}>
                        {targetUser.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        {targetUser.role !== "admin" && (
                          <>
                            <Button
                              variant="secondary"
                              className="px-3 py-1.5 text-xs"
                              isLoading={actioningId === targetUser.id}
                              onClick={() => handleToggleBlock(targetUser)}
                            >
                              {targetUser.status === "blocked" ? "Unblock" : "Block"}
                            </Button>
                            <Button
                              variant="ghost"
                              className="px-3 py-1.5 text-xs"
                              isLoading={actioningId === targetUser.id}
                              onClick={() => handlePromote(targetUser)}
                            >
                              Make Admin
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
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
