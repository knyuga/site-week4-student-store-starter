const express = require("express");
const router = express.Router();
const orderControllers = require("../controllers/orderControllers.js");
const orderItemControllers = require("../controllers/orderItemControllers.js");

// regular CRUD
router.post("/", orderControllers.createOrder)
router.get("/", orderControllers.getAllOrders) // shift option down
router.get("/:order_id", orderControllers.getOrderbyId) 
router.put("/:order_id", orderControllers.updateOrder)
router.delete("/:order_id", orderControllers.deleteOrder)

// modifying CRUD endpoints

// GET /orders/:order_id: Fetch details of a specific order by its ID, including the order items.
// router.get("/:id", orderControllers.getOrderbyId) 


// custom endpoints
router.post("/:order_id/items", orderControllers.addItemToOrder);
router.get("/:order_id/total", orderControllers.calculateTotal);



module.exports = router;