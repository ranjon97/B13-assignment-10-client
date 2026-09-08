import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Dumbbell } from "lucide-react";
import { classApi } from "@/api/classApi";
import { ClassCard } from "@/components/shared/ClassCard";
import { Input, Select } from "@/components/ui/FormField";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { PageSpinner } from "@/components/ui/Spinner";
import { CLASS_CATEGORIES } from "@/utils/format";

export function AllClassesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [classes, setClasses] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    let isCancelled = false;
    async function loadClasses() {
      setIsLoading(true);
      setHasError(false);
      try {
        const response = await classApi.getClasses({ search, category, page, limit: 9 });
        if (!isCancelled) {
          setClasses(response.data);
          setMeta(response.meta);
        }
      } catch {
        if (!isCancelled) setHasError(true);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }
    loadClasses();
    return () => {
      isCancelled = true;
    };
  }, [search, category, page]);

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    if (!("page" in updates)) next.delete("page");
    setSearchParams(next);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">Browse</span>
        <h1 className="mt-2 font-display text-4xl tracking-wide text-paper">All Classes</h1>
      </div>

      <div className="mb-10 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <Input
            className="pl-11"
            placeholder="Search classes by name..."
            defaultValue={search}
            onChange={(e) => updateParams({ search: e.target.value })}
          />
        </div>
        <Select
          className="sm:w-56"
          value={category}
          onChange={(e) => updateParams({ category: e.target.value })}
        >
          <option value="">All Categories</option>
          {CLASS_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : hasError ? (
        <ErrorState message="We couldn't load classes right now." />
      ) : classes.length === 0 ? (
        <EmptyState
          icon={Dumbbell}
          title="No classes found"
          description="Try adjusting your search or filter to find what you're looking for."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((fitnessClass) => (
              <ClassCard key={fitnessClass._id} fitnessClass={fitnessClass} />
            ))}
          </div>
          <Pagination meta={meta} onPageChange={(p) => updateParams({ page: p })} />
        </>
      )}
    </div>
  );
}
