import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "./auth";

export default function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    console.log(token)
    if (token) {
      login(token);
      window.location.replace("/dashboard");
    } else {
      navigate("/");
    }
  }, [navigate]);

  return <p>Logging you in...</p>;
}
