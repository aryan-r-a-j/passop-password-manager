const express = require('express')
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv') // or import 'dotenv/config' if you're using ES6
const bodparser = require('body-parser');
const bodyParser = require('body-parser');
const cors=require('cors')

dotenv.config()

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const app = express()
app.use(express.json())
const dbName = 'passop';
const port = process.env.PORT || 3000;
app.use(bodyParser.json())
app.use(cors({
  origin: "https://passop-password-manager-frontend.onrender.com"
}))

client.connect();

//  get all paswords
app.get('/', async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.find({}).toArray();
    //console.log('Found documents =>', findResult);
    res.json(findResult)
})



//    save a passwords
app.post('/', async (req, res) => {
    const password=req.body
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.insertOne(password);
    res.send({success:true, result:findResult})
})


//     delete a passwords
app.delete('/', async (req, res) => {
    const password=req.body
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.deleteOne(password);
    res.send({success:true, result:findResult})
})

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})