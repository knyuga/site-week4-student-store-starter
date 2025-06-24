const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new product
const createProduct = async (req, res) => {
    console.log("Creating a new product");
    const {name, description, price, image_url, category} = req.body;
    //  console.log(req.body)
    if (!name || !price || !category) {
        return res.status(400).json({ error: 'The name, price, and category fields are required' });
    }

    try {
        const product = await prisma.product.create({ 
            data: {
                name,
                description,
                price,
                image_url,
                category
            } 
        })
        console.log(product);
        
        res.json(product);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
    console.log("Product created successfully");
}
// Read a product by ID & // Read all products
const getProductById = async (req, res) => {
    console.log("Getting product by ID");
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "The id field is mandatory." });
    }

    try {
        const product = await prisma.product.findUnique(
            {where: { id: Number(id) }}
        );
        res.json(product);
    } catch (error) {
        res.status(500).json({error: error.message})    
    }
    console.log("Product retrieved successfully");
    console.log("Product ID:", id);
}

const getAllProducts = async (req, res) => {
    console.log("Getting all products");
    try {
        const {category, sort} = req.query; // get the category and sort from the query parameters

        const where = {}; // prisma query filter -  box(or object) to hold rules for porducts we want
        if (category) {
            where.category = category; // filter by category if provided
        }

        let orderBy = {}; // prisma query order by, able to assign to new variables
        if (sort) { // prisma sort by
            if (sort === 'price') {
                orderBy = { price: 'asc' }; // sort by price in ascending order
            } else if (sort === 'name') {
                orderBy = { name: 'asc' }; // sort by name in ascending order
            } else {
                return res.status(400).json({ error: "Invalid sort parameter. Use 'price' or 'name'." });
            }
        }

        const products = await prisma.product.findMany(
            { where, 
            orderBy 
        }); // find many products with the where and orderBy filters
        res.json(products);
        console.log("All products retrieved successfully");
        console.log("Number of products:", products.length);
    } catch (error) {
        res.status(500).json({error: error.message})
    }

}

// Update a product by ID
const updateProduct = async (req, res) => {
    console.log("Updating product by ID");
    const { id } = req.params; // get the id from the URL parameters
    const { name, description, price, image_url, category } = req.body; // get the rest of the data from the request body
    if (!id) {
        return res.status(400).json({ error: "The id field is mandatory." });
    }

    console.log("Received ID:", id);
    console.log("Received data:", { name, description, price, image_url, category });

    try {
        const product = await prisma.product.update(
        { 
            where: { id: Number(id) }, 
            data: {
                name,
                description,
                price,
                image_url,
                category
            }
        });
        res.json(product);
        console.log("Product updated successfully");
        console.log("Updated product ID:", id);
        console.log(product);
    } catch (error) {
        res.status(500).json({error: error.message})
    }

}

// Delete a product by ID
const deleteProduct = async (req, res) => {
    console.log("Deleting product by ID");
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "The id field is mandatory." });
    }
    try {
        const product = await prisma.product.delete
        (
            { where: { id: Number(id) } }
        );
        res.json(product);
        console.log("Product deleted successfully");
        console.log("Deleted product ID:", id);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}


module.exports = {
    createProduct,
    getProductById,
    getAllProducts,
    updateProduct,
    deleteProduct
}
