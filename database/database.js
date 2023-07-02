const {Client} = require('pg');

const client =  new Client ({
    host: "localhost",
    port: 5432,  
    user: "postgres",
    password: "Ertiga@2324",
    database: "avah"
})

client.connect ();

const getEmployees = (req,res) =>{
    client.query('SELECT * FROM demo_table', (err,result) =>{
        if(err){
            throw err
        }
        res.json({
            data: result.rows
        })
    })
}

module.exports = {getEmployees,client}