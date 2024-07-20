// Databse connection to PGSQL
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

client.connect()
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Connection error', err.stack));

module.exports = client;




// const {Client} = require('pg');

// const client =  new Client ({
//     host: "localhost",
//     port: 5432,  
//     user: "postgres",
//     password: "Ertiga@2324",
//     database: "avah"
// })

// client.connect ();

// const getEmployees = (req,res) =>{
//     client.query('SELECT * FROM demo_table', (err,result) =>{
//         if(err){
//             throw err
//         }
//         res.json({
//             data: result.rows
//         })
//     })
// }

// module.exports = {getEmployees,client}