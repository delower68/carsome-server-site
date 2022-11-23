require('dotenv').config();
const express = require('express');
const cors = require('cors');


const app = express();
const port = process.env.PORT || 8000 ;


// middle ware 
app.use(cors());
app.use(express.json());






app.get('/', (req, res )=>{
    res.send('Carsome server is running')
});


app.listen(port , ()=>{
    console.log(`CarSome running on ${port}`);
})