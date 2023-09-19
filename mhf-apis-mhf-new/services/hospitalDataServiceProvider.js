const hospitalModel = require ("../models/hospitalModel")

class hospitalDataServiceProvider {
    async createHospital (data) {
        return await hospitalModel.create(data) 
    }

    async getHospitalById(hospitalId) {
        return await hospitalModel.findOne({ _id: hospitalId })
    }
    async getHospitalByName(query) {
        return await hospitalModel.find(query)
    }
    async updateHospital(hospitalId, data) {
        return await hospitalModel.updateOne({ _id: hospitalId }, { $set: data })
    }
    async getHospitalBystatus(query) {
        return await hospitalModel.find(query)
    }
    async getHospitalBystatusLimit(query, skip, limit) {
        return await hospitalModel.find(query,{},{ skip:parseInt(skip), limit: parseInt(limit)}).sort({_id:-1});
    }

}

module.exports = new hospitalDataServiceProvider ()