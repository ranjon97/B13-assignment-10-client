import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Dumbbell, HeartPulse, Users2, Trophy, Flame } from "lucide-react";
import { classApi } from "@/api/classApi";
import { forumApi } from "@/api/index";
import { ClassCard } from "@/components/shared/ClassCard";
import { ForumPostCard } from "@/components/shared/ForumPostCard";
import { PulseLine } from "@/components/ui/Brand";
import { Button } from "@/components/ui/Button";
import { PageSpinner } from "@/components/ui/Spinner";

export function HomePage() {
  const [featuredClasses, setFeaturedClasses] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [classes, posts] = await Promise.all([classApi.getFeatured(), forumApi.getLatest()]);
        setFeaturedClasses(classes);
        setLatestPosts(posts);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border-subtle">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-pulse">
              Train. Track. Transform.
            </span>
            <h1 className="mt-4 font-display text-5xl leading-[0.95] tracking-wide text-paper sm:text-7xl">
              YOUR NEXT
              <br />
              PERSONAL BEST
              <br />
              STARTS HERE.
            </h1>
            <p className="mt-6 max-w-md text-base text-muted">
              Discover expert-led fitness classes, connect with real trainers, and join a community
              that shows up for every rep.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Button onClick={() => (window.location.href = "/classes")} className="text-base">
                Explore Classes <ArrowRight size={16} />
              </Button>
            </div>
          </motion.div>
        </div>
        <div className="text-pulse/40">
          <PulseLine />
        </div>
      </section>

      {isLoading ? (
        <PageSpinner />
      ) : (
        <>
          <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-muted">01 / Featured</span>
                <h2 className="mt-2 font-display text-3xl tracking-wide text-paper">Top Booked Classes</h2>
              </div>
              <Link to="/classes" className="hidden text-sm font-medium text-pulse hover:underline sm:block">
                View all classes →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredClasses.map((fitnessClass) => (
                <ClassCard key={fitnessClass._id} fitnessClass={fitnessClass} />
              ))}
            </div>
          </section>

          <section className="border-y border-border-subtle bg-surface/40">
            <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
              <div className="mb-10">
                <span className="font-mono text-xs uppercase tracking-widest text-muted">02 / Community</span>
                <h2 className="mt-2 font-display text-3xl tracking-wide text-paper">Latest From The Forum</h2>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {latestPosts.map((post) => (
                  <ForumPostCard key={post._id} post={post} />
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">03 / Why IronPulse</span>
        <h2 className="mt-2 font-display text-3xl tracking-wide text-paper">Built For Real Progress</h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Dumbbell, title: "Expert Trainers", desc: "Vetted coaches across every discipline." },
            { icon: HeartPulse, title: "Track Progress", desc: "Bookings, favorites, and history in one place." },
            { icon: Users2, title: "Real Community", desc: "Discuss, learn, and grow with fellow members." },
            { icon: Trophy, title: "Proven Results", desc: "Classes ranked by real booking activity." },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-border-subtle bg-surface p-6">
              <item.icon size={22} className="text-pulse" strokeWidth={1.5} />
              <h3 className="mt-4 font-display text-lg tracking-wide text-paper">{item.title}</h3>
              <p className="mt-1 text-sm text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border-subtle bg-surface/40">
        <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:px-8">
          <Flame size={28} className="text-signal" />
          <h2 className="mt-4 font-display text-3xl tracking-wide text-paper sm:text-4xl">
            READY TO FEEL THE PULSE?
          </h2>
          <p className="mt-3 max-w-md text-sm text-muted">
            Create your free account and book your first class in minutes.
          </p>
          <Button className="mt-8" onClick={() => (window.location.href = "/register")}>
            Join IronPulse
          </Button>
        </div>
      </section>
    </div>
  );
}
