const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
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
    const userCollection = client.db('coffeeDB').collection('user');

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
    // create an api to update data 
    app.put('/coffee/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const option = {upsert: true};
      // take data from body of request 
      const updatedCoffee = req.body;
      const coffee = {
        $set:{
          // name the fileds that we want to set/update 
          name: updatedCoffee.name,
          supplier: updatedCoffee.supplier, 
          category: updatedCoffee.category, 
          availableQuantity: updatedCoffee.availableQuantity, 
          taste: updatedCoffee.taste, 
          details: updatedCoffee.details, 
          photo: updatedCoffee.photo
        }
      }
      const result = await coffeeCollection.updateOne(filter, coffee, option);
      res.send(result);
    })

    // --------------------user related API's----------------------

    app.post('/user',async(req, res)=>{
      // take data which come from client side 
      const user = req.body;
      console.log(user);
      // add data to backend 
      const result = await userCollection.insertOne(user);
      // send result as a response to client 
      res.send(result); 
    })

    // To give user related information to read from client we need GET operation 
    app.get('/user',async(req, res)=>{
      const cursor = userCollection.find();
      const users = await cursor.toArray();
      // send response to client with array of objects 
      res.send(users);
    })
    //delete operation for a specific user id
    app.delete('/user/:id', async(req, res)=>{
      // get id using params 
      const id = req.params.id;
      // to make understand this id to mongodb we will create query which will be an object and object will touch which field (object will target _id from database)
      const query = {_id: new ObjectId(id)};
      // deleteOne based on query 
      const result = await userCollection.deleteOne(query);
      res.send(result);
    })
    // update data of logged at 
    app.patch('/user', async(req, res)=>{
      // client side will send user 
      const user = req.body;
      // email is unique for each user 
      const filter = {email: user.email};
      const updatedDoc = {
        $set:{
          lastLoggedAt: user.lastLoggedAt
        }
      }
      const result = await userCollection.updateOne(filter, updatedDoc);
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


