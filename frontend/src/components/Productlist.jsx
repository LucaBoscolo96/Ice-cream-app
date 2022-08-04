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
    <div>
      <h1 className="title">Products</h1>
      <h2 className="subtitle">List of products</h2>
      {user && user.role === "admin" && (
        <Link to="/products/add" className="button is-primary mb-2">
          Add New Brand
        </Link>
      )}
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            {/* <th>No</th> */}
            <th>Brand</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Created by</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.uuid}>
              {/* <td>{index + 1}</td> */}
              <td style={{ textAlign: "left" }}>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.quantity}</td>
              <td>{product.user.name}</td>
              <td>
                <Link
                  to={"/products/edit/" + product.uuid}
                  className="button is-primary"
                >
                  {user && user.role === "admin" && "Order Ice-Cream"}
                  {user && user.role === "user" && "Take Ice-cream"}
                </Link>
                {user && user.role === "admin" && (
                  <button
                    onClick={() => deleteProduct(product.uuid)}
                    className="button is-info"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Productlist;
