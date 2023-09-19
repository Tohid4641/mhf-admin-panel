var express = require("express");
const UserController = require("../controllers/UserController");
const userAuthMiddleware=require('../middlewares/userAuthMiddleware');

const doctorController = require ("../controllers/doctorController");
const hospitalController = require("../controllers/hospitalController");
const DonationsController = require('../controllers/DonationsController');

var router = express.Router();
router.post("/login", UserController.login);
router.post("/send_otp", UserController.resendConfirmOtp);
router.post("/update_profile", UserController.updateProfile);
router.post("/update_membership", UserController.updateMemberShip);
router.post("/update_payment", UserController.updatePayment);
router.post("/renew_membership", UserController.renewMembership);
router.post("/fetch_user_profile", UserController.fetchUserProfile);
router.post("/insert_complaint", UserController.insertComplaint);
router.post("/complaints", UserController.complaints);
router.post("/complaint", UserController.complaint);
router.post("/complaint_number", UserController.complaintNumber);
router.post("/complaint_update", UserController.complaintUpdate);
router.post("/mla_profile", UserController.mlaProfile);
router.post("/home_event_details", UserController.HomeEventDetails);
router.post("/event_projects", UserController.eventProjects);
router.post("/event_projects_limits", UserController.eventProjectsLimits);
router.post("/event_project", UserController.eventProject);
router.post("/contact_numbers", UserController.contactNumbers);
router.post("/contact_numbers_headofservice", UserController.contactNumbersHeadOfService);
router.post("/contact_us", UserController.contactUs);
router.post("/social_media_linkings", UserController.socialMediaLinkings);
router.post("/complaints_publish", UserController.complaintsPublish);
router.post("/depts", UserController.departments);
router.post("/albums", UserController.albums);
router.post("/album", UserController.album);

router.post("/get_hospital_by_status",hospitalController.getHospitalDataByStatusPagination);
router.post("/get_doctor_by_status",doctorController.getDoctorDataByStatusPagination)

router.post("/get_donation_order_id", DonationsController.createDonationOrderId)
router.post("/update_payment_details", DonationsController.updateDonationOrder)
router.post("/get_donations_by_status", DonationsController.getDonationsByStatus)



module.exports = router;