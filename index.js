const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();


const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try{
        const userCollection = client.db('shift-lawyer').collection('services');

        app.get('/services', async (req, res)=>{
            const query = {};
            const cursor = userCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });
    }
    finally{}
}
run().catch(err => console.log(err));


app.get('/', (req, res)=>{
    res.send('hellow')
})

app.listen(port);