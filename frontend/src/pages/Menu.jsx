import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Menu() {

  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {

    axios
      .get("http://localhost:5000/api/menu")
      .then((response) => {
        setMenu(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

  }, []);

  const addToCart = (item) => {

    const existingItem = cart.find(
      (cartItem) =>
        cartItem._id === item._id
    );

    if (existingItem) {

      setCart(
        cart.map((cartItem) =>
          cartItem._id === item._id
            ? {
                ...cartItem,
                quantity:
                  cartItem.quantity + 1
              }
            : cartItem
        )
      );

    } else {

      setCart([
        ...cart,
        {
          ...item,
          quantity: 1
        }
      ]);

    }
  };

  const increaseQuantity = (id) => {

    setCart(
      cart.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: item.quantity + 1
            }
          : item
      )
    );

  };

  const decreaseQuantity = (id) => {

    setCart(
      cart
        .map((item) =>
          item._id === id
            ? {
                ...item,
                quantity: item.quantity - 1
              }
            : item
        )
        .filter(
          (item) => item.quantity > 0
        )
    );

  };

  const goToCart = () => {

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

    navigate("/cart");

  };

  return (
    <div>

      <h1>🍴 Campus Cafeteria</h1>

      <h2>Today's Menu</h2>

      {menu.map((item) => {

        const cartItem = cart.find(
          (c) => c._id === item._id
        );

        return (

          <div key={item._id}>

            <h3>
              {item.itemName}
            </h3>

            <p>
              {item.description}
            </p>

            <p>
              ₹{item.price}
            </p>

            <p>
              Category: {item.category}
            </p>

            {item.available ? (
              <p>✅ Available</p>
            ) : (
              <p>❌ Not Available</p>
            )}

            {!cartItem ? (

              <button
                onClick={() =>
                  addToCart(item)
                }
                disabled={!item.available}
              >
                Add to Cart
              </button>

            ) : (

              <div>

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
                  {cartItem.quantity}{" "}
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

            )}

            <hr />

          </div>

        );

      })}

      <h3>
        Cart Items:{" "}
        {cart.reduce(
          (total, item) =>
            total + item.quantity,
          0
        )}
      </h3>

      <button onClick={goToCart}>
        🛒 View Cart
      </button>

    </div>
  );
}

export default Menu;