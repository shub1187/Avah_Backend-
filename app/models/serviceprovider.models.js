const sql = require("../config/db.config");

module.exports = {
  login: async (req, callback) => {
    try {
      const data = await new Promise((resolve) => {
        sql.query(
          "SELECT * FROM service_providers where email=? AND password=?",
          [req.body.email, req.body.password],
          (err, sqlResult) => {
            resolve(sqlResult);
          }
        );
      });
      console.log(data)
      if (data && data.length > 0) {
        return callback(false, data[0]);
      } else {
        return callback(true, "No data found");
      }
    } catch (e) {
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

  getAllEmployee: async (req, callback) => {
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
          "SELECT count(*) as numRows FROM employees WHERE is_deleted=0",
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
            "SELECT * FROM employees WHERE is_deleted=0 ORDER BY ID DESC LIMIT " +
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

  createEmployee: async (req, callback) => {
    try {
      var body = req.body;
      const data = await new Promise((resolve) => {
        sql.query(
          "INSERT into employees (first_name,last_name,email,mobile,password) VALUES (?,?,?,?,?)",
          [
            body.first_name,
            body.last_name,
            body.email,
            body.mobile,
            body.password,
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
};