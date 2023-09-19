const addDoctorSchema = require("../schemas/Doctor/addDoctor")
const getDoctorById = require("../schemas/Doctor/getDoctorById")
const getDoctorByName = require("../schemas/Doctor/getDoctorByName")
const updateDoctorDetailsSchema = require("../schemas/Doctor/updateDoctorDetails")
const getDoctorByStatus = require("../schemas/Doctor/getDoctorByStatus")
const updateDoctorStatus = require("../schemas/Doctor/updateDoctorStatus")

const addHospitalSchema = require("../schemas/Hospital/addHospital")
const getHospitalById = require("../schemas/Hospital/getHospitalById")
const updateHospitalDetailsSchema = require("./Hospital/updateHospitalDetails")
const getBospitalByStatus = require("./Hospital/getBospitalByStatus")
const updateHospitatStatus = require("./Hospital/updateHospitatStatus")

const schemaRoutes = {

    "/add_doctor": {
        multi: true,
        post: addDoctorSchema
    },

    "/get_doctor_by_id": {
        multi: true,
        post: getDoctorById
    },

    "/get_doctor_by_name": {
        multi: true,
        post: getDoctorByName
    },

    "/update_doctor_details": {
        multi: true,
        post: updateDoctorDetailsSchema
    },

    "/get_doctor_by_status": {
        multi: true,
        post: getDoctorByStatus
    },

    "/update_doctor_status": {
        multi: true,
        post: updateDoctorStatus
    },

    "/add_hospital":{
        multi:true,
        post:addHospitalSchema
    },

    "/get_hospital_by_id":{
        multi:true,
        post:getHospitalById
    },

    "/update_hospital_profile":{
        multi:true,
        post:updateHospitalDetailsSchema
    },

    "/get_hospital_by_status":{
        multi:true,
        post:getBospitalByStatus
    },

    "/update_hospital_status":{
        multi:true,
        post:updateHospitatStatus
    }


}

module.exports = schemaRoutes