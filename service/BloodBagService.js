const pool = require("../db");


exports.getAllBloodBags = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM blood_bags'
        pool.query(query, (err, result) => {
            if (err) {
                return reject(err)
            }
            if (result.length == 0) {
                return reject({
                    "success": false,
                    "message": "No Blood Bag found till date"
                })
            }
            if (result.length > 0) {
                return resolve({
                    success: true,
                    result
                })
            }
        })
    })
}