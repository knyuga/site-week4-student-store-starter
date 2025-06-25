const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create an new order item
const createOrderItem = async (req, res) => {
    console.log("Creating a new order item");
    const {order_id, product_id, quantity, price} = req.body;

    if (!order_id || !product_id || !quantity || !price) {
        return res.status(400).json({ error: 'The order id, product id, quantity, and price fields are required' });
    }

    try {
        const orderItem = await prisma.orderitem.create({
            data: {
                order_id,
                product_id,
                quantity,
                price
            }
        });
        console.log(orderItem);
        console.log("Order Item created successfully");
        res.json(order);
    } catch (error){
        res.status(500).json({error: error.message})
    }
}

// Read an order item by ID
const getOrderItemById = async (req, res) => {
    console.log("Getting order item by ID");
    const { id } = req.params; // the name in the route
    if ( !id ){
        return res.status(400).json({ error: "The id field is mandatory." });
    }

    try {
        const orderItem = await prisma.orderitem.findUnique(
            {where: { order_id: Number(id) }} // name in the prisma schema with the one in route
        );
        console.log("Order Item retrieved successfully.");
        console.log("Order item ID:", id);
        res.json(orderItem);
    } catch (error) {
        res.status(500).json({error: error.message})    
    }

}

// Read all order items
const getAllOrderItems = async (req, res) => {
    console.log("Getting all order items");
    try {
        const orderItems = await prisma.orderitem.findMany();
        console.log("All order items retrieved successfully.");
        console.log("Number of order items:", orderitems.length);
        res.json(orderItems);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

// Update an order item by ID
const updateOrderItem = async (req, res) => {
    console.log("Updating order item by ID");
    const { id } = req.params; // get the id from the URL parameters
    const { order_id, product_id, quantity, price } = req.body; // get the rest of the data from the request body
    if (!id) {
        return res.status(400).json({ error: "The id field is mandatory." });
    }
    console.log("Received ID:", id);
    console.log("Received data:", {order_id, product_id, quantity, price });

    try {
        const orderItem = await prisma.orderitem.update(
        { 
            where: { order_id: Number(id) }, 
            data: {
                order_id,
                product_id,
                quantity,
                price
            }
        });
        console.log("Order Item updated successfully");
        console.log("Updated Order Item ID:", id);
        console.log(orderItem);
        res.json(orderItem);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

// Delete an order item by ID
const deleteOrderItem = async (req, res) => {
    console.log("Deleting order item by ID");
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "The id field is mandatory." });
    }
    try {
        const orderItem = await prisma.orderitem.delete
        (
            { where: { order_id: Number(id) } }
        );
        res.json(orderItem);
        console.log("Order Item deleted successfully");
        console.log("Deleted Order ID:", id);
    } catch (error) {
        res.status(500).json({error: error.message})
    }

}

module.exports = {
    createOrderItem,
    getOrderItemById,
    getAllOrderItems,
    updateOrderItem,
    deleteOrderItem
}