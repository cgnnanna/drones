const { auditDb } = require("../simpleJsonDbConfig");
db = auditDb();


const saveAudit = (name, auditObj) => {
    let audit = getAudit(name);
    audit = audit ? audit : [];
    audit.push(auditObj);
    db.set(name, audit);
}

const getAudit = (name) => {
    return db.get(name);
}

module.exports = {
    saveAudit,
    getAudit
}