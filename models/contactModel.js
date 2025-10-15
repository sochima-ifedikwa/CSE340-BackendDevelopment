const pool = require("../database/");

async function addMessage(name, email, message) {
  try {
    const sql = `
      INSERT INTO contact_messages (name, email, message)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const result = await pool.query(sql, [name, email, message]);
    return result.rows[0];
  } catch (error) {
    console.error("Database error adding message:", error);
    throw error;
  }
}

module.exports = { addMessage };