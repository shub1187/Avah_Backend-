const {register,
    login,
    profile_completion,
    vehicleRegistration,
    vehicle_search,
    get_customer_vehicles,
    get_customer_profile_data,
    getAllCitiesPerState,
    getAllStates,
    getAllSpAsPerCustomerCity,
    getAllCities,
    createAppointment,
    getSPProfileData,
    getAllApprovedSpCities,
    get_customer_vehicle_numbers,
    getAllSpDetailsAsPerCustomerCity,
    cancelAppointment,
    getAllPendingApprovedAppointment,
    getAllRejectedCancelledAppointment,
    estimateApprovalFromCustomer,
    estimateRejectedByCustomer,
    profile_completion_with_image,
    reset_password,
    getStatistics,
    getRandomSp,
    getGeneralStatistics,
    rateServiceProvider,
    getPaidServices

} 
    = require("../controllers/customer.controllers.js");
const router = require("express").Router();
const { checkToken } = require("../middlewares/auth_validation");




router.post("/registerCustomer",register) // Token not required for first time sign up
router.post("/login",login) // Token not required for first time sign up
router.get("/getGeneralStatistics",getGeneralStatistics)
router.post("/profileCompletion",checkToken,profile_completion) // Token required as functionality is up post login
router.post("/vehicleRegistration",checkToken,vehicleRegistration) // Token required as functionality is up post login
router.get("/vehicleSearch",checkToken,vehicle_search) 
router.get("/getCustomerVehicle",checkToken,get_customer_vehicles) 
router.get("/getCustomerVehicleNumbers",checkToken,get_customer_vehicle_numbers) 
router.post("/getCustomerProfile",checkToken,get_customer_profile_data)
router.get("/getAllCitiesPerState",getAllCitiesPerState)
router.get("/getAllStates",getAllStates)
router.get("/getAllSpInCity",getAllSpAsPerCustomerCity)
router.get("/getAllCities",getAllCities)
router.get("/getAllApprovedSpCities",getAllApprovedSpCities)
router.get("/getSpProfileData",checkToken,getSPProfileData) 
router.get("/getSpDetailsPerCity",checkToken,getAllSpDetailsAsPerCustomerCity) 
router.get("/getAllPendingApprovedAppointment",checkToken,getAllPendingApprovedAppointment) 
router.get("/getAllRejectedCancelledAppointment",checkToken,getAllRejectedCancelledAppointment) 
router.post("/profileCompletionWithImage",checkToken,profile_completion_with_image) // Token required as functionality is up post login
router.post("/resetPassword",reset_password)
router.get("/getStatistics",checkToken,getStatistics)
router.get("/getPaidServices",checkToken,getPaidServices); // For feedback module
router.post("/createAppointment", checkToken, createAppointment);
router.post("/cancelAppointment", checkToken, cancelAppointment);
router.post("/rateServiceProvider",checkToken,rateServiceProvider);
router.get("/getRandomSp",getRandomSp)

//Estimate 
router.post("/estimateApproval", checkToken, estimateApprovalFromCustomer);
router.post("/estimateRejection", checkToken, estimateRejectedByCustomer);

module.exports = router;