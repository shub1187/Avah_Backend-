const sql = require("../config/db.config");

const {Client} = require('pg');

const client =  new Client ({
    host: "localhost",
    port: 5432,  
    user: "postgres",
    password: "Ertiga@2324",
    database: "avah"
})
client.connect ();

module.exports = {

  // Pre Registeration of Service Provider / Dealer from Register page
  register: async (req, callback) => {
    try {
      var body = req.body
      // Calculate the full_address by concatenating address, city, state, and pin_code
      const full_address = `${body.business_address} ${body.city} ${body.state} ${body.pin_code}`;
      const query = 'INSERT INTO pending_request_sp_dealer (name, email, business_name, business_type, document, password,approval_status,role,business_contact,sp_status,business_address,state,city,pin_code,full_address,is_deleted) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,$13,$14,$15,$16) RETURNING *';
      const values = [body.name, body.email, body.business_name, body.business_type, body.document, body.password,body.approval_status,body.role,body.business_contact,body.sp_status,body.business_address,body.state,body.city,body.pin_code,full_address,false];
      
      const data = await new Promise((resolve) => {
        client.query(query, values, (err, result) => {
          if (err) {
            console.error('Error registering user:', err);
            return callback(true, 'Service Provider Registration failed');
          }
          console.log('Service Provider registered successfully!');
          return callback(false, result.rows);
        });
      });
    } catch (error) {
      console.error('Error registering user:', error);
      return callback(true, error.message);
    }
  }
  ,  // Pre Registeration of Service Provider / Dealer ends

  login: async (req, callback) => {
    try {
      const login_query = {text: 'SELECT * FROM approved_service_providers WHERE email = $1 AND password = $2 AND role = $3',
      values: [req.body.email, req.body.password, req.body.role]}
      console.log( login_query)
        const data = await new Promise((resolve) => {
          client.query(
            login_query, 
            (err,result)=>{
              console.log("result",result)
            if (result.rows.length==1 && result.rows[0].sp_status == 'active' ) {  // Login successfull for active service provider
              return callback(false, result);
            } 
            else if(result.rows.length==1 && result.rows[0].sp_status == 'inactive') {
              return callback(true,"Sorry you cannot login you have been disabled by the Admin")    
            }
            else if (result.rows.length == 0) {
              return callback(true, "Kindly Enter Correct Credentials");
            }
          } 
          );
        });
    } catch (e) {
      console.log("ln 59", e.message)
      callback(true, e);
    }
  },

  getAllUsers: async (req, callback) => {
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
          "SELECT count(*) as numRows FROM users WHERE is_deleted=0",
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
            "SELECT * FROM users WHERE is_deleted=0 ORDER BY ID DESC LIMIT " +
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

  createUser: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        sql.query(
          "INSERT into users (first_name,last_name,email,mobile,password,vehicle_no) VALUES (?,?,?,?,?,?)",
          [
            body.first_name,
            body.last_name,
            body.email,
            body.mobile,
            body.password,
            body.vehicle_no
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
      console.log("catch block");
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

  updateUserPassword: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        sql.query(
          "UPDATE users SET password=? WHERE id=?",
          [body.password, body.id],
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

  updateUserDetail: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        sql.query(
          "UPDATE users SET first_name=?,last_name=?,email=?,mobile=?,vehicle_no=? WHERE id=?",
          [
            body.first_name,
            body.last_name,
            body.email,
            body.mobile,
            body.vehicle_no,
            body.user_id,
          ],
          (err, sqlResult) => {
            // if (err) {
            //   resolve(err);
            // } else {
            resolve(sqlResult);
            // }
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
      console.log("catch block");
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
      console.log(e);
      callback(true, e);
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
      console.log("catch block");
      callback(true, "error");
      return true;
    }
  },
  // To get list of technician for creating Job Card
  getAllTechnicianEmployee: async (req, callback) => {
   try {
    console.log("getAlltech:", req.query)
    const { sp_id } = req.query;
    const getall_technician = {
      text: 'SELECT * FROM employee WHERE role = $1 AND sp_id = $2',
      values: ['technician', sp_id],
    };
    const data = await new Promise((resolve) => {
      client.query(
        getall_technician,
        (err, result) => {
         if (err){
          console.log(err)
          return callback(true, "Unable to fetch the technican details");
         }
           else {
            let technican_names = [];
           result.rows.map((x) => {
              technican_names.push(x.name);
            });
            console.log(technican_names);
            const results = {
              results: technican_names ,
              pagination: {
                currentPage: 1,
                totalPages: 1,
                totalRows: "9",
              },
            };
            return callback(false, results);
          }
        }
      );
    });
   }
   catch (e){
    return callback(true, e.message);
   }
  },
// To get all Employee list as per the sp irr respective of role
getAllEmployee: async (req, callback) => {
  try {
    const { sp_id, q, _page, _limit } = req.query;
    let queryText = 'SELECT * FROM employee WHERE sp_id = $1';
    const queryParams = [sp_id];

    if (q) { // This is for search functionality
      queryText += ' AND (name ILIKE $2 OR email ILIKE $2 OR role ILIKE $2 OR status ILIKE $2 OR mobile ILIKE $2  )';
      queryParams.push(`%${q}%`);
    }

    const getall_employee = {
      text: queryText,
      values: queryParams,
    };

    const data = await new Promise((resolve) => {
      client.query(getall_employee, (err, result) => {
        if (err) {
          console.log(err);
          return callback(true, "Unable to fetch the technician details");
        } else {
          const results = {
            results: result.rows,
            pagination: {
              currentPage: parseInt(_page) || 1,
              totalPages: 1,
              totalRows: result.rowCount.toString(),
            },
          };
          return callback(false, results);
        }
      });
    });
  } catch (e) {
    return callback(true, e.message);
  }
},

// To get all model as per brand 
getAllModelPerBrand: async (req, callback) => {
  try {
    console.log(req.body)
    const getall_models = {
      text: 'SELECT model_name, brand_name FROM models',
    };
    const data = await new Promise((resolve) => {
      client.query(
        getall_models,
        (err, result) => {
         if (err){
          console.log(err)
          return callback(true, "Unable to fetch the models");
         }
           else {
            const data = result.rows;
              // Transform data into the desired format
              const brandModelMap = {};
              data.forEach(row => {
                const { brand_name, model_name } = row;
                if (!brandModelMap[brand_name]) {
                  brandModelMap[brand_name] = [];
                }
                brandModelMap[brand_name].push(model_name);
              });
              // Convert the transformed data to the desired array of objects format
              const resultArray = Object.keys(brandModelMap).map(brand_name => {
                return { [brand_name]: brandModelMap[brand_name] };
              });
              console.log(resultArray);
            const results = {
              results: resultArray,
              pagination: {
                currentPage: 1,
                totalPages: 1,
                totalRows: "9",
              }
            };
            return callback(false, results);
          }
        }
      );
    });
  } catch (e) {
    console.log("Error:", e);
    return callback(true, e.message);
  }
},

// To get all Appointment list as per the sp irr respective of status
getAllAppointment: async (req, callback) => {
  try {
    const { sp_id, q, _page, _limit } = req.query;
    let queryText = 'SELECT * FROM appointment WHERE sp_id = $1';
    const queryParams = [sp_id];

    if (q) { // This is for search functionality
      queryText += ' AND (name ILIKE $2 OR email ILIKE $2 OR role ILIKE $2 OR status ILIKE $2 OR mobile ILIKE $2  )';
      queryParams.push(`%${q}%`);
    }

    const getall_employee = {
      text: queryText,
      values: queryParams,
    };

    const data = await new Promise((resolve) => {
      client.query(getall_employee, (err, result) => {
        if (err) {
          console.log(err);
          return callback(true, "Unable to fetch the appointment details");
        } else {
          const results = {
            results: result.rows,
            pagination: {
              currentPage: parseInt(_page) || 1,
              totalPages: 1,
              totalRows: result.rowCount.toString(),
            },
          };
          return callback(false, results);
        }
      });
    });
  } catch (e) {
    return callback(true, e.message);
  }
},

// get All Model as per brands to create appointment.




  createEmployee:async (req, callback) => {
    try {
      var body = req.body
      const query = 'INSERT INTO employee (sp_id, name, email, mobile, gender, role, address, country, state, city, pin_code, pan_number, password, status, is_deleted) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *';
      const values = [body.sp_id, body.name, body.email, body.mobile, body.gender, body.role,body.address,body.country,body.state,body.city,body.pin_code,body.pan_number,body.password,body.status, false];
      
      const data = await new Promise((resolve) => {
        client.query(query, values, (err, result) => {
          if (err) {
            console.error('Error in creating new Employee:', err);
            return callback(true, 'Employee creation failed');
          }
          console.log('New Employee created successfully!');
          return callback(false, result.rows);
        });
      });
    } catch (error) {
      console.error('Error in creating new Employee:', error);
      return callback(true, error.message);
    }
  },

  createAppointment:async (req, callback) => {
    try {
      var body = req.body
      const query = 'INSERT INTO appointment (name,sp_id, vehicle_number,vehicle_type, brand,model, email, mobile, pickup_drop,address,service_date, booking_date,status,is_deleted) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *';
      const values = [ body.name,body.sp_id,body.vehicle_number,body.vehicle_type,body.brand,body.model,body.email,body.mobile, body.pickup_drop,body.address,body.service_date,body.booking_date,body.status, false];
      
      const data = await new Promise((resolve) => {
        client.query(query, values, (err, result) => {
          if (err) {
            console.error('Error in creating Appointment:', err);
            return callback(true, 'Appointment creation failed');
          }
          console.log('Appointment created successfully!');
          return callback(false, result.rows);
        });
      });
    } catch (error) {
      console.error('Error in creating Appointment from Service Provider Portal : ', error);
      return callback(true, error.message);
    }
  },

  updateEmployeePassword: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        sql.query(
          "UPDATE employees SET password=? WHERE id=?",
          [body.password, body.id],
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

  getEmployeeById: async (req, callback) => {
    try {
      const data = await new Promise((resolve) => {
        sql.query(
          "SELECT * FROM employees where id=?",
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

  updateEmployeeDetail: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        sql.query(
          "UPDATE employees SET first_name=?,last_name=?,email=?,mobile=? WHERE id=?",
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
      console.log("catch block");
      callback(true, "error");
      return true;
    }
  },

  deleteEmployee: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        sql.query(
          "UPDATE employees SET is_deleted=? WHERE id=?",
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
      console.log("catch block");
      callback(true, "error");
      return true;
    }
  },

  getEmployeeSearch: async (req, callback) => {
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
          "SELECT count(*) as numRows FROM employees WHERE is_deleted=0 AND first_name LIKE '%" +
          req.query.searchText +
          "%' OR last_name LIKE '%" +
          req.query.searchText +
          "%' OR mobile LIKE '%" +
          req.query.searchText +
          "%' OR email LIKE '%" +
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
            "SELECT * FROM employees WHERE is_deleted=0 AND first_name LIKE '%" +
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
      console.log(e);
      callback(true, e);
    }
  },

  updateEmployeeActive: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        sql.query(
          "UPDATE employees SET is_active=? WHERE id=?",
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
      console.log("catch block");
      callback(true, "error");
      return true;
    }
  },

  getAllSpare: async (req, callback) => {
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
          "SELECT count(*) as numRows FROM spares INNER JOIN fuels ON spares.id=fuels.id WHERE spares.is_deleted=0",
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
            "SELECT spares.*,fuels.fuel_name FROM spares INNER JOIN fuels ON spares.id=fuels.id WHERE spares.is_deleted=0 ORDER BY spares.ID DESC LIMIT " +
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

  createSpare: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        sql.query(
          "INSERT into spares (name,hsn_sac,part_number,fuel_type_id,threshold,purchase_price,selling_price,tax_price,units,expiry_date) VALUES (?,?,?,?,?,?,?,?,?,?)",
          [
            body.name,
            body.hsn_sac,
            body.part_number,
            body.fuel_type_id,
            body.threshold,
            body.purchase_price,
            body.selling_price,
            body.tax_price,
            body.units,
            body.expiry_date,
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
      console.log("catch block");
      callback(true, "error");
      return true;
    }
  },

  getSpareById: async (req, callback) => {
    try {
      const data = await new Promise((resolve) => {
        sql.query(
          "SELECT spares.*,fuels.fuel_name FROM spares INNER JOIN fuels ON spares.id=fuels.id where spares.id=?",
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

  updateSpareDetail: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        sql.query(
          "UPDATE spares SET name=?,hsn_sac=?,part_number=?,fuel_type_id=?,threshold=?,purchase_price=?,selling_price=?,tax_price=?,units=?,expiry_date=? WHERE id=?",
          [
            body.name,
            body.hsn_sac,
            body.part_number,
            body.fuel_type_id,
            body.threshold,
            body.purchase_price,
            body.selling_price,
            body.tax_price,
            body.units,
            body.expiry_date,
            body.id
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
      console.log("catch block");
      callback(true, "error");
      return true;
    }
  },

  deleteSpare: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        sql.query(
          "UPDATE spares SET is_deleted=? WHERE id=?",
          [1, body.id],
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

  getSpareSearch: async (req, callback) => {
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
          "SELECT count(*) as numRows FROM spares WHERE is_deleted=0 AND name LIKE '%" +
          req.query.searchText +
          "%' OR part_number LIKE '%" +
          req.query.searchText +
          "%' OR hsn_sac LIKE '%" +
          req.query.searchText +
          "%' OR selling_price LIKE '%" +
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
            "SELECT spares.*,fuels.fuel_name FROM spares INNER JOIN fuels ON spares.id=fuels.id WHERE spares.is_deleted=0 AND spares.name LIKE '%" +
            req.query.searchText +
            "%' OR spares.part_number LIKE '%" +
            req.query.searchText +
            "%' OR spares.hsn_sac LIKE '%" +
            req.query.searchText +
            "%' OR spares.selling_price LIKE '%" +
            req.query.searchText +
            "%' ORDER BY spares.ID DESC LIMIT " +
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

  updateSpareActive: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        sql.query(
          "UPDATE spares SET is_active=? WHERE id=?",
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

  getUserVehicleSearch: async (req, callback) => {
    try {
      var numRows;
      var queryPagination;
      var numPerPage = parseInt(req.query.numberPerPage, 10) || 50000;
      var page = parseInt(req.query.page, 10) || 0;
      var numPages;
      var skip = page * numPerPage;
      // Here we compute the LIMIT parameter for MySQL query
      var limit = skip + "," + numPerPage;
      const data = await new Promise((resolve) => {
        sql.query(
          "SELECT count(*) as numRows FROM users WHERE is_deleted=0 AND vehicle_no LIKE '%" +
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
            "SELECT * FROM users WHERE is_deleted=0 AND vehicle_no LIKE '%" +
            req.query.searchText +
            "%'",
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

  getAllLabour: async (req, callback) => {
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
          "SELECT count(*) as numRows FROM labour WHERE is_deleted=0",
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
            "SELECT * FROM labour WHERE is_deleted=0 ORDER BY ID DESC LIMIT " +
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

  createLabour: async (req, callback) => {
    try {
      var body = req.body;
      var error;
      const data = await new Promise((resolve) => {
        sql.query(
          "INSERT into labour (first_name,last_name,email,mobile,password,labour_price,tax) VALUES (?,?,?,?,?,?,?)",
          [
            body.first_name,
            body.last_name,
            body.email,
            body.mobile,
            body.password,
            body.labour_price,
            body.tax,
          ],
          (err, sqlResult) => {
            error = err;
            resolve(sqlResult);
          }
        );
      });
      if (data) {
        return callback(false, data);
      } else {
        return callback(true, error);
      }
    } catch {
      console.log("catch block");
      callback(true, "error");
      return true;
    }
  },

  getLabourById: async (req, callback) => {
    try {
      const data = await new Promise((resolve) => {
        sql.query(
          "SELECT * FROM labour where id=?",
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

  updateLabourDetail: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        sql.query(
          "UPDATE labour SET first_name=?,last_name=?,email=?,mobile=?,password=?,labour_price=?,tax=? WHERE id=?",
          [
            body.first_name,
            body.last_name,
            body.email,
            body.mobile,
            body.password,
            body.labour_price,
            body.tax,
            body.id
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
      console.log("catch block");
      callback(true, "error");
      return true;
    }
  },

  deleteLabour: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        sql.query(
          "UPDATE labour SET is_deleted=? WHERE id=?",
          [1, body.id],
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

  getLabourSearch: async (req, callback) => {
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
          "SELECT count(*) as numRows FROM labour WHERE is_deleted=0 AND first_name LIKE '%" +
          req.query.searchText +
          "%' OR last_name LIKE '%" +
          req.query.searchText +
          "%' OR mobile LIKE '%" +
          req.query.searchText +
          "%' OR email LIKE '%" +
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
            "SELECT * FROM labour WHERE is_deleted=0 AND first_name LIKE '%" +
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
      console.log(e);
      callback(true, e);
    }
  },

  updateLabourActive: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        sql.query(
          "UPDATE labour SET is_active=? WHERE id=?",
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

  createEstimate: async (req, callback) => {
    try {
      var body = req.body;
      var error;
      const data = await new Promise((resolve) => {
        sql.query(
          "INSERT into estimate (service_provider_id,user_id,spares_list,labour_list) VALUES (?,?,?,?)",
          [
            body.service_provider_id,
            body.user_id,
            body.spares_list,
            body.labour_list,
          ],
          (err, sqlResult) => {
            error = err;
            resolve(sqlResult);
          }
        );
      });
      if (data) {
        return callback(false, data);
      } else {
        return callback(true, error);
      }
    } catch {
      console.log("catch block");
      callback(true, "error");
      return true;
    }
  },

  getAllEstimate: async (req, callback) => {
    try {
      console.log(req.page);
      var numRows;
      var queryPagination;
      var numPerPage = parseInt(req.query.numberPerPage, 10) || 20000;
      var page = parseInt(req.query.page, 10) || 0;
      var numPages;
      var skip = page * numPerPage;
      // Here we compute the LIMIT parameter for MySQL query
      var limit = skip + "," + numPerPage;
      const data = await new Promise((resolve) => {
        sql.query(
          "SELECT count(*) as numRows FROM estimate",
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
            "SELECT users.*,estimate.* FROM estimate INNER JOIN users ON estimate.user_id=users.id ORDER BY estimate.ID DESC LIMIT " +
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

  // Service Provider Authority to approve/reject 

  
  spApprovalOfCustAppointment: async (req, callback) => {
    try {
      const body = req.body;
      const { appointment_id, appointment_status, is_reschedule_allowed,sp_rejection_note } = body;
  
      // Define the query and values based on the appointment_status
      let updateAppointmentQuery;
      let queryValues;
      
      if (appointment_status === 'Approved') {
        updateAppointmentQuery = {
          text: "UPDATE appointment SET appointment_status = 'Approved' WHERE appointment_id = $1 AND appointment_status <> 'Cancelled By SP' RETURNING name, appointment_status,appointment_date,appointment_time",
          values: [appointment_id],
        };
      } else if (appointment_status === 'Rejected By SP') {
        updateAppointmentQuery = {
          text: "UPDATE appointment SET appointment_status = 'Rejected By SP', is_reschedule_allowed = $2, has_sp_rejected =$3, sp_rejection_note = $4 WHERE appointment_id = $1 AND appointment_status <> 'cancelled' RETURNING name, appointment_status,appointment_date,appointment_time",
          values: [appointment_id, is_reschedule_allowed,true,sp_rejection_note],
        };
      } else {
        return callback(true, 'Invalid appointment_status');
      }
  
      const data = await new Promise((resolve) => {
        client.query(updateAppointmentQuery, (err, result) => {
          if (err) {
            console.error('Error in updating appointment:', err);
            return callback(true, 'Appointment updatation failed');
          }
          if (result.rows.length === 0) {
            return callback(true, 'Appointment not found or cannot be updated');
          }
          console.log(`Appointment ${appointment_status} successfully!`);
          return callback(false, result.rows);
        });
      });
    } catch (error) {
      console.error('Error in updating appointment:', error);
      return callback(true, error.message);
    }
  },

  getAllPendingAppointment: async (req, callback) => {
    try {
      console.log("Entered 1573 pending Appointment")
      const { sp_id, q, _page, _limit } = req.query;
      let queryText = 'SELECT appointment_id,name,vehicle_number,vehicle_type,brand,model,customization,fuel_type,email,mobile_number,pickup_drop,appointment_date,appointment_time,appointment_status,estimate_status,pickup_address FROM appointment WHERE sp_id = $1 AND (appointment_status = $2 OR appointment_status = $3)';
      const queryParams = [sp_id, 'Approved', 'Pending'];
  
      if (q) { // This is for search functionality
        queryText += ' AND (name ILIKE $4 OR vehicle_number ILIKE $4 OR vehicle_type ILIKE $4 OR appointment_status ILIKE $4)';
        queryParams.push(`%${q}%`);
      }
  
      const getall_employee = {
        text: queryText,
        values: queryParams,
      };
  
      const data = await new Promise((resolve) => {
        client.query(getall_employee, (err, result) => {
          if (err) {
            console.log(err);
            return callback(true, "Unable to fetch the pending appointment details");
          } else {
            const results = {
              results: result.rows,
              pagination: {
                currentPage: parseInt(_page) || 1,
                totalPages: 1,
                totalRows: result.rowCount.toString(),
              },
            };
            return callback(false, results);
          }
        });
      });
    } catch (e) {
      return callback(true, e.message);
    }
  },

  getAllRejectedAndCancelledAppointment: async (req, callback) => {
    try {
      const { sp_id, q, _page, _limit } = req.query;
      let queryText = 'SELECT appointment_id,name,vehicle_number,vehicle_type,brand,model,customization,fuel_type,email,mobile_number,pickup_drop,pickup_address,appointment_date,appointment_time,appointment_status,sp_rejection_note,cust_cancellation_note,sp_cancellation_note FROM appointment WHERE sp_id = $1 AND (appointment_status = $2 OR appointment_status = $3 OR appointment_status = $4)';
      const queryParams = [sp_id, 'Rejected By SP', 'Cancelled by Customer', 'cancelled by estimate']; 
  
      // if (q) { // This is for search functionality
      //   queryText += ' AND (name ILIKE $2 OR email ILIKE $2 OR role ILIKE $2 OR status ILIKE $2 OR mobile ILIKE $2  )';
      //   queryParams.push(`%${q}%`);
      // }
  
      const getall_employee = {
        text: queryText,
        values: queryParams,
      };
  
      const data = await new Promise((resolve) => {
        client.query(getall_employee, (err, result) => {
          if (err) {
            console.log(err);
            return callback(true, "Unable to fetch the pending appointment details");
          } else {
            const results = {
              results: result.rows,
              pagination: {
                currentPage: parseInt(_page) || 1,
                totalPages: 1,
                totalRows: result.rowCount.toString(),
              },
            };
            return callback(false, results);
          }
        });
      });
    } catch (e) {
      return callback(true, e.message);
    }
  },


  
};