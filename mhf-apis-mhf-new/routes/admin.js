var express = require("express");
const AdminController = require("../controllers/AdminController");
const PaymentController = require("../controllers/PymentController")
const MemberstatusController = require("../controllers/MemberstatusController")
const MembertypeController = require('../controllers/MembertypeController');
const ExportController = require('../controllers/ExportController');
const AdminAsyncController = require('../controllers/AdminAsyncController');

const adminAuthMiddleware=require('../middlewares/adminAuthMiddleware');

const doctorController = require ("../controllers/doctorController");
const hospitalController = require("../controllers/hospitalController");
const schemaValidator = require("../middlewares/validations/schemaValidator")
const validateRequest = schemaValidator(true)


var router = express.Router();
router.post("/login", AdminController.login);
router.post("/send_otp", AdminController.resendConfirmOtp);
router.post("/stats", AdminController.adminStats);
router.post("/mla_profile", AdminController.mlaProfile);
router.post("/update_mla_profile", AdminController.updateMLAProfile);
router.post("/insert_dept", AdminController.insertDepartment);
router.post("/depts", AdminController.departments);
router.post("/dept", AdminController.department);
router.post("/update_dept", AdminController.departmentUpdate);
router.post("/update_dept_status", AdminController.departmentUpdateStatus);
router.post("/insert_sub_dept", AdminController.insertSubDepartment);
router.post("/sub_depts", AdminController.subDepartments);
router.post("/sub_dept", AdminController.subDepartment);
router.post("/update_sub_dept", AdminController.subDepartmentUpdate);
router.post("/insert_event_project", AdminController.insertEventProject);
router.post("/events_projects", AdminController.eventProjects);
router.post("/events_projects_status", AdminController.eventProjectsStatus);
router.post("/events_projects_counts", AdminController.eventProjectsCounts);
router.post("/events_projects_filter", AdminController.eventProjectsFilter);
router.post("/event_project", AdminController.eventProject);
router.post("/update_event_project", AdminController.updateEventProject);
router.post("/update_event_project_status", AdminController.updateEventProjectStatus);
router.post("/insert_contact_number", AdminController.insertContactNumber);
router.post("/update_contact_number", AdminController.updateContactNumber);
router.post("/contact_numbers", AdminController.contactNumbers);
router.post("/contact_number", AdminController.contactNumber);
router.post("/contact_number_remove", AdminController.contactNumberRemove);
router.post("/contact_us", AdminController.contactUs);
router.post("/contact_numbers_headofservice", AdminController.contactNumbersHeadOfService);
router.post("/users", AdminController.users);
router.post("/users_counts", AdminController.usersCounts);
router.post("/update_contact_us", AdminController.updateContactUs);
router.post("/insert_socialmedia_linking", AdminController.insertSocialMediaLinking);
router.post("/social_media_linkings", AdminController.socialMediaLinkings);
router.post("/social_media_linking", AdminController.socialMediaLinking);
router.post("/social_media_linking_update", AdminController.socialMediaLinkingUpdate);
router.post("/complaints", AdminController.complaints);
router.post("/complaints_counts", AdminController.complaintsCounts);
router.post("/complaints_filter", AdminController.complaintsFilter);
router.post("/complaint", AdminController.complaint);
router.post("/complaint_number", AdminController.complaintNumber);
router.post("/complaint_update", AdminController.complaintUpdate);
router.post("/complaint_update_publish", AdminController.complaintUpdatePublish);
router.post("/insert_album", AdminController.insertAlbum);
router.post("/update_album", AdminController.updateAlbum);
router.post("/update_album_status", AdminController.updateAlbumStatus);
router.post("/albums", AdminController.albums);
router.post("/albums_status", AdminController.albums_status);
router.post("/album", AdminController.album);

router.post("/add_user", AdminController.addUser)
router.post("/get_user_details", AdminController.getUserDetails)
router.post("/users_list_by_status", AdminController.usersListByStatus)
router.post("/users_list_by_membership_status", AdminController.usersListByMemberShipStatusPagination)
router.post("/users_list_by_membership_expiry_date", AdminController.usersListByMemberShipExpiryDatePagination)
router.post("/delete_user", AdminController.deleteUser)
router.post("/delete_user_account", AdminController.deleteUserAccout)
router.post("/updatetheUser", AdminController.updateuserPersonalInfo)

router.post("/addPaymentType", PaymentController.addPaymentType)
router.get("/getPaymentType", PaymentController.getPaymentType)
router.delete("/deletePaymentType", PaymentController.deletePaymentType)
router.post("/membershipStatus", MemberstatusController.addMembershipStatus)
router.get("/getMembershipStatus", MemberstatusController.getMembershipStatus)
router.post('/addmembershipType', MembertypeController.addMembershipType)
router.get('/getmembershipTypeDetails', MembertypeController.getMembershipType)

router.post("/update_membership_status", AdminController.updateMemberShipStatus)
router.post("/update_membership_dates", AdminController.updateMemberShipDate)

router.post("/add_doctor",[adminAuthMiddleware.adminCheckingHeaders,validateRequest],doctorController.addDoctor)
router.post("/get_doctor_by_id",[adminAuthMiddleware.adminCheckingHeaders,validateRequest],doctorController.getDoctorDataById)
router.post("/get_doctor_by_name",[adminAuthMiddleware.adminCheckingHeaders,validateRequest],doctorController.doctorByName)
router.post("/update_doctor_details",[adminAuthMiddleware.adminCheckingHeaders,validateRequest],doctorController.updateDoctorDetails)
router.post("/get_doctor_by_status",[adminAuthMiddleware.adminCheckingHeaders,validateRequest],doctorController.getDoctorDataByStatus)
router.post("/update_doctor_status",[adminAuthMiddleware.adminCheckingHeaders,validateRequest],doctorController.updateDoctorStatus)

router.post("/add_hospital",[adminAuthMiddleware.adminCheckingHeaders,validateRequest],hospitalController.addHospital)
router.post("/get_hospital_by_id",[adminAuthMiddleware.adminCheckingHeaders,validateRequest],hospitalController.getHospitalDataById)
router.get("/get_hospital_by_name",hospitalController.hospitalByName)
router.post("/update_hospital_profile",[adminAuthMiddleware.adminCheckingHeaders,validateRequest],hospitalController.updateHospitalDetails)
router.post("/get_hospital_by_status",[adminAuthMiddleware.adminCheckingHeaders,validateRequest],hospitalController.getHospitalDataByStatus)
router.post("/update_hospital_status",[adminAuthMiddleware.adminCheckingHeaders,validateRequest],hospitalController.updateHospitalStatus)

router.post("/export_members",[adminAuthMiddleware.adminCheckingHeaders], ExportController.exportMembersList);
router.post("/add_membership",[adminAuthMiddleware.adminCheckingHeaders], AdminAsyncController.addMemberShip);
router.post("/update_membership",[adminAuthMiddleware.adminCheckingHeaders], AdminAsyncController.updateMemberShip);

module.exports = router;