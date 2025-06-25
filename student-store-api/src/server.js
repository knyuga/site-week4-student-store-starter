const express = require('express');
const app = express();
const port = 3000;
const productRoutes = require('../routes/productRoutes.js');
const orderRoutes = require('../routes/orderRoutes.js');
const orderItemRoutes = require('../routes/orderItemRoutes.js')
app.use(express.json())



app.get('/', (req, res) => {
    console.log('Received a request at /');
    res.send('Welcome to my app!')
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

app.use('/api/products', productRoutes); // Use product routes for /api/products -- use this route and that variable is an entrypoint variable
app.use('/api/orders', orderRoutes);
// app.use('/api/orderItems', orderItemRoutes);
app.use('/api/orders', orderItemRoutes);


