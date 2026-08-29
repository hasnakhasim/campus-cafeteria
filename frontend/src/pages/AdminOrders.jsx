import { useEffect, useState } from "react";
import axios from "axios";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setOrders(response.data);
    } catch (error) {
      console.log(error);
      alert("Unable to load orders");
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          status: newStatus
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Order status updated");

      loadOrders();

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
        "Failed to update order status"
      );
    }
  };

  return (
    <div className="page-container">

      <div className="page-header">
        <h1>Manage Orders</h1>

        <p>
          View and update student cafeteria orders
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="order-card">
          <h3>No orders available</h3>
          <p>
            Student orders will appear here.
          </p>
        </div>
      ) : (

        orders.map((order) => (

          <div
            className="order-card"
            key={order._id}
          >

            <h2>
              Order #{order._id}
            </h2>

            <p>
              <strong>Total:</strong> ₹
              {order.totalAmount}
            </p>

            <p>
              <strong>Pickup Time:</strong>{" "}
              {order.pickupTime}
            </p>

            <p>
              <strong>Current Status:</strong>{" "}
              <span className="order-status">
                {order.status}
              </span>
            </p>

            <hr />

            <h3>
              Update Order Status
            </h3>

            <select
              value={order.status}
              onChange={(e) =>
                updateStatus(
                  order._id,
                  e.target.value
                )
              }
            >
              <option value="Pending">
                Pending
              </option>

              <option value="Preparing">
                Preparing
              </option>

              <option value="Ready">
                Ready
              </option>

              <option value="Collected">
                Collected
              </option>
            </select>

          </div>

        ))

      )}

    </div>
  );
}

export default AdminOrders;