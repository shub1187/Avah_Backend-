const {
    register,
    login,
    createAppointment,
    getAllModelPerBrand,
    updateUserDetail,
    deleteUser,
    getUserSearch,
    updateUserPassword,
    updateUserActive,
    getAllEmployee,
    getAllAppointment,
    getAllTechnicianEmployee,
    createEmployee,
    getEmployeeById,
    updateEmployeeDetail,
    deleteEmployee,
    getEmployeeSearch,
    updateEmployeeActive,
    updateEmployeePassword,
    getUserVehicleSearch,
    createLabour,
    updateLabourDetail,
    updateLabourActive,
    deleteLabour,
    getLabourSearch,
    createEstimate,
    getAllEstimate,
    spApprovalOfCustAppointment,
    getAllPendingAppointment,
    getAllRejectedAndCancelledAppointment,
    addSpares,
    addLabour,
    getAllSpares,
    getAllLabour,
    deleteSpare,
    addEstimate,
    getEstimateDetails,
    editEstimate,
    getEstimatePendingVehcileList,
    getAllLabourListForAutoFill,
    getAllSpareListForAutoFill,
    getSpecificSpareDetailsForEstimate,
    getSpecificLabourDetailsForEstimate,
    getSpecificVechicleDetailsToCreateEstimate,
    getAllCreatedEstimateList,
    addEmployeeRole,
    getAllEmployeeRoles,
    getAllPermissionPerRoles,
    getNotificationNumbers,
    deleteEmployeeRole,
    editEmployeeRole,
    getAllCreatedJobcardList,
    getJobcardDetails,
    updateJobcard,
    getAllAdminAdvisorEmployee,
    openJobcard,
    generateInvoice,
    getAllPendingPaymentInvoices,
    recievePayment,
    getAllPaidInvoices,
    getAllVehicleList,
    getSpecificVehicleDetailsForSpAppt,
    reset_password,
  getStatistics    
} = require("../controllers/serviceproviders.controllers.js");
const router = require("express").Router();
const { checkToken } = require("../middlewares/auth_validation");

//common
router.post("/login", login);
router.post("/resetPassword",reset_password)

router.get("/getStatistics",checkToken,getStatistics)


//user



// Registeration Router
router.post("/registerServiceProvider",register)
router.post("/updateUserDetail", checkToken, updateUserDetail);
router.post("/deleteUser", checkToken, deleteUser);
router.get("/getUserSearch", checkToken, getUserSearch);
router.post("/updateUserActive", checkToken, updateUserActive);
router.post("/updateUserPassword", checkToken, updateUserPassword);

//employee
router.get("/getAllEmployee", checkToken, getAllEmployee);

router.post("/createEmployee", checkToken, createEmployee);
router.post("/getEmployeeById", checkToken, getEmployeeById);
router.post("/updateEmployeeDetail", checkToken, updateEmployeeDetail);
router.post("/deleteEmployee", checkToken, deleteEmployee);
router.get("/getEmployeeSearch", checkToken, getEmployeeSearch);
router.post("/updateEmployeeActive", checkToken, updateEmployeeActive);
router.post("/updateEmployeePassword", checkToken, updateEmployeePassword);

//Appointment 
router.post("/createAppointment", checkToken, createAppointment);
router.get("/getAllAppointment", checkToken, getAllAppointment);
router.get("/getAllModelPerBrand", checkToken, getAllModelPerBrand);
router.get("/getAllPendingAppointment", checkToken, getAllPendingAppointment);
router.get("/getAllRejectedAndCancelledAppointment", checkToken, getAllRejectedAndCancelledAppointment);
router.get("/getAllVehicleList", checkToken, getAllVehicleList);
router.get("/getSpecificVehicleDetailsForSpAppt", checkToken, getSpecificVehicleDetailsForSpAppt);

router.post("/approveCustAppointment", checkToken, spApprovalOfCustAppointment); // Currently Not in Use

//spares
router.post("/addspare",checkToken,addSpares);
router.get("/getAllSpares",checkToken,getAllSpares),
router.post("/deleteSpare",checkToken,deleteSpare);
router.get("/getSpecificSpareDetailsForEstimate",checkToken,getSpecificSpareDetailsForEstimate)
// Labours 
router.post("/addLabour",checkToken,addLabour)
router.get("/getAllLabour",checkToken,getAllLabour)
router.post("/deleteLabour",checkToken,deleteLabour)
router.get("/getSpecificLabourDetailsForEstimate",checkToken,getSpecificLabourDetailsForEstimate)

// Roles 
router.post("/addEmployeeRole",checkToken,addEmployeeRole)
router.get("/getAllEmployeeRoles",checkToken,getAllEmployeeRoles)
router.get("/getAllPermissionPerRoles",checkToken,getAllPermissionPerRoles)
router.post("/deleteEmployeeRole", checkToken, deleteEmployeeRole);
router.post("/editEmployeeRole", checkToken, editEmployeeRole);


//estimate
router.post("/addEstimate", checkToken, addEstimate);
router.get("/getEstimateDetails", checkToken, getEstimateDetails);
router.post("/editEstimate", checkToken, editEstimate);
router.get("/getEstimatePendingVehcileList", checkToken, getEstimatePendingVehcileList);
router.get("/getAllLabourListForAutoFill", checkToken, getAllLabourListForAutoFill);
router.get("/getAllSpareListForAutoFill", checkToken, getAllSpareListForAutoFill);
router.get("/getSpecificVechicleDetailsToCreateEstimate", checkToken, getSpecificVechicleDetailsToCreateEstimate);
router.get("/getAllCreatedEstimateList", checkToken, getAllCreatedEstimateList);

// Jobcard
router.get("/getAllCreatedJobcardList",checkToken,getAllCreatedJobcardList);
router.get("/getJobcardDetails",checkToken,getJobcardDetails);
router.post("/updateJobcard", checkToken, updateJobcard);
router.get("/getAllAdminAdvisorEmployee",checkToken,getAllAdminAdvisorEmployee);
router.get("/getAllTechnicianEmployee", checkToken, getAllTechnicianEmployee);
router.post("/openJobcard", checkToken, openJobcard);

// Invoice
router.post("/generateInvoice", checkToken, generateInvoice);
router.get("/getAllPendingPaymentInvoices", checkToken, getAllPendingPaymentInvoices);
router.post("/recievePayment", checkToken, recievePayment);
router.get("/getAllPaidInvoices", checkToken, getAllPaidInvoices);


//MISC 
router.get("/getNotificationNumbers",checkToken,getNotificationNumbers)


module.exports = router;