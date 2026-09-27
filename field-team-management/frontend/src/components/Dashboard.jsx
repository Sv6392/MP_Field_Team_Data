import React from "react";

import {
    FaMapMarkerAlt,
    FaBuilding,
    FaUserTie,
    FaUsers
} from "react-icons/fa";

const Dashboard = ({ teams }) => {

    const districts = [
        ...new Set(teams.map(team => team.district))
    ];

    const blocks = [
        ...new Set(teams.map(team => team.block))
    ];

    const feCount = teams.filter(
        team => team.fe_name
    ).length;

    const activeTeams = teams.filter(
        team => team.status === "Active"
    ).length;

    return (
        <div className="row g-4 mb-4">

            <div className="col-md-3">
                <div className="dashboard-card">

                    <div className="card-icon">
                        <FaMapMarkerAlt />
                    </div>

                    <div>
                        <h6>Districts</h6>
                        <h2>{districts.length}</h2>
                    </div>

                </div>
            </div>


            <div className="col-md-3">
                <div className="dashboard-card">

                    <div className="card-icon">
                        <FaBuilding />
                    </div>

                    <div>
                        <h6>Blocks</h6>
                        <h2>{blocks.length}</h2>
                    </div>

                </div>
            </div>


            <div className="col-md-3">
                <div className="dashboard-card">

                    <div className="card-icon">
                        <FaUserTie />
                    </div>

                    <div>
                        <h6>Field Teams</h6>
                        <h2>{feCount}</h2>
                    </div>

                </div>
            </div>


            <div className="col-md-3">
                <div className="dashboard-card">

                    <div className="card-icon">
                        <FaUsers />
                    </div>

                    <div>
                        <h6>Active Teams</h6>
                        <h2>{activeTeams}</h2>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default Dashboard;