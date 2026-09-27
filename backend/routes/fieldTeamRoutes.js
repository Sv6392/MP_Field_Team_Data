const express = require("express");
const multer = require("multer");

const router = express.Router();


// =====================================================
// CONTROLLER IMPORTS
// =====================================================

const {
    getAllFieldTeams,
    getFieldTeamById,
    addFieldTeam,
    updateFieldTeam,
    deleteFieldTeam,
    searchFieldTeams,
    bulkImportFieldTeams,
    getDistricts,
    getBlocks
} = require("../controllers/fieldTeamController");


// =====================================================
// MULTER CONFIGURATION
// =====================================================

const upload = multer({

    storage: multer.memoryStorage(),

    limits: {
        fileSize: 10 * 1024 * 1024 // 10 MB
    },

    fileFilter: (req, file, cb) => {

        const allowedExtensions = [
            ".xlsx",
            ".xls",
            ".csv"
        ];

        const fileName =
            file.originalname.toLowerCase();

        const isAllowed =
            allowedExtensions.some(
                (extension) =>
                    fileName.endsWith(extension)
            );

        if (isAllowed) {

            cb(null, true);

        } else {

            cb(
                new Error(
                    "Only Excel (.xlsx, .xls) and CSV files are allowed"
                )
            );

        }

    }

});


// =====================================================
// SEARCH FIELD TEAMS
// =====================================================
//
// GET /api/field-teams/search
//
// Examples:
//
// /api/field-teams/search
//
// /api/field-teams/search?district=Dhar
//
// /api/field-teams/search?district=Dhar&blocks=Dhar,Manawar
//
// /api/field-teams/search?search=Rahul
//
// =====================================================

router.get(
    "/search",
    searchFieldTeams
);


// =====================================================
// GET ALL DISTRICTS
// =====================================================
//
// GET /api/field-teams/districts
//
// =====================================================

router.get(
    "/districts",
    getDistricts
);


// =====================================================
// GET BLOCKS
// =====================================================
//
// GET /api/field-teams/blocks
//
// GET /api/field-teams/blocks?district=Dhar
//
// =====================================================

router.get(
    "/blocks",
    getBlocks
);


// =====================================================
// BULK IMPORT
// =====================================================
//
// POST /api/field-teams/bulk-import
//
// Form-data:
// key   = file
// value = Excel/CSV file
//
// =====================================================

router.post(
    "/bulk-import",
    upload.single("file"),
    bulkImportFieldTeams
);


// =====================================================
// GET ALL FIELD TEAMS
// =====================================================
//
// GET /api/field-teams
//
// =====================================================

router.get(
    "/",
    getAllFieldTeams
);


// =====================================================
// ADD FIELD TEAM
// =====================================================
//
// POST /api/field-teams
//
// =====================================================

router.post(
    "/",
    addFieldTeam
);


// =====================================================
// GET FIELD TEAM BY ID
// =====================================================
//
// GET /api/field-teams/:id
//
// IMPORTANT:
// This MUST remain after all fixed routes.
//
// =====================================================

router.get(
    "/:id",
    getFieldTeamById
);


// =====================================================
// UPDATE FIELD TEAM
// =====================================================
//
// PUT /api/field-teams/:id
//
// =====================================================

router.put(
    "/:id",
    updateFieldTeam
);


// =====================================================
// DELETE FIELD TEAM
// =====================================================
//
// DELETE /api/field-teams/:id
//
// =====================================================

router.delete(
    "/:id",
    deleteFieldTeam
);


// =====================================================
// EXPORT
// =====================================================

module.exports = router;