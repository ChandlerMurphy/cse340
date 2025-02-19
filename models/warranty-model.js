const pool = require("../database/")

/* ***************************
 *  Get inventory items by inv_id
 * ************************** */
async function getWarranty() {
    try {
      const data = await pool.query(`SELECT * FROM public.warranty`)
      return data.rows
    } catch (error) {
      console.error("getitembyid error " + error)
    }
}

module.exports = {getWarranty};