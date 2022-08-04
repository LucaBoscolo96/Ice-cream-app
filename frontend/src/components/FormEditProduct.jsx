import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const FormEditProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("0");
  const [msg, setMsg] = useState("");
  const prevQuantity = useRef(0);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getProductById = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/products/" + id
        );
        setName(response.data.name);
        setPrice(response.data.price);
        prevQuantity.current = response.data.quantity;
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
    };
    getProductById();
  }, [id]);

  const updateProduct = async (e) => {
    console.log(parseInt(prevQuantity.current, 10) + parseInt(quantity, 10));
    e.preventDefault();
    try {
      await axios.patch("http://localhost:5000/products/" + id, {
        name: name,
        price: price,
        quantity: parseInt(prevQuantity.current, 10) + parseInt(quantity, 10),
      });
      navigate("/products");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };
  return (
    <div>
      <h1 className="title">Products</h1>
      <h2 className="subtitle">Update Product</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            <form onSubmit={updateProduct}>
              <p className="has-text-centered has-text-danger">{msg}</p>
              <div className="field">
                <label className="label">Name</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Product name"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Price</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Price"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Current Quantity</label>
                <div className="control">
                  <input
                    type="number"
                    className="input"
                    value={prevQuantity.current}
                    readOnly
                    placeholder="Quantity"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">
                  How many would you like to order?
                </label>
                <div className="control">
                  <input
                    type="number"
                    className="input"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Quantity"
                  />
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <button type="submit" className="button is-success">
                    Update
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormEditProduct;
