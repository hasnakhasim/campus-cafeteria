import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
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

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/student");

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-container">

        {/* LEFT SIDE */}

        <div className="auth-brand">

          <div className="auth-logo">
            🍴
          </div>

          <h1>
            Campus Cafeteria
          </h1>

          <p>
            Student Food Ordering Portal
          </p>

          <div className="auth-feature">
            <span>🍛</span>
            <div>
              <strong>
                Easy Food Ordering
              </strong>
              <small>
                Order your favourite cafeteria food.
              </small>
            </div>
          </div>

          <div className="auth-feature">
            <span>⚡</span>
            <div>
              <strong>
                Skip the Queue
              </strong>
              <small>
                Pre-order your food before pickup.
              </small>
            </div>
          </div>

          <div className="auth-feature">
            <span>📦</span>
            <div>
              <strong>
                Track Your Order
              </strong>
              <small>
                See your order status in real time.
              </small>
            </div>
          </div>

        </div>


        {/* RIGHT SIDE */}

        <div className="auth-card">

          <div className="auth-card-header">

            <h2>
              Student Login
            </h2>

            <p>
              Login to your cafeteria account
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

            <div className="form-group">

              <label>
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

            </div>


            <div className="form-group">

              <label>
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

            </div>


            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >

              {loading
                ? "Logging in..."
                : "Login"}

            </button>

          </form>


          <div className="auth-switch">

            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              Create Account
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;