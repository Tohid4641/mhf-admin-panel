const apiResponse = require("../helpers/apiResponse");
const UserModel = require("../models/UserModel");
const FamilyMembersModel = require("../models/FamilyMembersModel");
const MembershipHistory = require("../models/MembershipHistoryModel");
const PaymentsModel = require("../models/PaymentsModel");

const moment = require ("moment")

const updateMemberShip = async (req, res) => {

    try {
        
        let data = req.body;
        let user = await UserModel.findOne({mobileNo: req.body.mobileNo});
        if(user){
            let membershipUpdate = await UserModel.updateOne({mobileNo: req.body.mobileNo}, {$set: data});

            await FamilyMembersModel.updateMany({userId: user._id}, {$set:{status:false}})
            if(req.body.familyMembers){
                let familyMembers = JSON.parse(req.body.familyMembers);
                let members = familyMembers.map((eachFamily) => {
                    return { userId : user._id, name: eachFamily.name, relation: eachFamily.relation, idproof: eachFamily.id }
                })
                await FamilyMembersModel.insertMany(members);
            }

            apiResponse.successResponseWithData(res,"Membership Updated Successfully.", membershipUpdate);

        } else {
            apiResponse.successResponse(res,"Membership Not Found.");
        }
        

    } catch (err) {
        console.log(err);
        apiResponse.unauthorizedResponse(res, "error occured");
    }
}

const addMemberShip = async (req, res) => {

    try {
        
        let data = req.body;
        let user = await UserModel.findOne({mobileNo: req.body.mobileNo});
        if(!user){

            if(!data.memberShipId){
                let randomNumber = Math.floor(Math.random() * 100000000);
                randomNumber = '' + randomNumber;
                while (randomNumber.length < 8) {
                    randomNumber = randomNumber + '0';
                }
                const currentDate = moment()
                const dateFormat = currentDate.format('MMYY')
                data.memberShipId = dateFormat+randomNumber;
            }

            let membershipData = await UserModel.create(data);

            if(req.body.familyMembers){
                let familyMembers = JSON.parse(req.body.familyMembers);
                let members = familyMembers.map((eachFamily) => {
                    return { userId : membershipData._id, name: eachFamily.name, relation: eachFamily.relation, idproof: eachFamily.id }
                })
                await FamilyMembersModel.insertMany(members);
            }

            apiResponse.successResponseWithData(res,"Membership added Successfully.", membershipData);

        } else {
            apiResponse.successResponse(res,"Member Already Registered.");
        }
        

    } catch (err) {
        console.log(err);
        apiResponse.unauthorizedResponse(res, "error occured");
    }
}


const renuewMemberShip = async (req, res) => {

    try {
        
        let data = req.body;
        let member = await UserModel.findOne({_id: req.body.id});
        if(member){

            let paymentDetails = null;
            if(member.paymentRef){
                paymentDetails = await PaymentsModel.findOne({_id: member.paymentRef });
            } else {
                paymentDetails = await PaymentsModel.findOne({userId: member._id, status: "Approved"}).sort({"createdAt": -1}).limit(1);
            }
            
            if(paymentDetails){
                let history = {
                    userId: req.body.id,
                    paymentRef: member.paymentRef,
                    issueDate: member.issueDate,
                    expiryDate: member.expiryDate
                }
                let historyAdded = await MembershipHistory.create(history);

                let payments = await PaymentsModel.findOne({userId: member._id, status: "Pending"});
                let memberUpdateData = {};
                const today = moment();
                memberUpdateData.issueDate = today;
                const expiryDate = today.add(parseInt(payments["paymentDuration"]), 'months');
                memberUpdateData.expiryDate = expiryDate;
                await UserModel.updateOne({_id: req.body.id}, {$set: memberUpdateData});

                apiResponse.successResponseWithData(res,"Membership renewed Successfully.", membershipData);
            } else {
                apiResponse.successResponseWithData(res,"Membership Not Updated.", membershipData);
            }
            
            

        } else {
            apiResponse.successResponse(res,"Member Already Registered.");
        }
        

    } catch (err) {
        console.log(err);
        apiResponse.unauthorizedResponse(res, "error occured");
    }
}

module.exports = { updateMemberShip, addMemberShip }