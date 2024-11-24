// const sql = require("../config/db.config");
// const client = require("../../database/database")

const client = require('../../database/database')

module.exports = {

  



// Admin Login Super user - Shubham
  login: async (req, callback) => {
    try {
      // console.log("ln 24",req.body)
      const_login_query = {text: 'SELECT * FROM admin WHERE email = $1 AND password = $2 AND role = $3',
      values: [req.body.email, req.body.password, req.body.role]}
        const data = await new Promise((resolve) => {
          client.query(
            const_login_query, 
            (err,data)=>{
            if (data.rows.length === 1) {  // Login successfull
              // console.log("ln 44",data.rows.length)
              return callback(false, data.rows);
            } else {
              return callback(true, "Kindly Enter Correct Credentials");
            }
          } 
          );
        });
    } catch (e) {
      // console.log("ln 46:" ,e)
      callback(true, e.message);
    }
  },

  approveServiceProvider : async (req, callback) => {
    try {
      const { email, approval_status, sp_status,sp_rejection_note } = req.body;
  
      // Update the pending_request_sp_dealer table
      const updateQuery = {
        text: 'UPDATE pending_request_sp_dealer SET sp_status = $1, approval_status = $2 WHERE email = $3 RETURNING *',
        values: [sp_status, approval_status, email]
      };
  
      const updateResult = await client.query(updateQuery);
  
      if (approval_status) {
        const updatedRow = updateResult.rows[0];
        // Exclude the register_sp_id column
      const { register_sp_id, ...insertValues } = updatedRow;

        // Insert into approved_service_providers table
        const insertQuery = {
            text: 'INSERT INTO approved_service_providers (name, email, business_name, business_type, document, password,approval_status,role,business_address,sp_status,business_contact,state,city,pin_code,full_address,is_deleted,permission_granted,business_document,serviced_brands) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,$13,$14,$15,$16,$17,$18,$19)',
            // values: [...Object.values(insertValues), false]
            values : [   insertValues.name,
              insertValues.email,
              insertValues.business_name,
              insertValues.business_type,
              insertValues.document,
              insertValues.password,
              insertValues.approval_status,
              insertValues.role,
              insertValues.business_address,
              insertValues.sp_status,
              insertValues.business_contact,
              insertValues.state,
              insertValues.city,
              insertValues.pin_code,
              insertValues.full_address,
              false,// The value you were adding
              ['All'],
              insertValues.business_document,
              insertValues.serviced_brands
            ]
        };
        await client.query(insertQuery); 
        // Delete from pending_request_sp_dealer table
        const deleteQuery = {
          text: 'UPDATE pending_request_sp_dealer SET is_deleted = $1  WHERE email = $2',
          values: [true,email]
        };
        await client.query(deleteQuery);
        return callback(false, 'Service Provider added to the system successfully');
      }
      // Admin does not want to approve the service provider
      else if (approval_status == false){
        // console.log("entered 91")
        const deleteQuery = {
          text: 'UPDATE pending_request_sp_dealer SET is_deleted = $1, sp_rejection_note = $3, sp_status = $4  WHERE email = $2',
          values: [true,email,sp_rejection_note,'Inactive']
        };
        await client.query(deleteQuery);
        return callback(false, 'Service Provider Deleted from the system succesfully');
      }
      
    } catch (e) {
      // console.log('Error:', e.message);
      callback(true, e.message);
    }
  }, 

  // Api for request tab get the pending_sp_request for approval
  // spRequest: async (req, callback) => {
  //   try {
  //     const page = parseInt(req.query.page, 10) || 1;
  //     const limit = parseInt(req.query.limit, 10) || 10;
  //     const offset = (page - 1) * limit;
  
  //     // console.log("ln 124", req.query.page, req.query.limit);
  //     const getall_pending_sp_query = {
  //       text: 'SELECT * FROM pending_request_sp_dealer WHERE is_deleted = false ORDER BY register_sp_id  DESC  LIMIT $1 OFFSET $2',
  //       values: [limit, offset],
  //     };
  //     console.log("ln 430",  getall_pending_sp_query);
  
  //     const data = await new Promise((resolve) => {
  //       client.query(
  //         getall_pending_sp_query,
  //         (err, result) => {
  //           // console.log("ln 435", result);
  //           if (result?.rows?.length > 0) {
  //               const results = {
  //                 results: result.rows
  //             };
  //             return callback(false, results);
  //           } else {
  //             return callback(true, "There are no pending request from service provider and dealer for approval");
  //           }
  //         }
  //       );
  //     });
  //   } catch (e) {
  //     console.log("Error:", e);
  //     return callback(true, e.message);
  //   }

  // },

  // Old Api starts to get pending request
//   spRequest: async (req, callback) => {
//     try {
//         const { _page, _limit, q } = req.query;
//         // Calculate OFFSET based on _page and limit
//         const offset = (_page - 1) * _limit;

//         // Old Query
//         // let queryText = `
//         //     SELECT * 
//         //     FROM pending_request_sp_dealer 
//         //     WHERE is_deleted = false 
//         // `;

//           let queryText = `SELECT register_sp_id, approval_status, is_deleted, business_type, full_address, role, business_address, sp_status, business_contact, sp_rejection_note, state, city, pin_code, name, email, business_name, serviced_brands
//           FROM pending_request_sp_dealer
//           WHERE is_deleted = false`;
//         const queryParams = [];

//         if (q) { // Search functionality
//             queryText += `
//                 AND (name ILIKE $${queryParams.length + 1}
//                 OR email ILIKE $${queryParams.length + 2}
//                 OR business_name ILIKE $${queryParams.length + 3})
//             `;
//             for (let i = 0; i < 3; i++) {
//                 queryParams.push(`%${q}%`);
//             }
//         }

//         // Always include ORDER BY clause
//         queryText += ' ORDER BY register_sp_id DESC LIMIT $' + (queryParams.length + 1) + ' OFFSET $' + (queryParams.length + 2);
//         queryParams.push(_limit, offset);

//         const getall_pending_sp_query = {
//             text: queryText,
//             values: queryParams,
//         };
//         const data = await new Promise((resolve) => {
//             client.query(
//                 getall_pending_sp_query,
//                 (err, result) => {
//                     if (err) {
//                         // console.error("Database query error:", err);
//                         return callback(true, "Unable to fetch pending requests from service providers and dealers");
//                     } else {
//                         // console.log(result.rows[0])
//                             const results = {
//                                 results: result.rows           
//                         } 

//                         return callback(false, results);
//                     }
//                 }
//             );
//         });
//     } catch (e) {
//         // console.error("Error:", e);
//         return callback(true, e.message);
//     }
// },
  // Old Api ends to get pending request

  spRequest: async (req, callback) => {
    try {
      const { _page, _limit, q } = req.query;
      // Calculate OFFSET based on _page and limit
      const offset = (_page - 1) * _limit;
  
      // Main query to fetch the data
      let queryText = `
          SELECT register_sp_id, approval_status, is_deleted, business_type, full_address, role, business_address, sp_status, business_contact, sp_rejection_note, state, city, pin_code, name, email, business_name, serviced_brands
          FROM pending_request_sp_dealer
          WHERE is_deleted = false
      `;
      // Count query to get the total number of records
      let countQueryText = `
          SELECT COUNT(*)
          FROM pending_request_sp_dealer
          WHERE is_deleted = false
      `;
      const queryParams = [];
  
      if (q) { // Search functionality
        queryText += `
            AND (name ILIKE $${queryParams.length + 1}
            OR email ILIKE $${queryParams.length + 2}
            OR business_name ILIKE $${queryParams.length + 3})
        `;
        countQueryText += `
            AND (name ILIKE $${queryParams.length + 1}
            OR email ILIKE $${queryParams.length + 2}
            OR business_name ILIKE $${queryParams.length + 3})
        `;
        for (let i = 0; i < 3; i++) {
          queryParams.push(`%${q}%`);
        }
      }
  
      // Always include ORDER BY clause
      queryText += ' ORDER BY register_sp_id DESC LIMIT $' + (queryParams.length + 1) + ' OFFSET $' + (queryParams.length + 2);
      queryParams.push(_limit, offset);
  
      const getall_pending_sp_query = {
        text: queryText,
        values: queryParams,
      };
  
      const count_all_pending_sp_query = {
        text: countQueryText,
        values: queryParams.slice(0, -2),  // Exclude LIMIT and OFFSET
      };
  
      const [result, countResult] = await Promise.all([
        new Promise((resolve) => {
          client.query(getall_pending_sp_query, (err, result) => {
            if (err) {
              return callback(true, "Unable to fetch pending requests from service providers and dealers");
            } else {
              resolve(result);
            }
          });
        }),
        new Promise((resolve) => {
          client.query(count_all_pending_sp_query, (err, result) => {
            if (err) {
              return callback(true, "Unable to fetch the count of pending requests");
            } else {
              resolve(result);
            }
          });
        })
      ]);
  
      const results = {
        results: result.rows,
        totalRecords: parseInt(countResult.rows[0].count, 10),
      };
  
      return callback(false, results);
  
    } catch (e) {
      return callback(true, e.message);
    }
  },
  
  

  getAllUsers: async (req, callback) => {
    try {
      // console.log("entered Get All User")
      const data = await client.query('SELECT * FROM users')
      // console.log(data.rows)
      let full_data = data.rows
       return callback((false), full_data);
   
    } catch (e) {
      // console.log(e.message, "ln 112")
    }
  },

  createUser: async (req, callback) => {
    try {
      var body = req.body;
      // console.log("entered createUsER")
      const {first_name, last_name,email,mobile, password}=req.body
      // console.log(body.first_name)
      const data = await new Promise((resolve) => {
        client.query(
          "INSERT INTO users (first_name, last_name,email,mobile, password) VALUES ($1,$2,$3,$4,$5) RETURNING * ",[first_name, last_name,email,mobile, password],
        (err,data)=>{
          if (data) {
            return callback(false, data);
          } else {
            return callback(true, err.message);
          }
        } 
        );
      });
    } catch {
      // console.log("catch block");
      callback(true, "error");
      return true;
    }
  },

  getUserById: async (req, callback) => {
    try {
      const data = await new Promise((resolve) => {
        sql.query(
          "SELECT * FROM users where id=?",
          [req.body.user_id],
          (err, sqlResult) => {
            resolve(sqlResult);
          }
        );
      });
      if (data && data.length > 0) {
        return callback(false, data[0]);
      } else {
        return callback(true, "No data found");
      }
    } catch (e) {
      callback(true, e);
    }
  },

  updateUserDetail: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        sql.query(
          "UPDATE users SET first_name=?,last_name=?,email=?,mobile=? WHERE id=?",
          [
            body.first_name,
            body.last_name,
            body.email,
            body.mobile,
            body.user_id,
          ],
          (err, sqlResult) => {
            resolve(sqlResult);
          }
        );
      });
      if (data) {
        return callback(false, data);
      } else {
        return callback(true, "Please choose other mobile number");
      }
    } catch {
      // console.log("catch block");
      callback(true, "error");
      return true;
    }
  },

  deleteUser: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        sql.query(
          "UPDATE users SET is_deleted=? WHERE id=?",
          [1, body.user_id],
          (err, sqlResult) => {
            resolve(sqlResult);
          }
        );
      });
      if (data) {
        return callback(false, data);
      } else {
        return callback(true, "Please choose other mobile number");
      }
    } catch {
      // console.log("catch block");
      callback(true, "error");
      return true;
    }
  },

  getUserSearch: async (req, callback) => {
    try {
      var numRows;
      var queryPagination;
      var numPerPage = parseInt(req.query.numberPerPage, 10) || 1;
      var page = parseInt(req.query.page, 10) || 0;
      var numPages;
      var skip = page * numPerPage;
      // Here we compute the LIMIT parameter for MySQL query
      var limit = skip + "," + numPerPage;
      const data = await new Promise((resolve) => {
        sql.query(
          "SELECT count(*) as numRows FROM users WHERE is_deleted=0 AND first_name LIKE '%" +
          req.query.searchText +
          "%' OR last_name LIKE '%" +
          req.query.searchText +
          "%' OR mobile LIKE '%" +
          req.query.searchText +
          "%' OR email LIKE '%" +
          req.query.searchText +
          "%'",
          (err, sqlResult) => {
            // console.log(err);
            resolve(sqlResult);
          }
        );
      });
      // console.log(data);
      if (data) {
        numRows = data[0].numRows;
        numPages = Math.ceil(numRows / numPerPage);
        // console.log("number of pages:", numPages);
        const data2 = await new Promise((resolve) => {
          sql.query(
            "SELECT * FROM users WHERE is_deleted=0 AND first_name LIKE '%" +
            req.query.searchText +
            "%' OR last_name LIKE '%" +
            req.query.searchText +
            "%' OR mobile LIKE '%" +
            req.query.searchText +
            "%' OR email LIKE '%" +
            req.query.searchText +
            "%' ORDER BY ID DESC LIMIT " +
            limit,
            (err, sqlResult) => {
              resolve(sqlResult);
            }
          );
        });
        if (data2) {
          var responsePayload = {
            results: data2,
          };
          if (page < numPages) {
            responsePayload.pagination = {
              current: page,
              perPage: numPerPage,
              totalPage: numPages,
              previous: page > 0 ? page - 1 : undefined,
              next: page < numPages - 1 ? page + 1 : undefined,
            };
          } else
            responsePayload.pagination = {
              err: "queried page " +
                page +
                " is >= to maximum page number " +
                numPages,
            };
          return callback(false, responsePayload);
        } else {
          return callback(true, "No data found");
        }
      } else {
        return callback(true, "No data found");
      }
    } catch (e) {
      // console.log(e);
      callback(true, e);
    }
  },

  updatePassword: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        sql.query(
          "UPDATE users SET password=? WHERE id=?",
          [body.password, body.user_id],
          (err, sqlResult) => {
            resolve(sqlResult);
          }
        );
      });
      if (data) {
        return callback(false, data);
      } else {
        return callback(true, "Please choose other mobile number");
      }
    } catch {
      // console.log("catch block");
      callback(true, "error");
      return true;
    }
  },

  updateUserActive: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        sql.query(
          "UPDATE users SET is_active=? WHERE id=?",
          [body.is_active, body.user_id],
          (err, sqlResult) => {
            resolve(sqlResult);
          }
        );
      });
      if (data) {
        return callback(false, data);
      } else {
        return callback(true, "Please choose other mobile number");
      }
    } catch {
      // console.log("catch block");
      callback(true, "error");
      return true;
    }
  },

  getAllServiceProviders: async (req, callback) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const offset = (page - 1) * limit;
  
      // console.log("ln 422", req.query.page, req.query.limit);
      const getall_sp_query = {
        text: 'SELECT * FROM approved_service_providers WHERE is_deleted = false ORDER BY sp_id DESC LIMIT $1 OFFSET $2',
        values: [limit, offset],
      };
      // console.log("ln 430", getall_sp_query);
  
      const data = await new Promise((resolve) => {
        client.query(
          getall_sp_query,
          (err, result) => {
            // console.log("ln 435", result);
            if (result?.rows?.length > 0) {
              const row_function = async () => {
                const countQuery = { text: 'SELECT COUNT(*) as total FROM approved_service_providers WHERE is_deleted = false' };
                const countResult = await client.query(countQuery);
                const totalRows = countResult.rows[0].total;
                const totalPages = Math.ceil(totalRows / limit);
  
                const results = {
                  results: result.rows,
                  pagination: {
                    currentPage: page,
                    totalPages: totalPages,
                    totalRows: totalRows,
                  },
                };
                // console.log("ln 453 from admin model", results);
                return callback(false, results);
              };
  
              row_function();
            } else {
              return callback(true, "There are no service providers in the system");
            }
          }
        );
      });
    } catch (e) {
      // console.log("Error:", e);
      return callback(true, e.message);
    }
  },

  createServiceProvider: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        // client.query(
        //   "INSERT INTO service_providers (business_name,business_type,business_address,first_name,last_name,email,mobile,password) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING * ",
        //   [body.business_name,body.business_type,body.business_address,body.first_name,body.last_name,body.email,body.mobile,body.password],
        // (err,data)=>{
        //   if (data) {
        //     return callback(false, data);
        //   } else {
        //     return callback(true, err.message);
        //   }
        // } 
        // );
      });
    } catch {
      // console.log("catch block");
      callback(true, "error");
      return true;
    }
  },

  getServiceProviderById: async (req, callback) => {
    try {
      const data = await new Promise((resolve) => {
        sql.query(
          "SELECT * FROM service_providers where id=?",
          [req.body.user_id],
          (err, sqlResult) => {
            resolve(sqlResult);
          }
        );
      });
      if (data && data.length > 0) {
        return callback(false, data[0]);
      } else {
        return callback(true, "No data found");
      }
    } catch (e) {
      callback(true, e);
    }
  },

  updateServiceProviderActive: async (req, callback) => {
    try {
      const update_query = {
        text: 'UPDATE approved_service_providers SET sp_status = $1 WHERE sp_id = $2',
        values: [req.body.sp_status, req.body.sp_id]
      };
      const data = await new Promise((resolve)=>{
       client.query(
        update_query,
        (err,result)=>{
            if(result.rowCount > 0){
              return callback(false,"Updated service provider Status successfully")
            }
            else{
              return callback(true,"Unable to update the status service provider not found")
            }
        }) 
      })

    }catch(e){
        return callback(true,e.message)
    }
  },

  updateServiceProviderDetail: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        sql.query(
          "UPDATE service_providers SET business_name=?,business_type=?,business_address=?,first_name=?,last_name=?,email=?,mobile=? WHERE id=?",
          [
            body.business_name,
            body.business_type,
            body.business_address,
            body.first_name,
            body.last_name,
            body.email,
            body.mobile,
            body.user_id,
          ],
          (err, sqlResult) => {
            resolve(sqlResult);
          }
        );
      });
      if (data) {
        return callback(false, data);
      } else {
        return callback(true, "Please choose other mobile number");
      }
    } catch {
      // console.log("catch block");
      callback(true, "error");
      return true;
    }
  },

  getServiceProviderSearch: async (req, callback) => {
    try {
      var numRows;
      var queryPagination;
      var numPerPage = parseInt(req.query.numberPerPage, 10) || 1;
      var page = parseInt(req.query.page, 10) || 0;
      var numPages;
      var skip = page * numPerPage;
      // Here we compute the LIMIT parameter for MySQL query
      var limit = skip + "," + numPerPage;
      const data = await new Promise((resolve) => {
        sql.query(
          "SELECT count(*) as numRows FROM service_providers WHERE is_deleted=0 AND business_name LIKE '%" +
          req.query.searchText +
          "%' OR business_type LIKE '%" +
          req.query.searchText +
          "%' OR mobile LIKE '%" +
          req.query.searchText +
          "%' OR email LIKE '%" +
          req.query.searchText +
          "%'",
          (err, sqlResult) => {
            // console.log(err);
            resolve(sqlResult);
          }
        );
      });
      // console.log(data);
      if (data) {
        numRows = data[0].numRows;
        numPages = Math.ceil(numRows / numPerPage);
        // console.log("number of pages:", numPages);
        const data2 = await new Promise((resolve) => {
          sql.query(
            "SELECT * FROM service_providers WHERE is_deleted=0 AND business_name LIKE '%" +
            req.query.searchText +
            "%' OR business_type LIKE '%" +
            req.query.searchText +
            "%' OR mobile LIKE '%" +
            req.query.searchText +
            "%' OR email LIKE '%" +
            req.query.searchText +
            "%' ORDER BY ID DESC LIMIT " +
            limit,
            (err, sqlResult) => {
              resolve(sqlResult);
            }
          );
        });
        if (data2) {
          var responsePayload = {
            results: data2,
          };
          if (page < numPages) {
            responsePayload.pagination = {
              current: page,
              perPage: numPerPage,
              totalPage: numPages,
              previous: page > 0 ? page - 1 : undefined,
              next: page < numPages - 1 ? page + 1 : undefined,
            };
          } else
            responsePayload.pagination = {
              err: "queried page " +
                page +
                " is >= to maximum page number " +
                numPages,
            };
          return callback(false, responsePayload);
        } else {
          return callback(true, "No data found");
        }
      } else {
        return callback(true, "No data found");
      }
    } catch (e) {
      // console.log(e);
      callback(true, e);
    }
  },

  updateServiceProviderPassword: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        sql.query(
          "UPDATE service_providers SET password=? WHERE id=?",
          [body.password, body.user_id],
          (err, sqlResult) => {
            resolve(sqlResult);
          }
        );
      });
      if (data) {
        return callback(false, data);
      } else {
        return callback(true, "Please choose other mobile number");
      }
    } catch {
      // console.log("catch block");
      callback(true, "error");
      return true;
    }
  },

  deleteServiceProvider: async (req, callback) => {
    // try {
    //   var body = req.body;
    //   const data = await new Promise((resolve) => {
    //     sql.query(
    //       "UPDATE service_providers SET is_deleted=? WHERE id=?",
    //       [1, body.user_id],
    //       (err, sqlResult) => {
    //         resolve(sqlResult);
    //       }
    //     );
    //   });
    //   if (data) {
    //     return callback(false, data);
    //   } else {
    //     return callback(true, "No data found");
    //   }
    // } catch {
    //   console.log("catch block");
    //   callback(true, "error");
    //   return true;
    // }

    try {
      const { email, approval_status, sp_status } = req.body;
      // console.log("ln 828 Entered delete sp ",req.body)
      // Update the pending_request_sp_dealer table
      const delete_query = {
        text: 'UPDATE approved_service_providers SET sp_status = $1, approval_status = $2, is_deleted = $3 WHERE email = $4 RETURNING *',
        values: ["Inactive",false, true, req.body.email]
      };
        const data = await new Promise((resolve) => {
          client.query(
            delete_query, 
            (err,result)=>{
            if (result.rowCount > 0) {  // Deleted  successfull
              return callback(false, "Service Provider Deleted Successfully");
            } else {
              return callback(true, "Service Provider not found in database");
            }
          } 
          );
        });


    }catch(e){
      callback(true,e.message)
    }
  },



  // New Api

  getAllBrands: async (req, callback) => {
    try {
      const { _page, _limit, q } = req.query;
  
      // Calculate the OFFSET based on the _page and _limit parameters
      const offset = (_page - 1) * _limit;
  
      let queryText = `
          SELECT brand_id, brand_name 
          FROM brands 
          WHERE is_deleted = false
      `;
      let countQueryText = `
          SELECT COUNT(*) 
          FROM brands 
          WHERE is_deleted = false
      `;
      const queryParams = [];
  
      if (q) { // This is for search functionality
        queryText += `
            AND brand_name ILIKE $1
        `;
        countQueryText += `
            AND brand_name ILIKE $1
        `;
        queryParams.push(`%${q}%`);
      }
  
      // Add ORDER BY clause
      queryText += ' ORDER BY brand_id DESC';
  
      // Add LIMIT and OFFSET
      queryText += ' LIMIT $' + (queryParams.length + 1) + ' OFFSET $' + (queryParams.length + 2);
      queryParams.push(_limit, offset);
  
      const getall_brands = {
        text: queryText,
        values: queryParams,
      };
  
      const count_all_brands = {
        text: countQueryText,
        values: queryParams.slice(0, -2),  // Exclude LIMIT and OFFSET
      };
  
      const [result, countResult] = await Promise.all([
        new Promise((resolve) => {
          client.query(getall_brands, (err, result) => {
            if (err) {
              console.error("Database query error:", err);
              return callback(true, "Unable to fetch the brands");
            } else {
              resolve(result);
            }
          });
        }),
        new Promise((resolve) => {
          client.query(count_all_brands, (err, result) => {
            if (err) {
              console.error("Database query error:", err);
              return callback(true, "Unable to fetch the count of brands");
            } else {
              resolve(result);
            }
          });
        })
      ]);
  
      const results = {
        results: result.rows,
        totalRecords: parseInt(countResult.rows[0].count, 10)
      };
  
      return callback(false, results);
  
    } catch (e) {
      console.error("Error:", e);
      return callback(true, e.message);
    }
  },
  



  createBrand: async (req, callback) => {
    try {
      const body = req.body;
      const query = 'INSERT INTO brands (brand_name) VALUES ($1) RETURNING *';
      const values = [body.brand_name];
  
      const data = await new Promise((resolve, reject) => {
        client.query(query, values, (err, result) => {
          if (err) {
            if (err.code === '23505') { // PostgreSQL duplicate key error code
              return callback(true,'This Brand already exists in the system');
            }
            // console.error('Error In ln 967:', err);
            return callback(true,'An unexpected error occurred. Please try again later.');
          }
          return callback(false,result.rows);
        });
      });
  
      return callback(false, data);
    } catch (error) {
      console.error('Error in adding brand', error);
      return callback(true, error.message);
    }
  },
  
  

  getBrandById: async (req, callback) => {
    try {
      const data = await new Promise((resolve) => {
        sql.query(
          "SELECT * FROM brands where id=?",
          [req.body.id],
          (err, sqlResult) => {
            resolve(sqlResult);
          }
        );
      });
      if (data && data.length > 0) {
        return callback(false, data[0]);
      } else {
        return callback(true, "No data found");
      }
    } catch (e) {
      callback(true, e);
    }
  },

  updateBrandActive: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        sql.query(
          "UPDATE brands SET is_active=? WHERE id=?",
          [body.is_active, body.id],
          (err, sqlResult) => {
            resolve(sqlResult);
          }
        );
      });
      if (data) {
        return callback(false, data);
      } else {
        return callback(true, "Please choose other mobile number");
      }
    } catch {
      console.log("catch block");
      callback(true, "error");
      return true;
    }
  },

  updateBrandDetail: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        sql.query(
          "UPDATE brands SET brand_image=?,brand_code=?,brand_name=? WHERE id=?",
          [body.brand_image, body.brand_code, body.brand_name, body.id],
          (err, sqlResult) => {
            resolve(sqlResult);
          }
        );
      });
      if (data) {
        return callback(false, data);
      } else {
        return callback(true, "Please choose other mobile number");
      }
    } catch {
      console.log("catch block");
      callback(true, "error");
      return true;
    }
  },

  getBrandSearch: async (req, callback) => {
    try {
      var numRows;
      var queryPagination;
      var numPerPage = parseInt(req.query.numberPerPage, 10) || 1;
      var page = parseInt(req.query.page, 10) || 0;
      var numPages;
      var skip = page * numPerPage;
      // Here we compute the LIMIT parameter for MySQL query
      var limit = skip + "," + numPerPage;
      const data = await new Promise((resolve) => {
        sql.query(
          "SELECT count(*) as numRows FROM brands WHERE is_deleted=0 AND brand_code LIKE '%" +
          req.query.searchText +
          "%' OR brand_name LIKE '%" +
          req.query.searchText +
          "%'",
          (err, sqlResult) => {
            console.log(err);
            resolve(sqlResult);
          }
        );
      });
      console.log(data);
      if (data) {
        numRows = data[0].numRows;
        numPages = Math.ceil(numRows / numPerPage);
        console.log("number of pages:", numPages);
        const data2 = await new Promise((resolve) => {
          sql.query(
            "SELECT * FROM brands WHERE brand_code LIKE '%" +
            req.query.searchText +
            "%' OR brand_name LIKE '%" +
            req.query.searchText +
            "%' ORDER BY ID DESC LIMIT " +
            limit,
            (err, sqlResult) => {
              resolve(sqlResult);
            }
          );
        });
        if (data2) {
          var responsePayload = {
            results: data2,
          };
          if (page < numPages) {
            responsePayload.pagination = {
              current: page,
              perPage: numPerPage,
              totalPage: numPages,
              previous: page > 0 ? page - 1 : undefined,
              next: page < numPages - 1 ? page + 1 : undefined,
            };
          } else
            responsePayload.pagination = {
              err: "queried page " +
                page +
                " is >= to maximum page number " +
                numPages,
            };
          return callback(false, responsePayload);
        } else {
          return callback(true, "No data found");
        }
      } else {
        return callback(true, "No data found");
      }
    } catch (e) {
      console.log(e);
      callback(true, e);
    }
  },

  deleteBrand: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        sql.query(
          "UPDATE brands SET is_deleted=? WHERE id=?",
          [1, body.id],
          (err, sqlResult) => {
            resolve(sqlResult);
          }
        );
      });
      if (data) {
        return callback(false, data);
      } else {
        return callback(true, "No data found");
      }
    } catch {
      console.log("catch block");
      callback(true, "error");
      return true;
    }
  },
  // Old Api 
  // getAllModels: async (req, callback) => {
  //   try {
  //     const getall_models = {
  //       text: 'SELECT * FROM models',
  //     };
  //     const data = await new Promise((resolve) => {
  //       client.query(
  //         getall_models,
  //         (err, result) => {
  //          if (err){
  //           console.log(err)
  //           return callback(true, "Unable to fetch the models");
  //          }
  //            else {
  //             const results = {
  //               results: result.rows
  //             };
  //             return callback(false, results);
  //           }
  //         }
  //       );
  //     });
  //   } catch (e) {
  //     console.log("Error:", e);
  //     return callback(true, e.message);
  //   }
  // },

  // New Api 

  getAllModels: async (req, callback) => {
    try {
      const { _page, _limit, q } = req.query;
  
      // Calculate the OFFSET based on the _page and _limit parameters
      const offset = (_page - 1) * _limit;
  
      let queryText = `
          SELECT * 
          FROM models
      `;
      let countQueryText = `
          SELECT COUNT(*) 
          FROM models
      `;
      const queryParams = [];
  
      if (q) { // This is for search functionality
        queryText += `
            WHERE model_name ILIKE $1
            OR brand_name ILIKE $1
        `;
        countQueryText += `
            WHERE model_name ILIKE $1
            OR brand_name ILIKE $1
        `;
        queryParams.push(`%${q}%`);
      }
  
      // Add ORDER BY clause
      queryText += ' ORDER BY model_id DESC';
  
      // Add LIMIT and OFFSET
      queryText += ' LIMIT $' + (queryParams.length + 1) + ' OFFSET $' + (queryParams.length + 2);
      queryParams.push(_limit, offset);
  
      const getall_models = {
        text: queryText,
        values: queryParams,
      };
  
      const count_all_models = {
        text: countQueryText,
        values: queryParams.slice(0, -2),  // Exclude LIMIT and OFFSET
      };
  
      const [result, countResult] = await Promise.all([
        new Promise((resolve) => {
          client.query(getall_models, (err, result) => {
            if (err) {
              console.error("Database query error:", err);
              return callback(true, "Unable to fetch the models");
            } else {
              resolve(result);
            }
          });
        }),
        new Promise((resolve) => {
          client.query(count_all_models, (err, result) => {
            if (err) {
              console.error("Database query error:", err);
              return callback(true, "Unable to fetch the count of models");
            } else {
              resolve(result);
            }
          });
        })
      ]);
  
      const results = {
        results: result.rows,
        totalRecords: parseInt(countResult.rows[0].count, 10)
      };
  
      return callback(false, results);
  
    } catch (e) {
      console.error("Error:", e);
      return callback(true, e.message);
    }
  },
  


  createModel: async (req, callback) => {
    try {
      var body = req.body
      console.log(body,"ln 1216 admin model")
      const query = 'INSERT INTO models (model_name,brand_name,fuel_type) VALUES ($1, $2, $3) RETURNING *';
      const values = [body.model_name,body.brand_name,body.fuel_type];
      const data = await new Promise((resolve) => {
        client.query(query, values, (err, result) => {
          if (err) {
            console.error('Error In  ln 1222:', err);
            return callback(true, 'This Model already exists in the system');
          }
          // console.log('Brand added to the system succesfully');
          return callback(false, result.rows);
        });
      });
    } catch (error) {
      console.error('Error in adding model', error);
      return callback(true, error.message);
    }
  },

  getModelById: async (req, callback) => {
    try {
      const data = await new Promise((resolve) => {
        sql.query(
          "SELECT models.*,brands.brand_name FROM models INNER JOIN brands ON models.brand_id=brands.id where models.id=?",
          [req.body.id],
          (err, sqlResult) => {
            resolve(sqlResult);
          }
        );
      });
      if (data && data.length > 0) {
        return callback(false, data[0]);
      } else {
        return callback(true, "No data found");
      }
    } catch (e) {
      callback(true, e);
    }
  },

  updateModelActive: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        sql.query(
          "UPDATE models SET is_active=? WHERE id=?",
          [body.is_active, body.id],
          (err, sqlResult) => {
            resolve(sqlResult);
          }
        );
      });
      if (data) {
        return callback(false, data);
      } else {
        return callback(true, "Please choose other mobile number");
      }
    } catch {
      console.log("catch block");
      callback(true, "error");
      return true;
    }
  },

  updateModelDetail: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        sql.query(
          "UPDATE models SET brand_id=?,model_code=?,model_name=? WHERE id=?",
          [body.brand_id, body.model_code, body.model_name, body.id],
          (err, sqlResult) => {
            resolve(sqlResult);
          }
        );
      });
      if (data) {
        return callback(false, data);
      } else {
        return callback(true, "Please choose other mobile number");
      }
    } catch {
      console.log("catch block");
      callback(true, "error");
      return true;
    }
  },

  deleteModel: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        sql.query(
          "UPDATE models SET is_deleted=? WHERE id=?",
          [1, body.id],
          (err, sqlResult) => {
            resolve(sqlResult);
          }
        );
      });
      if (data) {
        return callback(false, data);
      } else {
        return callback(true, "No data found");
      }
    } catch {
      console.log("catch block");
      callback(true, "error");
      return true;
    }
  },

  getModelSearch: async (req, callback) => {
    try {
      var numRows;
      var queryPagination;
      var numPerPage = parseInt(req.query.numberPerPage, 10) || 1;
      var page = parseInt(req.query.page, 10) || 0;
      var numPages;
      var skip = page * numPerPage;
      // Here we compute the LIMIT parameter for MySQL query
      var limit = skip + "," + numPerPage;
      const data = await new Promise((resolve) => {
        sql.query(
          "SELECT count(*) as numRows FROM models WHERE model_code LIKE '%" +
          req.query.searchText +
          "%' OR model_name LIKE '%" +
          req.query.searchText +
          "%'",
          (err, sqlResult) => {
            console.log(err);
            resolve(sqlResult);
          }
        );
      });
      console.log(data);
      if (data) {
        numRows = data[0].numRows;
        numPages = Math.ceil(numRows / numPerPage);
        console.log("number of pages:", numPages);
        const data2 = await new Promise((resolve) => {
          sql.query(
            "SELECT models.*,brands.brand_name FROM models INNER JOIN brands ON models.brand_id=brands.id WHERE models.model_code LIKE '%" +
            req.query.searchText +
            "%' OR model_name LIKE '%" +
            req.query.searchText +
            "%' ORDER BY ID DESC LIMIT " +
            limit,
            (err, sqlResult) => {
              resolve(sqlResult);
            }
          );
        });
        if (data2) {
          var responsePayload = {
            results: data2,
          };
          if (page < numPages) {
            responsePayload.pagination = {
              current: page,
              perPage: numPerPage,
              totalPage: numPages,
              previous: page > 0 ? page - 1 : undefined,
              next: page < numPages - 1 ? page + 1 : undefined,
            };
          } else
            responsePayload.pagination = {
              err: "queried page " +
                page +
                " is >= to maximum page number " +
                numPages,
            };
          return callback(false, responsePayload);
        } else {
          return callback(true, "No data found");
        }
      } else {
        return callback(true, "No data found");
      }
    } catch (e) {
      console.log(e);
      callback(true, e);
    }
  },


// Old  Api working for both admin and customer page
// getAllFuelTypes: async (req, callback) => {
//   try {
//     // Validate and set default values for pagination
//     const _page = parseInt(req.query._page, 10) || 1;
//     const _limit = parseInt(req.query._limit, 10) || 10;
//     const q = req.query.q || '';

//     // Calculate the OFFSET based on the _page and _limit parameters
//     const offset = (_page - 1) * _limit;

//     let queryText = `
//         SELECT * 
//         FROM fuels
//     `;
//     let countQueryText = `
//         SELECT COUNT(*) 
//         FROM fuels
//     `;
//     const queryParams = [];

//     if (q) { // This is for search functionality
//       queryText += `
//           WHERE fuel_name ILIKE $1
//       `;
//       countQueryText += `
//           WHERE fuel_name ILIKE $1
//       `;
//       queryParams.push(`%${q}%`);
//     }

//     // Add ORDER BY clause
//     queryText += ' ORDER BY fuel_id DESC';

//     // Add LIMIT and OFFSET
//     queryText += ' LIMIT $' + (queryParams.length + 1) + ' OFFSET $' + (queryParams.length + 2);
//     queryParams.push(_limit, offset);

//     const getall_fuel_type = {
//       text: queryText,
//       values: queryParams,
//     };

//     const count_all_fuel_types = {
//       text: countQueryText,
//       values: queryParams.slice(0, -2),  // Exclude LIMIT and OFFSET
//     };

//     const [result, countResult] = await Promise.all([
//       new Promise((resolve) => {
//         client.query(getall_fuel_type, (err, result) => {
//           if (err) {
//             console.error("Database query error:", err);
//             return callback(true, "Unable to fetch the fuel types");
//           } else {
//             resolve(result);
//           }
//         });
//       }),
//       new Promise((resolve) => {
//         client.query(count_all_fuel_types, (err, result) => {
//           if (err) {
//             console.error("Database query error:", err);
//             return callback(true, "Unable to fetch the count of fuel types");
//           } else {
//             resolve(result);
//           }
//         });
//       })
//     ]);

//     const results = {
//       results: result.rows,
//       totalRecords: parseInt(countResult.rows[0].count, 10)
//     };

//     return callback(false, results);

//   } catch (e) {
//     console.error("Error:", e);
//     return callback(true, e.message);
//   }
// },

// New Api that works for dropdown and page 

getAllFuelTypes: async (req, callback) => {
  try {
    // Extract query parameters
    const _page = parseInt(req.query._page, 10);
    const _limit = parseInt(req.query._limit, 10);
    const q = req.query.q || '';

    // Check if pagination parameters are provided
    const isPaginated = _page && _limit;

    let queryText = `
        SELECT * 
        FROM fuels
    `;
    let countQueryText = `
        SELECT COUNT(*) 
        FROM fuels
    `;
    const queryParams = [];

    if (q) { // This is for search functionality
      queryText += `
          WHERE fuel_name ILIKE $1
      `;
      countQueryText += `
          WHERE fuel_name ILIKE $1
      `;
      queryParams.push(`%${q}%`);
    }

    // Add ORDER BY clause
    queryText += ' ORDER BY fuel_id DESC';

    // Add LIMIT and OFFSET if pagination is enabled
    if (isPaginated) {
      const offset = (_page - 1) * _limit;
      queryText += ' LIMIT $' + (queryParams.length + 1) + ' OFFSET $' + (queryParams.length + 2);
      queryParams.push(_limit, offset);
    }

    const getall_fuel_type = {
      text: queryText,
      values: queryParams,
    };

    const count_all_fuel_types = {
      text: countQueryText,
      values: queryParams.slice(0, isPaginated ? -2 : undefined), // Exclude LIMIT and OFFSET if present
    };

    const [result, countResult] = await Promise.all([
      new Promise((resolve) => {
        client.query(getall_fuel_type, (err, result) => {
          if (err) {
            console.error("Database query error:", err);
            return callback(true, "Unable to fetch the fuel types");
          } else {
            resolve(result);
          }
        });
      }),
      new Promise((resolve) => {
        client.query(count_all_fuel_types, (err, result) => {
          if (err) {
            console.error("Database query error:", err);
            return callback(true, "Unable to fetch the count of fuel types");
          } else {
            resolve(result);
          }
        });
      })
    ]);

    const results = {
      results: result.rows,
      totalRecords: parseInt(countResult.rows[0].count, 10),
    };

    return callback(false, results);
  } catch (e) {
    console.error("Error:", e);
    return callback(true, e.message);
  }
},




  createFuelType: async (req, callback) => {
    try {
      var body = req.body
      const query = 'INSERT INTO fuels (fuel_name) VALUES ($1) RETURNING *';
      const values = [body.fuel_name];    
      const data = await new Promise((resolve) => {
        client.query(query, values, (err, result) => {
          if (err) {
            // console.error('Error In  ln 1454:', err);
            return callback(true, 'This fuel type  already exists in the system');
          }
          // console.log('Brand added to the system succesfully');
          return callback(false, result.rows);
        });
      });
    } catch (error) {
      console.error('Error in adding fuel type', error);
      return callback(true, error.message);
    }
   
  },

  getFuelTypeById: async (req, callback) => {
    try {
      const data = await new Promise((resolve) => {
        sql.query(
          "SELECT * FROM fuels where id=?",
          [req.body.id],
          (err, sqlResult) => {
            resolve(sqlResult);
          }
        );
      });
      if (data && data.length > 0) {
        return callback(false, data[0]);
      } else {
        return callback(true, "No data found");
      }
    } catch (e) {
      callback(true, e);
    }
  },

  updateFuelTypeActive: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        sql.query(
          "UPDATE models SET is_active=? WHERE id=?",
          [body.is_active, body.id],
          (err, sqlResult) => {
            resolve(sqlResult);
          }
        );
      });
      if (data) {
        return callback(false, data);
      } else {
        return callback(true, "Please choose other mobile number");
      }
    } catch {
      console.log("catch block");
      callback(true, "error");
      return true;
    }
  },

  updateFuelTypeDetail: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        sql.query(
          "UPDATE models SET fuel_name=? WHERE id=?",
          [body.fuel_name, body.id],
          (err, sqlResult) => {
            resolve(sqlResult);
          }
        );
      });
      if (data) {
        return callback(false, data);
      } else {
        return callback(true, "Please choose other mobile number");
      }
    } catch {
      console.log("catch block");
      callback(true, "error");
      return true;
    }
  },

  deleteFuelType: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        sql.query(
          "UPDATE fuels SET is_deleted=? WHERE id=?",
          [1, body.id],
          (err, sqlResult) => {
            resolve(sqlResult);
          }
        );
      });
      if (data) {
        return callback(false, data);
      } else {
        return callback(true, "No data found");
      }
    } catch {
      console.log("catch block");
      callback(true, "error");
      return true;
    }
  },

  getFuelTypeSearch: async (req, callback) => {
    try {
      var numRows;
      var queryPagination;
      var numPerPage = parseInt(req.query.numberPerPage, 10) || 1;
      var page = parseInt(req.query.page, 10) || 0;
      var numPages;
      var skip = page * numPerPage;
      // Here we compute the LIMIT parameter for MySQL query
      var limit = skip + "," + numPerPage;
      const data = await new Promise((resolve) => {
        sql.query(
          "SELECT count(*) as numRows FROM fuels WHERE is_deleted=0 AND fuel_name LIKE '%" +
          req.query.searchText +
          "%'",
          (err, sqlResult) => {
            console.log(err);
            resolve(sqlResult);
          }
        );
      });
      console.log(data);
      if (data) {
        numRows = data[0].numRows;
        numPages = Math.ceil(numRows / numPerPage);
        console.log("number of pages:", numPages);
        const data2 = await new Promise((resolve) => {
          sql.query(
            "SELECT * FROM fuels WHERE is_deleted=0 AND fuel_name LIKE '%" +
            req.query.searchText +
            "%' ORDER BY ID DESC LIMIT " +
            limit,
            (err, sqlResult) => {
              resolve(sqlResult);
            }
          );
        });
        if (data2) {
          var responsePayload = {
            results: data2,
          };
          if (page < numPages) {
            responsePayload.pagination = {
              current: page,
              perPage: numPerPage,
              totalPage: numPages,
              previous: page > 0 ? page - 1 : undefined,
              next: page < numPages - 1 ? page + 1 : undefined,
            };
          } else
            responsePayload.pagination = {
              err: "queried page " +
                page +
                " is >= to maximum page number " +
                numPages,
            };
          return callback(false, responsePayload);
        } else {
          return callback(true, "No data found");
        }
      } else {
        return callback(true, "No data found");
      }
    } catch (e) {
      console.log(e);
      callback(true, e);
    }
  },

  getAllCategory: async (req, callback) => {
    try {
      console.log(req.page);
      var numRows;
      var queryPagination;
      var numPerPage = parseInt(req.query.numberPerPage, 10) || 2000;
      var page = parseInt(req.query.page, 10) || 0;
      var numPages;
      var skip = page * numPerPage;
      // Here we compute the LIMIT parameter for MySQL query
      var limit = skip + "," + numPerPage;
      const data = await new Promise((resolve) => {
        sql.query(
          "SELECT count(*) as numRows FROM category WHERE is_deleted=0",
          (err, sqlResult) => {
            resolve(sqlResult);
          }
        );
      });
      console.log(data);
      if (data) {
        numRows = data[0].numRows;
        numPages = Math.ceil(numRows / numPerPage);
        console.log("number of pages:", numPages);
        const data2 = await new Promise((resolve) => {
          sql.query(
            "SELECT * FROM category WHERE is_deleted=0 ORDER BY ID DESC LIMIT " +
            limit,
            (err, sqlResult) => {
              resolve(sqlResult);
            }
          );
        });
        if (data2) {
          var responsePayload = {
            results: data2,
          };
          if (page < numPages) {
            responsePayload.pagination = {
              current: page,
              perPage: numPerPage,
              totalPage: numPages,
              previous: page > 0 ? page - 1 : undefined,
              next: page < numPages - 1 ? page + 1 : undefined,
            };
          } else
            responsePayload.pagination = {
              err: "queried page " +
                page +
                " is >= to maximum page number " +
                numPages,
            };
          return callback(false, responsePayload);
        } else {
          return callback(true, "No data found");
        }
      } else {
        return callback(true, "No data found");
      }
    } catch (e) {
      callback(true, e);
    }
  },

  createCategory: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        client.query(
          "INSERT INTO category (category_id,category_name) VALUES ($1,$2) RETURNING * ",[body.category_id,body.category_name],
        (err,data)=>{
          if (data) {
            return callback(false, data);
          } else {
            return callback(true, err.message);
          }
        } 
        );
      });
    } catch {
      console.log("catch block");
      callback(true, "error");
      return true;
    }
  },

  getCategoryById: async (req, callback) => {
    try {
      const data = await new Promise((resolve) => {
        sql.query(
          "SELECT * FROM category where id=?",
          [req.body.id],
          (err, sqlResult) => {
            resolve(sqlResult);
          }
        );
      });
      if (data && data.length > 0) {
        return callback(false, data[0]);
      } else {
        return callback(true, "No data found");
      }
    } catch (e) {
      callback(true, e);
    }
  },

  updateCategoryActive: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        sql.query(
          "UPDATE category SET is_active=? WHERE id=?",
          [body.is_active, body.id],
          (err, sqlResult) => {
            resolve(sqlResult);
          }
        );
      });
      if (data) {
        return callback(false, data);
      } else {
        return callback(true, "Please choose other mobile number");
      }
    } catch {
      console.log("catch block");
      callback(true, "error");
      return true;
    }
  },

  updateCategoryDetail: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        sql.query(
          "UPDATE category SET category_name=? WHERE id=?",
          [body.category_name, body.id],
          (err, sqlResult) => {
            resolve(sqlResult);
          }
        );
      });
      if (data) {
        return callback(false, data);
      } else {
        return callback(true, "Please choose other mobile number");
      }
    } catch {
      console.log("catch block");
      callback(true, "error");
      return true;
    }
  },

  deleteCategory: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        sql.query(
          "UPDATE category SET is_deleted=? WHERE id=?",
          [1, body.id],
          (err, sqlResult) => {
            resolve(sqlResult);
          }
        );
      });
      if (data) {
        return callback(false, data);
      } else {
        return callback(true, "No data found");
      }
    } catch {
      console.log("catch block");
      callback(true, "error");
      return true;
    }
  },

  getCategorySearch: async (req, callback) => {
    try {
      var numRows;
      var queryPagination;
      var numPerPage = parseInt(req.query.numberPerPage, 10) || 1;
      var page = parseInt(req.query.page, 10) || 0;
      var numPages;
      var skip = page * numPerPage;
      // Here we compute the LIMIT parameter for MySQL query
      var limit = skip + "," + numPerPage;
      const data = await new Promise((resolve) => {
        sql.query(
          "SELECT count(*) as numRows FROM category WHERE is_deleted=0 AND category_name LIKE '%" +
          req.query.searchText +
          "%'",
          (err, sqlResult) => {
            console.log(err);
            resolve(sqlResult);
          }
        );
      });
      console.log(data);
      if (data) {
        numRows = data[0].numRows;
        numPages = Math.ceil(numRows / numPerPage);
        console.log("number of pages:", numPages);
        const data2 = await new Promise((resolve) => {
          sql.query(
            "SELECT * FROM category WHERE is_deleted=0 AND category_name LIKE '%" +
            req.query.searchText +
            "%' ORDER BY ID DESC LIMIT " +
            limit,
            (err, sqlResult) => {
              resolve(sqlResult);
            }
          );
        });
        if (data2) {
          var responsePayload = {
            results: data2,
          };
          if (page < numPages) {
            responsePayload.pagination = {
              current: page,
              perPage: numPerPage,
              totalPage: numPages,
              previous: page > 0 ? page - 1 : undefined,
              next: page < numPages - 1 ? page + 1 : undefined,
            };
          } else
            responsePayload.pagination = {
              err: "queried page " +
                page +
                " is >= to maximum page number " +
                numPages,
            };
          return callback(false, responsePayload);
        } else {
          return callback(true, "No data found");
        }
      } else {
        return callback(true, "No data found");
      }
    } catch (e) {
      console.log(e);
      callback(true, e);
    }
  },

  getAllSubCategory: async (req, callback) => {
    try {
      console.log(req.page);
      var numRows;
      var queryPagination;
      var numPerPage = parseInt(req.query.numberPerPage, 10) || 2000;
      var page = parseInt(req.query.page, 10) || 0;
      var numPages;
      var skip = page * numPerPage;
      // Here we compute the LIMIT parameter for MySQL query
      var limit = skip + "," + numPerPage;
      const data = await new Promise((resolve) => {
        sql.query(
          "SELECT count(*) as numRows FROM sub_category WHERE is_deleted=0",
          (err, sqlResult) => {
            resolve(sqlResult);
          }
        );
      });
      console.log(data);
      if (data) {
        numRows = data[0].numRows;
        numPages = Math.ceil(numRows / numPerPage);
        console.log("number of pages:", numPages);
        const data2 = await new Promise((resolve) => {
          sql.query(
            "SELECT * FROM sub_category WHERE is_deleted=0 ORDER BY ID DESC LIMIT " +
            limit,
            (err, sqlResult) => {
              resolve(sqlResult);
            }
          );
        });
        if (data2) {
          var responsePayload = {
            results: data2,
          };
          if (page < numPages) {
            responsePayload.pagination = {
              current: page,
              perPage: numPerPage,
              totalPage: numPages,
              previous: page > 0 ? page - 1 : undefined,
              next: page < numPages - 1 ? page + 1 : undefined,
            };
          } else
            responsePayload.pagination = {
              err: "queried page " +
                page +
                " is >= to maximum page number " +
                numPages,
            };
          return callback(false, responsePayload);
        } else {
          return callback(true, "No data found");
        }
      } else {
        return callback(true, "No data found");
      }
    } catch (e) {
      callback(true, e);
    }
  },

  createSubCategory: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        // sql.query(
        //   "INSERT into sub_category (category_id,sub_category_name) VALUES (?,?)",
        //   [body.category_id, body.sub_category_name],
        //   (err, sqlResult) => {
        //     resolve(sqlResult);
        //   }
        // );
        client.query(
          "INSERT INTO sub_category (category_id,sub_category_name) VALUES ($1,$2) RETURNING * ",[body.category_id, body.sub_category_name],
        (err,data)=>{
          if (data) {
            return callback(false, data);
          } else {
            return callback(true, err.message);
          }
        } 
        );
        });
    } catch {
      console.log("catch block");
      callback(true, "error");
      return true;
    }
  },

  getSubCategoryById: async (req, callback) => {
    try {
      const data = await new Promise((resolve) => {
        sql.query(
          "SELECT * FROM sub_category where id=?",
          [req.body.id],
          (err, sqlResult) => {
            resolve(sqlResult);
          }
        );
      });
      if (data && data.length > 0) {
        return callback(false, data[0]);
      } else {
        return callback(true, "No data found");
      }
    } catch (e) {
      callback(true, e);
    }
  },

  updateSubCategoryActive: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        sql.query(
          "UPDATE sub_category SET is_active=? WHERE id=?",
          [body.is_active, body.id],
          (err, sqlResult) => {
            resolve(sqlResult);
          }
        );
      });
      if (data) {
        return callback(false, data);
      } else {
        return callback(true, "Please choose other mobile number");
      }
    } catch {
      console.log("catch block");
      callback(true, "error");
      return true;
    }
  },

  updateSubCategoryDetail: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        sql.query(
          "UPDATE sub_category SET category_id=?,sub_category_name=? WHERE id=?",
          [body.category_id, body.category_name, body.id],
          (err, sqlResult) => {
            resolve(sqlResult);
          }
        );
      });
      if (data) {
        return callback(false, data);
      } else {
        return callback(true, "Oops something went wrong");
      }
    } catch {
      console.log("catch block");
      callback(true, "error");
      return true;
    }
  },

  deleteSubCategory: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        sql.query(
          "UPDATE sub_category SET is_deleted=? WHERE id=?",
          [1, body.id],
          (err, sqlResult) => {
            resolve(sqlResult);
          }
        );
      });
      if (data) {
        return callback(false, data);
      } else {
        return callback(true, "No data found");
      }
    } catch {
      console.log("catch block");
      callback(true, "error");
      return true;
    }
  },

  getSubCategorySearch: async (req, callback) => {
    try {
      var numRows;
      var queryPagination;
      var numPerPage = parseInt(req.query.numberPerPage, 10) || 1;
      var page = parseInt(req.query.page, 10) || 0;
      var numPages;
      var skip = page * numPerPage;
      // Here we compute the LIMIT parameter for MySQL query
      var limit = skip + "," + numPerPage;
      const data = await new Promise((resolve) => {
        sql.query(
          "SELECT count(*) as numRows FROM sub_category WHERE is_deleted=0 AND sub_category_name LIKE '%" +
          req.query.searchText +
          "%'",
          (err, sqlResult) => {
            console.log(err);
            resolve(sqlResult);
          }
        );
      });
      console.log(data);
      if (data) {
        numRows = data[0].numRows;
        numPages = Math.ceil(numRows / numPerPage);
        console.log("number of pages:", numPages);
        const data2 = await new Promise((resolve) => {
          sql.query(
            "SELECT * FROM sub_category WHERE is_deleted=0 AND sub_category_name LIKE '%" +
            req.query.searchText +
            "%' ORDER BY ID DESC LIMIT " +
            limit,
            (err, sqlResult) => {
              resolve(sqlResult);
            }
          );
        });
        if (data2) {
          var responsePayload = {
            results: data2,
          };
          if (page < numPages) {
            responsePayload.pagination = {
              current: page,
              perPage: numPerPage,
              totalPage: numPages,
              previous: page > 0 ? page - 1 : undefined,
              next: page < numPages - 1 ? page + 1 : undefined,
            };
          } else
            responsePayload.pagination = {
              err: "queried page " +
                page +
                " is >= to maximum page number " +
                numPages,
            };
          return callback(false, responsePayload);
        } else {
          return callback(true, "No data found");
        }
      } else {
        return callback(true, "No data found");
      }
    } catch (e) {
      console.log(e);
      callback(true, e);
    }
  },

  getAllServiceCategory: async (req, callback) => {
    try {
      console.log(req.page);
      var numRows;
      var queryPagination;
      var numPerPage = parseInt(req.query.numberPerPage, 10) || 2000;
      var page = parseInt(req.query.page, 10) || 0;
      var numPages;
      var skip = page * numPerPage;
      // Here we compute the LIMIT parameter for MySQL query
      var limit = skip + "," + numPerPage;
      const data = await new Promise((resolve) => {
        sql.query(
          "SELECT count(*) as numRows FROM service_category WHERE is_deleted=0",
          (err, sqlResult) => {
            resolve(sqlResult);
          }
        );
      });
      console.log(data);
      if (data) {
        numRows = data[0].numRows;
        numPages = Math.ceil(numRows / numPerPage);
        console.log("number of pages:", numPages);
        const data2 = await new Promise((resolve) => {
          sql.query(
            "SELECT service_category.*,category.category_name,sub_category.sub_category_name FROM service_category INNER JOIN category ON service_category.category_id=category.id INNER JOIN sub_category ON service_category.sub_category_id=sub_category.id WHERE service_category.is_deleted=0 ORDER BY service_category.ID DESC LIMIT " +
            limit,
            (err, sqlResult) => {
              resolve(sqlResult);
            }
          );
        });
        if (data2) {
          var responsePayload = {
            results: data2,
          };
          if (page < numPages) {
            responsePayload.pagination = {
              current: page,
              perPage: numPerPage,
              totalPage: numPages,
              previous: page > 0 ? page - 1 : undefined,
              next: page < numPages - 1 ? page + 1 : undefined,
            };
          } else
            responsePayload.pagination = {
              err: "queried page " +
                page +
                " is >= to maximum page number " +
                numPages,
            };
          return callback(false, responsePayload);
        } else {
          return callback(true, "No data found");
        }
      } else {
        return callback(true, "No data found");
      }
    } catch (e) {
      callback(true, e);
    }
  },

  createServiceCategory: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        // sql.query(
        //   "INSERT into service_category (category_id,sub_category_id,service_category_name) VALUES (?,?,?)",
        //   [body.category_id, body.sub_category_id, body.service_category_name],
        //   (err, sqlResult) => {
        //     resolve(sqlResult);
        //   }
        // );

        client.query(
          "INSERT INTO service_category (category_id,sub_category_id,service_category_name) VALUES ($1,$2,$3) RETURNING * ",[body.category_id, body.sub_category_id, body.service_category_name],
        (err,data)=>{
          if (data) {
            return callback(false, data);
          } else {
            return callback(true, err.message);
          }
        } 
        );
      });
    
    } catch {
      console.log("catch block");
      callback(true, "error");
      return true;
    }
  },

  getServiceCategoryById: async (req, callback) => {
    try {
      const data = await new Promise((resolve) => {
        sql.query(
          "SELECT service_category.*,category.category_name,sub_category.sub_category_name FROM service_category INNER JOIN category ON service_category.category_id=category.id INNER JOIN sub_category ON service_category.sub_category_id=sub_category.id where service_category.id=?",
          [req.body.id],
          (err, sqlResult) => {
            resolve(sqlResult);
          }
        );
      });
      if (data && data.length > 0) {
        return callback(false, data[0]);
      } else {
        return callback(true, "No data found");
      }
    } catch (e) {
      callback(true, e);
    }
  },

  updateServiceCategoryActive: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        sql.query(
          "UPDATE service_category SET is_active=? WHERE id=?",
          [body.is_active, body.id],
          (err, sqlResult) => {
            resolve(sqlResult);
          }
        );
      });
      if (data) {
        return callback(false, data);
      } else {
        return callback(true, "Please choose other mobile number");
      }
    } catch {
      console.log("catch block");
      callback(true, "error");
      return true;
    }
  },

  updateServiceCategoryDetail: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        sql.query(
          "UPDATE service_category SET category_id=?,sub_category_id=?,service_category_name=? WHERE id=?",
          [body.category_id, body.sub_category_id, body.service_category_name, body.id],
          (err, sqlResult) => {
            resolve(sqlResult);
          }
        );
      });
      if (data) {
        return callback(false, data);
      } else {
        return callback(true, "Please choose other mobile number");
      }
    } catch {
      console.log("catch block");
      callback(true, "error");
      return true;
    }
  },

  deleteServiceCategory: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        sql.query(
          "UPDATE service_category SET is_deleted=? WHERE id=?",
          [1, body.id],
          (err, sqlResult) => {
            resolve(sqlResult);
          }
        );
      });
      if (data) {
        return callback(false, data);
      } else {
        return callback(true, "No data found");
      }
    } catch {
      console.log("catch block");
      callback(true, "error");
      return true;
    }
  },

  getServiceCategorySearch: async (req, callback) => {
    try {
      var numRows;
      var queryPagination;
      var numPerPage = parseInt(req.query.numberPerPage, 10) || 1;
      var page = parseInt(req.query.page, 10) || 0;
      var numPages;
      var skip = page * numPerPage;
      // Here we compute the LIMIT parameter for MySQL query
      var limit = skip + "," + numPerPage;
      const data = await new Promise((resolve) => {
        sql.query(
          "SELECT count(*) as numRows FROM service_category WHERE is_deleted=0 AND service_category_name LIKE '%" +
          req.query.searchText +
          "%'",
          (err, sqlResult) => {
            console.log(err);
            resolve(sqlResult);
          }
        );
      });
      console.log(data);
      if (data) {
        numRows = data[0].numRows;
        numPages = Math.ceil(numRows / numPerPage);
        console.log("number of pages:", numPages);
        const data2 = await new Promise((resolve) => {
          sql.query(
            "SELECT service_category.*,category.category_name,sub_category.sub_category_name FROM service_category INNER JOIN category ON service_category.category_id=category.id INNER JOIN sub_category ON service_category.sub_category_id=sub_category.id WHERE service_category.is_deleted=0 AND service_category.service_category_name LIKE '%" +
            req.query.searchText +
            "%' ORDER BY ID DESC LIMIT " +
            limit,
            (err, sqlResult) => {
              resolve(sqlResult);
            }
          );
        });
        if (data2) {
          var responsePayload = {
            results: data2,
          };
          if (page < numPages) {
            responsePayload.pagination = {
              current: page,
              perPage: numPerPage,
              totalPage: numPages,
              previous: page > 0 ? page - 1 : undefined,
              next: page < numPages - 1 ? page + 1 : undefined,
            };
          } else
            responsePayload.pagination = {
              err: "queried page " +
                page +
                " is >= to maximum page number " +
                numPages,
            };
          return callback(false, responsePayload);
        } else {
          return callback(true, "No data found");
        }
      } else {
        return callback(true, "No data found");
      }
    } catch (e) {
      console.log(e);
      callback(true, e);
    }
  },

  // Get list of all the customer 
  getAllCustomers: async (req, callback) => {
    try {
      const { q, _page, _limit } = req.query;
      let queryText = 'SELECT * FROM customer_registration';
      let countQueryText = 'SELECT COUNT(*) FROM customer_registration';
      const queryParams = [];
  
      // If search query is provided, modify the query to include search conditions
      if (q) {
        queryText += `
          WHERE name ILIKE $${queryParams.length + 1} || '%'
          OR email ILIKE $${queryParams.length + 2} || '%'
        `;
        countQueryText += `
          WHERE name ILIKE $${queryParams.length + 1} || '%'
          OR email ILIKE $${queryParams.length + 2} || '%'
        `;
        for (let i = 0; i < 2; i++) {
          queryParams.push(`%${q}%`);
        }
      }
  
      // Add ORDER BY and LIMIT/OFFSET for pagination
      queryText += ' ORDER BY customer_id DESC LIMIT $' + (queryParams.length + 1) + ' OFFSET $' + (queryParams.length + 2);
      queryParams.push(_limit, (_page - 1) * _limit);
  
      const get_all_customers = {
        text: queryText,
        values: queryParams,
      };
  
      const count_all_customers = {
        text: countQueryText,
        values: queryParams.slice(0, -2),  // Exclude LIMIT and OFFSET
      };
  
      // Execute the queries
      const [result, countResult] = await Promise.all([
        new Promise((resolve) => {
          client.query(get_all_customers, (err, result) => {
            if (err) {
              console.log(err);
              return callback(true, "Unable to fetch the customer details");
            } else {
              resolve(result);
            }
          });
        }),
        new Promise((resolve) => {
          client.query(count_all_customers, (err, result) => {
            if (err) {
              console.log(err);
              return callback(true, "Unable to fetch the count of customers");
            } else {
              resolve(result);
            }
          });
        })
      ]);
  
      // Combine the results
      const results = {
        results: result.rows,
        totalRecords: parseInt(countResult.rows[0].count, 10)
      };
  
      return callback(false, results);
  
    } catch (e) {
      return callback(true, e.message);
    }
  },
  

   // Get list of all the rejected service providers 
   getAllRejectedSp: async (req, callback) => {
    try {
      const { q, _page, _limit } = req.query;
      let queryText = 'SELECT * FROM pending_request_sp_dealer WHERE approval_status = $1 AND is_deleted = $2';
      let countQueryText = 'SELECT COUNT(*) FROM pending_request_sp_dealer WHERE approval_status = $1 AND is_deleted = $2';
      const queryParams = [false, true];
  
      // If search query is provided, modify the query to include search conditions
      if (q) {
        queryText += `
          AND (name ILIKE $${queryParams.length + 1}
          OR email ILIKE $${queryParams.length + 2})
        `;
        countQueryText += `
          AND (name ILIKE $${queryParams.length + 1}
          OR email ILIKE $${queryParams.length + 2})
        `;
        for (let i = 0; i < 2; i++) {
          queryParams.push(`%${q}%`);
        }
      }
  
      // Add ORDER BY and LIMIT/OFFSET for pagination
      queryText += ' ORDER BY register_sp_id DESC LIMIT $' + (queryParams.length + 1) + ' OFFSET $' + (queryParams.length + 2);
      queryParams.push(_limit, (_page - 1) * _limit);
  
      const get_all_rejected_sp = {
        text: queryText,
        values: queryParams,
      };
  
      const count_all_rejected_sp = {
        text: countQueryText,
        values: queryParams.slice(0, -2),  // Exclude LIMIT and OFFSET
      };
  
      // Execute the queries
      const [result, countResult] = await Promise.all([
        new Promise((resolve) => {
          client.query(get_all_rejected_sp, (err, result) => {
            if (err) {
              console.log(err);
              return callback(true, "Unable to fetch the rejected service providers details");
            } else {
              resolve(result);
            }
          });
        }),
        new Promise((resolve) => {
          client.query(count_all_rejected_sp, (err, result) => {
            if (err) {
              console.log(err);
              return callback(true, "Unable to fetch the count of rejected service providers");
            } else {
              resolve(result);
            }
          });
        })
      ]);
  
      // Combine the results
      const results = {
        results: result.rows,
        totalRecords: parseInt(countResult.rows[0].count, 10)
      };
  
      return callback(false, results);
  
    } catch (e) {
      return callback(true, e.message);
    }
  },
  

  // Old Query

  // getAllApprovedSp: async (req, callback) => {
  //   try {
  //     const { q, _page, _limit } = req.query;
  //     let queryText = 'SELECT * FROM approved_service_providers WHERE is_deleted = $1'
  //     const queryParams = [false];
  
  //    // If search query is provided, modify the query to include search conditions
  //       if (q) {
  //         if (!queryText.includes('WHERE')) {
  //           queryText += ' WHERE ';
  //         } else {
  //           queryText += ' AND ';
  //         }
  //         queryText += `
  //           (name ILIKE $${queryParams.length + 1}
  //           OR email ILIKE $${queryParams.length + 2})
  //         `;
  //         for (let i = 0; i < 2; i++) {
  //           queryParams.push(`%${q}%`);
  //         }
  //       }

  
  //     // This is for pagination
  //     // Always include ORDER BY clause
  //     queryText += ' ORDER BY sp_id DESC LIMIT $' + (queryParams.length + 1) + ' OFFSET $' + (queryParams.length + 2);
  //     queryParams.push(_limit, (_page - 1) * _limit);
  //     // console.log("ln 1298", queryText, queryParams);
  
  //     const get_all_approved_sp = {
  //       text: queryText,
  //       values: queryParams,
  //     };
  
  //     const data = await new Promise((resolve) => {
  //       client.query(get_all_approved_sp, (err, result) => {
  //         if (err) {
  //           console.log(err);
  //           return callback(true, "Unable to fetch the approved service providers details");
  //         } else {
  //           const results = {
  //             results: result.rows
  //           };
  //           return callback(false, results);
  //         }
  //       });
  //     });
  //   } catch (e) {
  //     return callback(true, e.message);
  //   }
  // },

  // New Query 

  getAllApprovedSp: async (req, callback) => {
    try {
      const { q, _page, _limit } = req.query;
      let queryText = 'SELECT * FROM approved_service_providers WHERE is_deleted = $1';
      let countQueryText = 'SELECT COUNT(*) FROM approved_service_providers WHERE is_deleted = $1';
      const queryParams = [false];
  
      // If search query is provided, modify the query to include search conditions
      if (q) {
        if (!queryText.includes('WHERE')) {
          queryText += ' WHERE ';
          countQueryText += ' WHERE ';
        } else {
          queryText += ' AND ';
          countQueryText += ' AND ';
        }
        queryText += `
          (name ILIKE $${queryParams.length + 1}
          OR email ILIKE $${queryParams.length + 2})
        `;
        countQueryText += `
          (name ILIKE $${queryParams.length + 1}
          OR email ILIKE $${queryParams.length + 2})
        `;
        for (let i = 0; i < 2; i++) {
          queryParams.push(`%${q}%`);
        }
      }
  
      // Add ORDER BY and LIMIT/OFFSET for pagination
      queryText += ' ORDER BY sp_id DESC LIMIT $' + (queryParams.length + 1) + ' OFFSET $' + (queryParams.length + 2);
      queryParams.push(_limit, (_page - 1) * _limit);
  
      const get_all_approved_sp = {
        text: queryText,
        values: queryParams,
      };
  
      const count_all_approved_sp = {
        text: countQueryText,
        values: queryParams.slice(0, -2),  // Exclude LIMIT and OFFSET
      };
  
      // Execute the queries
      const [result, countResult] = await Promise.all([
        new Promise((resolve) => {
          client.query(get_all_approved_sp, (err, result) => {
            if (err) {
              console.log(err);
              return callback(true, "Unable to fetch the approved service providers details");
            } else {
              resolve(result);
            }
          });
        }),
        new Promise((resolve) => {
          client.query(count_all_approved_sp, (err, result) => {
            if (err) {
              console.log(err);
              return callback(true, "Unable to fetch the count of approved service providers");
            } else {
              resolve(result);
            }
          });
        })
      ]);
  
      // Combine the results
      const results = {
        results: result.rows,
        totalRecords: parseInt(countResult.rows[0].count, 10)
      };
  
      return callback(false, results);
  
    } catch (e) {
      return callback(true, e.message);
    }
  },
  

   // Reset Password -- Forgot password 
   reset_password: async (req, callback) => { // As per new inputs
    try {
      var body = req.body;
    
      // Define the SQL query to update the profile
      const query = 'UPDATE admin SET password = $1 WHERE email = $2 RETURNING name, email';
      
      const values = [body.password, body.email];
      
      const data = await new Promise((resolve) => {
        client.query(query, values, (err, result) => {
          if (err) {
            return callback(true, 'Failed to reset password.');
          } else {
            if (result.rows.length > 0) {
              // console.log(result.rows[0])
              // Password Updated successfully
              return callback(false, result.rows[0]);
            } else {
              // No matching email found
              return callback(true, 'Email not found');
            }
          }
        });
      });
    } catch (error) {
      return callback(true, error.message);
    }
  },

  // Used To add new model
  getAllBrandsAutoFill: async (req, callback) => {
    try {
      const { sp_id,q} = req.query;
      // console.log("ln 1330 q", q, sp_id)
      let queryText = 'SELECT * FROM brands  WHERE  is_deleted = $1'; 
      const queryParams = [false];
      const get_all_brands = {
        text: queryText,
        values: queryParams,
      };
  
      const data = await new Promise((resolve) => {
        client.query(get_all_brands, (err, result) => {
          if (err) {
            console.log(err);
            return callback(true, "Unable to fetch the Brands");
          } else {
              const listofBrandsForAutofill = result.rows.map(item => ({ label: item.brand_name, value: item.brand_name }));
            return callback(false, listofBrandsForAutofill);
          }
        });
      });
    } catch (e) {
      return callback(true, e.message);
    }
  },

  // Used To add new model
  getAllFuelTypeAutoFill: async (req, callback) => {
    try {
      const { sp_id,q} = req.query;
      let queryText = 'SELECT * FROM fuels  WHERE  is_deleted = $1'; 
      const queryParams = [false];
      const get_all_fuel_type = {
        text: queryText,
        values: queryParams,
      };
  
      const data = await new Promise((resolve) => {
        client.query(get_all_fuel_type, (err, result) => {
          if (err) {
            console.log(err);
            return callback(true, "Unable to fetch the Brands");
          } else {
              const listofFuelForAutofill = result.rows.map(item => ({ label: item.fuel_name, value: item.fuel_name }));
            return callback(false, listofFuelForAutofill);
          }
        });
      });
    } catch (e) {
      return callback(true, e.message);
    }
  },

  getStatistics: async (req, callback) => {
    try {
      // Query to get the total number of customers
      const getCustomerCountQuery = {
        text: 'SELECT COUNT(*) FROM customer_registration',
      };
  
      // Query to get the total number of approved service providers
      const getApprovedServiceProviderCountQuery = {
        text: 'SELECT COUNT(*) FROM approved_service_providers',
      };
  
      // Query to get the total number of rejected service providers
      const getRejectedServiceProviderCountQuery = {
        text: 'SELECT COUNT(*) FROM pending_request_sp_dealer WHERE approval_status = $1 AND is_deleted = $2 ',
        values: [false,true]
      };
      // Query to get the total number of vehicles on Portal
      const getAllVehiclesCountQuery = {
        text: 'SELECT COUNT(*) FROM customer_vehicle_data',
      };

       // Query to get the total number of Active service providers
         const getActiveServiceProviderCountQuery = {
          text: 'SELECT COUNT(*) FROM approved_service_providers WHERE sp_status = $1',
          values: ['Active']
        };

        // Query to get the total number of Inactive service providers
           const getInactiveServiceProviderCountQuery = {
            text: 'SELECT COUNT(*) FROM approved_service_providers WHERE sp_status = $1',
            values: ['Inactive']
          };

           // Query to get the total number of Pending service providers
           const getPeningServiceProviderCountQuery = {
            text: 'SELECT COUNT(*) FROM pending_request_sp_dealer WHERE is_deleted = $1',
            values: [false]
          };
  
      // Execute queries asynchronously
      const customerCountPromise = client.query(getCustomerCountQuery);
      const approvedServiceProviderCountPromise = client.query(getApprovedServiceProviderCountQuery);
      const rejectedServiceProviderCountPromise = client.query(getRejectedServiceProviderCountQuery);
      const getAllVehiclesCountPromise = client.query(getAllVehiclesCountQuery);
      const getActiveServiceProviderCountPromise = client.query(getActiveServiceProviderCountQuery);
      const getInactiveServiceProviderCountPromise = client.query(getInactiveServiceProviderCountQuery);
      const getPendingServiceProviderCountPromise = client.query(getPeningServiceProviderCountQuery)
      // Wait for all promises to resolve
      const [
        customerCountResult,
        approvedServiceProviderCountResult,
        rejectedServiceProviderCountResult,
        getAllVehiclesCountResult,
        getActiveServiceProviderCountResult,
        getInactiveServiceProviderCountResult,
        getPendingServiceProviderCountResult
      ] = await Promise.all([
        customerCountPromise,
        approvedServiceProviderCountPromise,
        rejectedServiceProviderCountPromise,
        getAllVehiclesCountPromise,
        getActiveServiceProviderCountPromise,
        getInactiveServiceProviderCountPromise,
        getPendingServiceProviderCountPromise

      ]);
  
      // Extract counts from results
      const customerCount = customerCountResult.rows[0].count;
      const approvedServiceProviderCount = approvedServiceProviderCountResult.rows[0].count;
      const rejectedServiceProviderCount = rejectedServiceProviderCountResult.rows[0].count;
      const getAllVehiclesCount = getAllVehiclesCountResult.rows[0].count
      const  getActiveServiceProviderCount = getActiveServiceProviderCountResult.rows[0].count
      const getInactiveServiceProviderCount = getInactiveServiceProviderCountResult.rows[0].count
      const getPendingServiceProviderCount = getPendingServiceProviderCountResult.rows[0].count
      // Prepare response object
      const statistics = {
        customerCount,
        approvedServiceProviderCount,
        rejectedServiceProviderCount,
        getAllVehiclesCount,
        getActiveServiceProviderCount,
        getInactiveServiceProviderCount,
        getPendingServiceProviderCount
      };
  
      // Send response
      return callback(false, statistics);
    } catch (error) {
      console.error("Error:", error);
      return callback(true, "Unable to fetch statistics");
    }
  },


  getSpecificPendingSpDocument: async (req, callback) => {
    try {
      const { register_sp_id } = req.query;
      // console.log("ln 1705");
      let queryText =
        'SELECT business_document FROM pending_request_sp_dealer  WHERE register_sp_id = $1';
      const queryParams = [register_sp_id];
      const get_document = {
        text: queryText,
        values: queryParams,
      };
  
      const data = await new Promise((resolve) => {
        client.query(get_document, (err, result) => {
          // console.log("ln 2755", result)
          if (err) {
            console.log(err);
            return callback(true, "Unable to fetch the document");
          }
          else if ( result?.rows[0]?.business_document == null){
            return callback(true,'There is no documnet in the system against this service provider');
          }
          else {
            return callback(false, result.rows[0]);
          }
        });
      });
    } catch (e) {
      return callback(true, e.message);
    }
  },

  getSpecificApprovedSpDocument: async (req, callback) => {
    try {
      const { sp_id } = req.query;
      // console.log("ln 1705");
      let queryText =
        'SELECT business_document FROM approved_service_providers  WHERE sp_id = $1';
      const queryParams = [sp_id];
      const get_document = {
        text: queryText,
        values: queryParams,
      };
  
      const data = await new Promise((resolve) => {
        client.query(get_document, (err, result) => {
          if (err) {
            console.log(err);
            return callback(true, "Unable to fetch the document");
          }
          else if ( result?.rows[0]?.business_document == null){
            return callback(true,'There is no documnet in the system against this service provider');
          }
          else {
            return callback(false, result.rows[0]);
          }
        });
      });
    } catch (e) {
      return callback(true, e.message);
    }
  },

  getSpecificRejectedSpDocument: async (req, callback) => {
    try {
      const { register_sp_id } = req.query;
      // console.log("ln 1705");
      let queryText =
        'SELECT business_document FROM pending_request_sp_dealer  WHERE register_sp_id = $1';
      const queryParams = [register_sp_id];
      const get_document = {
        text: queryText,
        values: queryParams,
      };
  
      const data = await new Promise((resolve) => {
        client.query(get_document, (err, result) => {
          if (err) {
            console.log(err);
            return callback(true, "Unable to fetch the document");
          }
          else if ( result?.rows[0]?.business_document == null){
            return callback(true,'There is no documnet in the system against this service provider');
          }
          else {
            return callback(false, result.rows[0]);
          }
        });
      });
    } catch (e) {
      return callback(true, e.message);
    }
  },
  
  

};