import React, { useEffect, useState } from "react";

import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaSearch,
    FaSyncAlt,
    FaUsers,
    FaSpinner
} from "react-icons/fa";

import SearchBar from "../components/SearchBar";
import API from "../services/api";


const FieldTeam = () => {

    // ==========================================
    // DATA
    // ==========================================

    const [fieldTeams, setFieldTeams] = useState([]);

    const [districts, setDistricts] = useState([]);

    const [blocks, setBlocks] = useState([]);


    // ==========================================
    // SEARCH / FILTER
    // ==========================================

    const [search, setSearch] = useState("");

    const [district, setDistrict] = useState("");

    const [selectedBlocks, setSelectedBlocks] =
        useState([]);


    // ==========================================
    // UI STATES
    // ==========================================

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // ==========================================
    // PAGINATION
    // ==========================================

    const [currentPage, setCurrentPage] =
        useState(1);

    const recordsPerPage = 10;


    // ==========================================
    // EDIT STATE
    // ==========================================

    const [editingId, setEditingId] =
        useState(null);


    const [editData, setEditData] = useState({
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
    });


    // ==========================================
    // ADD FORM
    // ==========================================

    const [showAddForm, setShowAddForm] =
        useState(false);


    const [newData, setNewData] = useState({
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
    });


    // ==========================================
    // LOAD ALL DATA
    // ==========================================

    const loadFieldTeams = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await API.get(
                "/field-teams"
            );


            if (response.data.success) {

                setFieldTeams(
                    response.data.data || []
                );

            } else {

                setFieldTeams([]);

            }

        } catch (err) {

            console.error(
                "Load field teams error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load field team data"
            );

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // LOAD DISTRICTS
    // ==========================================

    const loadDistricts = async () => {

        try {

            const response = await API.get(
                "/field-teams/districts"
            );


            if (response.data.success) {

                setDistricts(
                    response.data.data || []
                );

            }

        } catch (err) {

            console.error(
                "District loading error:",
                err
            );

        }

    };


    // ==========================================
    // LOAD BLOCKS
    // ==========================================

    const loadBlocks = async (
        selectedDistrict = ""
    ) => {

        try {

            if (!selectedDistrict) {

                setBlocks([]);

                return;

            }


            const response = await API.get(
                "/field-teams/blocks",
                {
                    params: {
                        district:
                            selectedDistrict
                    }
                }
            );


            if (response.data.success) {

                setBlocks(
                    response.data.data || []
                );

            } else {

                setBlocks([]);

            }

        } catch (err) {

            console.error(
                "Block loading error:",
                err
            );

            setBlocks([]);

        }

    };


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {

        loadFieldTeams();

        loadDistricts();

    }, []);


    // ==========================================
    // LOAD BLOCKS WHEN DISTRICT CHANGES
    // ==========================================

    useEffect(() => {

        loadBlocks(district);

        setSelectedBlocks([]);

    }, [district]);


    // ==========================================
    // SEARCH
    // ==========================================

    const handleSearch = async () => {

        try {

            setLoading(true);

            setError("");

            setCurrentPage(1);


            const params = {};


            if (search.trim()) {

                params.search =
                    search.trim();

            }


            if (district) {

                params.district =
                    district;

            }


            if (
                selectedBlocks.length > 0
            ) {

                params.blocks =
                    selectedBlocks.join(",");

            }


            const response = await API.get(
                "/field-teams/search",
                {
                    params
                }
            );


            if (response.data.success) {

                setFieldTeams(
                    response.data.data || []
                );

            } else {

                setFieldTeams([]);

            }

        } catch (err) {

            console.error(
                "Search error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Search failed"
            );

            setFieldTeams([]);

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // RESET
    // ==========================================

    const handleReset = () => {

        setSearch("");

        setDistrict("");

        setSelectedBlocks([]);

        setCurrentPage(1);

        setError("");

        setSuccess("");

        loadFieldTeams();

    };


    // ==========================================
    // ADD FORM CHANGE
    // ==========================================

    const handleNewDataChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setNewData({
            ...newData,
            [name]: value
        });

    };


    // ==========================================
    // ADD FIELD TEAM
    // ==========================================

    const handleAdd = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            setError("");

            setSuccess("");


            const response = await API.post(
                "/field-teams",
                newData
            );


            if (response.data.success) {

                setSuccess(
                    "Field team added successfully."
                );


                setNewData({
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
                });


                setShowAddForm(false);

                await loadFieldTeams();

            }

        } catch (err) {

            console.error(
                "Add field team error:",
                err
            );


            setError(
                err.response?.data?.message ||
                "Unable to add field team"
            );

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // START EDIT
    // ==========================================

    const handleEdit = (team) => {

        setEditingId(team.id);

        setEditData({
            district:
                team.district || "",

            block:
                team.block || "",

            fe_name:
                team.fe_name || "",

            fe_contact:
                team.fe_contact || "",

            am_name:
                team.am_name || "",

            am_contact:
                team.am_contact || "",

            zom_name:
                team.zom_name || "",

            zom_contact:
                team.zom_contact || "",

            status:
                team.status || "Active",

            remarks:
                team.remarks || ""
        });

    };


    // ==========================================
    // EDIT CHANGE
    // ==========================================

    const handleEditChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setEditData({
            ...editData,
            [name]: value
        });

    };


    // ==========================================
    // UPDATE
    // ==========================================

    const handleUpdate = async (id) => {

        try {

            setLoading(true);

            setError("");

            setSuccess("");


            const response = await API.put(
                `/field-teams/${id}`,
                editData
            );


            if (response.data.success) {

                setSuccess(
                    "Field team updated successfully."
                );

                setEditingId(null);

                await loadFieldTeams();

            }

        } catch (err) {

            console.error(
                "Update error:",
                err
            );


            setError(
                err.response?.data?.message ||
                "Unable to update field team"
            );

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // DELETE
    // ==========================================

    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this field team?"
            );


        if (!confirmDelete) {
            return;
        }


        try {

            setLoading(true);

            setError("");

            setSuccess("");


            const response = await API.delete(
                `/field-teams/${id}`
            );


            if (response.data.success) {

                setSuccess(
                    "Field team deleted successfully."
                );


                await loadFieldTeams();

            }

        } catch (err) {

            console.error(
                "Delete error:",
                err
            );


            setError(
                err.response?.data?.message ||
                "Unable to delete field team"
            );

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // PAGINATION
    // ==========================================

    const totalPages =
        Math.ceil(
            fieldTeams.length /
            recordsPerPage
        );


    const startIndex =
        (currentPage - 1) *
        recordsPerPage;


    const currentRecords =
        fieldTeams.slice(
            startIndex,
            startIndex + recordsPerPage
        );


    const goToPage = (page) => {

        if (
            page < 1 ||
            page > totalPages
        ) {
            return;
        }

        setCurrentPage(page);

    };


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <div className="field-team-page">


            {/* ==================================
                PAGE HEADER
            ================================== */}

            <div className="page-header">

                <div>

                    <h2>
                        Field Team Management
                    </h2>

                    <p>
                        Manage FE, AM and ZOM
                        information
                    </p>

                </div>


                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() =>
                        setShowAddForm(
                            !showAddForm
                        )
                    }
                >

                    <FaPlus
                        className="me-2"
                    />

                    Add Field Team

                </button>

            </div>


            {/* ==================================
                ALERTS
            ================================== */}

            {error && (

                <div className="alert alert-danger">

                    {error}

                </div>

            )}


            {success && (

                <div className="alert alert-success">

                    {success}

                </div>

            )}


            {/* ==================================
                ADD FORM
            ================================== */}

            {showAddForm && (

                <div className="card mb-4">

                    <div className="card-header">

                        <h5 className="mb-0">
                            Add Field Team
                        </h5>

                    </div>


                    <form
                        onSubmit={handleAdd}
                        className="card-body"
                    >

                        <div className="row g-3">


                            <div className="col-md-4">

                                <label>
                                    District
                                </label>

                                <input
                                    type="text"
                                    name="district"
                                    className="form-control"
                                    value={
                                        newData.district
                                    }
                                    onChange={
                                        handleNewDataChange
                                    }
                                    required
                                />

                            </div>


                            <div className="col-md-4">

                                <label>
                                    Block
                                </label>

                                <input
                                    type="text"
                                    name="block"
                                    className="form-control"
                                    value={
                                        newData.block
                                    }
                                    onChange={
                                        handleNewDataChange
                                    }
                                    required
                                />

                            </div>


                            <div className="col-md-4">

                                <label>
                                    FE Name
                                </label>

                                <input
                                    type="text"
                                    name="fe_name"
                                    className="form-control"
                                    value={
                                        newData.fe_name
                                    }
                                    onChange={
                                        handleNewDataChange
                                    }
                                />

                            </div>


                            <div className="col-md-4">

                                <label>
                                    FE Contact
                                </label>

                                <input
                                    type="text"
                                    name="fe_contact"
                                    className="form-control"
                                    value={
                                        newData.fe_contact
                                    }
                                    onChange={
                                        handleNewDataChange
                                    }
                                />

                            </div>


                            <div className="col-md-4">

                                <label>
                                    AM Name
                                </label>

                                <input
                                    type="text"
                                    name="am_name"
                                    className="form-control"
                                    value={
                                        newData.am_name
                                    }
                                    onChange={
                                        handleNewDataChange
                                    }
                                />

                            </div>


                            <div className="col-md-4">

                                <label>
                                    AM Contact
                                </label>

                                <input
                                    type="text"
                                    name="am_contact"
                                    className="form-control"
                                    value={
                                        newData.am_contact
                                    }
                                    onChange={
                                        handleNewDataChange
                                    }
                                />

                            </div>


                            <div className="col-md-4">

                                <label>
                                    ZOM Name
                                </label>

                                <input
                                    type="text"
                                    name="zom_name"
                                    className="form-control"
                                    value={
                                        newData.zom_name
                                    }
                                    onChange={
                                        handleNewDataChange
                                    }
                                />

                            </div>


                            <div className="col-md-4">

                                <label>
                                    ZOM Contact
                                </label>

                                <input
                                    type="text"
                                    name="zom_contact"
                                    className="form-control"
                                    value={
                                        newData.zom_contact
                                    }
                                    onChange={
                                        handleNewDataChange
                                    }
                                />

                            </div>


                            <div className="col-md-4">

                                <label>
                                    Status
                                </label>

                                <select
                                    name="status"
                                    className="form-select"
                                    value={
                                        newData.status
                                    }
                                    onChange={
                                        handleNewDataChange
                                    }
                                >

                                    <option value="Active">
                                        Active
                                    </option>

                                    <option value="Inactive">
                                        Inactive
                                    </option>

                                </select>

                            </div>


                            <div className="col-12">

                                <label>
                                    Remarks
                                </label>

                                <textarea
                                    name="remarks"
                                    className="form-control"
                                    rows="2"
                                    value={
                                        newData.remarks
                                    }
                                    onChange={
                                        handleNewDataChange
                                    }
                                />

                            </div>


                            <div className="col-12">

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >

                                    {loading
                                        ? "Saving..."
                                        : "Save Field Team"
                                    }

                                </button>


                                <button
                                    type="button"
                                    className="btn btn-secondary ms-2"
                                    onClick={() =>
                                        setShowAddForm(false)
                                    }
                                >
                                    Cancel
                                </button>

                            </div>

                        </div>

                    </form>

                </div>

            )}


            {/* ==================================
                SEARCH PANEL
            ================================== */}

            <SearchBar

                search={search}
                setSearch={setSearch}

                district={district}
                setDistrict={setDistrict}

                selectedBlocks={
                    selectedBlocks
                }

                setSelectedBlocks={
                    setSelectedBlocks
                }

                districts={districts}

                blocks={blocks}

                onReset={handleReset}

            />


            {/* ==================================
                SEARCH BUTTON
            ================================== */}

            <div className="mt-3 mb-3">

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSearch}
                    disabled={loading}
                >

                    <FaSearch
                        className="me-2"
                    />

                    Search

                </button>


                <button
                    type="button"
                    className="btn btn-outline-secondary ms-2"
                    onClick={loadFieldTeams}
                    disabled={loading}
                >

                    <FaSyncAlt
                        className="me-2"
                    />

                    Refresh

                </button>

            </div>


            {/* ==================================
                SUMMARY
            ================================== */}

            <div className="row mb-3">

                <div className="col-md-4">

                    <div className="card">

                        <div className="card-body d-flex align-items-center">

                            <FaUsers
                                className="me-3"
                                size={28}
                            />

                            <div>

                                <small className="text-muted">
                                    Total Records
                                </small>

                                <h4 className="mb-0">
                                    {
                                        fieldTeams.length
                                    }
                                </h4>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==================================
                TABLE
            ================================== */}

            <div className="card">

                <div className="card-header">

                    <h5 className="mb-0">
                        Field Team Records
                    </h5>

                </div>


                <div className="table-responsive">

                    <table className="table table-hover table-bordered align-middle mb-0">

                        <thead>

                            <tr>

                                <th>
                                    #
                                </th>

                                <th>
                                    District
                                </th>

                                <th>
                                    Block
                                </th>

                                <th>
                                    FE Name
                                </th>

                                <th>
                                    FE Contact
                                </th>

                                <th>
                                    AM Name
                                </th>

                                <th>
                                    AM Contact
                                </th>

                                <th>
                                    ZOM Name
                                </th>

                                <th>
                                    ZOM Contact
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Remarks
                                </th>

                                <th>
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="12"
                                        className="text-center py-5"
                                    >

                                        <FaSpinner
                                            className="spinner-border"
                                        />

                                        <div className="mt-2">
                                            Loading...
                                        </div>

                                    </td>

                                </tr>

                            ) : currentRecords.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="12"
                                        className="text-center py-5"
                                    >

                                        No field team
                                        records found.

                                    </td>

                                </tr>

                            ) : (

                                currentRecords.map(
                                    (team, index) => (

                                        <tr key={team.id}>


                                            {/* NUMBER */}

                                            <td>
                                                {startIndex +
                                                    index +
                                                    1}
                                            </td>


                                            {/* DISTRICT */}

                                            <td>

                                                {editingId ===
                                                team.id ? (

                                                    <input
                                                        type="text"
                                                        name="district"
                                                        className="form-control form-control-sm"
                                                        value={
                                                            editData.district
                                                        }
                                                        onChange={
                                                            handleEditChange
                                                        }
                                                    />

                                                ) : (

                                                    team.district

                                                )}

                                            </td>


                                            {/* BLOCK */}

                                            <td>

                                                {editingId ===
                                                team.id ? (

                                                    <input
                                                        type="text"
                                                        name="block"
                                                        className="form-control form-control-sm"
                                                        value={
                                                            editData.block
                                                        }
                                                        onChange={
                                                            handleEditChange
                                                        }
                                                    />

                                                ) : (

                                                    team.block

                                                )}

                                            </td>


                                            {/* FE NAME */}

                                            <td>

                                                {editingId ===
                                                team.id ? (

                                                    <input
                                                        type="text"
                                                        name="fe_name"
                                                        className="form-control form-control-sm"
                                                        value={
                                                            editData.fe_name
                                                        }
                                                        onChange={
                                                            handleEditChange
                                                        }
                                                    />

                                                ) : (

                                                    team.fe_name

                                                )}

                                            </td>


                                            {/* FE CONTACT */}

                                            <td>

                                                {editingId ===
                                                team.id ? (

                                                    <input
                                                        type="text"
                                                        name="fe_contact"
                                                        className="form-control form-control-sm"
                                                        value={
                                                            editData.fe_contact
                                                        }
                                                        onChange={
                                                            handleEditChange
                                                        }
                                                    />

                                                ) : (

                                                    team.fe_contact

                                                )}

                                            </td>


                                            {/* AM NAME */}

                                            <td>

                                                {editingId ===
                                                team.id ? (

                                                    <input
                                                        type="text"
                                                        name="am_name"
                                                        className="form-control form-control-sm"
                                                        value={
                                                            editData.am_name
                                                        }
                                                        onChange={
                                                            handleEditChange
                                                        }
                                                    />

                                                ) : (

                                                    team.am_name

                                                )}

                                            </td>


                                            {/* AM CONTACT */}

                                            <td>

                                                {editingId ===
                                                team.id ? (

                                                    <input
                                                        type="text"
                                                        name="am_contact"
                                                        className="form-control form-control-sm"
                                                        value={
                                                            editData.am_contact
                                                        }
                                                        onChange={
                                                            handleEditChange
                                                        }
                                                    />

                                                ) : (

                                                    team.am_contact

                                                )}

                                            </td>


                                            {/* ZOM NAME */}

                                            <td>

                                                {editingId ===
                                                team.id ? (

                                                    <input
                                                        type="text"
                                                        name="zom_name"
                                                        className="form-control form-control-sm"
                                                        value={
                                                            editData.zom_name
                                                        }
                                                        onChange={
                                                            handleEditChange
                                                        }
                                                    />

                                                ) : (

                                                    team.zom_name

                                                )}

                                            </td>


                                            {/* ZOM CONTACT */}

                                            <td>

                                                {editingId ===
                                                team.id ? (

                                                    <input
                                                        type="text"
                                                        name="zom_contact"
                                                        className="form-control form-control-sm"
                                                        value={
                                                            editData.zom_contact
                                                        }
                                                        onChange={
                                                            handleEditChange
                                                        }
                                                    />

                                                ) : (

                                                    team.zom_contact

                                                )}

                                            </td>


                                            {/* STATUS */}

                                            <td>

                                                {editingId ===
                                                team.id ? (

                                                    <select
                                                        name="status"
                                                        className="form-select form-select-sm"
                                                        value={
                                                            editData.status
                                                        }
                                                        onChange={
                                                            handleEditChange
                                                        }
                                                    >

                                                        <option value="Active">
                                                            Active
                                                        </option>

                                                        <option value="Inactive">
                                                            Inactive
                                                        </option>

                                                    </select>

                                                ) : (

                                                    <span
                                                        className={
                                                            team.status ===
                                                            "Active"
                                                                ? "badge bg-success"
                                                                : "badge bg-secondary"
                                                        }
                                                    >
                                                        {
                                                            team.status
                                                        }
                                                    </span>

                                                )}

                                            </td>


                                            {/* REMARKS */}

                                            <td>

                                                {editingId ===
                                                team.id ? (

                                                    <input
                                                        type="text"
                                                        name="remarks"
                                                        className="form-control form-control-sm"
                                                        value={
                                                            editData.remarks
                                                        }
                                                        onChange={
                                                            handleEditChange
                                                        }
                                                    />

                                                ) : (

                                                    team.remarks

                                                )}

                                            </td>


                                            {/* ACTION */}

                                            <td>

                                                {editingId ===
                                                team.id ? (

                                                    <>

                                                        <button
                                                            type="button"
                                                            className="btn btn-success btn-sm me-1"
                                                            onClick={() =>
                                                                handleUpdate(
                                                                    team.id
                                                                )
                                                            }
                                                        >
                                                            Save
                                                        </button>


                                                        <button
                                                            type="button"
                                                            className="btn btn-secondary btn-sm"
                                                            onClick={() =>
                                                                setEditingId(
                                                                    null
                                                                )
                                                            }
                                                        >
                                                            Cancel
                                                        </button>

                                                    </>

                                                ) : (

                                                    <>

                                                        <button
                                                            type="button"
                                                            className="btn btn-warning btn-sm me-1"
                                                            title="Edit"
                                                            onClick={() =>
                                                                handleEdit(
                                                                    team
                                                                )
                                                            }
                                                        >

                                                            <FaEdit />

                                                        </button>


                                                        <button
                                                            type="button"
                                                            className="btn btn-danger btn-sm"
                                                            title="Delete"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    team.id
                                                                )
                                                            }
                                                        >

                                                            <FaTrash />

                                                        </button>

                                                    </>

                                                )}

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>


                {/* ==================================
                    PAGINATION
                ================================== */}

                {totalPages > 1 && (

                    <div className="card-footer">

                        <div className="d-flex justify-content-between align-items-center">

                            <span className="text-muted">

                                Page {currentPage}
                                {" "}of{" "}
                                {totalPages}

                            </span>


                            <div>

                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary me-1"
                                    disabled={
                                        currentPage === 1
                                    }
                                    onClick={() =>
                                        goToPage(
                                            currentPage - 1
                                        )
                                    }
                                >
                                    Previous
                                </button>


                                {Array.from(
                                    {
                                        length:
                                            totalPages
                                    },
                                    (_, index) => (
                                        <button
                                            type="button"
                                            key={index}
                                            className={
                                                currentPage ===
                                                index + 1
                                                    ? "btn btn-sm btn-primary me-1"
                                                    : "btn btn-sm btn-outline-secondary me-1"
                                            }
                                            onClick={() =>
                                                goToPage(
                                                    index + 1
                                                )
                                            }
                                        >
                                            {index + 1}
                                        </button>
                                    )
                                )}


                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary"
                                    disabled={
                                        currentPage ===
                                        totalPages
                                    }
                                    onClick={() =>
                                        goToPage(
                                            currentPage + 1
                                        )
                                    }
                                >
                                    Next
                                </button>

                            </div>

                        </div>

                    </div>

                )}

            </div>

        </div>

    );

};


export default FieldTeam;