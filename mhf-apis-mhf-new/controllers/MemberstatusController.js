const mongoose = require("mongoose")
const express = require("express")
const MembershipStatus = require("../models/MembershipStatus")


exports.addMembershipStatus = (req, res) => {

    const reviewedBy= req.body.reviewedBy;
    const reviewerComments= req.body.reviewerComments;
    const approvedBy= req.body.approvedBy;
    const rejected= req.body.rejected; 
    const reasonsForRejection= req.body.reasonsForRejection; 


    const membership = new MembershipStatus({
        reviewedBy: reviewedBy,
        reviewerComments: reviewerComments,
        approvedBy: approvedBy,
        rejected: rejected,
        reasonsForRejection: reasonsForRejection
    })
    membership.save()

    .then((doc) => {
        console.log(doc);

        if (doc) { res.status(200).json({ Message: "Status Has Been Added Successfully.", Result: doc, Status: "Successfull" }) }
    }).catch((err) => {
        if (err) { res.status(200).json({ Message: "Something Bad Has Happened.", Result: err, Status: "Failed" }) }

    })



}

exports.getMembershipStatus = (req, res) => {

    MembershipStatus.findById({ _id: req.body.id })
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