import {
  LayoutDashboard,
  CalendarCheck,
  Heart,
  UserPlus,
  PlusCircle,
  Dumbbell,
  MessageSquarePlus,
  Newspaper,
  Users,
  ClipboardList,
  Award,
  ShieldCheck,
  Receipt,
  MessagesSquare,
} from "lucide-react";

export const dashboardNav = {
  user: [
    { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
    { to: "/dashboard/bookings", label: "Booked Classes", icon: CalendarCheck },
    { to: "/dashboard/apply-trainer", label: "Apply as Trainer", icon: UserPlus },
    { to: "/dashboard/favorites", label: "Favorite Classes", icon: Heart },
  ],
  trainer: [
    { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
    { to: "/dashboard/add-class", label: "Add Class", icon: PlusCircle },
    { to: "/dashboard/my-classes", label: "My Classes", icon: Dumbbell },
    { to: "/dashboard/add-post", label: "Add Forum Post", icon: MessageSquarePlus },
    { to: "/dashboard/my-posts", label: "My Forum Posts", icon: Newspaper },
  ],
  admin: [
    { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
    { to: "/dashboard/manage-users", label: "Manage Users", icon: Users },
    { to: "/dashboard/applied-trainers", label: "Applied Trainers", icon: ClipboardList },
    { to: "/dashboard/manage-trainers", label: "Manage Trainers", icon: Award },
    { to: "/dashboard/manage-classes", label: "Manage Classes", icon: ShieldCheck },
    { to: "/dashboard/add-post", label: "Add Forum Post", icon: MessageSquarePlus },
    { to: "/dashboard/manage-posts", label: "Forum Moderation", icon: MessagesSquare },
    { to: "/dashboard/transactions", label: "Transactions", icon: Receipt },
  ],
};
