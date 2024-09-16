const express = require("express");
const app = express();

const bodyparser = require("body-parser");
const { MongoClient, ObjectId } = require("mongodb");

app.use(bodyparser.json());

const url = "mongodb+srv://jennyhoikka:fGUUjof5nVEdPCVR@cluster0.vbb4z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const dbName = "kirjarekisteri";
const bookCollection = "kirja";

const portti = 3000;

const connectToMongo = async () => {
  const client = new MongoClient(url, { useUnifiedTopology: true });

  try {

    await client.connect();
    
    console.log("Yhteys tietokantaan muodostettu");

    const db = client.db(dbName);
    const kirjaKokoelma = db.collection(bookCollection);

    app.get("/kirjat", async (req, res) => {
        try {
          const kirjat = await kirjaKokoelma.find().toArray();
          res.json(kirjat);
        } catch (err) {
          console.error("Tietojen hakeminen epäonnistui", err);
          res.status(500).json({ error: "Tietojen hakeminen epäonnistui" });
        }
      });

    app.listen(portti, () => {
      console.log(`Palvelin käynnistyi porttiin ${portti}`);
    });
  } catch (err) {
    console.error("Yhteys tietokantaan epäonnistui", err);
  }
};

connectToMongo();
