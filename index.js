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
        const usersCollection = client.db('CarSome-DB').collection('users');
        const bookingsCollection = client.db('CarSome-DB').collection('bookings');


        // all data load from mongodb 
        app.get('/products', async(req, res)=>{
            const query = {}
            const products = await productCollection.find(query).toArray();
            res.send(products);
        });

        // data load by microbus 
        app.get('/microbus', async(req, res)=>{
            // const query = {}
            const products = await productCollection.find({categoryName: "microbus"}).toArray();
            res.send(products);
        });


        // data load by luxuryCar
        app.get('/luxuryCar', async(req, res)=>{
            // const query = {}
            const products = await productCollection.find({categoryName: "luxuryCar"}).toArray();
            res.send(products);
        });



        // data load by electicCar 
        app.get('/electricCar', async(req, res)=>{
            // const query = {}
            const products = await productCollection.find({categoryName: "electicCar"}).toArray();
            res.send(products);
        });


        //post an user data in db
        app.post("/users",  async (req, res) => {
        const user = req.body;
        const result = await usersCollection.insertOne(user);
        res.send(result);
        });

        // post a booking data in md 
        app.post('/bookings', async(req, res)=>{
            const bookings = req.body;
            const result = await bookingsCollection.insertOne(bookings);
            res.send(result);
        })


        // get all booking data from mongodb 
        app.get('/bookings', async(req, res)=>{
            const email = req.query.email ;
            const query = {email: email};
            const bookings = await bookingsCollection.find(query).toArray();
            res.send(bookings);
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