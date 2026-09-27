// ==========================================
// BULK IMPORT EXCEL / CSV
// ==========================================
const bulkImportFieldTeams = (req, res) => {

    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "Please upload an Excel or CSV file"
        });
    }

    try {

        const XLSX = require("xlsx");

        // Read uploaded file
        const workbook = XLSX.read(req.file.buffer, {
            type: "buffer"
        });

        const sheetName = workbook.SheetNames[0];

        const worksheet = workbook.Sheets[sheetName];

        const data = XLSX.utils.sheet_to_json(worksheet, {
            defval: ""
        });

        if (data.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Uploaded file is empty"
            });
        }

        const records = [];

        const errors = [];

        data.forEach((row, index) => {

            const rowNumber = index + 2;

            const district = String(
                row["District"] || ""
            ).trim();

            const block = String(
                row["Block"] || ""
            ).trim();

            const fe_name = String(
                row["FE Name"] || ""
            ).trim();

            const fe_contact = String(
                row["FE Contact"] || ""
            ).trim();

            const am_name = String(
                row["AM Name"] || ""
            ).trim();

            const am_contact = String(
                row["AM Contact"] || ""
            ).trim();

            const zom_name = String(
                row["ZOM Name"] || ""
            ).trim();

            const zom_contact = String(
                row["ZOM Contact"] || ""
            ).trim();

            const status = String(
                row["Status"] || "Active"
            ).trim();

            const remarks = String(
                row["Remarks"] || ""
            ).trim();


            // Required fields
            if (!district || !block) {

                errors.push({
                    row: rowNumber,
                    message: "District and Block are required"
                });

                return;
            }


            records.push([
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
            ]);

        });


        if (records.length === 0) {

            return res.status(400).json({
                success: false,
                message: "No valid records found",
                errors
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
            VALUES ?
        `;


        db.query(
            sql,
            [records],
            (err, result) => {

                if (err) {

                    console.error(err);

                    return res.status(500).json({
                        success: false,
                        message: "Bulk import failed",
                        error: err.message
                    });

                }


                res.status(201).json({

                    success: true,

                    message:
                        "Bulk data imported successfully",

                    inserted:
                        result.affectedRows,

                    skipped:
                        errors.length,

                    errors

                });

            }
        );


    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message:
                "Unable to process uploaded file",

            error: error.message

        });

    }
};