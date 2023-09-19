const express = require("express")
const mongoose = require("mongoose")
const multer = require("multer")

const PaymentType = require("../models/Pymenttype")

var i = (function (n)
 {
    return  () => {
        n = n + 1;
        return n;
    }
}(0));

exports.addPaymentType = (req, res) => {

    const paymentType = req.body.paymentType;
    const userId = req.body.userId;
    const amount = req.body.amount;
    const transactionChannel = req.body.transactionChannel;


    const payment = new PaymentType({
        paymentType: paymentType,
        userId: userId,
        amount: amount,
        transactionChannel: transactionChannel,
        paymentReceipt: userId + "_" + "PaymentReceipt_" + i() + req.file.filename
    })

    payment.save()

    .then((doc) => {
        console.log(doc);
        if (doc) { res.status(200).json({ Message: "Payment type Has Been Added Successfully.", Result: doc, Status: "Success" }) }

    }).catch((err) => {
        if (err) { res.status(200).json({ Message: "Failed To Add Document.", Result: err, Status: 'Failed' }) }
    })

}

exports.getPaymentType = (req, res) => {

    PaymentType.find({ userId: req.body.userId })
        .then((doc) => {
            if (doc) {
                res.status(200).json({ Result: doc, status: true })
            }
        })
        .catch((err) => {
            if (err) {
                res.status(200).json({ Message: "No User record present on this Id", err })

            }
        })
}

exports.deletePaymentType = (req, res) => {
    PaymentType.findByIdAndDelete({ _id: req.body.id }, (err, doc) => {
        if (err) {
            if (err) { res.status(200).json({ Message: "Failed to delete.", err }) }
        } else {
            if (doc) { res.status(200).json({ Message: "PaymentType Has Been Deleted." }) }
        }
    })
}