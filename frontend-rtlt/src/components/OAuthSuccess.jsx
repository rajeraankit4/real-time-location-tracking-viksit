import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    console.log(token)
    if (token) {
      localStorage.setItem("token", token); // save JWT
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  }, [navigate]);

  return <p>Logging you in...</p>;
}
