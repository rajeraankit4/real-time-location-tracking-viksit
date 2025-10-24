import LoginForm from "./LoginForm";
export default function Login() {
  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth endpoint
    const backendUrl = (import.meta.env.VITE_BACKEND_URL);
    window.location.href = `${backendUrl}/api/auth/google`;
  };  

  return (
    <div>
      <LoginForm />
      <button onClick={handleGoogleLogin}>Login with Google</button>
    </div>
  );
}
