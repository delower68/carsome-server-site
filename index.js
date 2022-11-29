const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require("stripe")(process.env.STRIPE_SECRET);


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
        const paymentsCollection = client.db('CarSome-DB').collection('payment');


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



        // data load by electricCar 
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
        




        //for payment 
        app.get('/bookings/:id', async(req, res)=>{
            const id = req.params.id ;
            const  query = {_id: ObjectId(id)};
            const result = await bookingsCollection.findOne(query);
            res.send(result);
        })

        
    // FOR PAYMENT Server
    app.post('/create-payment-intent', async(req, res)=>{
        const booking = req.body ;
        const price = booking.resale_price ;
        const amount = price * 100 ;
        
  
        const paymentIntent = await stripe.paymentIntents.create({
          currency: "USD",
          amount: amount ,
          "payment_method_types": [
            "card"
          ],
          
        })
        res.send({
          clientSecret: paymentIntent.client_secret 
        })
      })
  

         // payment info saVE 
    app.post('/payments', async(req, res)=>{
        const payment = req. body ;
        const result = await paymentsCollection.insertOne(payment);
        const id = payment.bookingId ;
        const filter = {_id: ObjectId(id)};
        const updatedDoc={
          $set: {
            paid: true,
            transactionId: payment.transactionId
          }
        }
        const updateResult = await bookingsCollection.updateOne(filter, updatedDoc)
        res.send(updateResult); 
  
      })





        // delete a booking from UI 
        app.delete('/bookings/:id', async(req, res)=>{
            const id = req.params.id ;
            const  filter = {_id: ObjectId(id)};
            const result = await bookingsCollection.deleteOne(filter);
            res.send(result);
        })

        // delete a seller or buyer from UI 
        app.delete('/users/:id', async(req, res)=>{
            const id = req.params.id ;
            const  filter = {_id: ObjectId(id)};
            const result = await usersCollection.deleteOne(filter);
            res.send(result);

        })


        // get all buyer 
        app.get("/users", async (req, res) => {
            const query = {}
            const users = await usersCollection.find(query).toArray()
            res.send(users)
          });


          //for  get  each seller products 
app.get("/myProducts", async (req, res) => {
    const email = req.query.email;
    console.log(email);
    const query = {
      email: email,
    };
    const products = await productCollection.find(query).toArray();
    res.send(products);
  });



        
        //   make admin a user 
        app.put('/users/admin/:id', async(req, res)=>{
            // const decodedEmail = req.decoded.email ;
            // const query = {email: decodedEmail}
            // console.log(req.decoded.email);
            // const  user = await usersCollection.findOne(query)
            // if(user.type !== "admin"){
            //     return res.status(403).send({message: "Forbidden access"})
            // }
            const id = req.params.id ;
            const filter = {_id: ObjectId(id)};

            const options = {upsert: true};

            const updatedDoc = {
                $set:{
                    type: "admin"
                }
            }
            const result = await usersCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })


        // single buyer or seller delete server 

        app.get('/users/:id', async(req, res)=>{
            const  id = req.params.id ;
            const filter = {_id: ObjectId(id)};
            const result = await usersCollection.findOne(filter)
            res.send(result);
        })


        app.delete('/users/:id', async(req, res)=>{
            const id = req.params.id ;
            const filter = {_id: ObjectId(id)};
            console.log(id)
            const result = await usersCollection.deleteOne(filter);
            res.send(result); 
        })


        // a single product sent to the database 
        app.post('/products', async(req, res)=>{
            const product = req.body ;
            const result = await productCollection.insertOne(product);
            res.send(result);
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