import React from "react";
import { FaUsers } from "react-icons/fa";

const Navbar = () => {
    return (
        <nav className="navbar navbar-dark bg-primary px-4">
            <div className="container-fluid">

                <span className="navbar-brand mb-0 h1 d-flex align-items-center gap-2">
                    <FaUsers />
                    Field Team Management <b>/Suraj Verma</b>
                </span>

                <span className="text-white">
                    <strong>Welcome, Admin(Suraj)!</strong>
                </span>

            </div>
        </nav>
    );
};

export default Navbar;