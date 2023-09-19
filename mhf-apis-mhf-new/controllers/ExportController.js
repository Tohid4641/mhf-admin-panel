const apiResponse = require("../helpers/apiResponse");
const UserModel = require("../models/UserModel");
const excelJS = require("exceljs");

const exportMembersList = async (req, res) => {

    try {
        let membersQuery = [{ memberShipStatus: req.body.memberShipStatus }];
        if (req.body.search && req.body.search !== '') {
            membersQuery.push({ $or: [{ fullName: { $regex: req.body.search, $options: "i" } }, { mobileNo: { $regex: req.body.search, $options: "i" } }] });
        }
        membersQuery = { $and: membersQuery };

        const UserData = await UserModel.find(membersQuery).sort({createdAt:-1});

        const workbook = new excelJS.Workbook();  // Create a new workbook
        const worksheet = workbook.addWorksheet("My Users"); // New Worksheet
        const path = "./exports";  // Path to download excel
        // Column for data in excel. key must match data key
        worksheet.columns = [
            { header: "S No", key: "s_no", width: 10 },
            { header: "Mobile No", key: "mobileNo", width: 10 },
            { header: "MemberShip Id", key: "memberShipId", width: 10 },
            { header: "Issue Date", key: "issueDate", width: 10 },
            { header: "Expiry Date", key: "expiryDate", width: 10 },
            { header: "Name", key: "name", width: 10 },
            { header: "Father Name", key: "fatherName", width: 10 },
            { header: "Email", key: "email", width: 10 },
            { header: "Date Of Birth", key: "dateOfBirth", width: 10 },
            { header: "Aadhar", key: "aadhar", width: 10 },
            { header: "Address Proof", key: "addressProof", width: 10 },
            { header: "Ellection Id", key: "electionId", width: 10 },
            { header: "Id Proof", key: "idProof", width: 10 },
            { header: "Gender", key: "gender", width: 10 },
            { header: "Marital Status", key: "maritalStatus", width: 10 },
            { header: "Relation Type", key: "relationType", width: 10 },
            { header: "Profile Photo", key: "profilePhoto", width: 10 },
            { header: "Address", key: "address", width: 10 },
            { header: "Area", key: "area", width: 10 },
            { header: "City", key: "city", width: 10 },
            { header: "State", key: "state", width: 10 },
            { header: "ZipCode", key: "zipCode", width: 10 },
            { header: "Qualification", key: "qualification", width: 10 },
            { header: "Reference", key: "reference", width: 10 },
        ];

        UserData.map((user, index) => {
            user.s_no = index+1;
            worksheet.addRow(user);
        });

        // Making first line in excel bold
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
        });
        console.log("before");
        let file = `users_${Date.now()}.xlsx`;
        const data = await workbook.xlsx.writeFile(`${path}/${file}`)
            .then(() => {
                let dataResp = {
                    status: "success",
                    message: "file successfully downloaded",
                    file: file,
                };
                apiResponse.successResponseWithData(res,"Congratulations You have been registered successfully.", dataResp);
            });
        
    } catch (err) {
        console.log(err);
        apiResponse.unauthorizedResponse(res, "error occured");
    }
}

module.exports = { exportMembersList }