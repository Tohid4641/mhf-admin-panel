const apiResponse = require("../helpers/apiResponse");
const hospitalDataServiceProvider = require("../services/hospitalDataServiceProvider")

// Add Hospital

const addHospital = async (req, res) => {
    try {
        const data = req.body

        const addedHospital = await hospitalDataServiceProvider.createHospital(data)
        if (!addedHospital) {
            apiResponse.unauthorizedResponse(res, "Hospital could not be added successfully.");
        } else {
            apiResponse.successResponseWithData(res,"Congratulations You have been registered successfully.", addedHospital);
        }
    } catch (err) {
        apiResponse.unauthorizedResponse(res, "error occured");
    }
}

// Get Hospital details by ID
const getHospitalDataById = async (req, res) => {

    try {
        const gotHospitalById = await hospitalDataServiceProvider.getHospitalById(req.body.hospital_id)
        if (!gotHospitalById) {
            apiResponse.unauthorizedResponse(res, "could not retrieve hospital");
        } else {
            apiResponse.successResponseWithData(res,"following are the hospital details", gotHospitalById);
        }
    } catch (err) {
        apiResponse.unauthorizedResponse(res, "Error occurred while getting hospital");
    }
};

// Get Hospital details by status
const getHospitalDataByStatus = async (req, res) => {

    try {
        const query = {
            status: req.body.status
        }
        const gotHospitalByStatus = await hospitalDataServiceProvider.getHospitalBystatus(query)
        if (!gotHospitalByStatus) {
            apiResponse.unauthorizedResponse(res, "could not retrieve Hospital status List");
        } else {
            apiResponse.successResponseWithData(res,"Following are the Hospital Status List", gotHospitalByStatus);
        }
    } catch (err) {
        apiResponse.unauthorizedResponse(res, "Error occurred while getting hospital");
    }
};

const getHospitalDataByStatusPagination = async (req, res) => {

    try {
        let query = [{ status: req.body.status }];
        if(req.body.search && req.body.search !== ''){
            query.push({ $or: [{ name_of_hospital: {$regex:req.body.search, $options: "i"} }, { address_of_hospital: {$regex:req.body.search, $options: "i"} }] });
        }
        query = { $and: query };

        const skip = req.body.skip ? req.body.skip : 0;
        const limit = req.body.limit ? req.body.limit : 30;
        const gotHospitalByStatus = await hospitalDataServiceProvider.getHospitalBystatusLimit(query, skip, limit)
        if (!gotHospitalByStatus) {
            apiResponse.unauthorizedResponse(res, "could not retrieve Hospital status List");
        } else {
            apiResponse.successResponseWithData(res,"Following are the Hospital Status List", gotHospitalByStatus);
        }
    } catch (err) {
        apiResponse.unauthorizedResponse(res, "Error occurred while getting hospital");
    }
};

// Get Hospital details by status
const updateHospitalStatus = async (req, res) => {

    try {
        const data = {
            status: req.body.status
        }
        const gotHospitalByStatus = await hospitalDataServiceProvider.updateHospital(req.body.hospital_id, data)
        if (!gotHospitalByStatus) {
            apiResponse.unauthorizedResponse(res, "could not retrieve Hospital status List");
        } else {
            apiResponse.successResponseWithData(res,"Following are the Hospital Status List", gotHospitalByStatus);
        }
    } catch (err) {
        apiResponse.unauthorizedResponse(res, "Error occurred while getting hospital");
    }
};

// Get hospital by Name
const hospitalByName = async (req, res) => {
    try {
        let query = {
            name: req.query.name
        }

        const hospital = await hospitalDataServiceProvider.getHospitalByName(query)
        if (!hospital) {
            apiResponse.unauthorizedResponse(res, "Could not find hospital with given name.");
        } else {
            apiResponse.successResponseWithData(res,"Following is the hospital by given name.", hospital);
        }

    } catch (err) {
        apiResponse.unauthorizedResponse(res, "Error occured during operation.");
    }
}

// Update Hospital details
const updateHospitalDetails = async (req, res) => {
    try {
        const data = req.body

        const updatedData = await hospitalDataServiceProvider.updateHospital(req.body.hospital_id, data)
        if (!updatedData) {
            apiResponse.unauthorizedResponse(res, "Could not be update hospital name.");
        } else {
            apiResponse.successResponseWithData(res,"Following is the hospital by given name.", updatedData);
        }

    } catch (err) {
        apiResponse.unauthorizedResponse(res, "Error occured during updating hospital.");
    }

}
module.exports = { 
    addHospital, getHospitalDataById, getHospitalDataByStatus, hospitalByName, updateHospitalDetails, updateHospitalStatus,
    getHospitalDataByStatusPagination }