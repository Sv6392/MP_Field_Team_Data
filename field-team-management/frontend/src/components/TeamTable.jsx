import React from "react";

import {
    FaEdit,
    FaTrash,
    FaPhone
} from "react-icons/fa";

const TeamTable = ({
    teams,
    onEdit,
    onDelete
}) => {

    const callNumber = (number) => {

        if (!number) {
            return;
        }

        window.location.href = `tel:${number}`;
    };


    const Contact = ({ number }) => {

        if (!number) {
            return (
                <span className="text-muted">
                    -
                </span>
            );
        }

        return (
            <button
                className="contact-button"
                onClick={() => callNumber(number)}
            >
                <FaPhone />
                {number}
            </button>
        );
    };


    if (teams.length === 0) {

        return (
            <div className="empty-state">

                <h5>
                    No field team found
                </h5>

                <p>
                    Try changing your search or filter.
                </p>

            </div>
        );
    }


    return (

        <div className="table-responsive">

            <table className="table table-hover align-middle">

                <thead>

                    <tr>
                        <th>#</th>
                        <th>District</th>
                        <th>Block</th>

                        <th>FE Name</th>
                        <th>FE Contact</th>

                        <th>AM Name</th>
                        <th>AM Contact</th>

                        <th>ZOM Name</th>
                        <th>ZOM Contact</th>

                        <th>Status</th>
                        <th>Action</th>
                    </tr>

                </thead>


                <tbody>

                    {teams.map((team, index) => (

                        <tr key={team.id}>

                            <td>
                                {index + 1}
                            </td>

                            <td>
                                <strong>
                                    {team.district}
                                </strong>
                            </td>

                            <td>
                                {team.block}
                            </td>


                            <td>
                                {team.fe_name || "-"}
                            </td>

                            <td>
                                <Contact
                                    number={team.fe_contact}
                                />
                            </td>


                            <td>
                                {team.am_name || "-"}
                            </td>

                            <td>
                                <Contact
                                    number={team.am_contact}
                                />
                            </td>


                            <td>
                                {team.zom_name || "-"}
                            </td>

                            <td>
                                <Contact
                                    number={team.zom_contact}
                                />
                            </td>


                            <td>

                                <span
                                    className={
                                        team.status === "Active"
                                            ? "badge bg-success"
                                            : "badge bg-secondary"
                                    }
                                >
                                    {team.status}
                                </span>

                            </td>


                            <td>

                                <div className="d-flex gap-2">

                                    <button
                                        className="btn btn-sm btn-warning"
                                        onClick={() =>
                                            onEdit(team)
                                        }
                                    >
                                        <FaEdit />
                                    </button>


                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() =>
                                            onDelete(team.id)
                                        }
                                    >
                                        <FaTrash />
                                    </button>

                                </div>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );
};

export default TeamTable;