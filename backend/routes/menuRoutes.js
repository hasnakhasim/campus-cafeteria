const express = require("express");

const router = express.Router();

const Menu = require("../models/Menu");


// =====================================================
// GET ALL MENU
// GET /api/menu
// =====================================================

router.get("/", async (req, res) => {

  try {

    const menu =
      await Menu.find()
        .sort({
          createdAt: -1
        });


    res.json(menu);

  } catch (error) {

    console.error(
      "Get menu error:",
      error
    );

    res.status(500).json({

      message:
        error.message ||
        "Failed to fetch menu"

    });

  }

});



// =====================================================
// ADD MENU ITEM
// POST /api/menu
// =====================================================

router.post("/", async (req, res) => {

  try {

    const {
      itemName,
      description,
      price,
      category,
      available
    } = req.body;


    if (
      !itemName ||
      !description ||
      !price ||
      !category
    ) {

      return res.status(400).json({

        message:
          "Please provide all menu details"

      });

    }


    const menu =
      new Menu({

        itemName:
          itemName,

        description:
          description,

        price:
          Number(price),

        category:
          category,

        available:
          available !== undefined
            ? available
            : true

      });


    const savedMenu =
      await menu.save();


    res.status(201).json({

      message:
        "Menu item added successfully",

      menu:
        savedMenu

    });

  } catch (error) {

    console.error(
      "Add menu error:",
      error
    );

    res.status(500).json({

      message:
        error.message ||
        "Failed to add menu item"

    });

  }

});



// =====================================================
// UPDATE MENU ITEM
// PUT /api/menu/:id
// =====================================================

router.put(
  "/:id",
  async (req, res) => {

    try {

      const updatedMenu =
        await Menu.findByIdAndUpdate(

          req.params.id,

          req.body,

          {
            new: true,
            runValidators: true
          }

        );


      if (!updatedMenu) {

        return res.status(404).json({

          message:
            "Menu item not found"

        });

      }


      res.json({

        message:
          "Menu item updated successfully",

        menu:
          updatedMenu

      });

    } catch (error) {

      console.error(
        "Update menu error:",
        error
      );

      res.status(500).json({

        message:
          error.message ||
          "Failed to update menu"

      });

    }

  }
);



// =====================================================
// DELETE MENU ITEM
// DELETE /api/menu/:id
// =====================================================

router.delete(
  "/:id",
  async (req, res) => {

    try {

      const deletedMenu =
        await Menu.findByIdAndDelete(
          req.params.id
        );


      if (!deletedMenu) {

        return res.status(404).json({

          message:
            "Menu item not found"

        });

      }


      res.json({

        message:
          "Menu item deleted successfully",

        menu:
          deletedMenu

      });

    } catch (error) {

      console.error(
        "Delete menu error:",
        error
      );

      res.status(500).json({

        message:
          error.message ||
          "Failed to delete menu item"

      });

    }

  }
);


module.exports = router;