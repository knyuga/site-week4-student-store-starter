const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create an new order
const createOrder = async (req, res) => {
  console.log("Creating a new order");
  const { customer_id, status, items } = req.body;

  if (!status || !customer_id) {
    return res
      .status(400)
      .json({ error: "The customer id and status fields are required" });
  }

  try {
    const order = await prisma.order.create({
      data: {
        customer_id,
        status,
      },
    });
    console.log(order);
    console.log("Order created successfully");
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read an order by ID
const getOrderbyId = async (req, res) => {
  console.log("Getting order by ID");
  const { order_id } = req.params; // the name in the route
  if (!order_id) {
    return res.status(400).json({ error: "The id field is mandatory." });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { order_id: Number(order_id) }, // name in the prisma schema with the one in route
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  console.log("Order retrieved successfully.");
  console.log("Order ID:", order_id);
};

// Read all orders
const getAllOrders = async (req, res) => {
  console.log("Getting all orders");
  try {
    const orders = await prisma.order.findMany();
    console.log("All orders retrieve successfully.");
    console.log("Number of orders:", orders.length);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an order by ID
const updateOrder = async (req, res) => {
  console.log("Updating order by ID");
  const { order_id } = req.params; // get the id from the URL parameters
  const { customer_id, total_price, status } = req.body; // get the rest of the data from the request body
  if (!order_id) {
    return res.status(400).json({ error: "The id field is mandatory." });
  }
  console.log("Received ID:", order_id);
  console.log("Received data:", { customer_id, total_price, status });

  try {
    const order = await prisma.order.update({
      where: { order_id: Number(order_id) },
      data: {
        customer_id,
        total_price,
        status,
      },
    });
    res.json(order);
    console.log("Order updated successfully");
    console.log("Updated Order ID:", order_id);
    console.log(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an order by ID
const deleteOrder = async (req, res) => {
  console.log("Deleting order by ID");
  const { order_id } = req.params;
  if (!order_id) {
    return res.status(400).json({ error: "The id field is mandatory." });
  }
  try {
    const order = await prisma.order.delete({
      where: { order_id: Number(order_id) },
    });
    console.log("Order Item deleted successfully");
    console.log("Deleted Order Item ID:", order_id);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add add items to an existing order
const addItemToOrder = async (req, res) => {
  console.log("Add item to order");
  // you have the order id you are trying to add it to
  // you also have the items you are trying to add

  // make sure the order id exists in

  // for each item check that the product exists and the quantity is greater than 0

  // for each item, add a record to the table for order items
  // check if the item is already in order, and just update the quantity

  console.log("Creating a new order item or adding an item to existing order");
  const { order_id } = req.params;
  const { items } = req.body;
  console.log("ITEMS", req.body);

  if (!items) {
    return res.status(400).json({ error: "The item field is required" });
  }

  try {
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.product_id },
      });

      if (!product) {
        return res
          .status(400)
          .json({
            error: `Product with id ${item.product_id} does not exist.`,
          });
      } else if (item.quantity <= 0) {
        return res
          .status(400)
          .json({
            error: `Quantity for product ${item.product_id} must be greater than 0.`,
          });
      }

      const activeItem = await prisma.orderItem.findFirst({
        where: {
          order_id: parseInt(order_id),
          product_id: item.product_id,
        },
      });

      if (activeItem) {
        await prisma.orderItem.update({
          where: {
            order_item_id: activeItem.order_item_id,
          },
          data: {
            quantity: activeItem.quantity + item.quantity,
            price: item.price,
          },
        });
        console.log(`Updated quantity for product ${item.product_id}`);
      } else {
        await prisma.orderItem.create({
          data: {
            order_id: parseInt(order_id),
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
          },
        });
        console.log(`Created new order item for product ${item.product_id}`);
      }

      res.status(200).json({
        message: "add item to order was successful",
      });
    }
    // console.log(orderItem);
    // console.log("Order Item created successfully");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// calculate and return the total price of an order
const calculateTotal = async (req, res) => {
  // for each item in the order, calculate the price and return it

  const { order_id } = req.params; // comes from the route

  try {
    // Fetch all items for the given order

    // returns an array of order items
    const orderItems = await prisma.orderItem.findMany({
      where: { order_id: parseInt(order_id) },
    });

    // check there are order items (no null or lenght = 0 )
    if (!orderItems || orderItems.length === 0) {
      return res.status(404).json({ error: "No items found for this order." });
    }

    // Calculate total cost
    let total = 0;
    for (const item of orderItems) {
      total += item.quantity * item.price;
    }

    // update order in db
    const order = await prisma.order.update({
      where: { order_id: Number(order_id) },
      data: {
        total_price: total,
      },
    });

    // res.json({ order_id: parseInt(order_id), total });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOrder,
  getOrderbyId,
  getAllOrders,
  updateOrder,
  deleteOrder,
  addItemToOrder,
  calculateTotal,
};
