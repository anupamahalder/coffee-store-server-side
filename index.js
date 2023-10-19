const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5050;
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();


//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@usermanagement.ycasaad.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // create a post api to send data from client to server 
    app.post('/coffee',async(req,res)=>{
        const newCoffee = req.body;
        console.log(newCoffee);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


// run server on root 
app.get('/',(req, res)=>{
    res.send('Coffee making server is running!');
})

app.listen(port,()=>{
    console.log(`Coffee server is running on port: ${port}`);
})