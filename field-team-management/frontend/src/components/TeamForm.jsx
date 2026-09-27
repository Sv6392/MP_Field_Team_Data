import React, { useEffect, useState } from "react";

import {
    FaSave,
    FaTimes
} from "react-icons/fa";

const emptyForm = {
    district: "",
    block: "",

    fe_name: "",
    fe_contact: "",

    am_name: "",
    am_contact: "",

    zom_name: "",
    zom_contact: "",

    status: "Active",
    remarks: ""
};


const TeamForm = ({
    editingTeam,
    onSubmit,
    onCancel
}) => {

    const [form, setForm] = useState(emptyForm);


    useEffect(() => {

        if (editingTeam) {

            setForm({
                district: editingTeam.district || "",
                block: editingTeam.block || "",

                fe_name: editingTeam.fe_name || "",
                fe_contact: editingTeam.fe_contact || "",

                am_name: editingTeam.am_name || "",
                am_contact: editingTeam.am_contact || "",

                zom_name: editingTeam.zom_name || "",
                zom_contact: editingTeam.zom_contact || "",

                status: editingTeam.status || "Active",
                remarks: editingTeam.remarks || ""
            });

        } else {

            setForm(emptyForm);

        }

    }, [editingTeam]);


    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setForm({
            ...form,
            [name]: value
        });
    };


    const handleSubmit = (e) => {

        e.preventDefault();

        onSubmit(form);

    };


    return (

        <div className="form-card">

            <div className="form-header">

                <h4>
                    {editingTeam
                        ? "Edit Field Team"
                        : "Add Field Team"
                    }
                </h4>

                <button
                    className="btn btn-light"
                    onClick={onCancel}
                >
                    <FaTimes />
                </button>

            </div>


            <form onSubmit={handleSubmit}>

                <div className="row g-3">


                    {/* District */}

                    <div className="col-md-6">

                        <label>
                            District *
                        </label>

                        <input
                            type="text"
                            name="district"
                            className="form-control"
                            value={form.district}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* Block */}

                    <div className="col-md-6">

                        <label>
                            Block *
                        </label>

                        <input
                            type="text"
                            name="block"
                            className="form-control"
                            value={form.block}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* FE */}

                    <div className="col-md-6">

                        <label>
                            FE Name
                        </label>

                        <input
                            type="text"
                            name="fe_name"
                            className="form-control"
                            value={form.fe_name}
                            onChange={handleChange}
                        />

                    </div>


                    <div className="col-md-6">

                        <label>
                            FE Contact
                        </label>

                        <input
                            type="tel"
                            name="fe_contact"
                            className="form-control"
                            maxLength="15"
                            value={form.fe_contact}
                            onChange={handleChange}
                        />

                    </div>


                    {/* AM */}

                    <div className="col-md-6">

                        <label>
                            AM Name
                        </label>

                        <input
                            type="text"
                            name="am_name"
                            className="form-control"
                            value={form.am_name}
                            onChange={handleChange}
                        />

                    </div>


                    <div className="col-md-6">

                        <label>
                            AM Contact
                        </label>

                        <input
                            type="tel"
                            name="am_contact"
                            className="form-control"
                            maxLength="15"
                            value={form.am_contact}
                            onChange={handleChange}
                        />

                    </div>


                    {/* ZOM */}

                    <div className="col-md-6">

                        <label>
                            ZOM Name
                        </label>

                        <input
                            type="text"
                            name="zom_name"
                            className="form-control"
                            value={form.zom_name}
                            onChange={handleChange}
                        />

                    </div>


                    <div className="col-md-6">

                        <label>
                            ZOM Contact
                        </label>

                        <input
                            type="tel"
                            name="zom_contact"
                            className="form-control"
                            maxLength="15"
                            value={form.zom_contact}
                            onChange={handleChange}
                        />

                    </div>


                    {/* Status */}

                    <div className="col-md-6">

                        <label>
                            Status
                        </label>

                        <select
                            name="status"
                            className="form-select"
                            value={form.status}
                            onChange={handleChange}
                        >

                            <option value="Active">
                                Active
                            </option>

                            <option value="Inactive">
                                Inactive
                            </option>

                        </select>

                    </div>


                    {/* Remarks */}

                    <div className="col-md-6">

                        <label>
                            Remarks
                        </label>

                        <input
                            type="text"
                            name="remarks"
                            className="form-control"
                            value={form.remarks}
                            onChange={handleChange}
                        />

                    </div>


                    {/* Buttons */}

                    <div className="col-12">

                        <hr />

                        <div className="d-flex justify-content-end gap-2">

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onCancel}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                <FaSave className="me-2" />

                                {editingTeam
                                    ? "Update Team"
                                    : "Save Team"
                                }

                            </button>

                        </div>

                    </div>

                </div>

            </form>

        </div>

    );
};

export default TeamForm;