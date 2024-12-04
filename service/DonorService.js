const pool = require("../db");


exports.addDonor = (name, phoneNumber, address, dateOfBirth, gender, bloodType, medicalHistory) => {
    return new Promise((resolve, reject) => {

        //if any fields missing from body
        if ([name, phoneNumber, address, dateOfBirth, gender, bloodType, medicalHistory].some((field) => field == null || field == '')) {
            return reject({
                success: false,
                message: 'Provide the required details'
            })
        }
        //length of the phone nubmer less than the  10 digit
        if (phoneNumber.length < 10) {
            return reject({
                success: false,
                message: 'Provide the valid phone number'
            })
        }
        //checking the blood group
        if (!'A+, A-, B+, B-, AB+, AB-, O+, O-'.includes(bloodType)) {
            console.log(bloodType)
            return reject({
                success: false,
                message: 'Provide the valid blood group'
            })
        }

        const phoneNumberQuery = 'select * from donors where phone_number = ?'
        //checking the phone number that not used by some other users/donors, Must be unique
        pool.query(phoneNumberQuery, [phoneNumber], (phoneNumberError, phoneNumberResult) => {
            if (phoneNumberError) {
                return reject(phoneNumberError)
            }
            //used by other user
            if (phoneNumberResult.length > 0) {
                return reject({
                    success: false,
                    message: 'Phone number used by another donor, Please choose the other phone number'
                })
            }
            //if not, insert the records
            if (phoneNumberResult.length == 0) {
                const newDonorQuery = 'insert into donors (address,	blood_type,	date_of_birth, gender, medical_history,	full_name, phone_number) values (?,?,?,?,?,?,?) '

                pool.query(newDonorQuery, [address, bloodType, dateOfBirth, gender, medicalHistory, name, phoneNumber], (newDonorError, newDonorResult) => {
                    if (newDonorError) {
                        return reject(newDonorError)
                    }
                    if (newDonorResult.affectedRows > 0) {
                        return resolve({
                            success: true,
                            "donorId": newDonorResult.insertId,
                            "name": name,
                            "phoneNumber": phoneNumber,
                            "address": address,
                            "dateOfBirth": dateOfBirth,
                            "gender": gender,
                            "bloodType": bloodType,
                            "medicalHistory": "No significant medical history."

                        })
                    }
                })
            }
        })
    })
}


exports.getAllDonors = () => ({ msg: "test all" });
exports.getDonorById = () => ({ msg: "test" });
