import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../acamar-logo.jpg";
import { useDispatch, useSelector } from "react-redux";
import { LoginUser, LogOut, reset } from "../features/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const logout = () => {
    dispatch(LogOut());
    dispatch(reset());
    navigate("/");
  };
  return (
    <div>
      <nav
        className="navbar is-fixed-top has-shadow"
        role="navigation"
        aria-label="main navigation"
      >
        {/* <NavLink to="/dashboard" className="navbar-item" href="!#">
            <img src={logo} alt="logo" />
          </NavLink> */}
        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons"></div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
