const express = require("express");
const app = express();
const cors = require("cors");
require(`dotenv`).config();
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());
//
// console.log(process.env.DB_PASS);

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.irm8dks.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const menuCollection = client.db(`Bistro_Boss`).collection(`menu`);
    const testimonialCollection = client.db(`Bistro_Boss`).collection(`review`);
    const cartCollection = client.db(`Bistro_Boss`).collection(`carts`);

    // get the menu from database
    app.get("/menu", async (req, res) => {
      const result = await menuCollection.find().toArray();
      res.send(result);
    });
    // get the testimonials from database
    app.get("/testimonials", async (req, res) => {
      const result = await testimonialCollection.find().toArray();
      res.send(result);
    });
    // get the cart data from database
    app.get("/carts", async (req, res) => {
      const email = req.query.email;
      const query = { usrEmail: email };
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    });

    // post the cart data to database
    app.post("/carts", async (req, res) => {
      const cartData = req.body;
      const result = await cartCollection.insertOne(cartData);
      res.send(result);
    });

    // delete cart data from server
    app.delete(`/carts/:id`, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//
app.get("/", (req, res) => {
  res.send("boss is running");
});
app.listen(port, () => {
  console.log(`bistro boss is running on port: ${port}`);
});
