const express = require('express');
const app = express();
const port = 3000;
const productRoutes = require('../routes/productRoutes.js');
const orderRoutes = require('../routes/orderRoutes.js');
const orderItemRoutes = require('../routes/orderItemRoutes.js')
const cors = require("cors");

app.use(express.json())

const corsOption = {
  origin: "http://localhost:5173",
};
app.use(cors(corsOption));

app.get('/', (req, res) => {
    console.log('Received a request at /');
    res.send('Welcome to my app!')
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

app.use('/api/products', productRoutes); // Use product routes for /api/products -- use this route and that variable is an entrypoint variable
app.use('/api/orders', orderRoutes);
app.use('/api/orderItems', orderItemRoutes);


