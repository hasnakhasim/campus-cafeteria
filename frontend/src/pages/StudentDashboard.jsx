import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api";

function StudentDashboard() {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] =
    useState("home");

  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  const [pickupTime, setPickupTime] =
    useState("");

  const [loadingMenu, setLoadingMenu] =
    useState(false);

  const [loadingOrders, setLoadingOrders] =
    useState(false);

  const [placingOrder, setPlacingOrder] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [user, setUser] =
    useState(null);


  // =====================================================
  // GET USER + TOKEN
  // =====================================================

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    const storedUser =
      localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser =
        JSON.parse(storedUser);

      setUser(parsedUser);

      fetchMenu();

      // Load orders after user is available
      fetchOrders(parsedUser);

    } catch (err) {
      console.log(
        "User data error:",
        err
      );

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login");
    }
  }, [navigate]);


  // =====================================================
  // AXIOS CONFIG
  // =====================================================

  const getConfig = () => {
    const token =
      localStorage.getItem("token");

    return {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    };
  };


  // =====================================================
  // GET USER ID
  // =====================================================

  const getUserId = () => {
    try {
      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {
        return null;
      }

      const parsedUser =
        JSON.parse(storedUser);

      return (
        parsedUser._id ||
        parsedUser.id ||
        parsedUser.userId ||
        null
      );

    } catch (err) {
      console.log(
        "Unable to get user ID:",
        err
      );

      return null;
    }
  };


  // =====================================================
  // FETCH MENU
  // =====================================================

  const fetchMenu = async () => {
    try {
      setLoadingMenu(true);

      const response =
        await axios.get(
          `${API}/menu`
        );

      if (
        Array.isArray(
          response.data
        )
      ) {
        setMenu(
          response.data
        );

      } else if (
        Array.isArray(
          response.data.menu
        )
      ) {
        setMenu(
          response.data.menu
        );

      } else {
        setMenu([]);
      }

    } catch (err) {
      console.log(
        "Menu error:",
        err.response?.data ||
        err.message
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
  // FETCH MY ORDERS
  // =====================================================

  const fetchOrders = async (
    currentUser = null
  ) => {

    try {
      setLoadingOrders(true);

      setError("");

      let userId;

      if (currentUser) {
        userId =
          currentUser._id ||
          currentUser.id ||
          currentUser.userId;

      } else {
        userId =
          getUserId();
      }

      if (!userId) {
        console.log(
          "User ID not found"
        );

        setOrders([]);

        return;
      }

      console.log(
        "Loading orders for user:",
        userId
      );

      const response =
        await axios.get(
          `${API}/orders/my-orders/${userId}`,
          getConfig()
        );

      console.log(
        "MY ORDERS RESPONSE:",
        response.data
      );

      if (
        Array.isArray(
          response.data
        )
      ) {
        setOrders(
          response.data
        );

      } else if (
        Array.isArray(
          response.data.orders
        )
      ) {
        setOrders(
          response.data.orders
        );

      } else {
        setOrders([]);
      }

    } catch (err) {

      console.log(
        "Orders error:",
        err.response?.data ||
        err.message
      );

      setOrders([]);

      setError(
        err.response?.data?.message ||
        "Failed to load orders"
      );

    } finally {
      setLoadingOrders(false);
    }
  };


  // =====================================================
  // ADD TO CART
  // =====================================================

  const addToCart = (food) => {

    setMessage("");
    setError("");

    setCart(
      (previousCart) => {

        const existing =
          previousCart.find(
            (item) =>
              item._id ===
              food._id
          );

        if (existing) {

          return previousCart.map(
            (item) =>
              item._id ===
              food._id
                ? {
                    ...item,
                    quantity:
                      item.quantity + 1,
                  }
                : item
          );
        }

        return [
          ...previousCart,
          {
            ...food,
            quantity: 1,
          },
        ];
      }
    );

    setMessage(
      `${food.itemName} added to cart.`
    );
  };


  // =====================================================
  // INCREASE QUANTITY
  // =====================================================

  const increaseQuantity = (id) => {

    setCart(
      (previousCart) =>
        previousCart.map(
          (item) =>
            item._id === id
              ? {
                  ...item,
                  quantity:
                    item.quantity + 1,
                }
              : item
        )
    );
  };


  // =====================================================
  // DECREASE QUANTITY
  // =====================================================

  const decreaseQuantity = (id) => {

    setCart(
      (previousCart) =>
        previousCart
          .map(
            (item) =>
              item._id === id
                ? {
                    ...item,
                    quantity:
                      item.quantity - 1,
                  }
                : item
          )
          .filter(
            (item) =>
              item.quantity > 0
          )
    );
  };


  // =====================================================
  // REMOVE FROM CART
  // =====================================================

  const removeFromCart = (id) => {

    setCart(
      (previousCart) =>
        previousCart.filter(
          (item) =>
            item._id !== id
        )
    );
  };


  // =====================================================
  // TOTAL
  // =====================================================

  const cartTotal =
    cart.reduce(
      (total, item) =>
        total +
        Number(item.price) *
          Number(item.quantity),
      0
    );


  // =====================================================
  // PLACE ORDER
  // =====================================================

  const placeOrder = async () => {

    setMessage("");
    setError("");

    if (cart.length === 0) {

      setError(
        "Please add food to your cart."
      );

      return;
    }

    if (!pickupTime) {

      setError(
        "Please select a pickup time."
      );

      return;
    }

    const userId =
      getUserId();

    if (!userId) {

      setError(
        "User ID not found. Please login again."
      );

      return;
    }

    try {

      setPlacingOrder(true);

      const orderData = {

        userId: userId,

        items: cart.map(
          (item) => ({
            itemId:
              item._id,

            itemName:
              item.itemName,

            price:
              Number(item.price),

            quantity:
              Number(item.quantity),
          })
        ),

        totalAmount:
          cartTotal,

        pickupTime:
          pickupTime,

        status:
          "Pending",
      };


      console.log(
        "ORDER DATA:",
        orderData
      );


      const response =
        await axios.post(
          `${API}/orders`,
          orderData,
          getConfig()
        );


      console.log(
        "ORDER RESPONSE:",
        response.data
      );


      setMessage(
        "Order placed successfully!"
      );


      setCart([]);

      setPickupTime("");


      // Reload orders
      await fetchOrders();


      // Open My Orders
      setActiveSection(
        "orders"
      );

    } catch (err) {

      console.log(
        "PLACE ORDER ERROR:",
        err.response?.data ||
        err.message
      );

      setError(
        err.response?.data?.message ||
        "Failed to place order."
      );

    } finally {

      setPlacingOrder(false);
    }
  };


  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    navigate("/login");
  };


  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (
    status
  ) => {

    if (!status) {
      return "order-status pending";
    }

    return (
      "order-status " +
      status
        .toLowerCase()
        .replace(
          /\s+/g,
          "-"
        )
    );
  };


  // =====================================================
  // REFRESH ORDERS
  // =====================================================

  const refreshOrders = async () => {

    setMessage("");
    setError("");

    await fetchOrders();

    setMessage(
      "Orders refreshed."
    );
  };


  // =====================================================
  // RETURN
  // =====================================================

  return (

    <div className="student-home">


      {/* =================================================
          HEADER
      ================================================= */}

      <header className="student-header">

        <div className="student-brand">

          <div className="student-brand-icon">
            🍛
          </div>

          <div>

            <h1>
              Campus Cafeteria
            </h1>

            <p>
              Student Portal
            </p>

          </div>

        </div>


        <div className="student-profile">

          <span>
            👤{" "}
            {user?.name ||
              "Student"}
          </span>

          <button
            className="student-logout"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </header>


      {/* =================================================
          NAVIGATION
      ================================================= */}

      <nav className="student-navigation">

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
          🏠 Home
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
          🍛 Menu
        </button>


        <button
          className={
            activeSection === "cart"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveSection(
              "cart"
            )
          }
        >
          🛒 Cart ({cart.length})
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
          📦 My Orders
        </button>

      </nav>


      {/* =================================================
          MESSAGE
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
          CONTENT
      ================================================= */}

      <main className="student-content">


        {/* =================================================
            HOME
        ================================================= */}

        {activeSection === "home" && (

          <section className="student-section">

            <div className="student-welcome">

              <h2>
                Welcome,{" "}
                {user?.name ||
                  "Student"} 👋
              </h2>

              <p>
                Order your favourite
                cafeteria food and
                track your orders
                easily.
              </p>

            </div>


            <div className="student-card-grid">


              <div
                className="student-card"
                onClick={() =>
                  setActiveSection(
                    "menu"
                  )
                }
              >

                <div className="student-card-icon">
                  🍛
                </div>

                <h3>
                  View Menu
                </h3>

                <p>
                  Browse available
                  cafeteria food.
                </p>

              </div>


              <div
                className="student-card"
                onClick={() =>
                  setActiveSection(
                    "cart"
                  )
                }
              >

                <div className="student-card-icon">
                  🛒
                </div>

                <h3>
                  My Cart
                </h3>

                <p>
                  {cart.length} item(s)
                  in your cart.
                </p>

              </div>


              <div
                className="student-card"
                onClick={() => {

                  setActiveSection(
                    "orders"
                  );

                  fetchOrders();

                }}
              >

                <div className="student-card-icon">
                  📦
                </div>

                <h3>
                  My Orders
                </h3>

                <p>
                  Track your food
                  orders and status.
                </p>

              </div>

            </div>

          </section>

        )}


        {/* =================================================
            MENU
        ================================================= */}

        {activeSection === "menu" && (

          <section className="student-section">

            <div className="page-title">

              <h2>
                Cafeteria Menu
              </h2>

              <p>
                Select your favourite
                food.
              </p>

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
                  No food available
                </h3>

                <p>
                  Please check again
                  later.
                </p>

              </div>

            ) : (

              <div className="menu-grid">

                {menu.map(
                  (food) => (

                    <div
                      className="menu-card"
                      key={
                        food._id
                      }
                    >

                      <div className="menu-image">
                        🍛
                      </div>


                      <div className="menu-details">

                        <h3>
                          {
                            food.itemName
                          }
                        </h3>

                        <p className="menu-description">
                          {
                            food.description
                          }
                        </p>


                        {food.category && (

                          <span className="menu-category">
                            {
                              food.category
                            }
                          </span>

                        )}


                        <div className="menu-bottom">

                          <span className="menu-price">
                            ₹
                            {
                              food.price
                            }
                          </span>


                          <button
                            className="add-cart-btn"
                            onClick={() =>
                              addToCart(
                                food
                              )
                            }
                          >
                            Add
                          </button>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </section>

        )}


        {/* =================================================
            CART
        ================================================= */}

        {activeSection === "cart" && (

          <section className="student-section">

            <div className="page-title">

              <h2>
                My Cart
              </h2>

              <p>
                Review your order
                before placing it.
              </p>

            </div>


            {cart.length === 0 ? (

              <div className="empty-message">

                <h3>
                  Your cart is empty
                </h3>

                <p>
                  Add food items from
                  the menu.
                </p>

                <button
                  className="add-food-btn"
                  style={{
                    marginTop:
                      "15px",
                  }}
                  onClick={() =>
                    setActiveSection(
                      "menu"
                    )
                  }
                >
                  View Menu
                </button>

              </div>

            ) : (

              <div className="cart-container">


                <div className="cart-list">

                  {cart.map(
                    (item) => (

                      <div
                        className="cart-item"
                        key={
                          item._id
                        }
                      >

                        <div className="cart-item-info">

                          <h3>
                            {
                              item.itemName
                            }
                          </h3>

                          <p>
                            ₹
                            {
                              item.price
                            }{" "}
                            each
                          </p>

                        </div>


                        <div className="quantity-control">

                          <button
                            onClick={() =>
                              decreaseQuantity(
                                item._id
                              )
                            }
                          >
                            −
                          </button>

                          <span>
                            {
                              item.quantity
                            }
                          </span>

                          <button
                            onClick={() =>
                              increaseQuantity(
                                item._id
                              )
                            }
                          >
                            +
                          </button>

                        </div>


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


                        <button
                          className="delete-btn"
                          onClick={() =>
                            removeFromCart(
                              item._id
                            )
                          }
                        >
                          🗑
                        </button>

                      </div>

                    )
                  )}

                </div>


                <div className="cart-summary">

                  <h3>
                    Order Summary
                  </h3>


                  <div className="summary-row">

                    <span>
                      Items
                    </span>

                    <span>
                      {cart.length}
                    </span>

                  </div>


                  <div className="summary-total">

                    <span>
                      Total
                    </span>

                    <span>
                      ₹
                      {cartTotal}
                    </span>

                  </div>


                  <div className="pickup-box">

                    <label>
                      Pickup Time
                    </label>

                    <select
                      value={
                        pickupTime
                      }
                      onChange={(e) =>
                        setPickupTime(
                          e.target.value
                        )
                      }
                    >

                      <option value="">
                        Select pickup time
                      </option>

                      <option value="10:00 AM">
                        10:00 AM
                      </option>

                      <option value="11:00 AM">
                        11:00 AM
                      </option>

                      <option value="12:00 PM">
                        12:00 PM
                      </option>

                      <option value="1:00 PM">
                        1:00 PM
                      </option>

                      <option value="2:00 PM">
                        2:00 PM
                      </option>

                      <option value="3:00 PM">
                        3:00 PM
                      </option>

                      <option value="4:00 PM">
                        4:00 PM
                      </option>

                    </select>

                  </div>


                  <button
                    className="checkout-btn"
                    onClick={
                      placeOrder
                    }
                    disabled={
                      placingOrder
                    }
                  >

                    {placingOrder
                      ? "Placing Order..."
                      : "Place Order"}

                  </button>

                </div>

              </div>

            )}

          </section>

        )}


        {/* =================================================
            MY ORDERS
        ================================================= */}

        {activeSection === "orders" && (

          <section className="student-section">

            <div className="admin-section-header">

              <div>

                <h2>
                  My Orders
                </h2>

                <p>
                  Track your food order
                  status.
                </p>

              </div>


              <button
                className="add-food-btn"
                onClick={
                  refreshOrders
                }
              >
                🔄 Refresh
              </button>

            </div>


            {loadingOrders ? (

              <div className="empty-message">

                <h3>
                  Loading orders...
                </h3>

              </div>

            ) : orders.length === 0 ? (

              <div className="empty-message">

                <h3>
                  No orders yet
                </h3>

                <p>
                  Your placed orders
                  will appear here.
                </p>

              </div>

            ) : (

              <div className="orders-list">

                {orders.map(
                  (order) => (

                    <div
                      className="order-card"
                      key={
                        order._id
                      }
                    >


                      {/* HEADER */}

                      <div className="order-card-header">

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

                          <div className="order-amount">
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
                            {
                              order.status ||
                              "Pending"
                            }
                          </span>

                        </div>

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
                              className="order-item-row"
                              key={
                                item._id ||
                                index
                              }
                            >

                              <span>
                                {
                                  item.itemName
                                }

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


                      {/* FOOTER */}

                      <div className="order-footer">

                        <span>
                          🕐 Pickup:
                          {" "}
                          {
                            order.pickupTime ||
                            "Not specified"
                          }
                        </span>


                        <span>
                          Status:
                          {" "}
                          <strong>
                            {
                              order.status ||
                              "Pending"
                            }
                          </strong>
                        </span>

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

export default StudentDashboard;