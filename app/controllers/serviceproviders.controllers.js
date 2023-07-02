const {
    login,
    getAllUsers,
    createUser,
    getUserById,
    updateUserDetail,
    deleteUser,
    getUserSearch,
    updateUserActive,
    updateUserPassword,
    getAllEmployee,
    createEmployee,
    getEmployeeById,
    updateEmployeeDetail,
    deleteEmployee,
    getEmployeeSearch,
    updateEmployeeActive,
    updateEmployeePassword,
    getAllSpare,
    createSpare,
    getSpareById,
    updateSpareDetail,
    deleteSpare,
    getSpareSearch,
    updateSpareActive,
    getUserVehicleSearch,
    createLabour,
    getAllLabour,
    getLabourById,
    updateLabourDetail,
    updateLabourActive,
    deleteLabour,
    getLabourSearch,
    createEstimate,
    getAllEstimate
} = require("../models/serviceprovider.models.js");
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
                console.log(results)
                const toCreateToken = {
                    id: results.id,
                    role: "admin",
                };
                const jsontoken = sign(toCreateToken, "avah100token", {
                    // expiresIn: "1h"
                });
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

    updateUserPassword: (req, res) => {
        updateUserPassword(req, (err, results) => {
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

    getAllEmployee: (req, res) => {
        getAllEmployee(req, (err, results) => {
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

    createEmployee: (req, res) => {
        createEmployee(req, (err, results) => {
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

    getEmployeeById: (req, res) => {
        getEmployeeById(req, (err, results) => {
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

    updateEmployeePassword: (req, res) => {
        updateEmployeePassword(req, (err, results) => {
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

    updateEmployeeDetail: (req, res) => {
        updateEmployeeDetail(req, (err, results) => {
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

    deleteEmployee: (req, res) => {
        deleteEmployee(req, (err, results) => {
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

    getEmployeeSearch: (req, res) => {
        getEmployeeSearch(req, (err, results) => {
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

    updateEmployeeActive: (req, res) => {
        updateEmployeeActive(req, (err, results) => {
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

    getAllSpare: (req, res) => {
        getAllSpare(req, (err, results) => {
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

    createSpare: (req, res) => {
        createSpare(req, (err, results) => {
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

    getSpareById: (req, res) => {
        getSpareById(req, (err, results) => {
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

    updateSpareDetail: (req, res) => {
        updateSpareDetail(req, (err, results) => {
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

    deleteSpare: (req, res) => {
        deleteSpare(req, (err, results) => {
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

    getSpareSearch: (req, res) => {
        getSpareSearch(req, (err, results) => {
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

    updateSpareActive: (req, res) => {
        updateSpareActive(req, (err, results) => {
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

    getUserVehicleSearch: (req, res) => {
        getUserVehicleSearch(req, (err, results) => {
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

    createLabour: (req, res) => {
        createLabour(req, (err, results) => {
            if (err)
                res.status(500).send({
                    error: true,
                    message: "Something Went wrong. Please try again later",
                    errorLog: results
                });
            else
                res.send({
                    error: false,
                    message: "success",
                    data: results,
                });
        });
    },

    createEstimate: (req, res) => {
        createEstimate(req, (err, results) => {
            if (err)
                res.status(500).send({
                    error: true,
                    message: "Something Went wrong. Please try again later",
                    errorLog: results
                });
            else
                res.send({
                    error: false,
                    message: "success",
                    data: results,
                });
        });
    },

    getAllEstimate: (req, res) => {
        getAllEstimate(req, (err, results) => {
            if (err)
                res.status(500).send({
                    error: true,
                    message: "Something Went wrong. Please try again later",
                    errorLog: results
                });
            else
                res.send({
                    error: false,
                    message: "success",
                    data: results,
                });
        });
    },

    getAllLabour: (req, res) => {
        getAllLabour(req, (err, results) => {
            if (err)
                res.status(500).send({
                    error: true,
                    message: "Something Went wrong. Please try again later",
                    errorLog: results
                });
            else
                res.send({
                    error: false,
                    message: "success",
                    data: results,
                });
        });
    },

    getLabourById: (req, res) => {
        getLabourById(req, (err, results) => {
            if (err)
                res.status(500).send({
                    error: true,
                    message: "Something Went wrong. Please try again later",
                    errorLog: results
                });
            else
                res.send({
                    error: false,
                    message: "success",
                    data: results,
                });
        });
    },

    updateLabourDetail: (req, res) => {
        updateLabourDetail(req, (err, results) => {
            if (err)
                res.status(500).send({
                    error: true,
                    message: "Something Went wrong. Please try again later",
                    errorLog: results
                });
            else
                res.send({
                    error: false,
                    message: "success",
                    data: results,
                });
        });
    },

    deleteLabour: (req, res) => {
        deleteLabour(req, (err, results) => {
            if (err)
                res.status(500).send({
                    error: true,
                    message: "Something Went wrong. Please try again later",
                    errorLog: results
                });
            else
                res.send({
                    error: false,
                    message: "success",
                    data: results,
                });
        });
    },

    getLabourSearch: (req, res) => {
        getLabourSearch(req, (err, results) => {
            if (err)
                res.status(500).send({
                    error: true,
                    message: "Something Went wrong. Please try again later",
                    errorLog: results
                });
            else
                res.send({
                    error: false,
                    message: "success",
                    data: results,
                });
        });
    },

    updateLabourActive: (req, res) => {
        updateLabourActive(req, (err, results) => {
            if (err)
                res.status(500).send({
                    error: true,
                    message: "Something Went wrong. Please try again later",
                    errorLog: results
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