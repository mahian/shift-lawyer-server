const express = require('express');
const port = process.env.PORT || 5000;
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://shift-lawyer:${process.env.PASSWORD}@cluster0.pvcfvi2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const serviceCollection = client.db('shift-lawyer').collection('services');

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.post('/add-service', async (req, res) => {
            
        })
    }
    finally { }
}
run().catch(err => console.log(err));


app.get('/', (req, res) => {
    res.send('hellow')
})

app.listen(port, () => {
    console.log(`your app is running at ${port}`);
});