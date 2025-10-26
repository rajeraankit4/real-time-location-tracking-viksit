// Login: store token
export function login(token) {
  try {
    localStorage.setItem("token", token);
  } catch (err) {
    console.error("login error", err);
  }
}

// Logout: remove token and redirect
export function logout(redirectTo = "/") {
  localStorage.removeItem("token");
  try {
    window.location.replace(redirectTo);
  } catch (err) {
    window.location.href = redirectTo;
  }
}

// Decode a JWT (client-side). Returns payload object or null.
export function decodeJwt(token) {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    // base64url -> base64
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(json);
  } catch (err) {
    console.error("decodeJwt error", err);
    return null;
  }
}

// Return decoded token payload from localStorage token (if present)
export function getUserFromToken() {
  try {
    const token = localStorage.getItem("token");
    return decodeJwt(token);
  } catch (err) {
    return null;
  }
}
