import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <Compass size={48} className="text-pulse" strokeWidth={1.5} />
      <h1 className="mt-6 font-display text-7xl tracking-wide text-paper">404</h1>
      <p className="mt-2 font-display text-xl tracking-wide text-paper">Off The Map</p>
      <p className="mt-2 max-w-sm text-sm text-muted">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link to="/">
        <Button className="mt-8">Back to Home</Button>
      </Link>
    </div>
  );
}
