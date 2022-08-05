import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import emailjs from "@emailjs/browser";

const FormEditProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("0");
  const [today, setToday] = useState("0");
  const [msg, setMsg] = useState("");
  const prevQuantity = useRef(0);
  const [newQuantity, setNewQuantity] = useState();

  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);

  const customMsg = () => {
    if (user.today === 0) {
      return "You still haven't had any ice cream today!";
    }
    if (user.today === 1) {
      return "You have already taken one ice cream today";
    }
    if (user.today === 2) {
      return "You had enougth ice cream for today. Come back tomorrow!";
    }
  };
  const templateParams = {
    product: name,
    quantity: newQuantity,
  };

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

  useEffect(() => {
    setNewQuantity(parseInt(prevQuantity.current, 10) - parseInt(quantity, 10));
  }, [quantity]);

  const checkQuantity = (e) => {
    e.preventDefault();
    console.log(quantity);
    if (user.role === "admin") {
      if (quantity < 5) {
        setMsg("Order at least 5 items!");
      } else {
        orderIcecream();
      }
    }
    if (user.role === "user") {
      if (user.today + parseInt(quantity, 10) > 2) {
        setMsg("You can take maximum 2 ice cream per day!");
      } else {
        console.log(quantity);
        takeIcecream();
      }
    }
  };

  const orderIcecream = async () => {
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

  const takeIcecream = async () => {
    console.log(newQuantity);

    try {
      await axios.patch("http://localhost:5000/products/" + id, {
        name: name,
        price: price,
        quantity: newQuantity,
      });
      if (newQuantity < 10) {
        emailjs.send(
          "default_service",
          "template_icecream",
          templateParams,
          "cD0MTG16d4UZX8cVk"
        );
        console.log("email sent");
      }
      navigate("/products");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
    todayCount();
  };

  const todayCount = async () => {
    try {
      await axios.patch("http://localhost:5000/users/" + user.uuid, {
        today: user.today + parseInt(quantity, 10),
      });
    } catch (error) {
      if (error.response) {
        setMsg("A problem occured. Retry");
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
            <form onSubmit={checkQuantity}>
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

              {user && user.role === "user" && (
                <div>
                  <h4>{customMsg()}</h4>
                </div>
              )}

              <div className="field">
                {user && user.role === "admin" && (
                  <div>
                    <label className="label">
                      How many would you like to order?
                    </label>
                    <span>Min 5</span>
                  </div>
                )}
                {user && user.role === "user" && (
                  <div>
                    <label className="label">
                      How many would you like to take?
                    </label>
                    <span>Max 2</span>
                  </div>
                )}

                <div className="mt-1 control">
                  <input
                    type="number"
                    className="input"
                    min="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.currentTarget.value)}
                    placeholder="Quantity"
                  />
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <button type="submit" className="button is-primary">
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
