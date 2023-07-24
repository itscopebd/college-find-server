

const express = require("express");
const app = express();
require('dotenv').config()
const cors = require('cors');
const { MongoClient, ServerApiVersion, Collection, ObjectId } = require('mongodb');

app.use(cors())
app.use(express.json())


app.get("/", (req, res) => {
  res.send("Rofiq")
})


const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.loltiyt.mongodb.net/?retryWrites=true&w=majority`;



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
    const college_list = client.db("college-find").collection("college-list")
    const apply_information = client.db("college-find").collection("apply-information")
    const research = client.db("college-find").collection("research")



    // find college list api

    app.get("/college-list", async (req, res) => {
      const result = await college_list.find().toArray();
      res.send(result);
      // console.log(result)

    })


    // details college api 

    app.get("/details/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const result = await college_list.findOne(query);
      res.send(result)
    })


    // apply information api 

    app.post("/save-apply-info", async (req, res) => {

      const data = req.body;
      const email = data.admissionEmail;
      const subject = data.subject;

      // const check = apply_information.find(
      //   {
      //     $and: [
      //       {
      //         admissionEmail: email
      //       },
      //       {
      //         subject: subject
      //       }
      //     ]
      //   }
      // );
      // if (check) {
      //   return res.send({ message: "You Already Applyed This Subject ! " })
      // }
      
        const result = await apply_information.insertOne(data);
        res.send(result)
    


    })
    // student research api 
    app.get("/research-data", async (req, res) => {

      const result = await research.find().toArray()
      res.send(result)

    })

    app.get("/research-details/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const result = await research.findOne(query);
      res.send(result)
    })



    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.listen(3000, () => {
  console.log("Server is running! ")
})