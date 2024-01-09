const sql = require("../config/db.config");
const { v4: uuidv4 } = require('uuid');
const {Client} = require('pg');

const client =  new Client ({
    host: "localhost",
    port: 5432,  
    user: "postgres",
    password: "Ertiga@2324",
    database: "avah"
})
client.connect ();

const addEstimateEntry = async (data, type, estimateNumber,sp_id,appointment_id) => {
  try {
    console.log(" ln 16 sp_id", sp_id, data)
      const { name, hsn_sac, selling_price, tax } = data;
      // if(labour_name){
      //   var name = labour_name
      // }
      // if(spare_name){
      //   var name = spare_name
      // }
      const query = 'INSERT INTO estimate (estimate_number, type, name, hsn_sac, selling_price, tax, sp_id,appointment_id) VALUES ($1, $2, $3, $4, $5, $6,$7,$8) RETURNING *';
      const values = [estimateNumber, type, name, hsn_sac, selling_price, tax,sp_id,appointment_id];

      const result = await client.query(query, values);

      console.log(`${type} entry added to the system successfully!`, result.rows);
      return result.rows; // Resolve with the inserted data
  } catch (error) {
      console.error(`Error in adding ${type} entry:`, error);
      throw error; // Reject the promise with the error
  }
};

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
      // OLD Login Query 
      // const login_query = {text: 'SELECT * FROM approved_service_providers WHERE email = $1 AND password = $2 AND role = $3',
      // values: [req.body.email, req.body.password, req.body.role]}
      //  New Login Query
      const login_query = {text: 'SELECT * FROM service_provider_login_creds WHERE email = $1 AND password = $2',
      values: [req.body.email, req.body.password]}
      console.log( login_query)
        const data = await new Promise((resolve) => {
          client.query(
            login_query, 
            (err,result)=>{
              console.log("result",result)
            if (result.rows.length==1 && result.rows[0].status == 'active' ) {  // Login successfull for active service provider
              return callback(false, result);
            } 
            else if(result.rows.length==1 && result.rows[0].status == 'inactive') {
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
            results: result.rows
            // pagination: {
            //   currentPage: parseInt(_page) || 1,
            //   totalPages: 1,
            //   totalRows: result.rowCount.toString(),
            // },
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
    let queryText = 'SELECT * FROM appointment WHERE sp_id = $1 ';
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
      const query = 'INSERT INTO employee (sp_id, name, email, mobile, gender, role, address, country, state, city, pin_code, pan_number, password, status, is_deleted,permission_granted) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *';
      const values = [body.sp_id, body.name, body.email, body.mobile, body.gender, body.role,body.address,body.country,body.state,body.city,body.pin_code,body.pan_number,body.password,body.status, false,body.permission_granted];
      
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
      let queryText = 'SELECT appointment_id,name,vehicle_number,vehicle_type,brand,model,customization,fuel_type,email,mobile_number,pickup_drop,appointment_date,appointment_time,appointment_status,estimate_status,pickup_address FROM appointment WHERE sp_id = $1 AND (appointment_status = $2 OR appointment_status = $3) AND estimate_status <> $4';
      const queryParams = [sp_id, 'Approved', 'Pending', 'Created'];
  
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
              results: result.rows
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

  addSpares:async (req, callback) => {
    try {
      var body = req.body;
      console.log("ln 1290",body)
      // Parse the string values to integers
      const scgst = parseInt(body.scgst, 10);
      const cgst = parseInt(body.cgst, 10);
      
      const purchase_price = body.purchase_price?parseInt(body.purchase_price, 10) : 0;
      const selling_price = parseInt(body.selling_price, 10);
      const units = body.units?parseInt(body.units, 10) : 0;
      const threshold = body.threshold?parseInt(body.threshold, 10) : 0;
  
      const query = 'INSERT INTO spares (spare_name, sp_id, hsn_sac, part_number, fuel_type, threshold, units, purchase_price, selling_price, manufacturer, location, expiry, scgst, cgst, tax)  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *';
      const values = [
        body.spare_name, body.sp_id, body.hsn_sac, body.part_number, body.fuel_type,
        threshold, units, purchase_price, selling_price,
        body.manufacturer, body.location, body.expiry, scgst, cgst, scgst + cgst
      ];
  
      const data = await new Promise((resolve) => {
        client.query(query, values, (err, result) => {
          if (err) {
            console.error('Error in adding spare part', err);
            return callback(true, 'Could not add the spare part');
          }
          console.log('Spare added to the system successfully!', result.rows);
          return callback(false, result.rows);
        });
      });
    } catch (error) {
      console.error('Error in adding spare part ', error);
      return callback(true, error.message);
    }
  },
  

  addLabour:async (req, callback) => {
    try {
      var body = req.body
      console.log("ln 1258", body)
      const price = parseInt(body.selling_price, 10);
      const scgst = parseInt(body.scgst, 10);
      const cgst = parseInt(body.cgst, 10);
      const query = 'INSERT INTO labour (labour_name,sp_id,hsn_sac,selling_price,scgst,cgst,tax)  VALUES ($1, $2, $3, $4, $5,$6,$7) RETURNING *';
      const values = [body.labour_name,body.sp_id,body.hsn_sac,price,scgst,cgst,scgst+cgst];
      const data = await new Promise((resolve) => {
        client.query(query, values, (err, result) => {
          if (err) {
            console.error('Error in adding spare part', err);
            return callback(true, 'Could not add the labour');
          }
          console.log('Labour added to the system successfully!', result.rows);
          return callback(false, result.rows);
        });
      });
    } catch (error) {
      console.error('Error in adding spare part ', error);
      return callback(true, error.message);
    }
  },



  getAllSpares: async (req, callback) => {
    try {
      const { sp_id, q, _page, _limit } = req.query;
      console.log("ln 1289 q", q, _page, _limit);
      let queryText = 'SELECT * FROM spares WHERE sp_id = $1 AND is_deleted = $2';
  
      const queryParams = [sp_id, false];
      console.log('ln 1284', queryText);
  
      // Calculate the OFFSET based on the _page and _limit parameters
      const offset = (_page - 1) * _limit;
  
      if (q) { // This is for search functionality
        console.log("inside q ln 1291", q);
        queryText += ` AND (spare_name ILIKE $${queryParams.length + 1}
          OR hsn_sac ILIKE $${queryParams.length + 2}
          OR fuel_type ILIKE $${queryParams.length + 3})`; // Added closing parenthesis
        for (let i = 0; i < 3; i++) {
          queryParams.push(`%${q}%`);
        }
        console.log("Query Text", queryText,queryParams.length ,queryParams);
      }
  
      // This is for pagination
      console.log("ln 1351",_limit, offset)
     
      queryText += ' LIMIT $' + (queryParams.length + 1) + ' OFFSET $' + (queryParams.length + 2);
      queryParams.push(_limit, offset);
      console.log("ln 1298", queryText, queryParams);
  
      const get_all_spares = {
        text: queryText,
        values: queryParams,
      };
  
      const data = await new Promise((resolve) => {
        client.query(get_all_spares, (err, result) => {
          if (err) {
            console.log(err);
            return callback(true, "Unable to fetch the spare details");
          } else {
            const results = {
              results: result.rows
            };
            return callback(false, results);
          }
        });
      });
    } catch (e) {
      return callback(true, e.message);
    }
  },
  

  getAllLabour: async (req, callback) => {
    try {
      const { sp_id, q, _page, _limit } = req.query;
      console.log("ln 1330 q", q,_limit,_page)
      let queryText = 'SELECT * FROM labour  WHERE sp_id = $1 AND is_deleted = $2'; 
      const queryParams = [sp_id,false];

        // Calculate the OFFSET based on the _page and _limit parameters
        const offset = (_page - 1) * _limit;
        console.log("ln 1390", offset )
      if (q) { // This is for search functionality
        queryText += ' AND (labour_name ILIKE $3 OR hsn_sac ILIKE $3)';
        console.log(queryText, "ln 1393")
        queryParams.push(`%${q}%`);
      }
      console.log("ln 1395", queryParams, queryText)
      // This is for pagination
      queryText += ' LIMIT $' + (queryParams.length + 1) + ' OFFSET $' + (queryParams.length + 2);
      console.log("ln 1399", queryParams, queryText)
      queryParams.push(_limit, offset);
      console.log("ln 1401", queryParams, queryText)
      const get_all_labours = {
        text: queryText,
        values: queryParams,
      };
  
      const data = await new Promise((resolve) => {
        client.query(get_all_labours, (err, result) => {
          if (err) {
            console.log(err);
            return callback(true, "Unable to fetch the labour details");
          } else {
            const results = {
              results: result.rows
            };
            return callback(false, results);
          }
        });
      });
    } catch (e) {
      return callback(true, e.message);
    }
  },

  deleteLabour: async (req, callback) => { // As per new inputs
    try {
      var body = req.body;   
      console.log("ln 1371", body)
      const labour_id = parseInt(body.labour_id, 10);
      console.log("ln 1373", labour_id)
      // Define the SQL query to update the profile
      const query = 'UPDATE labour SET is_deleted = $1 WHERE labour_id = $2 AND sp_id = $3 RETURNING *'; 
      const values = [true,labour_id,body.sp_id];  
      const data = await new Promise((resolve) => {
        client.query(query, values, (err, result) => {
          if (err) {
            return callback(true, 'Unable to delete the spare');
          } else {
            if (result.rows.length > 0) {
              console.log(result.rows[0])
              return callback(false, result.rows[0]);
            } else {
              // No matching email found
              return callback(true, 'Labour not found in backend system');
            }
          }
        });
      });
    } catch (error) {
      return callback(true, error.message);
    }
  },

  deleteSpare: async (req, callback) => { // As per new inputs
    try {
      var body = req.body;   
      console.log("ln 1371", body)
      const spare_id = parseInt(body.spare_id, 10);
      console.log("ln 1373", spare_id)
      // Define the SQL query to update the profile
      const query = 'UPDATE spares SET is_deleted = $1 WHERE spare_id = $2 AND sp_id = $3 RETURNING *'; 
      const values = [true,spare_id,body.sp_id];  
      const data = await new Promise((resolve) => {
        client.query(query, values, (err, result) => {
          if (err) {
            return callback(true, 'Unable to delete the spare');
          } else {
            if (result.rows.length > 0) {
              console.log(result.rows[0])
              return callback(false, result.rows[0]);
            } else {
              // No matching email found
              return callback(true, 'Spare not found in backend system');
            }
          }
        });
      });
    } catch (error) {
      return callback(true, error.message);
    }
  },
   addEstimate : async (req, callback) => {
    try {
     

          // Generate or retrieve the estimate number for this specific moment
          const sequenceName = 'estimate_number_seq'; // Replace with your sequence name
          const { rows } = await client.query(`SELECT nextval('${sequenceName}')`);
          const estimateNumber = rows[0].nextval;
        console.log("ln 1491", req.body)
        const { sp_id,sparePayload, labourPayload,appointment_id } = req.body;

        // Insert spare parts
        const sparePromises = sparePayload.map(async (spare) => {
            return addEstimateEntry({ ...spare, type: 'spare' }, 'spare', estimateNumber,sp_id,appointment_id);
        });

        // Insert labor entries
        const labourPromises = labourPayload.map(async (labour) => {
            return addEstimateEntry({ ...labour, type: 'labour' }, 'labour', estimateNumber,sp_id,appointment_id);
        });

        // Update Estimate Status in Appointment table


        const [spareResults, labourResults] = await Promise.all([
            Promise.all(sparePromises),
            Promise.all(labourPromises)
        ]);

        const query = `UPDATE appointment SET estimate_status = $1, estimate_number = $4  WHERE appointment_id = $2 AND sp_id = $3 RETURNING *`; 
        const values = ['Created',appointment_id, sp_id,estimateNumber];  
        client.query(query, values)
  
        console.log('Estimate data inserted successfully!');
        callback(false, 'Estimate data inserted successfully!');
    } catch (error) {
        console.error('Error in adding estimate: ', error);
        callback(true, error.message);
    }
},

 getEstimateDetails : async (req, callback) => {
  try {
    console.log(req.query)
    // return false
      const { appointment_id, sp_id, estimate_number } = req.query;
      const estimateValues = [estimate_number,sp_id];
      console.log("ln 1463", sp_id,estimate_number)
      // Fetch spare details for the specific estimate_number
      const spareQuery = `
      SELECT * FROM estimate
      WHERE estimate_number = $1 AND type = 'spare' AND sp_id = $2
  `;
  const spareValues = [estimate_number, sp_id];
  const spareResult = await client.query(spareQuery, spareValues);

      // Fetch labour details for the specific estimate_number
      const labourQuery = `
      SELECT * FROM estimate
      WHERE estimate_number = $1 AND type = 'labour' AND sp_id = $2 
      `;
      const labourResult = await client.query(labourQuery, estimateValues);
    console.log("ln 1477", spareResult)
      // Prepare and structure the retrieved data
      const data = {
          spares: spareResult.rows,
          labours: labourResult.rows,
       
      };

      console.log('Estimate details retrieved successfully!', data);
      callback(false, data);
  } catch (error) {
      console.error('Error in fetching estimate details: ', error);
      callback(true, error.message);
  }
},

editEstimate : async (req, callback) => {
  try {
      const { estimate_number,sp_id,sparePayload, labourPayload,appointment_id } = req.body;

      // Delete previous 
      console.log("Entered editEstimate ln 1566", estimate_number, sp_id)
      const deleteOldEstimateQuery = `
      DELETE FROM estimate
      WHERE estimate_number = $1 AND sp_id = $2 `;
      const deleteOldEstimateValues = [estimate_number,sp_id];
      const deleteOldEstimate = await client.query(deleteOldEstimateQuery, deleteOldEstimateValues);

      // Insert spare parts
      const sparePromises = sparePayload.map(async (spare) => {
          return addEstimateEntry({ ...spare, type: 'spare' }, 'spare', estimate_number,sp_id,appointment_id);
      });

      // Insert labor entries
      const labourPromises = labourPayload.map(async (labour) => {
          return addEstimateEntry({ ...labour, type: 'labour' }, 'labour', estimate_number,sp_id,appointment_id);
      });

      // Update Estimate Status in Appointment table


      const [spareResults, labourResults] = await Promise.all([
          Promise.all(sparePromises),
          Promise.all(labourPromises)
      ]);

      const query = `UPDATE appointment SET estimate_status = $1 WHERE appointment_id = $2 AND sp_id = $3 RETURNING *`; 
      const values = ['Created',appointment_id, sp_id];  
      client.query(query, values)

      console.log('Estimate data edited successfully!');
      callback(false, 'Estimate data edited successfully!');
  } catch (error) {
      console.error('Error in editing estimate: ', error);
      callback(true, error.message);
  }
},

getEstimatePendingVehcileList: async (req, callback) => { // This is for showing data inside table.
  try {
    // console.log("ln 181", req.query)
    const {sp_id} = req.query;
    // console.log("ln 176:", customer_id, _page, _limit, q);
    // Construct a SQL query with pagination
    const query = 'SELECT vehicle_number FROM appointment WHERE sp_id = $1 AND estimate_status = $2 AND appointment_status = $3';
    const values = [sp_id,'Pending', 'Approved']; // Use '%' to match any characters after the entered partial number
    const data = await new Promise((resolve) => {
      client.query(query,values, (err, result) => {
        if (err) {
          return callback(true, 'Error retrieving Pending Estimate vehicles');
        } else {
          if (result.rows.length === 0) {
            return callback(true, 'No vehicles found Pending for Estimate creation');
          } else {
            const listOfVehicleNumbers = result.rows.map(item => ({ label: item.vehicle_number, value: item.vehicle_number }));
            // console.log("ln 200", result.rows);
            return callback(false, listOfVehicleNumbers);
          }
        }
      });
    });
  } catch (error) {
    return callback(true, error.message);
  }
},

getAllLabourListForAutoFill: async (req, callback) => {
  try {
    const { sp_id, q} = req.query;
    console.log("ln 1330 q", q)
    let queryText = 'SELECT * FROM labour  WHERE sp_id = $1 AND is_deleted = $2'; 
    const queryParams = [sp_id,false];
    if (q) { // This is for search functionality
      queryText += ' AND (labour_name ILIKE $3 OR hsn_sac ILIKE $3)';
      console.log(queryText, "ln 1393")
      queryParams.push(`%${q}%`);
    }
    console.log("ln 1395", queryParams, queryText)
    const get_all_labours = {
      text: queryText,
      values: queryParams,
    };

    const data = await new Promise((resolve) => {
      client.query(get_all_labours, (err, result) => {
        if (err) {
          console.log(err);
          return callback(true, "Unable to fetch the labour details");
        } else {
       
            // results: result.rows
            const listOfLabourForAutoFill = result.rows.map(item => ({ label: item.labour_name, value: item.labour_name }));
         
          return callback(false, listOfLabourForAutoFill);
        }
      });
    });
  } catch (e) {
    return callback(true, e.message);
  }
},

getAllSpareListForAutoFill: async (req, callback) => {
  try {

    // console.log("ln 1669", req.body);
    // console.log("ln 1670", req.query)
    const { sp_id,q} = req.query;
    console.log("ln 1330 q", q, sp_id)
    let queryText = 'SELECT * FROM spares  WHERE sp_id = $1 AND is_deleted = $2'; 
    const queryParams = [sp_id,false];
    if (q) { // This is for search functionality
      queryText += ' AND (spare_name ILIKE $3 OR hsn_sac ILIKE $3)';
      console.log(queryText, "ln 1393")
      queryParams.push(`%${q}%`);
    }
    // console.log("ln 1395", queryParams, queryText)
    const get_all_spares = {
      text: queryText,
      values: queryParams,
    };

    const data = await new Promise((resolve) => {
      client.query(get_all_spares, (err, result) => {
        if (err) {
          console.log(err);
          return callback(true, "Unable to fetch the spare details");
        } else {
            const listOfSparesForAutoFill = result.rows.map(item => ({ label: item.spare_name, value: item.spare_name }));
          return callback(false, listOfSparesForAutoFill);
        }
      });
    });
  } catch (e) {
    return callback(true, e.message);
  }
},



getSpecificSpareDetailsForEstimate: async (req, callback) => {
  try {
    const { sp_id, spare_name } = req.query;
    console.log("ln 1705", sp_id, spare_name);
    let queryText =
      'SELECT spare_id,spare_name,hsn_sac,selling_price,tax FROM spares  WHERE sp_id = $1 AND spare_name = $2 AND is_deleted = $3';
    const queryParams = [sp_id, spare_name, false];
    const get_spare = {
      text: queryText,
      values: queryParams,
    };

    const data = await new Promise((resolve) => {
      client.query(get_spare, (err, result) => {
        if (err) {
          console.log(err);
          return callback(true, "Unable to fetch the spare details");
        } else {
          console.log("ln 1720 ", result.rows);

          // Renaming spare_name to name in the result
          const modifiedResult = result.rows[0];
          if (modifiedResult) {
            modifiedResult.name = modifiedResult.spare_name;
            delete modifiedResult.spare_name;
          }

          return callback(false, modifiedResult);
        }
      });
    });
  } catch (e) {
    return callback(true, e.message);
  }
},

getSpecificLabourDetailsForEstimate: async (req, callback) => {
  try {
    const {sp_id,labour_name} = req.query;
    console.log('ln 1729', sp_id, labour_name)
    let queryText = 'SELECT labour_id,labour_name,hsn_sac,selling_price,tax FROM labour  WHERE sp_id = $1 AND labour_name = $2 AND is_deleted = $3'; 
    const queryParams = [sp_id,labour_name,false];
    const get_labour = {
      text: queryText,
      values: queryParams,
    };

    const data = await new Promise((resolve) => {
      client.query(get_labour, (err, result) => {
        if (err) {
          console.log(err);
          return callback(true, "Unable to fetch the labour details");
        } else {
          const modifiedResult = result.rows[0];
          if (modifiedResult) {
            modifiedResult.name = modifiedResult.labour_name;
            delete modifiedResult.labour_name;
          }

          return callback(false, modifiedResult);
        }
      });
    });
  } catch (e) {
    return callback(true, e.message);
  }
},

getSpecificVechicleDetailsToCreateEstimate: async (req, callback) => {
  try {
    const {sp_id,vehicle_number} = req.query;
    console.log('ln 1729', sp_id, vehicle_number)
    let queryText = 'SELECT * FROM appointment_details  WHERE sp_id = $1 AND vehicle_number = $2 '; 
    const queryParams = [sp_id,vehicle_number];
    const get_vehicle = {
      text: queryText,
      values: queryParams,
    };

    const data = await new Promise((resolve) => {
      client.query(get_vehicle, (err, result) => {
        if (err) {
          console.log(err);
          return callback(true, "Unable to fetch the vehcile details");
        } else {      
          return callback(false, result.rows[0]);
        }
      });
    });
  } catch (e) {
    return callback(true, e.message);
  }
},

getAllCreatedEstimateList: async (req, callback) => {
  try {
    const {sp_id,q} = req.query;
    console.log("ln 1791", sp_id)
    let queryText = 'SELECT * FROM appointment  WHERE sp_id = $1 AND estimate_status = $2'; 
    const queryParams = [sp_id,'Created'];
  
    if (q) { // This is for search functionality
      console.log("inside q ln 1739", q); 
      queryText += ` AND vehicle_number ILIKE $3`; // Added closing parenthesis  
      queryParams.push(`%${q}%`)
      console.log("Query Text ln 1742", queryText,queryParams.length ,queryParams);
    }

    // queryText += ' LIMIT $' + (queryParams.length + 1) + ' OFFSET $' + (queryParams.length + 2);
    //   queryParams.push(_limit, offset);
     

    const get_estimate = {
      text: queryText,
      values: queryParams,
    };

    const data = await new Promise((resolve) => {
      client.query(get_estimate, (err, result) => {
        if (err) {
          console.log(err);
          return callback(true, "Unable to fetch the spare details");
        } else {
          const results = {
            results: result.rows
          };
          return callback(false, results);
        }
      });
    });
  } catch (e) {
    return callback(true, e.message);
  }
},

addEmployeeRole:async (req, callback) => {
  try {
    var body = req.body
    console.log("ln 1258", body)
    const query = 'INSERT INTO employee_roles (sp_id,role_name,permission_granted)  VALUES ($1, $2, $3) RETURNING *';
    const values = [body.sp_id,body.role_name,body.permission_granted];
    const data = await new Promise((resolve) => {
      client.query(query, values, (err, result) => {
        if (err) {
          console.error('Error in adding employee role', err);
          return callback(true, 'Could not add the new employee role');
        }
        console.log('Employee role added to the system successfully!', result.rows);
        return callback(false, result.rows);
      });
    });
  } catch (error) {
    console.error('Error in adding Employee Role', error);
    return callback(true, error.message);
  }
},

getAllEmployeeRoles: async (req, callback) => {
  try {
    const { sp_id, q, _page, _limit } = req.query;
    console.log("ln 1330 q", q,_limit,_page)
    let queryText = 'SELECT role_id,role_name,permission_granted FROM employee_roles  WHERE sp_id = $1 AND is_deleted = $2'; 
    const queryParams = [sp_id,false];

      // Calculate the OFFSET based on the _page and _limit parameters
      const offset = (_page - 1) * _limit;
      console.log("ln 1390", offset )
    if (q) { // This is for search functionality
      queryText += ' AND (role_name ILIKE $3)';
      console.log(queryText, "ln 1393")
      queryParams.push(`%${q}%`);
    }
    console.log("ln 1395", queryParams, queryText)
    // This is for pagination
    queryText += ' LIMIT $' + (queryParams.length + 1) + ' OFFSET $' + (queryParams.length + 2);
    console.log("ln 1399", queryParams, queryText)
    queryParams.push(_limit, offset);
    console.log("ln 1401", queryParams, queryText)
    const get_all_roles = {
      text: queryText,
      values: queryParams,
    };

    const data = await new Promise((resolve) => {
      client.query(get_all_roles, (err, result) => {
        if (err) {
          console.log(err);
          return callback(true, "Unable to fetch the role details");
        } else {
          const results = {
            results: result.rows
          };
          return callback(false, results);
        }
      });
    });
  } catch (e) {
    return callback(true, e.message);
  }
},

getAllPermissionPerRoles: async (req, callback) => {
  try {
    const { sp_id } = req.query;
    let queryText = 'SELECT role_name, permission_granted FROM employee_roles WHERE sp_id = $1';
    const queryParams = [sp_id];

    const getAllPermissionQuery = {
      text: queryText,
      values: queryParams,
    };

    client.query(getAllPermissionQuery, (err, result) => {
      if (err) {
        console.error(err);
        return callback(true, "Unable to fetch permissions per roles");
      } else {
        const formattedData = {};

        // Loop through the query results to organize by role_name
        result.rows.forEach(row => {
          const { role_name, permission_granted } = row;
          if (!(role_name in formattedData)) {
            formattedData[role_name] = permission_granted; // Store permissions directly without an array
          } else {
            formattedData[role_name].push(permission_granted);
          }
        });

        // Convert the formatted data into the desired array of objects format
        const resultArray = Object.keys(formattedData).map(role_name => ({
          label:role_name,
          value:role_name,
          permissions : formattedData[role_name]
        }));

        return callback(false, resultArray);
      }
    });
  } catch (e) {
    console.error("Error:", e);
    return callback(true, e.message);
  }
},

getNotificationNumbers: async (req, callback) => {
  try {
    const { sp_id } = req.query;
    console.log("ln 1849", sp_id)
    const queryParamsAppointment = [sp_id,'Approved','Pending','Created'];
    const queryParamsEstimate = [sp_id,'Created'];
    const getAppointmentCount = {
      text: 'SELECT COUNT(appointment_id) AS appointment_count FROM appointment WHERE sp_id = $1 AND (appointment_status = $2 OR appointment_status = $3) AND estimate_status <> $4',
      values: queryParamsAppointment,
    };

    const appointmentCountResult = await new Promise((resolve) => {
      client.query(getAppointmentCount, (err, result) => {
        if (err) {
          console.error(err);
          return callback(true, "Unable to fetch Notification Numbers details");
        } else {
          resolve(result.rows[0].appointment_count);
        }
      });
    });

    const getEstimateCount = {
      text: 'SELECT COUNT(appointment_id) AS estimate_count FROM appointment WHERE sp_id = $1 AND estimate_status = $2',
      values: queryParamsEstimate,
    };
console.log("ln 1871 ", getEstimateCount)
    const estimateCountResult = await new Promise((resolve) => {
      client.query(getEstimateCount, (err, result) => {
        if (err) {
          console.error(err);
          return callback(true, "Unable to fetch estimate details");
        } else {
          resolve(result.rows[0].estimate_count);
        }
      });
    });

    // Create an object with the counts
    const notificationCounts = {
      appointment_list: appointmentCountResult,
      estimate_list: estimateCountResult,
    };

    return callback(false,  notificationCounts );
  } catch (e) {
    console.error("Error:", e);
    return callback(true, e.message);
  }
},


deleteEmployeeRole: async (req, callback) => { // As per new inputs
  try {
    var body = req.body;  
    const role_id = parseInt(body.role_id, 10);
    console.log("ln 1373", role_id)
    // Define the SQL query to update the profile
    const query = 'UPDATE employee_roles SET is_deleted = $1 WHERE role_id = $2 AND sp_id = $3 RETURNING *'; 
    const values = [true,role_id,body.sp_id];  
    const data = await new Promise((resolve) => {
      client.query(query, values, (err, result) => {
        if (err) {
          return callback(true, 'Unable to delete the role');
        } else {
          if (result.rows.length > 0) {
            console.log(result.rows[0])
            return callback(false, result.rows[0]);
          } else {
            // No matching email found
            return callback(true, 'Role not found in backend system');
          }
        }
      });
    });
  } catch (error) {
    return callback(true, error.message);
  }
},

editEmployeeRole: async (req, callback) => { // As per new inputs
  try {
    var body = req.body;  
    const role_id = parseInt(body.role_id, 10);
    // Define the SQL query to update the profile
    const query = 'UPDATE employee_roles SET permission_granted = $1 WHERE role_id = $2 AND sp_id = $3 RETURNING *'; 
    const values = [body.permission_granted,role_id,body.sp_id];  
    const data = await new Promise((resolve) => {
      client.query(query, values, (err, result) => {
        if (err) {
          return callback(true, 'Unable to edit the role');
        } else {
          if (result.rows.length > 0) {
            console.log(result.rows[0])
            return callback(false, result.rows[0]);
          } else {
            // No matching email found
            return callback(true, 'Role not found in backend system');
          }
        }
      });
    });
  } catch (error) {
    return callback(true, error.message);
  }
},



















  
};