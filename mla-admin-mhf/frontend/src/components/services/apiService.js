const apiService = {
  admin_send_otp: 'admin/send_otp',
  user_send_otp: 'user/send_otp',
  adminLogin: 'admin/login',
  userLogin: 'user/login',
  insertDepartment: 'admin/insert_dept',
  getDepartments: 'admin/depts',
  getDepartment: 'admin/dept',
  updateDepartment: 'admin/update_dept',
  updateDeptStatus: 'admin/update_dept_status',
  getEventsProjects: 'admin/events_projects_status',
  insertEventProject: 'admin/insert_event_project',
  updateEventProject: 'admin/update_event_project',
  getEventDetails: 'admin/event_project',
  fileUpload: 'file/file_upload',
  s3file_imageUpload: 's3file/image_upload',
  getProfile: 'admin/mla_profile',
  updateProfile: 'admin/update_mla_profile',
  insertContacts: 'admin/insert_contact_number',
  getContacts: 'admin/contact_numbers',
  contactDetails: 'admin/contact_number',
  deletetDetails: 'admin/contact_number_remove',
  updateContactHeadService: 'admin/update_contact_number',
  getComplaints: 'admin/complaints',
  complaintDetails: 'admin/complaint',
  complaint_number: 'admin/complaint_number',
  updateComplaint: 'admin/complaint_update',
  updateComplaintPublish: 'admin/complaint_update_publish',
  getContactUs: 'admin/contact_us',
  updateContactUs: 'admin/update_contact_us',
  getAlbums: 'admin/albums_status',
  getAlbum: 'admin/album',
  insertAlbum: 'admin/insert_album',
  updateAlbum: 'admin/update_album',
  userList: 'admin/users',
  headOfServiceList: 'admin/contact_numbers_headofservice',
  complaintsFilter: 'admin/complaints_filter',
  complaintsCount: 'admin/complaints_counts',
  eventProjectsCount: 'admin/events_projects_counts',
  usersCount: 'admin/users_counts',
  filter_events: 'admin/events_projects_filter',
  deletetEvent: 'admin/update_event_project_status',
  deleteAlbum: 'admin/update_album_status',
  socialMediaLinkings: 'admin/social_media_linkings',
  insertSocialMediaLinking: 'admin/insert_socialmedia_linking',
  socialMediaLinkingUpdate: 'admin/social_media_linking_update',
  getStats:'admin/stats',
  exportMembersList: 'admin/export_members',

  //..  Membership API's ..//
  insertMember: 'admin/add_user',
  add_membership: 'admin/add_membership',
  update_membership: 'admin/update_membership',
  updateMemberStatus: 'admin/update_member_status',
  deleteMember: 'admin/delete_user',
  deleteMemberAccount: 'admin/delete_user_account',
  getMembersList: 'admin/users_list_by_status',
  getMembersDetails: 'admin/get_user_details',
  updateMemberShipStatus: 'admin/update_membership_status',
  updateMemberShipDate: 'admin/update_membership_dates',
  usersListByMembershipStatus: 'admin/users_list_by_membership_status',
  usersListByMembershipExpiryDate: 'admin/users_list_by_membership_expiry_date',

  //..  Hospital API's ..//
  addHospital: 'admin/add_hospital',
  updateHospital: 'admin/update_hospital_profile',
  deleteHospital: 'admin/update_hospital_status',
  getHospitalList: 'admin/get_hospital_by_status',
  getHospitalDetails: 'admin/get_hospital_by_id',

  //..  Doctors API's ..//
  addDoctor: 'admin/add_doctor',
  updateDoctor: 'admin/update_doctor_details',
  deleteDoctor: 'admin/update_doctor_status',
  getDoctorsList: 'admin/get_doctor_by_status',
  getDoctorDetails: 'admin/get_doctor_by_id'
};

export default apiService;