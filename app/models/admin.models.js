// const sql = require("../config/db.config");
// const client = require("../../database/database")

const {Client} = require('pg');

const client =  new Client ({
    host: "localhost",
    port: 5432,  
    user: "postgres",
    password: "Ertiga@2324",
    database: "avah"
})
client.connect ();
// client.connect();
module.exports = {
  login: async (req, callback) => {
    try {
      // console.log("ln : 18",req.body)
      // const data = await client.query('SELECT * FROM admin')
      // console.log(data.rows)
      // const data = await new Promise((resolve) => {
      //   sql.query(
      //     "SELECT * FROM admin where username=? AND password=?",
      //     [req.body.username, req.body.password],
      //     (err, sqlResult) => {
      //       resolve(sqlResult);
      //     }
      //   );
      // });
      // if (data && data.length > 0) {
      //   return callback(false, data[0]);
      // } else {
      //   return callback(true, "No data found");
      // }
      console.log("Login query started", req.token)
    //  const select_query=client.query("SELECT * FROM admin where username=$1 AND password=$2 RETURNING * " 
    //     [req.body.username, req.body.password])
      const_login_query = {text: 'SELECT * FROM admin WHERE username = $1 AND password = $2',
      values: [req.body.username, req.body.password]}
        const data = await new Promise((resolve) => {
          client.query(
            // "SELECT * FROM admin (username,password) VALUES ($1,$2) RETURNING * ",[req.body.username, req.body.password],
            const_login_query,
          
            (err,data)=>{
            if (data) {
              console.log("ln 44",data)
              return callback(false, data);
            } else {
              console.log("ln 47",err)
              return callback(true, err.message);
            }
          } 
          );
        });

        console.log("ln: 54 outer data ",data)

        
      
    } catch (e) {
      console.log("ln 46:" ,e)
      callback(true, e.message);
    }
  },

  getAllUsers: async (req, callback) => {
    try {
      // console.log("entered Get All User")
      const data = await client.query('SELECT * FROM users')
      // console.log(data.rows)
      let full_data = data.rows
       return callback((false), full_data);
      // console.log(req.page);
      // var numRows;
      // var queryPagination;
      // var numPerPage = parseInt(req.query.numberPerPage, 10) || 2000;
      // var page = parseInt(req.query.page, 10) || 0;
      // var numPages;
      // var skip = page * numPerPage;
      // // Here we compute the LIMIT parameter for MySQL query
      // var limit = skip + "," + numPerPage;
      // const data = await new Promise((resolve) => {
      //   sql.query(
      //     "SELECT count(*) as numRows FROM users WHERE is_deleted=0",
      //     (err, sqlResult) => {
      //       resolve(sqlResult);
      //     }
      //   );
      // });
      // console.log(data);
      // if (data) {
      //   numRows = data[0].numRows;
      //   numPages = Math.ceil(numRows / numPerPage);
      //   console.log("number of pages:", numPages);
      //   const data2 = await new Promise((resolve) => {
      //     sql.query(
      //       "SELECT * FROM users WHERE is_deleted=0 ORDER BY ID DESC LIMIT " +
      //       limit,
      //       (err, sqlResult) => {
      //         resolve(sqlResult);
      //       }
      //     );
      //   });
      //   if (data2) {
      //     var responsePayload = {
      //       results: data2,
      //     };
      //     if (page < numPages) {
      //       responsePayload.pagination = {
      //         current: page,
      //         perPage: numPerPage,
      //         totalPage: numPages,
      //         previous: page > 0 ? page - 1 : undefined,
      //         next: page < numPages - 1 ? page + 1 : undefined,
      //       };
      //     } else
      //       responsePayload.pagination = {
      //         err: "queried page " +
      //           page +
      //           " is >= to maximum page number " +
      //           numPages,
      //       };
      //     return callback(false, responsePayload);
      //   } else {
      //     return callback(true, "No data found");
      //   }
      // } else {
      //   return callback(true, "No data found");
      // }
    } catch (e) {
      console.log(e.message, "ln 112")
    }
  },

  createUser: async (req, callback) => {
    try {
      var body = req.body;
      console.log("entered createUsER")
      const {first_name, last_name,email,mobile, password}=req.body
      console.log(body.first_name)
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
      console.log("catch block");
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
      console.log("catch block");
      callback(true, "error");
      return true;
    }
  },

  getAllServiceProviders: async (req, callback) => {
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
          "SELECT count(*) as numRows FROM service_providers WHERE is_deleted=0",
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
            "SELECT * FROM service_providers WHERE is_deleted=0 ORDER BY ID DESC LIMIT " +
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

  createServiceProvider: async (req, callback) => {
    try {
      var body = req.body;
      // const data = await new Promise((resolve) => {
      //   sql.query(
      //     "INSERT into service_providers (business_name,business_type,business_address,first_name,last_name,email,mobile,password) VALUES (?,?,?,?,?,?,?,?)",
      //     [
      //       body.business_name,
      //       body.business_type,
      //       body.business_address,
      //       body.first_name,
      //       body.last_name,
      //       body.email,
      //       body.mobile,
      //       body.password,
      //     ],
      //     (err, sqlResult) => {
      //       resolve(sqlResult);
      //     }
      //   );
      // });
      // if (data) {
      //   return callback(false, data);
      // } else {
      //   return callback(true, "Please choose other mobile number");
      // }

      const data = await new Promise((resolve) => {
        client.query(
          "INSERT INTO service_providers (business_name,business_type,business_address,first_name,last_name,email,mobile,password) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING * ",[body.business_name,body.business_type,body.business_address,body.first_name,body.last_name,body.email,body.mobile,body.password],
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
      var body = req.body;
      const data = await new Promise((resolve) => {
        sql.query(
          "UPDATE service_providers SET is_active=? WHERE id=?",
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
      console.log("catch block");
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
      console.log(e);
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
      console.log("catch block");
      callback(true, "error");
      return true;
    }
  },

  deleteServiceProvider: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        sql.query(
          "UPDATE service_providers SET is_deleted=? WHERE id=?",
          [1, body.user_id],
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

  getAllBrands: async (req, callback) => {
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
          "SELECT count(*) as numRows FROM brands WHERE is_deleted=0",
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
            "SELECT * FROM brands WHERE is_deleted=0 ORDER BY ID DESC LIMIT " +
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

  createBrand: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        // sql.query(
        //   "INSERT into brands (brand_image,brand_code,brand_name) VALUES (?,?,?)",
        //   [body.brand_image, body.brand_code, body.brand_name],
        //   (err, sqlResult) => {
        //     resolve(sqlResult);
        //   }
        // );
        client.query(
          "INSERT INTO brands (brand_image,brand_code,brand_name) VALUES ($1,$2,$3) RETURNING * ",[body.brand_image, body.brand_code, body.brand_name],
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

  getAllModels: async (req, callback) => {
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
          "SELECT count(*) as numRows FROM models WHERE is_deleted=0",
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
            "SELECT models.*,brands.brand_name FROM models INNER JOIN brands ON models.brand_id=brands.id WHERE models.is_deleted=0 ORDER BY ID DESC LIMIT " +
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

  createModel: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
      //   sql.query(
      //     "INSERT into models (brand_id,model_code,model_name) VALUES (?,?,?)",
      //     [body.brand_id, body.model_code, body.model_name],
      //     (err, sqlResult) => {
      //       resolve(sqlResult);
      //     }
      //   );

      client.query(
        "INSERT INTO models (brand_id,model_code,model_name) VALUES ($1,$2,$3) RETURNING * ",[body.brand_id, body.model_code, body.model_name],
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

  getAllFuelTypes: async (req, callback) => {
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
          "SELECT count(*) as numRows FROM fuels WHERE is_deleted=0",
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
            "SELECT * FROM fuels WHERE is_deleted=0 ORDER BY ID DESC LIMIT " +
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

  createFuelType: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
      //   sql.query(
      //     "INSERT into fuels (fuel_name) VALUES (?)",
      //     [body.fuel_name],
      //     (err, sqlResult) => {
      //       resolve(sqlResult);
      //     }
      //   );
      client.query(
        "INSERT INTO fuels (fuel_name) VALUES ($1) RETURNING * ",[body.fuel_name],
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
};