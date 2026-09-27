import React from "react";

import {
    FaTachometerAlt,
    FaUsers,
    FaPlusCircle,
    FaFileExcel
} from "react-icons/fa";

const Sidebar = ({ onImportExport }) => {

    return (
        <div className="sidebar">

            <div className="sidebar-title">
                MENU
            </div>

            <div className="sidebar-item active">
                <FaTachometerAlt />
                <span>Dashboard</span>
            </div>

            <div className="sidebar-item">
                <FaUsers />
                <span>Field Teams</span>
            </div>

            <div className="sidebar-item">
                <FaPlusCircle />
                <span>Add Team</span>
            </div>

            <div
                className="sidebar-item"
                onClick={onImportExport}
            >
                <FaFileExcel />
                <span>Import / Export</span>
            </div>

        </div>
    );
};

export default Sidebar;