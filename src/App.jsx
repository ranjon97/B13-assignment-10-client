import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/context/AuthContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PrivateRoute } from "@/routes/PrivateRoute";
import { RoleRoute } from "@/routes/RoleRoute";

import { HomePage } from "@/pages/HomePage";
import { AllClassesPage } from "@/pages/AllClassesPage";
import { ClassDetailsPage } from "@/pages/ClassDetailsPage";
import { PaymentPage } from "@/pages/PaymentPage";
import { PaymentSuccessPage } from "@/pages/PaymentSuccessPage";
import { ForumPage } from "@/pages/ForumPage";
import { ForumPostDetailsPage } from "@/pages/ForumPostDetailsPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

import { DashboardOverviewPage } from "@/pages/dashboard/DashboardOverviewPage";
import { BookedClassesPage } from "@/pages/dashboard/user/BookedClassesPage";
import { ApplyTrainerPage } from "@/pages/dashboard/user/ApplyTrainerPage";
import { FavoriteClassesPage } from "@/pages/dashboard/user/FavoriteClassesPage";
import { AddClassPage } from "@/pages/dashboard/trainer/AddClassPage";
import { MyClassesPage } from "@/pages/dashboard/trainer/MyClassesPage";
import { MyForumPostsPage } from "@/pages/dashboard/trainer/MyForumPostsPage";
import { AddForumPostPage } from "@/pages/dashboard/shared/AddForumPostPage";
import { ManageUsersPage } from "@/pages/dashboard/admin/ManageUsersPage";
import { AppliedTrainersPage } from "@/pages/dashboard/admin/AppliedTrainersPage";
import { ManageTrainersPage } from "@/pages/dashboard/admin/ManageTrainersPage";
import { ManageClassesPage } from "@/pages/dashboard/admin/ManageClassesPage";
import { ForumModerationPage } from "@/pages/dashboard/admin/ForumModerationPage";
import { TransactionsPage } from "@/pages/dashboard/admin/TransactionsPage";

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const appTree = (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            style: { background: "#1c2025", color: "#f4f6f5", border: "1px solid #2a2f36" },
          }}
        />
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="classes" element={<AllClassesPage />} />
            <Route path="forum" element={<ForumPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />

            <Route element={<PrivateRoute />}>
              <Route path="classes/:id" element={<ClassDetailsPage />} />
              <Route path="payment/:classId" element={<PaymentPage />} />
              <Route path="payment/success" element={<PaymentSuccessPage />} />
              <Route path="forum/:id" element={<ForumPostDetailsPage />} />
            </Route>
          </Route>

          <Route element={<PrivateRoute />}>
            <Route path="dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardOverviewPage />} />

              <Route element={<RoleRoute allowedRoles={["user"]} />}>
                <Route path="bookings" element={<BookedClassesPage />} />
                <Route path="apply-trainer" element={<ApplyTrainerPage />} />
                <Route path="favorites" element={<FavoriteClassesPage />} />
              </Route>

              <Route element={<RoleRoute allowedRoles={["trainer"]} />}>
                <Route path="add-class" element={<AddClassPage />} />
                <Route path="my-classes" element={<MyClassesPage />} />
                <Route path="my-posts" element={<MyForumPostsPage />} />
              </Route>

              <Route element={<RoleRoute allowedRoles={["trainer", "admin"]} />}>
                <Route path="add-post" element={<AddForumPostPage />} />
              </Route>

              <Route element={<RoleRoute allowedRoles={["admin"]} />}>
                <Route path="manage-users" element={<ManageUsersPage />} />
                <Route path="applied-trainers" element={<AppliedTrainersPage />} />
                <Route path="manage-trainers" element={<ManageTrainersPage />} />
                <Route path="manage-classes" element={<ManageClassesPage />} />
                <Route path="manage-posts" element={<ForumModerationPage />} />
                <Route path="transactions" element={<TransactionsPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );

  if (!googleClientId) return appTree;

  return <GoogleOAuthProvider clientId={googleClientId}>{appTree}</GoogleOAuthProvider>;
}

export default App;
