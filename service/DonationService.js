const pool = require("../db");

exports.addDonation = (donorId, qty) => {
    return new Promise((resolve, reject) => {
        if (!donorId) {
            return reject({
                success: false,
                message: 'DonorId is missing'
            })
        }

        if (!qty) {
            return reject({
                success: false,
                message: 'qty is missing'
            })
        }

        if (qty <= 0) {
            return reject({
                success: false,
                message: 'Qty must be greater than to zero'
            })
        }

        if (qty > 470) {
            return reject({
                success: false,
                message: 'Qty cannot be greater than to 470ML'
            })
        }

        const donorQuery = 'select * from donors where donor_id = ?'
        pool.query(donorQuery, [donorId], (donorErr, donorResult) => {
            if (donorErr) {
                return reject(donorErr)
            }
            //if donor not found
            if (donorResult.length == 0) {
                return reject({
                    success: false,
                    message: `Donor not found for the given ID ${donorId}`
                })
            }


            if (donorResult.length > 0) {
                let date_of_birth = new Date(donorResult[0].date_of_birth)
                let curDate = new Date()
                let age = ((curDate - date_of_birth) / (24 * 60 * 60 * 1000)) / 365
                if (age < 18 || age > 65) {
                    return reject({
                        success: false,
                        message: 'The age of donor must be greater than to 18 years and smaller than to 65'
                    })
                }

                let donationQuery = 'select * from donations where donor_id = ?'
                pool.query(donationQuery, [donorId], (donationErr, donationResult) => {
                    if (donationErr) {
                        return reject(donationErr)
                    }
                    //checking the 56 days gap
                    if (donationResult.length > 0) {
                        let previousDonationDate = donationResult[0].donated_at;
                        let coolingPeriod = curDate - previousDonationDate
                        if (coolingPeriod < 56) {
                            return reject({
                                success: false,
                                message: 'The next donation will be done after the next 56 days from the previous donation'
                            })
                        }
                    }

                    const newDonationQuery = 'insert into donations (blood_type, donated_at, qty, donor_id) values (?,?,?,?)'
                    pool.query(newDonationQuery, [donorResult[0].blood_type, curDate, qty, donorId], (newDonationErr, newDonationResult) => {
                        if (newDonationErr) {
                            return reject(newDonationErr)
                        }
                        let resultObject = {
                            success: true
                        }
                        if (newDonationResult.affectedRows > 0) {
                            resultObject["donationId"] = newDonationResult.insertId
                            resultObject["donorId"] = donorId
                            resultObject["qty"] = qty
                            resultObject["bloodType"] = donorResult[0].blood_type
                            //below queries for blood bags

                            const existingBagsQuery = 'select * from blood_bags where blood_type = ? and donated_at = ? '
                            const formattedDate = curDate.toISOString().split('T')[0];


                            pool.query(existingBagsQuery, [donorResult[0].blood_type, formattedDate], (existingBagsQueryErr, existingBagsQueryResult) => {

                                if (existingBagsQueryErr) {
                                    return reject(existingBagsQueryErr)
                                }

                                if (existingBagsQueryResult.length > 0) {
                                    const updateBagsQuery = 'update blood_bags set qty = ? where blood_bag_id =?'
                                    let udpatedQty = existingBagsQueryResult[0].qty + Number(qty)
                                    pool.query(updateBagsQuery, [udpatedQty, existingBagsQueryResult[0].blood_bag_id], (updateErr, updateResult) => {
                                        if (updateErr) {
                                            return reject(updateErr)
                                        }
                                        resultObject["donatedAt"] = formattedDate
                                        if (updateResult.affectedRows > 0) {
                                            console.log('Records in bags query is updated')
                                            console.log('resultObject', resultObject)
                                            return resolve(resultObject)
                                        }
                                    })
                                }
                                // if not found an existing records
                                if (existingBagsQueryResult.length == 0) {
                                    const insertRecordBagsQuery = 'insert into blood_bags (blood_type, donated_at,	qty) values(?,?,?)'
                                    pool.query(insertRecordBagsQuery, [donorResult[0].blood_type, curDate, qty], (insertQueryErr, insertQueryResult) => {
                                        if (insertQueryErr) {
                                            return reject(insertQueryErr)
                                        }
                                        console.log('insertQueryResult', insertQueryResult)
                                        if (insertQueryResult.affectedRows > 0) {
                                            console.log('Record insert in blood bags tables')
                                            return resolve(resultObject)
                                        }
                                    })
                                }
                            })
                        }
                    })
                })
            }
        })
    })
}


exports.getAllDonations = () => {
    return new Promise((resolve, reject) => {
        const query = 'select * from donations'
        pool.query(query, (err, result) => {
            if (err) {
                return reject(err)
            }
            if (result.length == 0) {
                return reject({
                    success: false,
                    message: 'No donor was found'
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

exports.getDonationHistory = () => ({ msg: "test" });