const apiResponse = require("../helpers/apiResponse");
const { razorPayKeys } = require("../helpers/razorpay");
const donationsDataServiceProvider = require("../services/donationsDataServiceProvider");
const Razorpay = require('razorpay')

const createDonationOrderId = async (req, res) => {
    try {
        const data = req.body

        var instance = new Razorpay({ key_id: razorPayKeys.key_id, key_secret: razorPayKeys.key_secret });

        instance.orders.create({
            amount: parseInt(data.amount),
            currency: data.currency,
            receipt: data.recipt,
            notes: {
              key1: "key1",
              key2: "key3"
            }
        }).then(async(orderData) => {

            let order = {
                orderId: orderData.id,
                receipt: data.receipt,
                amount: data.originalAmount,
                currency: orderData.currency,
                mobileNo: data.mobileNo
            }

            if(req.user){
                order.user = req.user._id;
                order.mobileNo = req.user.mobileNo;
            }

            await donationsDataServiceProvider.createOrderId(order);

            apiResponse.successResponseWithData(res,"Congratulations You have been registered successfully.", orderData);
        }).catch((error) => {
            apiResponse.unauthorizedResponse(res, "Got Error while creating Order.");
        })
    } catch (err) {
        apiResponse.unauthorizedResponse(res, "error occured");
    }
}

const updateDonationOrder = async (req, res) => {
    try {
        const data = req.body;
        let updateData = await donationsDataServiceProvider.updatePayment(data.orderId, data);

        if(updateData){
            apiResponse.successResponseWithData(res,"Payment Updated Successfully", updateData);
        } else {
            apiResponse.unauthorizedResponse(res, "Got Error while updating payment.");
        }
    } catch (err) {
        apiResponse.unauthorizedResponse(res, "error occured");
    }
}

const getDonationsByStatus = async (req, res) => {
    try {
        
        let query = [ { status: req.body.status } ];

        if(req.user){
            query.push({ $or:[{mobileNo : req.body.mobileNo},{user : req.user._id}] });
        } else {
            query.push({mobileNo : req.body.mobileNo});
        }

        let updateData = await donationsDataServiceProvider.getDonationsByStatus(query);

        if(updateData){
            apiResponse.successResponseWithData(res,"Payment Updated Successfully", orderData);
        } else {
            apiResponse.unauthorizedResponse(res, "Got Error while updating payment.");
        }
    } catch (err) {
        apiResponse.unauthorizedResponse(res, "error occured");
    }
}

module.exports = { createDonationOrderId, updateDonationOrder, getDonationsByStatus }