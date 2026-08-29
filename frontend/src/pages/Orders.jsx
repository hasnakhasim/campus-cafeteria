import { useEffect, useState } from "react";
import axios from "axios";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/orders/my-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setOrders(response.data);

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
        "Unable to load your orders"
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        Loading your orders...
      </div>
    );
  }

  return (
    <div className="page-container">

      <div className="page-header">

        <h1>My Orders</h1>

        <p>
          View your cafeteria orders and pickup status.
        </p>

      </div>


      {orders.length === 0 ? (

        <div className="empty-message">

          <h3>No orders yet</h3>

          <p>
            Your orders will appear here.
          </p>

        </div>

      ) : (

        orders.map((order) => (

          <div
            className="order-card"
            key={order._id}
          >

            <h2>
              Order #{order._id.slice(-6)}
            </h2>


            <p>
              <strong>Order Date:</strong>{" "}
              {new Date(
                order.createdAt
              ).toLocaleString()}
            </p>


            <p>
              <strong>Pickup Time:</strong>{" "}
              {order.pickupTime}
            </p>


            <p>
              <strong>Total Amount:</strong>{" "}
              ₹{order.totalAmount}
            </p>


            <p>
              <strong>Status:</strong>

              <span
                className={
                  order.status === "Pending"
                    ? "status-pending"
                    : order.status === "Preparing"
                    ? "status-preparing"
                    : order.status === "Ready"
                    ? "status-ready"
                    : "status-collected"
                }
              >
                {order.status}
              </span>

            </p>


            <hr />


            <h3>Ordered Items</h3>


            {order.items.map((item) => (

              <div
                key={item._id}
                style={{
                  padding: "10px 0",
                  borderBottom:
                    "1px solid #eeeeee"
                }}
              >

                <p>
                  <strong>
                    {item.itemName}
                  </strong>
                </p>

                <p>
                  ₹{item.price} ×{" "}
                  {item.quantity}
                </p>

              </div>

            ))}

          </div>

        ))

      )}

    </div>
  );
}

export default Orders;