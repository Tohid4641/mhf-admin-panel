const express = require('express');
const MembershipType = require('../models/Membershiptype')



exports.addMembershipType = (req, res) => {

    const planDuration= req.body.planDuration;
    const userId= req.body.userId;
    const MemberStatus= req.body.MemberStatus;


    const membershipT = new MembershipType({
        planDuration: planDuration,
        userId: userId,
        MemberStatus: MemberStatus,
    })
    membershipT.save()

    .then((doc) => {
        console.log(doc);

        if (doc) { res.status(200).json({ Message: "MembershipType Has Been Added Successfully.", Result: doc, Status: "successfull" }) }
    }).catch((err) => {
        if (err) { res.status(200).json({ Message: "Something Bad Has Happened.", Result: err, Status: "Failed" }) }

    })

}

exports.getMembershipType = (req, res) => {

    MembershipType.find({ userId: req.body.userId})
        .then((doc) => {
            if (doc) {
                res.status(200).json({ Message: "Here is your Details",Result: doc,  status: true })
            }
        })
        .catch((err) => {
            if (err) {
                res.status(200).json({ Message: "No User record present on this Id", err })

            }
        })
}