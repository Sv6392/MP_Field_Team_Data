const db = require("../config/db");
const XLSX = require("xlsx");


// =====================================================
// GET ALL FIELD TEAMS
// =====================================================

const getAllFieldTeams = (req, res) => {

    const sql = `
        SELECT *
        FROM field_teams
        ORDER BY id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.error("Get all field teams error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch field teams"
            });

        }

        return res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });

    });

};


// =====================================================
// GET FIELD TEAM BY ID
// =====================================================

const getFieldTeamById = (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT *
        FROM field_teams
        WHERE id = ?
    `;

    db.query(sql, [id], (err, results) => {

        if (err) {

            console.error("Get field team by ID error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch field team"
            });

        }

        if (results.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Field team not found"
            });

        }

        return res.status(200).json({
            success: true,
            data: results[0]
        });

    });

};


// =====================================================
// ADD FIELD TEAM
// =====================================================

const addFieldTeam = (req, res) => {

    const {
        district,
        block,
        fe_name,
        fe_contact,
        am_name,
        am_contact,
        zom_name,
        zom_contact,
        status,
        remarks
    } = req.body;


    // -----------------------------------------------
    // VALIDATION
    // -----------------------------------------------

    if (!district || !block || !fe_name) {

        return res.status(400).json({
            success: false,
            message: "District, Block and FE Name are required"
        });

    }


    const sql = `
        INSERT INTO field_teams
        (
            district,
            block,
            fe_name,
            fe_contact,
            am_name,
            am_contact,
            zom_name,
            zom_contact,
            status,
            remarks
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;


    const values = [
        district,
        block,
        fe_name,
        fe_contact || null,
        am_name || null,
        am_contact || null,
        zom_name || null,
        zom_contact || null,
        status || "Active",
        remarks || null
    ];


    db.query(sql, values, (err, result) => {

        if (err) {

            console.error("Add field team error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to add field team"
            });

        }


        return res.status(201).json({
            success: true,
            message: "Field team added successfully",
            id: result.insertId
        });

    });

};


// =====================================================
// UPDATE FIELD TEAM
// =====================================================

const updateFieldTeam = (req, res) => {

    const { id } = req.params;

    const {
        district,
        block,
        fe_name,
        fe_contact,
        am_name,
        am_contact,
        zom_name,
        zom_contact,
        status,
        remarks
    } = req.body;


    if (!district || !block || !fe_name) {

        return res.status(400).json({
            success: false,
            message: "District, Block and FE Name are required"
        });

    }


    const sql = `
        UPDATE field_teams
        SET
            district = ?,
            block = ?,
            fe_name = ?,
            fe_contact = ?,
            am_name = ?,
            am_contact = ?,
            zom_name = ?,
            zom_contact = ?,
            status = ?,
            remarks = ?
        WHERE id = ?
    `;


    const values = [
        district,
        block,
        fe_name,
        fe_contact || null,
        am_name || null,
        am_contact || null,
        zom_name || null,
        zom_contact || null,
        status || "Active",
        remarks || null,
        id
    ];


    db.query(sql, values, (err, result) => {

        if (err) {

            console.error("Update field team error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to update field team"
            });

        }


        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Field team not found"
            });

        }


        return res.status(200).json({
            success: true,
            message: "Field team updated successfully"
        });

    });

};


// =====================================================
// DELETE FIELD TEAM
// =====================================================

const deleteFieldTeam = (req, res) => {

    const { id } = req.params;


    const sql = `
        DELETE FROM field_teams
        WHERE id = ?
    `;


    db.query(sql, [id], (err, result) => {

        if (err) {

            console.error("Delete field team error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to delete field team"
            });

        }


        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Field team not found"
            });

        }


        return res.status(200).json({
            success: true,
            message: "Field team deleted successfully"
        });

    });

};


// =====================================================
// SEARCH FIELD TEAMS
// Supports:
// - District
// - Multiple Blocks
// - General Search
// =====================================================

const searchFieldTeams = (req, res) => {

    const {
        district,
        blocks,
        search
    } = req.query;


    let sql = `
        SELECT *
        FROM field_teams
        WHERE 1 = 1
    `;


    const values = [];


    // =================================================
    // DISTRICT FILTER
    // =================================================

    if (district) {

        sql += `
            AND district = ?
        `;

        values.push(district);

    }


    // =================================================
    // MULTIPLE BLOCK FILTER
    // =================================================

    if (blocks) {

        let blockList = [];


        if (typeof blocks === "string") {

            blockList = blocks
                .split(",")
                .map(block => block.trim())
                .filter(block => block !== "");

        }


        if (blockList.length > 0) {

            const placeholders =
                blockList
                    .map(() => "?")
                    .join(",");


            sql += `
                AND block IN (${placeholders})
            `;


            values.push(...blockList);

        }

    }


    // =================================================
    // GENERAL SEARCH
    // =================================================

    if (search) {

        sql += `
            AND (
                fe_name LIKE ?
                OR fe_contact LIKE ?
                OR am_name LIKE ?
                OR am_contact LIKE ?
                OR zom_name LIKE ?
                OR zom_contact LIKE ?
                OR district LIKE ?
                OR block LIKE ?
            )
        `;


        const searchValue = `%${search}%`;


        values.push(
            searchValue,
            searchValue,
            searchValue,
            searchValue,
            searchValue,
            searchValue,
            searchValue,
            searchValue
        );

    }


    // =================================================
    // ORDER
    // =================================================

    sql += `
        ORDER BY id DESC
    `;


    // =================================================
    // EXECUTE
    // =================================================

    db.query(sql, values, (err, results) => {

        if (err) {

            console.error("Search field teams error:", err);

            return res.status(500).json({
                success: false,
                message: "Search failed"
            });

        }


        return res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });

    });

};


// =====================================================
// GET DISTRICTS
// =====================================================

const getDistricts = (req, res) => {

    const sql = `
        SELECT DISTINCT district
        FROM field_teams
        WHERE district IS NOT NULL
        AND TRIM(district) <> ''
        ORDER BY district ASC
    `;


    db.query(sql, (err, results) => {

        if (err) {

            console.error("Get districts error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to load districts"
            });

        }


        const districts = results.map(
            item => item.district
        );


        return res.status(200).json({
            success: true,
            count: districts.length,
            data: districts
        });

    });

};


// =====================================================
// GET BLOCKS
// Optional district filter
//
// GET /blocks
// GET /blocks?district=Dhar
// =====================================================

const getBlocks = (req, res) => {

    const { district } = req.query;


    let sql = `
        SELECT DISTINCT block
        FROM field_teams
        WHERE block IS NOT NULL
        AND TRIM(block) <> ''
    `;


    const values = [];


    if (district) {

        sql += `
            AND district = ?
        `;

        values.push(district);

    }


    sql += `
        ORDER BY block ASC
    `;


    db.query(sql, values, (err, results) => {

        if (err) {

            console.error("Get blocks error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to load blocks"
            });

        }


        const blocks = results.map(
            item => item.block
        );


        return res.status(200).json({
            success: true,
            count: blocks.length,
            data: blocks
        });

    });

};


// =====================================================
// BULK IMPORT
// Excel / XLS / CSV
// =====================================================

const bulkImportFieldTeams = (req, res) => {

    try {

        // -------------------------------------------------
        // CHECK FILE
        // -------------------------------------------------

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message: "Please upload an Excel or CSV file"
            });

        }


        // -------------------------------------------------
        // READ FILE
        // -------------------------------------------------

        const workbook = XLSX.read(
            req.file.buffer,
            {
                type: "buffer"
            }
        );


        const sheetName =
            workbook.SheetNames[0];


        if (!sheetName) {

            return res.status(400).json({
                success: false,
                message: "No worksheet found in file"
            });

        }


        const worksheet =
            workbook.Sheets[sheetName];


        const rows =
            XLSX.utils.sheet_to_json(
                worksheet,
                {
                    defval: ""
                }
            );


        if (!rows.length) {

            return res.status(400).json({
                success: false,
                message: "The uploaded file is empty"
            });

        }


        // -------------------------------------------------
        // PROCESS ROWS
        // -------------------------------------------------

        const records = [];


        rows.forEach((row, index) => {

            const district =
                String(
                    row["District"] ||
                    row["district"] ||
                    ""
                ).trim();


            const block =
                String(
                    row["Block"] ||
                    row["block"] ||
                    ""
                ).trim();


            const feName =
                String(
                    row["FE Name"] ||
                    row["FE_Name"] ||
                    row["fe_name"] ||
                    ""
                ).trim();


            const feContact =
                String(
                    row["FE Contact"] ||
                    row["FE Contact No"] ||
                    row["FE Contact Number"] ||
                    row["FE_Contact"] ||
                    row["fe_contact"] ||
                    ""
                ).trim();


            const amName =
                String(
                    row["AM Name"] ||
                    row["AM_Name"] ||
                    row["am_name"] ||
                    ""
                ).trim();


            const amContact =
                String(
                    row["AM Contact"] ||
                    row["AM Contact No"] ||
                    row["AM Contact Number"] ||
                    row["AM_Contact"] ||
                    row["am_contact"] ||
                    ""
                ).trim();


            const zomName =
                String(
                    row["ZOM Name"] ||
                    row["ZOM_Name"] ||
                    row["zom_name"] ||
                    ""
                ).trim();


            const zomContact =
                String(
                    row["ZOM Contact"] ||
                    row["ZOM Contact No"] ||
                    row["ZOM Contact Number"] ||
                    row["ZOM_Contact"] ||
                    row["zom_contact"] ||
                    ""
                ).trim();


            const status =
                String(
                    row["Status"] ||
                    row["status"] ||
                    "Active"
                ).trim();


            const remarks =
                String(
                    row["Remarks"] ||
                    row["remarks"] ||
                    ""
                ).trim();


            // ---------------------------------------------
            // SKIP COMPLETELY EMPTY ROW
            // ---------------------------------------------

            if (
                !district &&
                !block &&
                !feName &&
                !feContact &&
                !amName &&
                !amContact &&
                !zomName &&
                !zomContact
            ) {
                return;
            }


            // ---------------------------------------------
            // REQUIRED VALIDATION
            // ---------------------------------------------

            if (!district || !block || !feName) {

                console.warn(
                    `Skipping row ${index + 2}: District, Block or FE Name missing`
                );

                return;

            }


            records.push([
                district,
                block,
                feName,
                feContact || null,
                amName || null,
                amContact || null,
                zomName || null,
                zomContact || null,
                status || "Active",
                remarks || null
            ]);

        });


        // -------------------------------------------------
        // NO VALID RECORDS
        // -------------------------------------------------

        if (records.length === 0) {

            return res.status(400).json({
                success: false,
                message: "No valid records found in uploaded file"
            });

        }


        // -------------------------------------------------
        // INSERT
        // -------------------------------------------------

        const sql = `
            INSERT INTO field_teams
            (
                district,
                block,
                fe_name,
                fe_contact,
                am_name,
                am_contact,
                zom_name,
                zom_contact,
                status,
                remarks
            )
            VALUES ?
        `;


        db.query(
            sql,
            [records],
            (err, result) => {

                if (err) {

                    console.error(
                        "Bulk import database error:",
                        err
                    );

                    return res.status(500).json({
                        success: false,
                        message: "Bulk import failed",
                        error: err.message
                    });

                }


                return res.status(201).json({

                    success: true,

                    message:
                        "Field team data imported successfully",

                    inserted:
                        result.affectedRows,

                    totalRows:
                        rows.length

                });

            }
        );

    } catch (error) {

        console.error(
            "Bulk import error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to process uploaded file",
            error: error.message
        });

    }

};


// =====================================================
// EXPORT CONTROLLERS
// =====================================================

module.exports = {

    getAllFieldTeams,

    getFieldTeamById,

    addFieldTeam,

    updateFieldTeam,

    deleteFieldTeam,

    searchFieldTeams,

    bulkImportFieldTeams,

    getDistricts,

    getBlocks

};