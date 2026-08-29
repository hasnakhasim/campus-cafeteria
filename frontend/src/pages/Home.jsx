import { Link } from "react-router-dom";

function Home() {
  return (
    <div>

      <h1>🍴 Campus Cafeteria</h1>

      <h2>Welcome to Campus Cafeteria</h2>

      <p>
        Order food online and collect it
        at your selected pickup time.
      </p>

      <Link to="/login">
        <button>
          Student Login
        </button>
      </Link>

      <br />
      <br />

      <Link to="/register">
        <button>
          Register
        </button>
      </Link>

    </div>
  );
}

export default Home;