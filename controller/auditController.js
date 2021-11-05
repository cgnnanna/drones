const { getAudit } = require("../db/auditRepository");
const response = require("../utils/response");

const getAuditReport = (req, res) => {
    let result = getAudit("batteryLevel");
    result = result ? result : [];
    return res.json(response(true, null, result));
}

module.exports = {
    getAuditReport
}