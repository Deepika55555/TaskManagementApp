import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  console.log("Navbar user:", user);

  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">
        <Link to="/">Task Dashboard</Link>
      </h1>
      <div className="relative">
        {user ? (
          <>

            {/* User icon circle */}
            <button
              onClick={() => setDropdownOpen((open) => !open)}
              className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center focus:outline-none"
              aria-label="User menu"
            >
              {/* You can replace this with an actual user icon or initials */}
              <span className="text-white font-bold">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </span>
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg text-gray-800 py-2"
              >
                <p className="px-4 py-2 border-b border-gray-200">
                  {user.name || "User"}
                </p>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline mr-4">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
