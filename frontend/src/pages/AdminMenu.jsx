import { useEffect, useState } from "react";
import axios from "axios";

function AdminMenu() {
  const [menu, setMenu] = useState([]);

  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

  const loadMenu = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/menu"
      );

      setMenu(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const addFood = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/menu",
        {
          itemName,
          description,
          price: Number(price),
          category,
          available: true
        }
      );

      alert("Food added successfully");

      setItemName("");
      setDescription("");
      setPrice("");
      setCategory("");

      loadMenu();

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to add food"
      );
    }
  };

  return (
    <div className="page-container">

      <div className="page-header">
        <h1>Manage Menu</h1>
        <p>
          Add and manage cafeteria food items
        </p>
      </div>


      {/* ADD FOOD */}

      <div className="auth-box">

        <h2>Add New Food</h2>

        <form onSubmit={addFood}>

          <input
            type="text"
            placeholder="Food name"
            value={itemName}
            onChange={(e) =>
              setItemName(e.target.value)
            }
            required
          />

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            required
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value)
            }
            required
          />

          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            required
          />

          <button type="submit">
            Add Food
          </button>

        </form>

      </div>


      {/* MENU LIST */}

      <div style={{ marginTop: "35px" }}>

        <h2>Current Menu</h2>

        <div className="menu-list">

          {menu.map((item) => (

            <div
              className="menu-item"
              key={item._id}
            >

              <div className="food-icon">
                🍛
              </div>

              <h3>
                {item.itemName}
              </h3>

              <p className="menu-description">
                {item.description}
              </p>

              <p className="menu-price">
                ₹{item.price}
              </p>

              <p className="menu-category">
                {item.category}
              </p>

              <p>
                Status:{" "}
                {item.available
                  ? "Available"
                  : "Not Available"}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default AdminMenu;