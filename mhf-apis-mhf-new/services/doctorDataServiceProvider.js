const doctorModel = require ("../models/doctorModel")

class doctorDataServiceProvider {
    async createDoctor (data) {
        return await doctorModel.create(data) 
    }

    async getDoctorById(doctorId) {
        return await doctorModel.findOne({ _id: doctorId })
    }
    async getDoctorByName(query) {
        return await doctorModel.find(query)
    }
    async updateDoctor(doctorId, data) {
        return await doctorModel.updateOne({ _id: doctorId }, { $set: data })
    }
    async updateDoctorStatus(doctorId, data) {
        return await doctorModel.updateOne({ _id: doctorId }, { $set: data })
    }
    async getDoctorByStatus (query) {
        return await doctorModel.find(query)
    }

    async getDoctorByStatusPagination (query, skip, limit) {
        return await doctorModel.find(query,{},{ skip:parseInt(skip), limit: parseInt(limit)}).sort({_id:-1});
    }
    

}

module.exports = new doctorDataServiceProvider ()