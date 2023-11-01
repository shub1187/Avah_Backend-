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

    // customer registeration/sign up api

    register: async (req, callback) => {
        try {
          var body = req.body
          const query = 'INSERT INTO customer_registration (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING name, email';
          const values = [body.name, body.email, body.password, 'customer'];
          
          const data = await new Promise((resolve) => {
            client.query(query, values, (err, result) => {
              if (err) {
                if(err.code == 23505){
                    return callback(true, 'Email id already exists');
                }else {
                return callback(true, 'Customer Registration failed');
                }
              }
              console.log('Customer registered successfully!');
              return callback(false, result.rows);
            });
          });
        } catch (error) {
        //   console.error('Error registering cutomer:', error);
          return callback(true, error.message);
        }
      },

      login: async (req, callback) => {
        try {
          const login_query = {text: 'SELECT  name, customer_id, role, email FROM customer_registration WHERE email = $1 AND password = $2 AND role = $3',
          values: [req.body.email, req.body.password, req.body.role]}
        //   console.log( login_query)
            const data = await new Promise((resolve) => {
              client.query(
                login_query, 
                (err,result)=>{
                  // console.log("result",result)
                if (result.rows.length==1) {  // Login successfull for registered users 
                  return callback(false, result);
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
      // Prompting profile completion of customer after successfull registeration
      profile_completion: async (req, callback) => { // As per new inputs
        try {
          var body = req.body;
          
          // Calculate the full_address by concatenating address, city, state, and pin_code
          const full_address = `${body.address} ${body.city} ${body.state} ${body.pin_code}`;
          
          // Define the SQL query to update the profile
          const query = 'UPDATE customer_registration SET address = $1, city = $2, state = $3, pin_code = $4, full_address = $5, mobile_number = $6 WHERE email = $7 RETURNING name, email';
          
          const values = [body.address, body.city, body.state, body.pin_code, full_address, body.mobile_number, body.email];
          
          const data = await new Promise((resolve) => {
            client.query(query, values, (err, result) => {
              if (err) {
                return callback(true, 'Profile Updation failed');
              } else {
                if (result.rows.length > 0) {
                  console.log(result.rows[0])
                  // Profile updated successfully
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
      

// Vehcile addition by customer into his account but this api will give error if customer has not completed its profile. Because personal details will have null value
      vehicleRegistration: async (req, callback) => {
        try {
          var body = req.body;
          // console.log(" ln 98", body )
          // First, fetch the customer_id based on name and email
          const customerQuery = 'SELECT customer_id,name,email,full_address,mobile_number FROM customer_registration WHERE email = $1';
          const customerValues = [body.email];
      
          const customerResult = await new Promise((resolve) => {
            client.query(customerQuery, customerValues, (err, result) => {
              if (err) {
                return callback(true, 'Customer not found');
              }
      
              if (result.rows.length === 0) {
                return callback(true, 'Customer not found');
              }
      
              // Extract the customer_id from the query result
              const customer_id = result.rows[0].customer_id; // Need to deal with null error if customer has not completed his profile completion
              const email = result.rows[0].email;
              const full_address = result.rows[0].full_address;
              const mobile_number = result.rows[0].mobile_number;
              console.log("ln 115 vehcileRegisteration api cust_id is : ", result.rows[0])
              const name = result.rows[0].name;
      
              // Now, insert vehicle details using the fetched customer_id
              const vehicleQuery = 'INSERT INTO customer_vehicle_data (customer_id, vehicle_number, vehicle_type, brand, model, customization, fuel_type, chassis_number,name,full_address,email,mobile_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *';
              const vehicleValues = [customer_id, body.vehicle_number, body.vehicle_type, body.brand, body.model, body.customization, body.fuel_type, body.chassis_number,name,full_address,email,mobile_number];
              client.query(vehicleQuery, vehicleValues, (err, result) => {
                if (err) {
                  console.log('ln 132', err)
                  if (err.code === '23505') {
                    return callback(true, `${name}, vehicle registration failed because the vehicle with vehicle number  ${body.vehicle_number} has already been registered`);
                  } else {
                    console.log("ln 126" , err.message)
                    return callback(true, 'Vehicle registration failed');
                  }
                }
      
                console.log('Vehicle registered successfully!');
                console.log("ln 132",result)
                var data = {
                  vehicle_number :  result.rows[0].vehicle_number,
                  customer_name : name
                }
                console.log(data)
                return callback(false, data);
              });
            });
          });
        } catch (error) {
          return callback(true, error.message);
        }
      },

      // vehicle_search for creating appointment
      vehicle_search: async (req, callback) => {
        try {
          const {VehicleNumber} = req.query;       
          const query = 'SELECT * FROM customer_vehicle_data WHERE vehicle_number = $1';
          const values = [VehicleNumber]; 
          // console.log("ln 162 ",query)
          const data = await new Promise((resolve) => {
            client.query(query, values, (err, result) => {
              if (err) {
                return callback(true, "Vehicle Search failed ",err);
              } else if (result.rows.length > 0) {
                return callback(false, result.rows);
              } else {
                return callback(true, 'Vehicle search failed');
              }
            });
          });
        } catch (error) {
          return callback(true, error.message);
        }
      },

      get_customer_vehicles: async (req, callback) => { // This is for showing data inside table.
        try {
          // console.log("ln 181", req.query)
          const { customer_id, q, _page, _limit } = req.query;
          // console.log("ln 176:", customer_id, _page, _limit, q);
      
          // Calculate the OFFSET based on the _page and _limit parameters
          const offset = (_page - 1) * _limit;
      
          // Construct a SQL query with pagination
          let queryText = `
            SELECT vehicle_number, vehicle_type, brand, model, customization, fuel_type 
            FROM customer_vehicle_data 
            WHERE customer_id = $1
          `;
      
          const queryParams = [customer_id];
      
          if (q) { // This is for search functionality
            queryText += `
              AND (vehicle_number ILIKE $${queryParams.length + 1}
                OR vehicle_type ILIKE $${queryParams.length + 2}
                OR brand ILIKE $${queryParams.length + 3}
                OR model ILIKE $${queryParams.length + 4}
                OR customization ILIKE $${queryParams.length + 5}
                OR fuel_type ILIKE $${queryParams.length + 6})
            `;
            for (let i = 0; i < 6; i++) {
              queryParams.push(`%${q}%`);
            }
          }
      
          queryText += ' LIMIT $' + (queryParams.length + 1) + ' OFFSET $' + (queryParams.length + 2);
          queryParams.push(_limit, offset);
      
          const getall_customer_vehicles = {
            text: queryText,
            values: queryParams,
          };
      
          const data = await new Promise((resolve) => {
            client.query(getall_customer_vehicles, (err, result) => {
              if (err) {
                return callback(true, 'Error retrieving customer vehicles');
              } else {
                if (result.rows.length === 0) {
                  return callback(true, 'No vehicles found for the customer');
                } else {
                  console.log("ln 200", result.rows);
                  return callback(false, result.rows);
                }
              }
            });
          });
        } catch (error) {
          return callback(true, error.message);
        }
      },


      get_customer_vehicle_numbers: async (req, callback) => { // This is for showing data inside table.
        try {
          // console.log("ln 181", req.query)
          const { customer_id} = req.query;
          // console.log("ln 176:", customer_id, _page, _limit, q);
          // Construct a SQL query with pagination
          const query = ' SELECT vehicle_number FROM customer_vehicle_data WHERE customer_id = $1';
          const values = [customer_id]; // Use '%' to match any characters after the entered partial number
      
          const data = await new Promise((resolve) => {
            client.query(query,values, (err, result) => {
              if (err) {
                return callback(true, 'Error retrieving customer vehicles');
              } else {
                if (result.rows.length === 0) {
                  return callback(true, 'No vehicles found for the customer');
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
      

      get_customer_profile_data: async (req, callback) => {
        try {
          console.log("Entered ln 197: get_profile_data", req)
          // Construct a SQL query to search for vehicles based on the partial vehicle number
          const query = 'SELECT name,email,full_address,mobile_number FROM customer_registration  WHERE email = $1';
          const values = [req.body.email]; // Use '%' to match any characters after the entered partial number
          console.log("ln 198",query)
          let button_name = ""
          const data = await new Promise((resolve) => {
            client.query(query, values, (err, result) => {
              console.log(result.rows)
              // return false
              if (err) {
                return callback(true, err);
              } else if(result.rows.length > 0) {
                // console.log("Ln 204 GET customer_profile",result.rows)
                if (result.rows[0].full_address != null && result.rows[0].mobile_number != null ){
                   button_name = "Update Profile"
                  console.log(button_name)
                } else {
                  button_name = "Complete your Profile"
                  console.log(button_name)
                }
                let data = {
                  name : result.rows[0].name,
                  email : result.rows[0].email,
                  address : result.rows[0].full_address,
                  mobile_number : result.rows[0].mobile_number,
                  button_name : button_name
                }

                return callback(false, data);
              }
            });
          });
        } catch (error) {
          return callback(true, error.message);
        }
      },

      getAllCitiesPerState: async (req, callback) => { // Required while registering sp and while updating customer profile
        try {
          const getAllCitiesQuery = {
            text: 'SELECT state, city FROM cities',
          };
      
          const data = await new Promise((resolve) => {
            client.query(getAllCitiesQuery, (err, result) => {
              if (err) {
                console.error(err);
                return callback(true, "Unable to fetch cities by state");
              } else {
                const cityStateMap = {};
      
                result.rows.forEach(row => {
                  const { state, city } = row;
                  if (!cityStateMap[state]) {
                    cityStateMap[state] = [];
                  }
                  cityStateMap[state].push(city);
                });
      
                const resultArray = Object.keys(cityStateMap).map(state => {
                  return { [state]: cityStateMap[state] };
                });
      
                return callback(false, resultArray);
              }
            });
          });
        } catch (e) {
          console.error("Error:", e);
          return callback(true, e.message);
        }
      },

      getAllStates: async (req, callback) => { // Required while registering sp and while updating customer profile
        try {
          const getAllStates = {
            text: 'SELECT DISTINCT state FROM cities',
          };
      
          const data = await new Promise((resolve) => {
            client.query(getAllStates, (err, result) => {
              if (err) {
                console.error(err);
                return callback(true, "Unable to fetch unique state names");
              } else {
                const AllStates = result.rows.map(row => row.state);
                console.log(AllStates); 
                return callback(false, AllStates);
              }
            });
          });
        } catch (e) {
          console.error("Error:", e);
          return callback(true, e.message);
        }
      },

      getAllSpAsPerCustomerCity: async (req, callback) => { // Get All SP as per customer City needed to create appointment via customer panel
        try {
          const {city,state} = req.query
          const query = 'SELECT business_name,sp_id FROM approved_service_providers WHERE city = $1 AND state = $2'; // state will take care of same city name in multiple states
          const values = [city,state]; // Use '%' to match any characters after the entered partial number
          
          const data = await new Promise((resolve) => {
            client.query(query, values, (err, result) => {
              if (err) {
                return callback(true, 'There are No service providers in your city');
              } else if(result.rows.length > 0) {
                // const listOfSp = result.rows.map(item => item.business_name);
                console.log(result.rows)
                return callback(false, result.rows);
              }else {
                return callback(true, 'There are No service providers in your city');
              }
            });
          });
        } catch (error) {
          return callback(true, error.message);
        }
      },
      // Test - 04

      getAllSpDetailsAsPerCustomerCity: async (req, callback) => {
        try {
          const queryForCities =
            'SELECT DISTINCT city, state FROM approved_service_providers WHERE city IS NOT NULL AND state IS NOT NULL';
      
          const cityStateData = await new Promise((resolve) => {
            client.query(queryForCities, (err, result) => {
              if (err) {
                return callback(true, 'Error fetching cities and states');
              } else if (result.rows.length > 0) {
                return resolve(result.rows);
              } else {
                return callback(true, 'No cities and states found in the database');
              }
            });
          });
      
          const resulte = {};
      
          for (const { city, state } of cityStateData) {
            const queryForServiceProviders =
              'SELECT sp_id, business_name, business_address,business_contact FROM approved_service_providers WHERE city = $1 AND state = $2 AND sp_status <> $3';
            const values = [city, state, 'inactive'];
      
            const serviceProviderData = await new Promise((resolve) => {
              client.query(queryForServiceProviders, values, (err, result) => {
                if (err) {
                  return callback(
                    true,
                    `Error fetching service providers for ${city}, ${state}`
                  );
                } else if (result.rows.length > 0) {
                  const location = `${city} (${state})`;
                  resulte[location] = result.rows.map((row) => ({
                    sp_id: row.sp_id,
                    label: row.business_name,
                    value: row.business_name,
                    address: row.business_address,
                    sp_mobile : row.business_contact
                  }));
                  resolve();
                }
              });
            });
          }
      
          if (Object.keys(resulte).length > 0) {
            return callback(false,  resulte );
          } else {
            return callback(true, 'No active service providers found in the database');
          }
        } catch (error) {
          return callback(true, error.message);
        }
      },
      
      
      
      
      
      
      

      getAllCities: async (req, callback) => { // We are not using this This will be required in Customer Homepage/Landing page to select his city out of 4029
        try {
          const getAllCities = {
            text: 'SELECT city FROM cities',
          };
      
          const data = await new Promise((resolve) => {
            client.query(getAllCities, (err, result) => {
              if (err) {
                console.error(err);
                return callback(true, "Unable to fetch cities");
              } else {
                // console.log(result.rows)
                const listOfCities = result.rows.map(item => ({ label: item.city }));
                return callback(false, listOfCities);
              }
            });
          });
        } catch (e) {
          console.error("Error:", e);
          return callback(true, e.message);
        }
      },

      getAllApprovedSpCities: async (req, callback) => {
        try {
          const getAllCities = {
            text: 'SELECT DISTINCT city, state FROM approved_service_providers WHERE city IS NOT NULL AND state IS NOT NULL',
          };
      
          const data = await new Promise((resolve) => {
            client.query(getAllCities, (err, result) => {
              if (err) {
                console.error(err);
                return callback(true, "Unable to fetch cities");
              } else {
                const listOfCities = result.rows.map(item => ({ label:`${item.city} (${item.state})` }));
                // const listOfCities = result.rows.map(item => `${item.city} (${item.state})`);
                return callback(false, listOfCities);
              }
            });
          });
        } catch (e) {
          console.error("Error:", e);
          return callback(true, e.message);
        }
      },
      

      getSPProfileData: async (req, callback) => {
        try {
          const {sp_id,business_name} = req.query;
          console.log("ln 389", sp_id,business_name)
      
          const getSpDetails = {
            text: 'SELECT sp_id, business_name, full_address,business_contact FROM approved_service_providers WHERE sp_id = $1 AND business_name = $2',
            values: [sp_id,business_name],
          };
      
          const data = await new Promise((resolve) => {
            client.query(getSpDetails, (err, result) => {
              if (err) {
                console.error(err);
                return callback(true, "Unable to fetch Service Provider Details");
              } else {
                return callback(false, result.rows);
              }
            });
          });
        } catch (e) {
          console.error("Error:", e);
          return callback(true, e.message);
        }
      },
      

      createAppointment:async (req, callback) => { //creates appointment
        try {
          var body = req.body
          console.log("ln 691", body)
          const query = 'INSERT INTO appointment (customer_id,sp_id,name,business_name,vehicle_number,vehicle_type, brand,model,fuel_type, email, mobile_number, pickup_drop,pickup_address,appointment_date,appointment_time,appointment_status,has_customer_cancelled,has_sp_cancelled,jobcard_status,cust_cancellation_note,sp_cancellation_note,is_reschedule_allowed,customization,has_sp_rejected,sp_rejection_note,estimate_status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26) RETURNING *';
          const values = [body.customer_id,body.sp_id,body.name,body.business_name,body.vehicle_number,body.vehicle_type, body.brand,body.model,body.fuel_type, body.email, body.mobile_number, body.pickup_drop,body.pickup_address,body.appointment_date,body.appointment_time,"Pending",false,false,"Pending",null,null,false,body.customization,false,null,'Pending'];
          
          const data = await new Promise((resolve) => {
            client.query(query, values, (err, result) => {
              if (err) {
                console.error('Error in customer creating Appointment:', err);
                return callback(true, 'Appointment creation failed');
              }
              console.log('Appointment created successfully!');
              return callback(false, result.rows);
            });
          });
        } catch (error) {
          console.error('Error in creating Appointment:', error);
          return callback(true, error.message);
        }
      },

      cancelAppointment:async (req, callback) => { //creates appointment
        try {
          var body = req.body
          console.log("ln 691", body)
          const query = 'UPDATE appointment SET appointment_status = $1, has_customer_cancelled =$2, cust_cancellation_note =$3 WHERE appointment_id = $4 AND jobcard_status = $5  RETURNING *';
          const values = ['cancelled',true,body.cust_cancellation_note,body.appointment_id,'Pending'];
          
          const data = await new Promise((resolve) => {
            client.query(query, values, (err, result) => {
              if (err) {
                console.error('Error in cancelling  Appointment from Customer Portal:', err);
                return callback(true, 'Failed to cancel appointment');
              }
              console.log('Appointment cancelled successfully!');
              return callback(false, 'Appointment cancelled successfully');
            });
          });
        } catch (error) {
          console.error('Error in cancelling Appointment:', error);
          return callback(true, error.message);
        }
      },

      getAllPendingApprovedAppointment: async (req, callback) => {
        try {
          console.log("Entered 1573 pending Appointment")
          const { customer_id, q, _page, _limit } = req.query;
          let queryText = 'SELECT appointment_id,customer_id,sp_id,vehicle_number,vehicle_type,brand,model,fuel_type,pickup_drop,pickup_address,appointment_time,appointment_status,jobcard_status,customization,estimate_status,appointment_date,sp_name,sp_address,sp_email,sp_contact,sp_rejection_note,cust_cancellation_note,sp_cancellation_note FROM appointment_details WHERE customer_id = $1 AND (appointment_status = $2 OR appointment_status = $3)';
          const queryParams = [customer_id, 'Approved', 'Pending'];
      
          if (q) { // This is for search functionality
            queryText += ' AND (sp_name ILIKE $4 OR vehicle_number ILIKE $4 OR vehicle_type ILIKE $4 OR appointment_status ILIKE $4)';
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
                return callback(true, "Unable to fetch the pending and approved appointment details");
              } else {
                // const results = {
                //   results: result.rows,
                //   pagination: {
                //     currentPage: parseInt(_page) || 1,
                //     totalPages: 1,
                //     totalRows: result.rowCount.toString(),
                //   },
                // };
                return callback(false, result.rows);
              }
            });
          });
        } catch (e) {
          return callback(true, e.message);
        }
      },

      getAllRejectedCancelledAppointment: async (req, callback) => {
        try {
          console.log("Entered 1573 pending Appointment")
          const { customer_id, q, _page, _limit } = req.query;
          let queryText = 'SELECT appointment_id,customer_id,sp_id,vehicle_number,vehicle_type,brand,model,fuel_type,pickup_drop,pickup_address,appointment_time,appointment_status,jobcard_status,customization,estimate_status,appointment_date,sp_name,sp_address,sp_email,sp_contact,sp_rejection_note,cust_cancellation_note,sp_cancellation_note FROM appointment_details WHERE customer_id = $1 AND (appointment_status = $2 OR appointment_status = $3)';
          const queryParams = [customer_id, 'Rejected By SP', 'Cancelled By Customer'];
      
          if (q) { // This is for search functionality
            queryText += ' AND (sp_name ILIKE $4 OR vehicle_number ILIKE $4 OR vehicle_type ILIKE $4 OR appointment_status ILIKE $4)';
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
                return callback(true, "Unable to fetch the pending and approved appointment details");
              } else {
                // const results = {
                //   results: result.rows,
                //   pagination: {
                //     currentPage: parseInt(_page) || 1,
                //     totalPages: 1,
                //     totalRows: result.rowCount.toString(),
                //   },
                // };
                return callback(false, result.rows);
              }
            });
          });
        } catch (e) {
          return callback(true, e.message);
        }
      }

}