
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

//require enviroment variables
require("dotenv").config();
const { setupDB } = require("./db/setup");
const db = require('./db')

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

//include DB setup and wait for async function to finish
(async () => {
    console.log(process.env.DB_URL)
    await setupDB();
})();


app.get('/', (req, res) => {
    res.send('Hello World!')
 })

 app.get('/get_contracts', (req, res)=>{


    res.json({
        status:"success"
    })


 })
 app.post('/post_constracts', (req, res)=>{



    res.json({
        status:"success"
    })
 })

  
app.listen(port, () => {
    console.log(`App api listening on port ${port}`)
})