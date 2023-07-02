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
  updateServiceProviderPassword,
  updateServiceProviderActive,
  updateServiceProviderDetail,
  getServiceProviderSearch,
  login,
  getAllBrands,
  getBrandSearch,
  createBrand,
  getBrandById,
  updateBrandActive,
  updateBrandDetail,
  deleteBrand,
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
} = require("../models/admin.models.js");
const {
  sign
} = require("jsonwebtoken");
module.exports = {
  login: (req, res) => {
    login(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else {
        const toCreateToken = {
          id: results.id,
          role: "admin",
        };
        const jsontoken = sign(toCreateToken, "avah100token", {
          // expiresIn: "1h"
        });
        console.log("This the avah token",jsontoken)
        res.send({
          error: false,
          message: "success",
          data: results,
          token: jsontoken,
        });
      }
    });
  },

  getAllUsers: (req, res) => {
    getAllUsers(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  createUser: (req, res) => {
    createUser(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  getUserById: (req, res) => {
    getUserById(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  updateUserDetail: (req, res) => {
    updateUserDetail(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  deleteUser: (req, res) => {
    deleteUser(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  getUserSearch: (req, res) => {
    getUserSearch(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  updatePassword: (req, res) => {
    updatePassword(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  updateUserActive: (req, res) => {
    updateUserActive(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },
  //ServiceProviders
  getAllServiceProviders: (req, res) => {
    getAllServiceProviders(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  createServiceProvider: (req, res) => {
    createServiceProvider(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  getServiceProviderById: (req, res) => {
    getServiceProviderById(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  updateServiceProviderActive: (req, res) => {
    updateServiceProviderActive(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  updateServiceProviderDetail: (req, res) => {
    updateServiceProviderDetail(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  getServiceProviderSearch: (req, res) => {
    getServiceProviderSearch(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  updateServiceProviderPassword: (req, res) => {
    updateServiceProviderPassword(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  deleteServiceProvider: (req, res) => {
    deleteServiceProvider(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  getAllBrands: (req, res) => {
    getAllBrands(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  createBrand: (req, res) => {
    createBrand(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  getBrandSearch: (req, res) => {
    getBrandSearch(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  getBrandById: (req, res) => {
    getBrandById(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  updateBrandActive: (req, res) => {
    updateBrandActive(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  updateBrandDetail: (req, res) => {
    updateBrandDetail(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  deleteBrand: (req, res) => {
    deleteBrand(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  getAllModels: (req, res) => {
    getAllModels(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  createModel: (req, res) => {
    createModel(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  getModelById: (req, res) => {
    getModelById(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  updateModelActive: (req, res) => {
    updateModelActive(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  updateModelDetail: (req, res) => {
    updateModelDetail(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  deleteModel: (req, res) => {
    deleteModel(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  getModelSearch: (req, res) => {
    getModelSearch(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  getAllFuelTypes: (req, res) => {
    getAllFuelTypes(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  createFuelType: (req, res) => {
    createFuelType(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  getFuelTypeById: (req, res) => {
    getFuelTypeById(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  updateFuelTypeActive: (req, res) => {
    updateFuelTypeActive(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  updateFuelTypeDetail: (req, res) => {
    updateFuelTypeDetail(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  deleteFuelType: (req, res) => {
    deleteFuelType(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  getFuelTypeSearch: (req, res) => {
    getFuelTypeSearch(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  getAllCategory: (req, res) => {
    getAllCategory(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  createCategory: (req, res) => {
    createCategory(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  getCategoryById: (req, res) => {
    getCategoryById(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  updateCategoryActive: (req, res) => {
    updateCategoryActive(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  updateCategoryDetail: (req, res) => {
    updateCategoryDetail(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  deleteCategory: (req, res) => {
    deleteCategory(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  getCategorySearch: (req, res) => {
    getCategorySearch(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  getAllSubCategory: (req, res) => {
    getAllSubCategory(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  createSubCategory: (req, res) => {
    createSubCategory(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  getSubCategoryById: (req, res) => {
    getSubCategoryById(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  updateSubCategoryActive: (req, res) => {
    updateSubCategoryActive(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  updateSubCategoryDetail: (req, res) => {
    updateSubCategoryDetail(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  deleteSubCategory: (req, res) => {
    deleteSubCategory(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  getSubCategorySearch: (req, res) => {
    getSubCategorySearch(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  getAllServiceCategory: (req, res) => {
    getAllServiceCategory(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  createServiceCategory: (req, res) => {
    createServiceCategory(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  getServiceCategoryById: (req, res) => {
    getServiceCategoryById(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  updateServiceCategoryActive: (req, res) => {
    updateServiceCategoryActive(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  updateServiceCategoryDetail: (req, res) => {
    updateServiceCategoryDetail(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  deleteServiceCategory: (req, res) => {
    deleteServiceCategory(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },

  getServiceCategorySearch: (req, res) => {
    getServiceCategorySearch(req, (err, results) => {
      if (err)
        res.status(500).send({
          error: true,
          message: results || "Something Went wrong. Please try again later",
        });
      else
        res.send({
          error: false,
          message: "success",
          data: results,
        });
    });
  },
};