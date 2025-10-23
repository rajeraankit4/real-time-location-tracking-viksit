export default function Login() {
  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth endpoint
    const backendUrl = (import.meta.env.VITE_BACKEND_URL);
    window.location.href = `${backendUrl}/auth/google`;
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleGoogleLogin}>Login with Google</button>
    </div>
  );
}
