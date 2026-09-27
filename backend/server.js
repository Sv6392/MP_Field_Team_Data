require("dotenv").config();

const express = require("express");
const cors = require("cors");

const fieldTeamRoutes = require("./routes/fieldTeamRoutes");

const app = express();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "Field Team Management API is running"
    });

});


// ==========================================
// FIELD TEAM ROUTES
// ==========================================

app.use("/api/field-teams", fieldTeamRoutes);


// ==========================================
// ERROR HANDLER
// ==========================================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "API endpoint not found"
    });

});


// ==========================================
// SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`🚀 Server running on port ${PORT}`);

});