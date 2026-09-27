import React, { useState } from "react";

import {
    FaFileExcel,
    FaUpload,
    FaDownload,
    FaTimes
} from "react-icons/fa";

import API from "../services/api";


const ImportExport = ({ onClose }) => {

    const [file, setFile] = useState(null);

    const [uploading, setUploading] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");


    // ==========================================
    // FILE SELECT
    // ==========================================

    const handleFileChange = (e) => {

        const selectedFile =
            e.target.files[0];

        setFile(selectedFile);

        setMessage("");
        setError("");
    };


    // ==========================================
    // UPLOAD
    // ==========================================

    const handleUpload = async () => {

        if (!file) {

            setError(
                "Please select an Excel or CSV file"
            );

            return;
        }


        const formData = new FormData();

        formData.append(
            "file",
            file
        );


        try {

            setUploading(true);

            setError("");
            setMessage("");


            const response = await API.post(
                "/field-teams/bulk-import",
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data"
                    }
                }
            );


            setMessage(
                `${response.data.inserted} records imported successfully.`
            );


            if (response.data.skipped > 0) {

                setError(
                    `${response.data.skipped} records were skipped.`
                );

            }


            setFile(null);


            document.getElementById(
                "excelFile"
            ).value = "";


        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "File upload failed"
            );

        } finally {

            setUploading(false);

        }

    };


    // ==========================================
    // DOWNLOAD TEMPLATE
    // ==========================================

    const downloadTemplate = () => {

        const headers = [
            "District",
            "Block",
            "FE Name",
            "FE Contact",
            "AM Name",
            "AM Contact",
            "ZOM Name",
            "ZOM Contact",
            "Status",
            "Remarks"
        ];


        const csvContent =
            headers.join(",") +
            "\n";


        const blob = new Blob(
            [csvContent],
            {
                type: "text/csv;charset=utf-8;"
            }
        );


        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");

        link.href = url;

        link.download =
            "field_team_template.csv";

        link.click();

        URL.revokeObjectURL(url);

    };


    return (

        <div className="import-export-card">

            <div className="import-header">

                <div>

                    <h3>
                        Import / Export
                    </h3>

                    <p>
                        Bulk upload field team
                        information
                    </p>

                </div>


                <button
                    className="btn btn-light"
                    onClick={onClose}
                >
                    <FaTimes />
                </button>

            </div>


            {/* IMPORT */}

            <div className="import-section">

                <div className="section-icon">
                    <FaUpload />
                </div>

                <div className="section-content">

                    <h5>
                        Import Bulk Data
                    </h5>

                    <p>
                        Upload Excel or CSV file
                        containing field team records.
                    </p>


                    <input
                        id="excelFile"
                        type="file"
                        className="form-control"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileChange}
                    />


                    <div className="mt-3">

                        <button
                            className="btn btn-primary"
                            onClick={handleUpload}
                            disabled={
                                uploading ||
                                !file
                            }
                        >

                            <FaUpload
                                className="me-2"
                            />

                            {uploading
                                ? "Uploading..."
                                : "Upload Data"
                            }

                        </button>

                    </div>


                    {message && (

                        <div className="alert alert-success mt-3">

                            {message}

                        </div>

                    )}


                    {error && (

                        <div className="alert alert-danger mt-3">

                            {error}

                        </div>

                    )}

                </div>

            </div>


            {/* TEMPLATE */}

            <div className="import-section">

                <div className="section-icon">
                    <FaFileExcel />
                </div>

                <div className="section-content">

                    <h5>
                        Excel / CSV Template
                    </h5>

                    <p>
                        Download the template and
                        enter your bulk data.
                    </p>


                    <button
                        className="btn btn-success"
                        onClick={
                            downloadTemplate
                        }
                    >

                        <FaDownload
                            className="me-2"
                        />

                        Download Template

                    </button>

                </div>

            </div>


            {/* EXPORT */}

            <div className="import-section">

                <div className="section-icon">
                    <FaDownload />
                </div>

                <div className="section-content">

                    <h5>
                        Export Data
                    </h5>

                    <p>
                        We will add Excel export
                        of the current field-team
                        records here.
                    </p>

                </div>

            </div>

        </div>

    );
};

export default ImportExport;