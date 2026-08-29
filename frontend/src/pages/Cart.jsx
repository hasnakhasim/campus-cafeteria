import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Cart() {

  const [cart, setCart] = useState([]);
  const [pickupTime, setPickupTime] =
    useState("");

  const navigate = useNavigate();

  useEffect(() => {

    const savedCart =
      JSON.parse(
        localStorage.getItem("cart")
      ) || [];

    setCart(savedCart);

  }, []);

  const increaseQuantity = (id) => {

    const updatedCart = cart.map(
      (item) =>
        item._id === id
          ? {
              ...item,
              quantity:
                item.quantity + 1
            }
          : item
    );

    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

  };

  const decreaseQuantity = (id) => {

    const updatedCart = cart
      .map(
        (item) =>
          item._id === id
            ? {
                ...item,
                quantity:
                  item.quantity - 1
              }
            : item
      )
      .filter(
        (item) => item.quantity > 0
      );

    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

  };

  const totalAmount = cart.reduce(
    (total, item) =>
      total +
      item.price * item.quantity,
    0
  );

  const placeOrder = async () => {

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    if (!pickupTime) {
      alert("Please select pickup time");
      return;
    }

    const user =
      JSON.parse(
        localStorage.getItem("user")
      );

    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {

      const orderData = {

        userId: user.id,

        items: cart.map(
          (item) => ({
            menuId: item._id,
            itemName: item.itemName,
            price: item.price,
            quantity: item.quantity
          })
        ),

        totalAmount: totalAmount,

        pickupTime: pickupTime

      };

      const response =
        await axios.post(
          "http://localhost:5000/api/orders",
          orderData
        );

      alert(
        response.data.message
      );

      localStorage.removeItem(
        "cart"
      );

      navigate("/orders");

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Order failed"
      );

    }
  };

  return (
    <div>

      <h1>🛒 Your Cart</h1>

      {cart.length === 0 ? (

        <div>

          <p>
            Your cart is empty.
          </p>

          <button
            onClick={() =>
              navigate("/menu")
            }
          >
            Back to Menu
          </button>

        </div>

      ) : (

        <div>

          {cart.map((item) => (

            <div key={item._id}>

              <h2>
                {item.itemName}
              </h2>

              <p>
                Price: ₹{item.price}
              </p>

              <button
                onClick={() =>
                  decreaseQuantity(
                    item._id
                  )
                }
              >
                -
              </button>

              <span>
                {" "}
                {item.quantity}{" "}
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

              <p>
                Item Total: ₹
                {item.price *
                  item.quantity}
              </p>

              <hr />

            </div>

          ))}

          <h2>
            Total: ₹{totalAmount}
          </h2>

          <h3>
            Select Pickup Time
          </h3>

          <select
            value={pickupTime}
            onChange={(e) =>
              setPickupTime(
                e.target.value
              )
            }
          >

            <option value="">
              Select pickup time
            </option>

            <option value="12:30 PM">
              12:30 PM
            </option>

            <option value="1:00 PM">
              1:00 PM
            </option>

            <option value="1:30 PM">
              1:30 PM
            </option>

            <option value="2:00 PM">
              2:00 PM
            </option>

          </select>

          <br />
          <br />

          <button
            onClick={placeOrder}
          >
            Place Order
          </button>

        </div>

      )}

    </div>
  );
}

export default Cart;