const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const express = require('express');
const cors = require('cors');


const app = express();
const port = process.env.PORT || 8000 ;


// middle ware 
app.use(cors());
app.use(express.json());



// mondodb inisital code 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tkreg8z.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



// main function
async function run(){
    try{
        const productCollection = client.db('CarSome-DB').collection('products');

        // all data load from mongodb 
        app.get('/products', async(req, res)=>{
            const query = {}
            const products = await productCollection.find(query).toArray();
            res.send(products);
        })

    }
    finally{

    }
}
run().catch(err => console.log(err))
























app.get('/', (req, res )=>{
    res.send('Carsome server is running')
});


app.listen(port , ()=>{
    console.log(`CarSome running on ${port}`);
})