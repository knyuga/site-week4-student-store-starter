import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import SubNavbar from "../SubNavbar/SubNavbar";
import Sidebar from "../Sidebar/Sidebar";
import Home from "../Home/Home";
import ProductDetail from "../ProductDetail/ProductDetail";
import NotFound from "../NotFound/NotFound";
import {
  removeFromCart,
  addToCart,
  getQuantityOfItemInCart,
  getTotalItemsInCart,
} from "../../utils/cart";
import "./App.css";

function App() {
  // State variables
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [searchInputValue, setSearchInputValue] = useState("");
  const [userInfo, setUserInfo] = useState({ name: "", dorm_number: "" });
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({}); // object that acts like a dictionary seperate by commas
  const [isFetching, setIsFetching] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);

  // Toggles sidebar
  const toggleSidebar = () => setSidebarOpen((isOpen) => !isOpen);

  // Functions to change state (used for lifting state)
  const handleOnRemoveFromCart = (item) => setCart(removeFromCart(cart, item));
  const handleOnAddToCart = (item) => setCart(addToCart(cart, item));
  const handleGetItemQuantity = (item) => getQuantityOfItemInCart(cart, item);
  const handleGetTotalCartItems = () => getTotalItemsInCart(cart);

  const handleOnSearchInputChange = (event) => {
    setSearchInputValue(event.target.value);
  };

  // In App.jsx implement the useEffect hook to fetch products from http://localhost:3000/products and update the products state
  useEffect(() => {
    // use state -   const [products, setProducts] = useState([]);
    // use effect should be use to trigger the state
    // fetch request from local host 3000/products
    // After receiving the data, you update the products state variable with the list of products.
    console.log("inside useeffect");
    const fetchProducts = async () => {
      // async must be used in a function not use effect
      console.log("inside fetchproduct");
      try {
        const { data } = await axios.get(`http://localhost:3000/api/products`);
        console.log(data);
        setProducts(data);
        console.log();
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []); // dependency array empty, so this should only run once

  // In App.jsx update handleOnCheckout function; set isCheckingOut to true, create an order with the cart items, make a POST request to
  // http://localhost:3000/orders, handle success and error responses, and
  // reset the cart.
  const handleOnCheckout = async () => {
    setIsCheckingOut(true);
    // create an order with the cart items
    // loop through the cart and items to order

    // added an order payload - how we did json on backend - and made an order using create order
    const dormNumber = parseInt(userInfo.dorm_number);
    const orderPayload = {
      customer_id: dormNumber,
      total_price: 0,
      status: "pending",
    };
    console.log("This is ze order payload:", orderPayload);
    const response = await axios.post(
      `http://localhost:3000/api/orders`,
      orderPayload
    );

    const orderId = response.data;
    console.log(orderId.order_id);
    for (const [productId, quantity] of Object.entries(cart)) {
      const product_id = parseInt(productId, 10);
      const product = products.find((p) => p.id === product_id);

      await axios.post(
        `http://localhost:3000/api/orders/${orderId.order_id}/items`,
        {
          items: [
            {
              product_id: product.id,
              quantity: quantity,
              price: product.price,
            },
          ],
        });
    } 
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Sidebar
          cart={cart}
          error={error}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          isOpen={sidebarOpen}
          products={products}
          toggleSidebar={toggleSidebar}
          isCheckingOut={isCheckingOut}
          addToCart={handleOnAddToCart}
          removeFromCart={handleOnRemoveFromCart}
          getQuantityOfItemInCart={handleGetItemQuantity}
          getTotalItemsInCart={handleGetTotalCartItems}
          handleOnCheckout={handleOnCheckout}
          order={order}
          setOrder={setOrder}
        />
        <main>
          <SubNavbar
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            searchInputValue={searchInputValue}
            handleOnSearchInputChange={handleOnSearchInputChange}
          />
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  error={error}
                  products={products}
                  isFetching={isFetching}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                  addToCart={handleOnAddToCart}
                  searchInputValue={searchInputValue}
                  removeFromCart={handleOnRemoveFromCart}
                  getQuantityOfItemInCart={handleGetItemQuantity}
                />
              }
            />
            <Route
              path="/:productId"
              element={
                <ProductDetail
                  cart={cart}
                  error={error}
                  products={products}
                  addToCart={handleOnAddToCart}
                  removeFromCart={handleOnRemoveFromCart}
                  getQuantityOfItemInCart={handleGetItemQuantity}
                />
              }
            />
            <Route
              path="*"
              element={
                <NotFound
                  error={error}
                  products={products}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                />
              }
            />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
