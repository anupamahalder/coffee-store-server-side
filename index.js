const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5050;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


//middleware
app.use(cors());
app.use(express.json());

// run server on root 
app.get('/',(req, res)=>{
    res.send('Coffee making server is running!');
})

app.listen(port,()=>{
    console.log(`Coffee server is running on port: ${port}`);
})


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
    const coffeeCollection = client.db('coffeeDB').collection('coffee'); 

    // Read data from database
    app.get('/coffee', async(req, res)=>{
      // setting a pointer to our coffeeCollection and find with no parameter
      const cursor = coffeeCollection.find();
      // make all items in an array 
      const result = await cursor.toArray();
      // send the response to client 
      res.send(result);
    })
    // create a post api to send data from client to server 
    app.post('/coffee',async(req,res)=>{
        const newCoffee = req.body;
        console.log(newCoffee);
        const result = await coffeeCollection.insertOne(newCoffee);
        // send response to client 
        res.send(result);
    })
    // create a delete api 
    app.delete('/coffee/:id', async(req, res)=>{
      const id = req.params.id;
      // based on whch field we want to find data and delete that data 
      const query = {_id: new ObjectId(id)};
      // now deleteone from collection 
      const result = await coffeeCollection.deleteOne(query);
      //send response to client
      res.send(result);
    })
    //to update coffee data we need a specific data of that using id
    app.get('/coffee/:id', async(req, res)=>{
      const id = req.params.id;
      // using the line below this can able to find data from mongodb 
      const query = {_id: new ObjectId(id)};
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


