import React, { useEffect, useState } from "react";

import {
    FaPlus
} from "react-icons/fa";

import API from "../services/api";

import Dashboard from "../components/Dashboard";
import SearchBar from "../components/SearchBar";
import TeamTable from "../components/TeamTable";
import TeamForm from "../components/TeamForm";


const FieldTeams = () => {

    const [teams, setTeams] = useState([]);

    const [search, setSearch] = useState("");
    const [district, setDistrict] = useState("");
    const [block, setBlock] = useState("");

    const [loading, setLoading] = useState(false);

    const [showForm, setShowForm] = useState(false);

    const [editingTeam, setEditingTeam] = useState(null);


    // ==========================================
    // GET TEAMS
    // ==========================================

    const fetchTeams = async () => {

        try {

            setLoading(true);

            const response = await API.get(
                "/field-teams"
            );

            setTeams(response.data.data || []);

        } catch (error) {

            console.error(error);

            alert(
                "Unable to fetch field team data"
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // SEARCH
    // ==========================================

    const searchTeams = async () => {

        try {

            setLoading(true);

            const params = {};

            if (search) {
                params.search = search;
            }

            if (district) {
                params.district = district;
            }

            if (block) {
                params.block = block;
            }


            if (
                !search &&
                !district &&
                !block
            ) {

                await fetchTeams();

                return;
            }


            const response = await API.get(
                "/field-teams/search",
                {
                    params
                }
            );

            setTeams(
                response.data.data || []
            );

        } catch (error) {

            console.error(error);

            alert(
                "Search failed"
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // LOAD DATA
    // ==========================================

    useEffect(() => {

        fetchTeams();

    }, []);


    // ==========================================
    // AUTO SEARCH
    // ==========================================

    useEffect(() => {

        const timer = setTimeout(() => {

            searchTeams();

        }, 300);

        return () => clearTimeout(timer);

    }, [
        search,
        district,
        block
    ]);


    // ==========================================
    // ADD / UPDATE
    // ==========================================

    const handleSubmit = async (formData) => {

        try {

            if (editingTeam) {

                await API.put(
                    `/field-teams/${editingTeam.id}`,
                    formData
                );

                alert(
                    "Field team updated successfully"
                );

            } else {

                await API.post(
                    "/field-teams",
                    formData
                );

                alert(
                    "Field team added successfully"
                );

            }


            setShowForm(false);
            setEditingTeam(null);

            fetchTeams();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Operation failed"
            );

        }
    };


    // ==========================================
    // EDIT
    // ==========================================

    const handleEdit = (team) => {

        setEditingTeam(team);
        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
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

            await API.delete(
                `/field-teams/${id}`
            );

            alert(
                "Field team deleted successfully"
            );

            fetchTeams();

        } catch (error) {

            console.error(error);

            alert(
                "Unable to delete field team"
            );

        }
    };


    // ==========================================
    // RESET
    // ==========================================

    const handleReset = () => {

        setSearch("");
        setDistrict("");
        setBlock("");

    };


    // ==========================================
    // FILTER DATA
    // ==========================================

    const districts = [
        ...new Set(
            teams.map(
                team => team.district
            )
        )
    ];


    const blocks = [
        ...new Set(
            teams.map(
                team => team.block
            )
        )
    ];


    return (

        <div className="page-container">

            {/* Dashboard */}

            <Dashboard
                teams={teams}
            />


            {/* Add button */}

            {!showForm && (

                <div className="page-heading">

                    <div>

                        <h3>
                            Field Teams
                        </h3>

                        <p>
                            Manage field engineers,
                            AMs and ZOM contacts
                        </p>

                    </div>


                    <button
                        className="btn btn-primary"
                        onClick={() => {

                            setEditingTeam(null);
                            setShowForm(true);

                        }}
                    >

                        <FaPlus className="me-2" />

                        Add Field Team

                    </button>

                </div>

            )}


            {/* Form */}

            {showForm && (

                <TeamForm
                    editingTeam={editingTeam}

                    onSubmit={handleSubmit}

                    onCancel={() => {

                        setShowForm(false);
                        setEditingTeam(null);

                    }}
                />

            )}


            {/* Search */}

            {!showForm && (

                <SearchBar
                    search={search}
                    setSearch={setSearch}

                    district={district}
                    setDistrict={setDistrict}

                    block={block}
                    setBlock={setBlock}

                    districts={districts}
                    blocks={blocks}

                    onReset={handleReset}
                />

            )}


            {/* Table */}

            {!showForm && (

                <div className="table-card">

                    <div className="table-header">

                        <h5>
                            Field Team Records
                        </h5>

                        <span>
                            {teams.length} records
                        </span>

                    </div>


                    {loading ? (

                        <div className="loading">

                            Loading...

                        </div>

                    ) : (

                        <TeamTable
                            teams={teams}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />

                    )}

                </div>

            )}

        </div>
    );
};

export default FieldTeams;