const express = require('express');
const port = process.env.PORT || 5000;
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://shift-lawyer:${process.env.PASSWORD}@cluster0.pvcfvi2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const serviceCollection = client.db('shift-lawyer').collection('services');
        const reviewCollection = client.db('shift-lawyer').collection('reviews');


        // get data
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/reviews', async (req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = {serviceId : id};
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        app.get('/limitedServices', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        // post data
        app.post('/add-service', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result);
        });

        app.post('/add-review', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })


        // delete data
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await serviceCollection.deleteOne(query);
            res.send(service)
        })

        // update/put data
        app.put('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = req.body;
            const option = { upsert: true };
            const updatedService = {
                $set: {
                    title: service.title,
                    imgUrl: service.imgUrl,
                    description: service.description
                }
            }
            const result = await serviceCollection.updateOne(query, updatedService, option);
            res.send(result);
        })

    }
    finally { }
}
run().catch(err => console.log(err));


app.get('/', (req, res) => {
    res.send('server is running...')
})

app.listen(port, () => {
    console.log(`your app is running at ${port}`);
});