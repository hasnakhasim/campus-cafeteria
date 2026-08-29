import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("home");

  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loadingMenu, setLoadingMenu] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [orderFilter, setOrderFilter] = useState("All");
  const [orderSearch, setOrderSearch] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =====================================================
  // AXIOS CONFIG
  // =====================================================

  const getConfig = () => {
    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // =====================================================
  // CHECK ADMIN LOGIN
  // =====================================================

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      navigate("/admin/login");
      return;
    }

    try {
      const user = JSON.parse(userData);

      if (user.role !== "admin") {
        navigate("/login");
        return;
      }
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/admin/login");
      return;
    }

    fetchMenu();
    fetchOrders();

    // Automatically refresh
    const interval = setInterval(() => {
      fetchOrders();
      fetchMenu();
    }, 5000);

    return () => clearInterval(interval);
  }, [navigate]);

  // =====================================================
  // FETCH MENU
  // =====================================================

  const fetchMenu = async () => {
    try {
      setLoadingMenu(true);

      const response = await axios.get(
        `${API}/menu`
      );

      if (Array.isArray(response.data)) {
        setMenu(response.data);
      } else if (
        Array.isArray(response.data.menu)
      ) {
        setMenu(response.data.menu);
      } else {
        setMenu([]);
      }

    } catch (err) {
      console.log(
        "Menu error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
        "Failed to load menu"
      );

    } finally {
      setLoadingMenu(false);
    }
  };

  // =====================================================
  // FETCH ALL ORDERS
  // =====================================================

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);

      const response = await axios.get(
        `${API}/orders`,
        getConfig()
      );

      if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else if (
        Array.isArray(response.data.orders)
      ) {
        setOrders(response.data.orders);
      } else {
        setOrders([]);
      }

    } catch (err) {
      console.log(
        "Orders error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
        "Failed to load orders"
      );

    } finally {
      setLoadingOrders(false);
    }
  };

  // =====================================================
  // DELETE MENU ITEM
  // =====================================================

  const deleteFood = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this food item?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      setError("");
      setMessage("");

      await axios.delete(
        `${API}/menu/${id}`,
        getConfig()
      );

      // Remove immediately from screen
      setMenu((previousMenu) =>
        previousMenu.filter(
          (item) =>
            item._id !== id
        )
      );

      setMessage(
        "Food item deleted successfully."
      );

      // Get latest database data
      await fetchMenu();

    } catch (err) {

      console.log(
        "Delete menu error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
        "Failed to delete food item"
      );
    }
  };

  // =====================================================
  // UPDATE ORDER STATUS
  // =====================================================

  const updateOrderStatus = async (
    orderId,
    newStatus
  ) => {

    try {

      setError("");
      setMessage("");

      const response =
        await axios.put(

          `${API}/orders/${orderId}/status`,

          {
            status: newStatus,
          },

          getConfig()

        );


      const updatedOrder =
        response.data.order;


      // Update immediately
      setOrders((previousOrders) =>
        previousOrders.map(
          (order) =>
            order._id === orderId
              ? {
                  ...order,
                  status:
                    updatedOrder?.status ||
                    newStatus,
                }
              : order
        )
      );


      setMessage(
        "Order status updated successfully."
      );

    } catch (err) {

      console.log(
        "Status update error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
        "Failed to update order status"
      );
    }
  };

  // =====================================================
  // DELETE ORDER
  // =====================================================

  const deleteOrder = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this order?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      await axios.delete(
        `${API}/orders/${id}`,
        getConfig()
      );

      setOrders(
        (previousOrders) =>
          previousOrders.filter(
            (order) =>
              order._id !== id
          )
      );

      setMessage(
        "Order deleted successfully."
      );

    } catch (err) {

      console.log(
        "Delete order error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
        "Failed to delete order"
      );
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/admin/login");
  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {

    if (!status) {
      return "order-status pending";
    }

    return (
      "order-status " +
      status
        .toLowerCase()
        .replace(/\s+/g, "-")
    );
  };

  // =====================================================
  // FILTER ORDERS
  // =====================================================

  const filteredOrders =
    orders.filter((order) => {

      const matchesStatus =
        orderFilter === "All" ||
        order.status === orderFilter;


      const searchText =
        orderSearch
          .toLowerCase()
          .trim();


      const orderId =
        order._id
          ?.toLowerCase() || "";


      const studentName =
        order.userId?.name
          ?.toLowerCase() || "";


      const studentEmail =
        order.userId?.email
          ?.toLowerCase() || "";


      const itemNames =
        order.items
          ?.map(
            (item) =>
              item.itemName
          )
          .join(" ")
          .toLowerCase() || "";


      const matchesSearch =
        searchText === "" ||
        orderId.includes(
          searchText
        ) ||
        studentName.includes(
          searchText
        ) ||
        studentEmail.includes(
          searchText
        ) ||
        itemNames.includes(
          searchText
        );


      return (
        matchesStatus &&
        matchesSearch
      );
    });


  // =====================================================
  // STATISTICS
  // =====================================================

  const totalOrders =
    orders.length;

  const pendingOrders =
    orders.filter(
      (order) =>
        order.status ===
        "Pending"
    ).length;

  const preparingOrders =
    orders.filter(
      (order) =>
        order.status ===
        "Preparing"
    ).length;

  const readyOrders =
    orders.filter(
      (order) =>
        order.status ===
        "Ready"
    ).length;

  const totalRevenue =
    orders.reduce(
      (total, order) =>
        total +
        Number(
          order.totalAmount || 0
        ),
      0
    );


  // =====================================================
  // ADMIN USER
  // =====================================================

  let adminUser = {};

  try {
    adminUser = JSON.parse(
      localStorage.getItem(
        "user"
      ) || "{}"
    );
  } catch (error) {
    adminUser = {};
  }


  // =====================================================
  // RETURN
  // =====================================================

  return (

    <div className="admin-dashboard">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="admin-header">

        <div className="admin-brand">

          <div className="admin-logo">
            🍛
          </div>

          <div>

            <h1>
              Campus Cafeteria
            </h1>

            <p>
              Admin Panel
            </p>

          </div>

        </div>


        <div className="admin-profile">

          <span>
            👤{" "}
            {adminUser.name ||
              "Admin"}
          </span>

          <button
            className="admin-logout"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </header>


      {/* =================================================
          NAVIGATION
      ================================================= */}

      <nav className="admin-navigation">

        <button
          className={
            activeSection === "home"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveSection(
              "home"
            )
          }
        >
          🏠 Dashboard
        </button>


        <button
          className={
            activeSection === "menu"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveSection(
              "menu"
            )
          }
        >
          🍛 Manage Menu
        </button>


        <button
          className={
            activeSection === "orders"
              ? "active"
              : ""
          }
          onClick={() => {

            setActiveSection(
              "orders"
            );

            fetchOrders();

          }}
        >
          📦 Manage Orders
        </button>

      </nav>


      {/* =================================================
          MESSAGES
      ================================================= */}

      {message && (

        <div className="success-message">

          {message}

        </div>

      )}


      {error && (

        <div className="error-message">

          {error}

        </div>

      )}


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="admin-content">


        {/* =================================================
            DASHBOARD HOME
        ================================================= */}

        {activeSection === "home" && (

          <section className="admin-section">

            <div className="admin-welcome">

              <h2>
                Welcome,{" "}
                {adminUser.name ||
                  "Admin"} 👋
              </h2>

              <p>
                Manage your cafeteria
                menu and student orders.
              </p>

            </div>


            {/* STATISTICS */}

            <div className="admin-stat-grid">


              <div className="admin-stat-card">

                <div className="stat-icon">
                  📦
                </div>

                <div>

                  <h3>
                    Total Orders
                  </h3>

                  <strong>
                    {totalOrders}
                  </strong>

                </div>

              </div>


              <div className="admin-stat-card">

                <div className="stat-icon">
                  ⏳
                </div>

                <div>

                  <h3>
                    Pending
                  </h3>

                  <strong>
                    {pendingOrders}
                  </strong>

                </div>

              </div>


              <div className="admin-stat-card">

                <div className="stat-icon">
                  👨‍🍳
                </div>

                <div>

                  <h3>
                    Preparing
                  </h3>

                  <strong>
                    {preparingOrders}
                  </strong>

                </div>

              </div>


              <div className="admin-stat-card">

                <div className="stat-icon">
                  ✅
                </div>

                <div>

                  <h3>
                    Ready
                  </h3>

                  <strong>
                    {readyOrders}
                  </strong>

                </div>

              </div>


              <div className="admin-stat-card">

                <div className="stat-icon">
                  💰
                </div>

                <div>

                  <h3>
                    Revenue
                  </h3>

                  <strong>
                    ₹{totalRevenue}
                  </strong>

                </div>

              </div>


              <div className="admin-stat-card">

                <div className="stat-icon">
                  🍛
                </div>

                <div>

                  <h3>
                    Menu Items
                  </h3>

                  <strong>
                    {menu.length}
                  </strong>

                </div>

              </div>

            </div>


            {/* QUICK ACTIONS */}

            <div className="quick-actions">

              <h2>
                Quick Actions
              </h2>


              <div className="quick-action-grid">

                <button
                  onClick={() =>
                    setActiveSection(
                      "menu"
                    )
                  }
                >
                  🍛
                  <span>
                    Manage Menu
                  </span>
                </button>


                <button
                  onClick={() => {

                    setActiveSection(
                      "orders"
                    );

                    fetchOrders();

                  }}
                >
                  📦
                  <span>
                    Manage Orders
                  </span>
                </button>

              </div>

            </div>

          </section>

        )}


        {/* =================================================
            MANAGE MENU
        ================================================= */}

        {activeSection === "menu" && (

          <section className="admin-section">

            <div className="admin-section-header">

              <div>

                <h2>
                  Manage Menu
                </h2>

                <p>
                  View and manage cafeteria
                  food items.
                </p>

              </div>


              <button
                className="add-food-btn"
                onClick={() =>
                  navigate(
                    "/admin/menu"
                  )
                }
              >
                ➕ Add / Manage Food
              </button>

            </div>


            {loadingMenu ? (

              <div className="empty-message">

                <h3>
                  Loading menu...
                </h3>

              </div>

            ) : menu.length === 0 ? (

              <div className="empty-message">

                <h3>
                  No menu items
                </h3>

                <p>
                  Add food items to
                  your cafeteria menu.
                </p>

              </div>

            ) : (

              <div className="admin-menu-grid">

                {menu.map(
                  (item) => (

                    <div
                      className="admin-menu-card"
                      key={item._id}
                    >

                      <div className="admin-menu-image">
                        🍛
                      </div>


                      <div className="admin-menu-details">

                        <h3>
                          {item.itemName}
                        </h3>

                        <p>
                          {item.description}
                        </p>

                        <span>
                          {item.category}
                        </span>


                        <strong>
                          ₹{item.price}
                        </strong>


                        <div
                          className={
                            item.available
                              ? "available"
                              : "not-available"
                          }
                        >
                          {item.available
                            ? "Available"
                            : "Not Available"}
                        </div>


                        <button
                          className="delete-menu-btn"
                          onClick={() =>
                            deleteFood(
                              item._id
                            )
                          }
                        >
                          🗑 Delete
                        </button>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </section>

        )}


        {/* =================================================
            MANAGE ORDERS
        ================================================= */}

        {activeSection === "orders" && (

          <section className="admin-section">


            {/* HEADER */}

            <div className="admin-section-header">

              <div>

                <h2>
                  Manage Orders
                </h2>

                <p>
                  View, filter and manage
                  student orders.
                </p>

              </div>


              <button
                className="add-food-btn"
                onClick={
                  fetchOrders
                }
              >
                🔄 Refresh
              </button>

            </div>


            {/* FILTER */}

            <div className="order-filter">

              <input
                type="text"
                placeholder="Search order ID, student, email or food..."
                value={
                  orderSearch
                }
                onChange={(e) =>
                  setOrderSearch(
                    e.target.value
                  )
                }
              />


              <select
                value={
                  orderFilter
                }
                onChange={(e) =>
                  setOrderFilter(
                    e.target.value
                  )
                }
              >

                <option value="All">
                  All Orders
                </option>

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


              <button
                className="clear-filter-btn"
                onClick={() => {

                  setOrderFilter(
                    "All"
                  );

                  setOrderSearch(
                    ""
                  );

                }}
              >
                Clear
              </button>

            </div>


            {/* COUNT */}

            <div className="order-count">

              Showing{" "}

              <strong>
                {
                  filteredOrders.length
                }
              </strong>{" "}

              of{" "}

              <strong>
                {orders.length}
              </strong>{" "}

              orders

            </div>


            {/* ORDERS */}

            {loadingOrders ? (

              <div className="empty-message">

                <h3>
                  Loading orders...
                </h3>

              </div>

            ) : filteredOrders.length === 0 ? (

              <div className="empty-message">

                <h3>
                  No matching orders
                </h3>

                <p>
                  Try another search
                  or status filter.
                </p>

              </div>

            ) : (

              <div className="admin-orders-list">

                {filteredOrders.map(
                  (order) => (

                    <div
                      className="admin-order-card"
                      key={
                        order._id
                      }
                    >


                      {/* ORDER HEADER */}

                      <div className="order-header">

                        <div>

                          <h3>
                            Order #
                            {order._id
                              ?.slice(
                                -6
                              )
                              .toUpperCase()}
                          </h3>

                          <p>
                            {order.createdAt
                              ? new Date(
                                  order.createdAt
                                ).toLocaleString()
                              : ""}
                          </p>

                        </div>


                        <div>

                          <div className="order-total">
                            ₹
                            {
                              order.totalAmount
                            }
                          </div>

                          <span
                            className={getStatusClass(
                              order.status
                            )}
                          >
                            {order.status ||
                              "Pending"}
                          </span>

                        </div>

                      </div>


                      {/* STUDENT */}

                      <div className="admin-student-info">

                        <strong>
                          Student:
                        </strong>{" "}

                        {order.userId?.name ||
                          "Unknown Student"}

                        <br />

                        <strong>
                          Email:
                        </strong>{" "}

                        {order.userId?.email ||
                          "No email"}

                      </div>


                      {/* ITEMS */}

                      <div className="order-items">

                        <h4>
                          Ordered Items
                        </h4>

                        {order.items?.map(
                          (
                            item,
                            index
                          ) => (

                            <div
                              className="order-item"
                              key={
                                item._id ||
                                index
                              }
                            >

                              <span>

                                {item.itemName}

                                {" × "}

                                {
                                  item.quantity
                                }

                              </span>


                              <strong>

                                ₹
                                {
                                  Number(
                                    item.price
                                  ) *
                                  Number(
                                    item.quantity
                                  )
                                }

                              </strong>

                            </div>

                          )
                        )}

                      </div>


                      {/* PICKUP */}

                      <div className="order-information">

                        <div>

                          <span>
                            Pickup Time
                          </span>

                          <strong>
                            {
                              order.pickupTime ||
                              "Not specified"
                            }
                          </strong>

                        </div>


                        <div>

                          <span>
                            Total
                          </span>

                          <strong>
                            ₹
                            {
                              order.totalAmount
                            }
                          </strong>

                        </div>

                      </div>


                      {/* STATUS */}

                      <div className="status-management">

                        <label>
                          Order Status
                        </label>


                        <select
                          value={
                            order.status ||
                            "Pending"
                          }
                          onChange={(e) =>
                            updateOrderStatus(
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


                        <span
                          className={getStatusClass(
                            order.status
                          )}
                        >
                          {order.status ||
                            "Pending"}
                        </span>


                        <button
                          className="delete-order-btn"
                          onClick={() =>
                            deleteOrder(
                              order._id
                            )
                          }
                        >
                          🗑 Delete
                        </button>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </section>

        )}

      </main>

    </div>
  );
}

export default AdminDashboard;