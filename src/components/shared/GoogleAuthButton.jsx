import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

export function GoogleAuthButton({ onSuccess }) {
  const { loginWithGoogleToken } = useAuth();
  const isConfigured = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  if (!isConfigured) {
    return (
      <p className="rounded-lg border border-dashed border-border-subtle px-4 py-3 text-center text-xs text-muted">
        Google sign-in will appear here once VITE_GOOGLE_CLIENT_ID is set.
      </p>
    );
  }

  const handleSuccess = async (credentialResponse) => {
    try {
      await loginWithGoogleToken(credentialResponse.credential);
      toast.success("Signed in with Google");
      onSuccess?.();
    } catch (err) {
      toast.error(err.message || "Google sign-in failed");
    }
  };

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => toast.error("Google sign-in failed")}
        theme="filled_black"
        shape="pill"
        text="continue_with"
        width="320"
      />
    </div>
  );
}
