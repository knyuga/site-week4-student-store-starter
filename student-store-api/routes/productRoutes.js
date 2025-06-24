const express = require("express");
const router = express.Router();
const productControllers = require("../controllers/productControllers.js");


router.post("/", productControllers.createProduct)
router.get("/", productControllers.getAllProducts) // shift option down
router.get("/:id", productControllers.getProductById) 
router.put("/:id", productControllers.updateProduct)
router.delete("/:id", productControllers.deleteProduct)


module.exports = router;