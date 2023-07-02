const {
  getAllUsers,
  createUser,
  getUserById,
  updateUserDetail,
  deleteUser,
  getUserSearch,
  updatePassword,
  updateUserActive,
  getAllServiceProviders,
  createServiceProvider,
  getServiceProviderById,
  updateServiceProviderActive,
  updateServiceProviderDetail,
  getServiceProviderSearch,
  deleteServiceProvider,
  updateServiceProviderPassword,
  login,
  createBrand,
  getBrandById,
  updateBrandActive,
  updateBrandDetail,
  getAllBrands,
  deleteBrand,
  getBrandSearch,
  getAllModels,
  createModel,
  getModelById,
  updateModelActive,
  updateModelDetail,
  deleteModel,
  getModelSearch,
  getAllFuelTypes,
  createFuelType,
  getFuelTypeById,
  updateFuelTypeActive,
  updateFuelTypeDetail,
  deleteFuelType,
  getFuelTypeSearch,
  getAllCategory,
  createCategory,
  getCategoryById,
  updateCategoryActive,
  updateCategoryDetail,
  deleteCategory,
  getCategorySearch,
  getAllSubCategory,
  createSubCategory,
  getSubCategoryById,
  updateSubCategoryActive,
  updateSubCategoryDetail,
  deleteSubCategory,
  getSubCategorySearch,
  getAllServiceCategory,
  createServiceCategory,
  getServiceCategoryById,
  updateServiceCategoryActive,
  updateServiceCategoryDetail,
  deleteServiceCategory,
  getServiceCategorySearch,
} = require("../controllers/admin.controllers.js");
const router = require("express").Router();
const { checkToken } = require("../middlewares/auth_validation");

//common
router.post("/login", login);

//user
router.get("/getAllUsers", checkToken, getAllUsers);
// router.get("/getAllUsers", getAllUsers); // checking by shub
// router.post("/createUser", checkToken, createUser);
router.post("/createUser", createUser);
router.post("/getUserById", checkToken, getUserById);
router.post("/updateUserDetail", checkToken, updateUserDetail);
router.post("/deleteUser", checkToken, deleteUser);
router.get("/getUserSearch", checkToken, getUserSearch);
router.post("/updatePassword", checkToken, updatePassword);
router.post("/updateUserActive", checkToken, updateUserActive);

//serviceprovider
router.get("/getAllServiceProviders", checkToken, getAllServiceProviders);
router.post("/createServiceProvider", checkToken, createServiceProvider);
router.post("/getServiceProviderById", checkToken, getServiceProviderById);
router.get("/getServiceProviderSearch", checkToken, getServiceProviderSearch);
router.post("/deleteServiceProvider", checkToken, deleteServiceProvider);
router.post(
  "/updateServiceProviderPassword",
  checkToken,
  updateServiceProviderPassword
);
router.post(
  "/updateServiceProviderActive",
  checkToken,
  updateServiceProviderActive
);
router.post(
  "/updateServiceProviderDetail",
  checkToken,
  updateServiceProviderDetail
);

//brands
router.get("/getAllBrands", checkToken, getAllBrands);
router.post("/createBrand", checkToken, createBrand);
router.post("/getBrandById", checkToken, getBrandById);
router.post("/updateBrandActive", checkToken, updateBrandActive);
router.post("/updateBrandDetail", checkToken, updateBrandDetail);
router.post("/deleteBrand", checkToken, deleteBrand);
router.get("/getBrandSearch", checkToken, getBrandSearch);

//models
router.get("/getAllModels", checkToken, getAllModels);
router.post("/createModel", checkToken, createModel);
router.post("/getModelById", checkToken, getModelById);
router.post("/updateModelActive", checkToken, updateModelActive);
router.post("/updateModelDetail", checkToken, updateModelDetail);
router.post("/deleteModel", checkToken, deleteModel);
router.get("/getModelSearch", checkToken, getModelSearch);

//fueltype
router.get("/getAllFuelTypes", checkToken, getAllFuelTypes);
router.post("/createFuelType", checkToken, createFuelType);
router.post("/getFuelTypeById", checkToken, getFuelTypeById);
router.post("/updateFuelTypeActive", checkToken, updateFuelTypeActive);
router.post("/updateFuelTypeDetail", checkToken, updateFuelTypeDetail);
router.post("/deleteFuelType", checkToken, deleteFuelType);
router.get("/getFuelTypeSearch", checkToken, getFuelTypeSearch);

//category
router.get("/getAllCategory", checkToken, getAllCategory);
router.post("/createCategory", checkToken, createCategory);
router.post("/getCategoryById", checkToken, getCategoryById);
router.post("/updateCategoryActive", checkToken, updateCategoryActive);
router.post("/updateCategoryDetail", checkToken, updateCategoryDetail);
router.post("/deleteCategory", checkToken, deleteCategory);
router.get("/getCategorySearch", checkToken, getCategorySearch);

//subcategory
router.get("/getAllSubCategory", checkToken, getAllSubCategory);
router.post("/createSubCategory", checkToken, createSubCategory);
router.post("/getSubCategoryById", checkToken, getSubCategoryById);
router.post("/updateSubCategoryActive", checkToken, updateSubCategoryActive);
router.post("/updateSubCategoryDetail", checkToken, updateSubCategoryDetail);
router.post("/deleteSubCategory", checkToken, deleteSubCategory);
router.get("/getSubCategorySearch", checkToken, getSubCategorySearch);

//servicecategory
router.get("/getAllServiceCategory", checkToken, getAllServiceCategory);
router.post("/createServiceCategory", checkToken, createServiceCategory);
router.post("/getServiceCategoryById", checkToken, getServiceCategoryById);
router.post("/updateServiceCategoryActive", checkToken, updateServiceCategoryActive);
router.post("/updateServiceCategoryDetail", checkToken, updateServiceCategoryDetail);
router.post("/deleteServiceCategory", checkToken, deleteServiceCategory);
router.get("/getServiceCategorySearch", checkToken, getServiceCategorySearch);
module.exports = router;