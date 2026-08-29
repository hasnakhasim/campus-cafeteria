import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      const user = response.data.user;

      // Check admin role
      if (user.role !== "admin") {
        setError(
          "Access denied. Admin account required."
        );
        return;
      }

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      navigate("/admin/dashboard");

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Invalid admin email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page admin-auth-page">

      <div className="auth-container">

        {/* LEFT SIDE */}

        <div className="auth-brand admin-auth-brand">

          <div className="auth-logo">
            🛡️
          </div>

          <h1>
            Campus Cafeteria
          </h1>

          <p>
            Administration Portal
          </p>

          <div className="auth-feature">

            <span>📋</span>

            <div>
              <strong>
                Manage Orders
              </strong>

              <small>
                View and manage student food orders.
              </small>
            </div>

          </div>


          <div className="auth-feature">

            <span>🍛</span>

            <div>
              <strong>
                Manage Menu
              </strong>

              <small>
                Add, edit and remove cafeteria items.
              </small>
            </div>

          </div>


          <div className="auth-feature">

            <span>📊</span>

            <div>
              <strong>
                Administration
              </strong>

              <small>
                Manage cafeteria activities from one place.
              </small>
            </div>

          </div>

        </div>


        {/* RIGHT SIDE */}

        <div className="auth-card">

          <div className="auth-card-header">

            <h2>
              Admin Login
            </h2>

            <p>
              Sign in to the administration portal
            </p>

          </div>


          {error && (

            <div className="auth-error">
              {error}
            </div>

          )}


          <form
            onSubmit={handleLogin}
            className="auth-form"
          >

            {/* EMAIL */}

            <div className="form-group">

              <label>
                Admin Email
              </label>

              <input
                type="email"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

            </div>


            {/* PASSWORD */}

            <div className="form-group">

              <label>
                Password
              </label>

              <input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

            </div>


            {/* LOGIN */}

            <button
              type="submit"
              className="auth-submit admin-login-button"
              disabled={loading}
            >

              {loading
                ? "Signing in..."
                : "Admin Login"}

            </button>

          </form>


          <div className="auth-switch admin-login-note">

            🔒
            <span>
              Authorized administrators only
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminLogin;