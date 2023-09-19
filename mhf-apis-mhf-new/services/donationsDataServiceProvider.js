
const donationsModel = require ("../models/DonationsModel")

class donationsDataServiceProvider {
    async createOrderId (data) {
        return await donationsModel.create(data) 
    }
    async updatePayment(orderId, data) {
        return await donationsModel.updateOne({ orderId: orderId }, { $set: data })
    }

    async getDonationsByStatus (query) {
        return await donationsModel.find(query)
    }
}

module.exports = new donationsDataServiceProvider ()