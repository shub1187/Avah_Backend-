const {
    register,
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
} = require("../models/customer.models.js")

const {
    sign
} = require("jsonwebtoken");

module.exports = {
    // Registeration of customer
    register: (req, res) => {
        register(req, (err, results) => {
            if (err)
                res.status(500).send({
                    error: true,
                    message: results || "Something Went wrong. Please try again later",
                });
            else {
                // console.log("customer controller ln 52",results)
                res.send({
                    error: false,
                    message: `${results[0].name} you have registered successfully`
                });
            }
        });
    },
     // Login of customer
     login: (req, res) => {
        login(req, (err, results) => {
            if (err)
                res.status(500).send({
                    error: true,
                    message: results || "Something Went wrong. Please try again later",
                });
            else {
                // console.log("ln 33 customer login controller",results.rows[0] )
                const toCreateToken = {
                    id: results.id,
                    role: "customer",
                };
                const jsontoken = sign(toCreateToken, "avah100token", {
                    // expiresIn: "1h"
                });
                res.send({
                    error: false,
                    message: `${results.rows[0].name} you have logged in successfully`,
                    // data: results.rows[0],
                    customer_id : results.rows[0].customer_id,
                    cust_name: results.rows[0].name,
                    customer_email :  results.rows[0].email,
                    token: jsontoken,
                    TYPE_OF_USER : 3,// for customer dashboard.
                
                });
            }
        });
    },

       // Profile Updation of customer After Registeration
       profile_completion: (req, res) => {
        profile_completion(req, (err, results) => {
            if (err)
                res.status(500).send({
                    error: true,
                    message: results || "Something Went wrong. Please try again later",
                });
            else {     
                res.send({
                    error: false,
                    // result : results,
                    message: `${results.name} your profile has been updated successfully`,
                });
            }
        });
    },

        // Registeration of customer vehicle
        vehicleRegistration: (req, res) => {
            vehicleRegistration(req, (err, results) => {
                if (err)
                    res.status(500).send({
                        error: true,
                        message: results || "Something Went wrong. Please try again later",
                    });
                else {
                    // console.log("customer controller ln 52",results)
                    res.send({
                        error: false,
                        message: `${results.customer_name} the vehicle number ${results.vehicle_number} has been registered successfully`,
                        // data: results
                    });
                }
            });
        },

        // vechile search 
        vehicle_search: (req, res) => {
            vehicle_search(req, (err, results) => {
                if (err)
                    res.status(500).send({
                        error: true,
                        message: results || "Something Went wrong. Please try again later",
                    });
                else {     
                    res.send({
                        error: false,
                        result : results,
                        // message: `${results.name} your profile has been updated successfully`,
                    });
                }
            });
        },

        get_customer_vehicles: (req, res) => {
           get_customer_vehicles(req, (err, results) => {
                if (err)
                    res.status(500).send({
                        error: true,
                        message: results || "Something Went wrong. Please try again later",
                    });
                else {     
                    res.send({
                        error: false,
                        result : results,
                        // message: `${results.name} your profile has been updated successfully`,
                    });
                }
            });
        },

        get_customer_profile_data: (req, res) => {
            get_customer_profile_data(req, (err, results) => {
                 if (err)
                     res.status(500).send({
                         error: true,
                         message: results || "Something Went wrong. Please try again later",
                     });
                 else {     
                     res.send({
                         error: false,
                         result : results,
                         // message: `${results.name} your profile has been updated successfully`,
                     });
                 }
             });
         },

         getAllCitiesPerState: (req, res) => {
            getAllCitiesPerState(req, (err, results) => {
                 if (err)
                     res.status(500).send({
                         error: true,
                         message: results || "Something Went wrong. Please try again later",
                     });
                 else {     
                     res.send({
                         error: false,
                         result : results
                     });
                 }
             });
         },

        getAllStates: (req, res) => {
           getAllStates(req, (err, results) => {
                 if (err)
                     res.status(500).send({
                         error: true,
                         message: results || "Something Went wrong. Please try again later",
                     });
                 else {     
                     res.send({
                         error: false,
                         result : results
                     });
                 }
             });
         },

         getAllSpAsPerCustomerCity: (req, res) => {
            getAllSpAsPerCustomerCity(req, (err, results) => {
                  if (err)
                      res.status(500).send({
                          error: true,
                          message: results || "Something Went wrong. Please try again later",
                      });
                  else {     
                      res.send({
                          error: false,
                          result : results
                      });
                  }
              });
          },

          getAllCities: (req, res) => {
            getAllCities(req, (err, results) => {
                  if (err)
                      res.status(500).send({
                          error: true,
                          message: results || "Something Went wrong. Please try again later",
                      });
                  else {     
                      res.send({
                          error: false,
                          result : results
                      });
                  }
              });
          },

         getAllApprovedSpCities: (req, res) => {
           getAllApprovedSpCities(req, (err, results) => {
                  if (err)
                      res.status(500).send({
                          error: true,
                          message: results || "Something Went wrong. Please try again later",
                      });
                  else {     
                      res.send({
                          error: false,
                          result : results
                      });
                  }
              });
          },

          createAppointment: (req, res) => {
            createAppointment(req, (err, results) => {
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

        getSPProfileData: (req, res) => {
            getSPProfileData(req, (err, results) => {
                if (err)
                    res.status(500).send({
                        error: true,
                        message: results || "Something Went wrong. Please try again later",
                    });
                else
                    res.send({
                        error: false,
                        data: results,
                    });
            });
        },
        get_customer_vehicle_numbers: (req, res) => {
            get_customer_vehicle_numbers(req, (err, results) => {
                if (err)
                    res.status(500).send({
                        error: true,
                        message: results || "Something Went wrong. Please try again later",
                    });
                else
                    res.send({
                        error: false,
                        data: results,
                    });
            });
        },
        getAllSpDetailsAsPerCustomerCity: (req, res) => {
            getAllSpDetailsAsPerCustomerCity(req, (err, results) => {
                if (err)
                    res.status(500).send({
                        error: true,
                        message: results || "Something Went wrong. Please try again later",
                    });
                else
                    res.send({
                        error: false,
                        data: results,
                    });
            });
        },

        cancelAppointment: (req, res) => {
            cancelAppointment(req, (err, results) => {
                if (err)
                    res.status(500).send({
                        error: true,
                        message: results || "Something Went wrong. Please try again later",
                    });
                else
                    res.send({
                        error: false,
                        message: results,
                    });
            });
        },

}