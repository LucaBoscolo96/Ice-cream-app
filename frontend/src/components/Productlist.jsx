import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const Productlist = () => {
  const [products, setProducts] = useState([]);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    const response = await axios.get("http://localhost:5000/products");
    setProducts(response.data);
  };

  const deleteProduct = async (productId) => {
    await axios.delete("http://localhost:5000/products/" + productId);
    getProducts();
  };
  return (
    <div className="dashboard">
      <div className="header">
        <h1 className="title">Products</h1>
        <h2 className="subtitle">List of products</h2>
        {user && user.role === "admin" && (
          <Link to="/products/add" className="button is-primary mb-2">
            Add New Brand
          </Link>
        )}
      </div>

      <div className="columns is-multiline is-centered">
        {products.map((product, index) => (
          <div key={product.uuid} className="column product-card">
            <h2>{product.name}</h2>
            <div className="product-info">
              <h3>Price: {product.price}</h3>
              <h3>Quantity: {product.quantity}</h3>
              <h3>Created by: {product.user.name}</h3>
            </div>
            <Link
              to={"/products/edit/" + product.uuid}
              className="button is-primary card-button"
            >
              {user && user.role === "admin" && "Order"}
              {user && user.role === "user" && "Take"}
            </Link>{" "}
            {user && user.role === "admin" && (
              <button
                onClick={() => deleteProduct(product.uuid)}
                className="button is-info card-button"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Productlist;
