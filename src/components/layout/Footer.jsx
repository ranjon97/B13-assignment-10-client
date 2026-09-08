import { Link } from "react-router-dom";
import { Activity, Instagram, Youtube, MapPin, Mail, Phone } from "lucide-react";

function XLogo(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <Activity size={22} className="text-pulse" strokeWidth={2.5} />
              <span className="font-display text-lg tracking-wide text-paper">IRONPULSE</span>
            </Link>
            <p className="mt-4 text-sm text-muted">
              Train with purpose. Book classes, connect with trainers, and track your progress in one place.
            </p>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-muted">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/" className="text-muted hover:text-pulse">Home</Link></li>
              <li><Link to="/classes" className="text-muted hover:text-pulse">All Classes</Link></li>
              <li><Link to="/forum" className="text-muted hover:text-pulse">Community Forum</Link></li>
              <li><Link to="/register" className="text-muted hover:text-pulse">Join Now</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-muted">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li className="flex items-center gap-2"><MapPin size={15} /> Dhaka, Bangladesh</li>
              <li className="flex items-center gap-2"><Mail size={15} /> hello@ironpulse.app</li>
              <li className="flex items-center gap-2"><Phone size={15} /> +880 1XXX-XXXXXX</li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-muted">Follow Us</h4>
            <div className="mt-4 flex gap-3">
              <a href="#" aria-label="X" className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle text-muted transition-colors hover:border-pulse hover:text-pulse">
                <XLogo />
              </a>
              <a href="#" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle text-muted transition-colors hover:border-pulse hover:text-pulse">
                <Instagram size={16} />
              </a>
              <a href="#" aria-label="YouTube" className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle text-muted transition-colors hover:border-pulse hover:text-pulse">
                <Youtube size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border-subtle pt-6 text-center text-xs text-muted">
          © {new Date().getFullYear()} IronPulse. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
