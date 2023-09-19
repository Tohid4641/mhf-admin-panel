const apiResponse = require("../helpers/apiResponse");
const doctorDataServiceProvider = require("../services/doctorDataServiceProvider")

// Add Doctor
const addDoctor = async (req, res) => {
    try {
        const data = req.body

        const addedDoctor = await doctorDataServiceProvider.createDoctor(data)
        if (!addedDoctor) {
            apiResponse.unauthorizedResponse(res, "doctor could not be added successfully.");
        } else {
            apiResponse.successResponseWithData(res,"Congratulations You have been registered successfully.", addedDoctor);
        }
    } catch (err) {
        console.log(err)
        apiResponse.unauthorizedResponse(res, "error occured");
    }
}

// Get Doctor details by Id

const getDoctorDataById = async (req, res) => {

    try {
        const query = req.body.doctor_id

        const gotDoctorById = await doctorDataServiceProvider.getDoctorById(query)
        if (!gotDoctorById) {
            apiResponse.unauthorizedResponse(res, "could not retrieve doctor");
        } else {
            apiResponse.successResponseWithData(res,"following are the doctor details", gotDoctorById);
        }
    } catch (err) {
        apiResponse.unauthorizedResponse(res, "Error occurred while getting doctor");
    }

};


// Get Doctor details by status
const getDoctorDataByStatus = async (req, res) => {

    try {
        const query = {
            status: req.body.status
        }
        const gotDoctorByStatus = await doctorDataServiceProvider.getDoctorByStatus(query
        )
        if (!gotDoctorByStatus) {
            apiResponse.unauthorizedResponse(res, "Could not retrieve Doctor status List");
        } else {
            apiResponse.successResponseWithData(res,"Following are the Doctor Status List", gotDoctorByStatus);
        }
    } catch (err) {
        apiResponse.unauthorizedResponse(res, "Error occurred while getting doctor");
    }
};

// Get Doctor details by status
const getDoctorDataByStatusPagination = async (req, res) => {

    try {

        let query = [{ status: req.body.status }];
        if(req.body.search && req.body.search !== ''){
            query.push({ $or: [{ name_of_doctor: {$regex:req.body.search, $options: "i"} }, { list_of_hospitals_working: {$regex:req.body.search, $options: "i"} }] });
        }
        query = { $and: query };
        const skip = req.body.skip ? req.body.skip : 0;
        const limit = req.body.limit ? req.body.limit : 30;
        const gotDoctorByStatus = await doctorDataServiceProvider.getDoctorByStatusPagination(query, skip, limit)
        if (!gotDoctorByStatus) {
            apiResponse.unauthorizedResponse(res, "Could not retrieve Doctor status List");
        } else {
            apiResponse.successResponseWithData(res,"Following are the Doctor Status List", gotDoctorByStatus);
        }
    } catch (err) {
        console.log(err);
        apiResponse.unauthorizedResponse(res, "Error occurred while getting doctor");
    }
};

// Get Doctor by Name
const doctorByName = async (req, res) => {
    try {
        let query = {
            name_of_doctor: req.body.name
        }

        const doctor = await doctorDataServiceProvider.getDoctorByName(query)
        if (!doctor) {
            apiResponse.unauthorizedResponse(res, "Could not find doctor with given name.");
        } else {
            apiResponse.successResponseWithData(res,"Following is the doctor by given name.", doctor);
        }

    } catch (err) {
        apiResponse.unauthorizedResponse(res, "Error occured during operation.");
    }
}

// Update Doctor details
const updateDoctorDetails = async (req, res) => {
    try {
        const data = req.body

        // console.log(req.body)
        const updatedData = await doctorDataServiceProvider.updateDoctor(req.body.doctor_id, data)
        if (!updatedData) {
            apiResponse.unauthorizedResponse(res, "Could not be update doctor name.");
        } else {
            apiResponse.successResponseWithData(res,"Doctor name has been updated successfully.", updatedData);
        }

    } catch (err) {
        console.log(err);
        apiResponse.unauthorizedResponse(res, "Error occured during updating doctor.");
    }

}

// Update Doctor details
const updateDoctorStatus = async (req, res) => {
    try {

        // console.log(req.body)
        const updatedData = await doctorDataServiceProvider.updateDoctorStatus(req.body.doctor_id, { status: req.body.status })
        if (!updatedData) {
            apiResponse.unauthorizedResponse(res, "Could not be update doctor name.");
        } else {
            apiResponse.successResponseWithData(res,"Doctor name has been updated successfully.", updatedData);
        }

    } catch (err) {
        console.log(err);
        apiResponse.unauthorizedResponse(res, "Error occured during updating doctor.");
    }

}

module.exports = { 
    addDoctor, getDoctorDataById, getDoctorDataByStatus, doctorByName, updateDoctorDetails, updateDoctorStatus,
    getDoctorDataByStatusPagination }