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
