import { useState } from "react";
import { useNavigate } from "react-router-dom";
// No new direct imports needed for UI, assuming Tailwind CSS and daisyUI are set up.

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // State for error messages
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user)); // Store user data
        navigate("/"); // Navigate to home or dashboard on success
      } else {
        setError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("Network error or server unavailable. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-blue-950 p-4 font-inter"> {/* Deep dark background */}
      <div className="card w-full max-w-sm bg-gray-900 rounded-3xl shadow-2xl p-8 border border-blue-700 border-opacity-30 backdrop-blur-md">
        <form onSubmit={handleLogin} className="card-body p-0"> {/* Adjusted padding here */}
          <h2 className="card-title text-4xl font-extrabold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 drop-shadow-md">
            Welcome to <span className="text-blue-200">Help Hive!</span>
          </h2>
          <p className="text-center text-blue-100 text-opacity-80 mb-8 font-light">
            Please log in to your account.
          </p>

          {/* Error Message Display */}
          {error && (
            <div role="alert" className="alert alert-error bg-red-800 text-white mb-6 shadow-lg border border-red-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-lg font-medium">{error}</span>
            </div>
          )}

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text text-blue-200 text-lg font-semibold">Email Address</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              className="input input-bordered input-primary w-full text-blue-100 text-lg p-3 rounded-lg bg-gray-700 border-blue-600 focus:ring-4 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-inner"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text text-blue-200 text-lg font-semibold">Password</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Your secure password"
              className="input input-bordered input-primary w-full text-blue-100 text-lg p-3 rounded-lg bg-gray-700 border-blue-600 focus:ring-4 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-inner"
              value={form.password}
              onChange={handleChange}
              required
            />
            {/* Optional: Add a "Forgot Password?" link */}
            {/* <label className="label">
              <a href="#" className="label-text-alt link link-hover text-blue-300 text-opacity-70">Forgot password?</a>
            </label> */}
          </div>

          <div className="form-control mt-4">
            <button
              type="submit"
              className="btn btn-primary btn-lg w-full shadow-lg shadow-blue-700/40 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-600/60 active:scale-98 active:shadow-md border-none bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xl"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-lg"></span>
                  Logging in...
                </>
              ) : (
                "Secure Login"
              )}
            </button>
          </div>

          {/* Optional: Add a link to a registration page */}
          <p className="text-center text-base text-blue-200 text-opacity-70 mt-8">
            Don't have an account?{" "}
            <a href="/signup" className="link link-hover text-cyan-300 font-semibold hover:underline">
              Register here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
