const {
    register,
    login,
    createAppointment,
    getAllModelPerBrand,
   
    updateUserDetail,
    deleteUser,
    getUserSearch,
    updateUserActive,
    updateUserPassword,
    getAllTechnicianEmployee,
    getAllEmployee,
    getAllAppointment,
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
    updateLabourDetail,
    updateLabourActive,
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
    deleteLabour,
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
    reset_password
} = require("../models/serviceprovider.models.js");
const {
    sign
} = require("jsonwebtoken");

module.exports = {
    // Registeration
    register: (req, res) => {
        register(req, (err, results) => {
            if (err)
                res.status(500).send({
                    error: true,
                    message: results || "Something Went wrong. Please try again later",
                });
            else {
                console.log("sp controller ln 52",results)
                res.send({
                    error: false,
                    message: "Registeration successfull"
                });
            }
        });
    },//

      // Reset Password  of customer After Registeration when he forgets it
      reset_password: (req, res) => {
        reset_password(req, (err, results) => {
            if (err)
                res.status(500).send({
                    error: true,
                    message: results || "Something Went wrong. Please try again later",
                });
            else {     
                res.send({
                    error: false,
                    // result : results,
                    message: `${results.name} your password has been updated successfully`,
                });
            }
        });
    },

    login: (req, res) => {
        login(req, (err, results) => {
            if (err)
                res.status(500).send({
                    error: true,
                    message: results || "Something Went wrong. Please try again later",
                });
            else {
                console.log("ln 69 sp login controller",results.rows[0] )
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
                    // data: results,
                    token: jsontoken,
                    role: results.rows[0].role,
                    designation: results.rows[0].designation,
                    profile_name : results.rows[0].name,
                    message : `${ results.rows[0].name}  have logged in successfully with a role of ${results.rows[0].role}`,
                    TYPE_OF_USER : `${ results.rows[0].user_type}`,
                    sp_id :  results.rows[0].sp_id,
                    business_name : results.rows[0].business_name,
                    permission_granted :  results.rows[0].permission_granted
                });
            }
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

    spApprovalOfCustAppointment: (req, res) => {
        spApprovalOfCustAppointment(req, (err, results) => {
          if (err) {
            res.status(200).send({
              error: true,
              message: results || "Something Went wrong. Please try again later",
            });
          } else {
            // Extract the date from the timestamp
            const appointmentDate = new Date(results[0].appointment_date);
            const formattedDate = appointmentDate.toDateString();
      
            res.send({
              error: false,
              message: `You have ${results[0].appointment_status} ${results[0].name}'s appointment on ${formattedDate} at ${results[0].appointment_time}`,
              data: results,
            });
          }
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

    getAllTechnicianEmployee: (req, res) => {
        getAllTechnicianEmployee(req, (err, results) => {
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

    getAllModelPerBrand: (req, res) => {
        getAllModelPerBrand(req, (err, results) => {
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



    getAllAppointment: (req, res) => {
        getAllAppointment(req, (err, results) => {
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

    getAllPendingAppointment: (req, res) => {
        getAllPendingAppointment(req, (err, results) => {
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
    getAllRejectedAndCancelledAppointment: (req, res) => {
        getAllRejectedAndCancelledAppointment(req, (err, results) => {
            if (err)
                res.status(500).send({
                    error: true,
                    message: results || "Something Went wrong. Please try again later",
                });
            else
            console.log(" ln 338", results)
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
                    message: "Employee added to the system successfully",
                    data: results,
                });
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

    // Service provider adding his spares 
    addSpares: (req, res) => {
        addSpares(req, (err, results) => {
            if (err)
                res.status(200).send({
                    error: true,
                    message: results || "Something Went wrong. Please try again later",
                });
            else {
                // console.log("customer controller ln 52",results)
                res.send({
                    error: false,
                    message: `Spare name ${results[0].spare_name} added to the system successfully`,
                    // data: results
                });
            }
        });
    },

        // Service provider adding his labour
        addLabour: (req, res) => {
            addLabour(req, (err, results) => {
                if (err)
                    res.status(200).send({
                        error: true,
                        message: results || "Something Went wrong. Please try again later",
                    });
                else {
                    // console.log("customer controller ln 52",results)
                    res.send({
                        error: false,
                        message: `Labour name ${results[0].labour_name} added to the system successfully`,
                        // data: results
                    });
                }
            });
        },

        getAllSpares: (req, res) => {
            getAllSpares(req, (err, results) => {
                if (err)
                    res.status(200).send({
                        error: true,
                        message: results || "Something Went wrong. Please try again later",
                    });
                else {
                    // console.log("customer controller ln 52",results)
                    res.send({
                        error: false,
                        // message: `Spare name ${results[0].labour_name} added to the system successfully`,
                        data: results
                    });
                }
            });
        },

        getAllLabour: (req, res) => {
            getAllLabour(req, (err, results) => {
                if (err)
                    res.status(200).send({
                        error: true,
                        message: results || "Something Went wrong. Please try again later",
                    });
                else {
                    // console.log("customer controller ln 52",results)
                    res.send({
                        error: false,
                        // message: `Spare name ${results[0].labour_name} added to the system successfully`,
                        data: results
                    });
                }
            });
        },

        deleteLabour: (req, res) => {
            deleteLabour(req, (err, results) => {
                if (err)
                    res.status(200).send({
                        error: true,
                        message: results || "Something Went wrong. Please try again later",
                    });
                else {
                    // console.log("customer controller ln 52",results)
                    res.send({
                        error: false,
                        message: `Labour name ${results.labour_name} deleted from the system successfully`,
                        // data: results
                    });
                }
            });
        },

        deleteSpare: (req, res) => {
            deleteSpare(req, (err, results) => {
                if (err)
                    res.status(200).send({
                        error: true,
                        message: results || "Something Went wrong. Please try again later",
                    });
                else {
                    // console.log("customer controller ln 52",results)
                    res.send({
                        error: false,
                        message: `Spare name ${results.spare_name} deleted from the system successfully`,
                        // data: results
                    });
                }
            });
        },

        addEstimate: (req, res) => {
            addEstimate(req, (err, results) => {
                if (err)
                    res.status(200).send({
                        error: true,
                        message: results || "Something Went wrong. Please try again later",
                    });
                else {
                    console.log("LN 827 SP  controller",results)
                    res.send({
                        error: false,
                        message: `Estimate created successfully`,
                        data: results
                    });
                }
            });
        },

        getEstimateDetails: (req, res) => {
            getEstimateDetails(req, (err, results) => {
                if (err)
                    res.status(200).send({
                        error: true,
                        message: results || "Something Went wrong. Please try again later",
                    });
                else {
                    console.log("LN 827 SP  controller",results)
                    res.send({
                        error: false,
                        message: 'Estimate details retrieved successfully',
                        data: results
                    });
                }
            });
        },

        editEstimate: (req, res) => {
            editEstimate(req, (err, results) => {
                if (err)
                    res.status(200).send({
                        error: true,
                        message: results || "Something Went wrong. Please try again later",
                    });
                else {
                    // console.log("LN 865 SP  controller",results)
                    res.send({
                        error: false,
                        message: `Estimate edited successfully`,
                        data: results
                    });
                }
            });
        },

        getEstimatePendingVehcileList: (req, res) => {
            getEstimatePendingVehcileList(req, (err, results) => {
                if (err)
                    res.status(200).send({
                        error: true,
                        message: results || "Something Went wrong. Please try again later",
                    });
                else {
                    console.log("LN 865 SP  controller",results)
                    res.send({
                        error: false,
                        message: `List of Penidng Estimate vehicles fetched successfully`,
                        data: results
                    });
                }
            });
        },

        getAllLabourListForAutoFill: (req, res) => {
            getAllLabourListForAutoFill(req, (err, results) => {
                if (err)
                    res.status(200).send({
                        error: true,
                        message: results || "Something Went wrong. Please try again later",
                    });
                else {
                    console.log("LN 903 SP  controller",results)
                    res.send({
                        error: false,
                        message: `List of Autofill labour fetched successfully`,
                        data: results
                    });
                }
            });
        },

        getAllSpareListForAutoFill: (req, res) => {
            getAllSpareListForAutoFill(req, (err, results) => {
                if (err)
                    res.status(200).send({
                        error: true,
                        message: results || "Something Went wrong. Please try again later",
                    });
                else {
                    console.log("LN 903 SP  controller",results)
                    res.send({
                        error: false,
                        message: `List of Autofill Spares fetched successfully`,
                        data: results
                    });
                }
            });
        },

        getSpecificSpareDetailsForEstimate: (req, res) => {
            getSpecificSpareDetailsForEstimate(req, (err, results) => {
                if (err)
                    res.status(200).send({
                        error: true,
                        message: results || "Something Went wrong. Please try again later",
                    });
                else {
                    console.log("LN 942 SP  controller",results)
                    res.send({
                        error: false,
                        message: `Spares details fetched successfully`,
                        data: results
                    });
                }
            });
        },

        getSpecificLabourDetailsForEstimate: (req, res) => {
            getSpecificLabourDetailsForEstimate(req, (err, results) => {
                if (err)
                    res.status(200).send({
                        error: true,
                        message: results || "Something Went wrong. Please try again later",
                    });
                else {
                    console.log("LN 903 SP  controller",results)
                    res.send({
                        error: false,
                        message: `Labour details fetched successfully`,
                        data: results
                    });
                }
            });
        },

        
        getSpecificVechicleDetailsToCreateEstimate: (req, res) => {
            getSpecificVechicleDetailsToCreateEstimate(req, (err, results) => {
                if (err)
                    res.status(200).send({
                        error: true,
                        message: results || "Something Went wrong. Please try again later",
                    });
                else {
                    console.log("LN 980 SP  controller",results)
                    res.send({
                        error: false,
                        message: `Vehicle details fetched successfully`,
                        data: results
                    });
                }
            });
        },

        getAllCreatedEstimateList: (req, res) => {
            getAllCreatedEstimateList(req, (err, results) => {
                if (err)
                    res.status(200).send({
                        error: true,
                        message: results || "Something Went wrong. Please try again later",
                    });
                else {
                    console.log("LN 999 SP  controller",results)
                    res.send({
                        error: false,
                        message: `Vehicle details fetched successfully`,
                        data: results
                    });
                }
            });
        },

        addEmployeeRole: (req, res) => {
            addEmployeeRole(req, (err, results) => {
                if (err)
                    res.status(200).send({
                        error: true,
                        message: results || "Something Went wrong. Please try again later",
                    });
                else {
                    console.log("LN 1019 SP  controller",results)
                    res.send({
                        error: false,
                        message: `New Employee role that is ${results[0].role_name} added to the system successfully`,
                        data: results
                    });
                }
            });
        },

        getAllEmployeeRoles: (req, res) => {
            getAllEmployeeRoles(req, (err, results) => {
                if (err)
                    res.status(200).send({
                        error: true,
                        message: results || "Something Went wrong. Please try again later",
                    });
                else {
                    console.log("LN 1038 SP  controller",results)
                    res.send({
                        error: false,
                        message: `Employee roles fetched successfully`,
                        data: results
                    });
                }
            });
        },

        getAllPermissionPerRoles: (req, res) => {
            getAllPermissionPerRoles(req, (err, results) => {
                if (err)
                    res.status(200).send({
                        error: true,
                        message: results || "Something Went wrong. Please try again later",
                    });
                else {
                    console.log("LN 1038 SP  controller",results)
                    res.send({
                        error: false,
                        message: `Permissions per  role fetched successfully`,
                        data: results
                    });
                }
            });
        },

        getNotificationNumbers: (req, res) => {
            getNotificationNumbers(req, (err, results) => {
                if (err)
                    res.status(200).send({
                        error: true,
                        message: results || "Something Went wrong. Please try again later",
                    });
                else {
                    console.log("LN 1078 SP  controller",results)
                    res.send({
                        error: false,
                        message: `Number of Notifications fetched successfully`,
                        data: results
                    });
                }
            });
        },

        deleteEmployeeRole: (req, res) => {
            deleteEmployeeRole(req, (err, results) => {
                if (err)
                    res.status(200).send({
                        error: true,
                        message: results || "Something Went wrong. Please try again later",
                    });
                else {
                    // console.log("customer controller ln 52",results)
                    res.send({
                        error: false,
                        message: `Role name ${results.role_name} deleted from the system successfully`
                    });
                }
            });
        },

        editEmployeeRole: (req, res) => {
            editEmployeeRole(req, (err, results) => {
                if (err)
                    res.status(200).send({
                        error: true,
                        message: results || "Something Went wrong. Please try again later",
                    });
                else {
                    // console.log("customer controller ln 52",results)
                    res.send({
                        error: false,
                        message: `Role name ${results.role_name} edited to the system successfully`
                    });
                }
            });
        },

        getAllCreatedJobcardList: (req, res) => {
            getAllCreatedJobcardList(req, (err, results) => {
                if (err)
                    res.status(200).send({
                        error: true,
                        message: results || "Something Went wrong. Please try again later",
                    });
                else {
                    console.log("Ln 1133 SP  controller",results)
                    res.send({
                        error: false,
                        message: `Jobcard List fetched successfully`,
                        data: results
                    });
                }
            });
        },

        getJobcardDetails: (req, res) => {
            getJobcardDetails(req, (err, results) => {
                if (err)
                    res.status(200).send({
                        error: true,
                        message: results || "Something Went wrong. Please try again later",
                    });
                else {
                    console.log("Ln 1152 SP  controller",results)
                    res.send({
                        error: false,
                        message: `Jobcard details fetched successfully`,
                        data: results
                    });
                }
            });
        },

        updateJobcard: (req, res) => {
            updateJobcard(req, (err, results) => {
                if (err)
                    res.status(200).send({
                        error: true,
                        message: results || "Something Went wrong. Please try again later",
                    });
                else {
                    // console.log("LN 865 SP  controller",results)
                    res.send({
                        error: false,
                        message: `Jobcard edited successfully`,
                        data: results
                    });
                }
            });
        },

        getAllAdminAdvisorEmployee: (req, res) => {
            getAllAdminAdvisorEmployee(req, (err, results) => {
                if (err)
                    res.status(200).send({
                        error: true,
                        message: results || "Something Went wrong. Please try again later",
                    });
                else {
                    // console.log("LN 865 SP  controller",results)
                    res.send({
                        error: false,
                        message: `Admin & Advisor's  List fetched successfully`,
                        data: results
                    });
                }
            });
        },

        openJobcard: (req, res) => {
            openJobcard(req, (err, results) => {
                if (err)
                    res.status(200).send({
                        error: true,
                        message: results || "Something Went wrong. Please try again later",
                    });
                else {
                    // console.log("LN 865 SP  controller",results)
                    res.send({
                        error: false,
                        message: `Job card opened successfully`,
                        data: results
                    });
                }
            });
        },

        generateInvoice: (req, res) => {
            generateInvoice(req, (err, results) => {
                if (err)
                    res.status(200).send({
                        error: true,
                        message: results || "Something Went wrong. Please try again later",
                    });
                else {
                    // console.log("LN 865 SP  controller",results)
                    res.send({
                        error: false,
                        message: `Invoice generated successfully`,
                        data: results
                    });
                }
            });
        },

        getAllPendingPaymentInvoices: (req, res) => {
            getAllPendingPaymentInvoices(req, (err, results) => {
                if (err)
                    res.status(200).send({
                        error: true,
                        message: results || "Something Went wrong. Please try again later",
                    });
                else {
                    // console.log("LN 865 SP  controller",results)
                    res.send({
                        error: false,
                        message: `Pending Invoices fetched successfully`,
                        data: results
                    });
                }
            });
        },


        recievePayment: (req, res) => {
            recievePayment(req, (err, results) => {
                if (err)
                    res.status(200).send({
                        error: true,
                        message: results || "Something Went wrong. Please try again later",
                    });
                else {
                    // console.log("LN 865 SP  controller",results)
                    res.send({
                        error: false,
                        message: `Payment recieved successfully`,
                        data: results
                    });
                }
            });
        },

        getAllPaidInvoices: (req, res) => {
            getAllPaidInvoices(req, (err, results) => {
                if (err)
                    res.status(200).send({
                        error: true,
                        message: results || "Something Went wrong. Please try again later",
                    });
                else {
                    // console.log("LN 865 SP  controller",results)
                    res.send({
                        error: false,
                        message: `List fetched successfully`,
                        data: results
                    });
                }
            });
        },

        getAllVehicleList: (req, res) => {
            getAllVehicleList(req, (err, results) => {
                if (err)
                    res.status(200).send({
                        error: true,
                        message: results || "Something Went wrong. Please try again later",
                    });
                else {
                    // console.log("LN 865 SP  controller",results)
                    res.send({
                        error: false,
                        message: `Vehicle List fetched successfully`,
                        data: results
                    });
                }
            });
        },

        getSpecificVehicleDetailsForSpAppt: (req, res) => {
            getSpecificVehicleDetailsForSpAppt(req, (err, results) => {
                if (err)
                    res.status(200).send({
                        error: true,
                        message: results || "Something Went wrong. Please try again later",
                    });
                else {
                    // console.log("LN 865 SP  controller",results)
                    res.send({
                        error: false,
                        message: `Vehicle Details fetched successfully`,
                        data: results
                    });
                }
            });
        },

  




};  