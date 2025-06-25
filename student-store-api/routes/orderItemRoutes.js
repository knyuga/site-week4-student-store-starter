const express = require("express");
const router = express.Router();
const orderItemControllers = require("../controllers/orderItemControllers.js");

router.post("/", orderItemControllers.createOrderItem)
router.get("/", orderItemControllers.getAllOrderItems) // shift option down
router.get("/:id", orderItemControllers.getOrderItemById) 
router.put("/:id", orderItemControllers.updateOrderItem)
router.delete("/:id", orderItemControllers.deleteOrderItem)

module.exports = router;