const express = require("express");
const router = express.Router();
const { getAuditReport } = require("../controller/auditController");

router.get("/battery", getAuditReport);





module.exports = router;