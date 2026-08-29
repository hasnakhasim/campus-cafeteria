import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [rollNo, setRollNo] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          rollNo,
          name,
          email,
          department,
          password,
        }
      );

      setSuccess(
        "Registration successful! Redirecting to login..."
      );

      setRollNo("");
      setName("");
      setEmail("");
      setDepartment("");
      setPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Registration failed"
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

          <h1>Campus Cafeteria</h1>

          <p>
            Student Food Ordering Portal
          </p>

          <div className="auth-feature">
            <span>👨‍🎓</span>
            <div>
              <strong>Student Account</strong>
              <small>
                Create your personal cafeteria account.
              </small>
            </div>
          </div>

          <div className="auth-feature">
            <span>🍛</span>
            <div>
              <strong>Order Food</strong>
              <small>
                Browse the menu and order your food.
              </small>
            </div>
          </div>

          <div className="auth-feature">
            <span>📦</span>
            <div>
              <strong>Track Orders</strong>
              <small>
                Check your order status easily.
              </small>
            </div>
          </div>

        </div>


        {/* RIGHT SIDE */}

        <div className="auth-card">

          <div className="auth-card-header">

            <h2>Create Account</h2>

            <p>
              Register as a student
            </p>

          </div>


          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}


          {success && (
            <div className="auth-success">
              {success}
            </div>
          )}


          <form
            onSubmit={handleRegister}
            className="auth-form"
          >

            {/* ROLL NUMBER */}

            <div className="form-group">

              <label>
                Roll Number
              </label>

              <input
                type="text"
                placeholder="Enter your roll number"
                value={rollNo}
                onChange={(e) =>
                  setRollNo(e.target.value)
                }
                required
              />

            </div>


            {/* NAME */}

            <div className="form-group">

              <label>
                Name
              </label>

              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
              />

            </div>


            {/* EMAIL */}

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


            {/* DEPARTMENT */}

            <div className="form-group">

              <label>
                Department
              </label>

              <select
                value={department}
                onChange={(e) =>
                  setDepartment(e.target.value)
                }
                required
              >

                <option value="">
                  Select Department
                </option>

                <option value="MCA">
                  MCA
                </option>

                <option value="BCA">
                  BCA
                </option>

                <option value="BSc Computer Science">
                  BSc Computer Science
                </option>

                <option value="BCom">
                  BCom
                </option>

                <option value="BA">
                  BA
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>


            {/* PASSWORD */}

            <div className="form-group">

              <label>
                Password
              </label>

              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

            </div>


            {/* REGISTER BUTTON */}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >

              {loading
                ? "Creating Account..."
                : "Create Account"}

            </button>

          </form>


          <div className="auth-switch">

            <span>
              Already have an account?
            </span>

            <Link to="/login">
              Login
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;