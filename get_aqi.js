import { fetchAQIData } from "./fetch_aqi_data.js";
import express from "express";
const app = express();
const port = 3000;

// Define your city coordinates
const city = {
    name: "delhi-dwarka",
    lat: 28.597564488447873, // latitude
    lon: 77.05655435814133, // longitude
};

// Define your API key
app.get("/", async (req, res) => {
    // const { lat, lon } = req.query;
    const { lat, lon } = city;
    if (!lat || !lon) {
        return res
            .status(400)
            .json({ error: "Latitude and longitude are required" });
    }
    const data = await fetchAQIData(city);
    res.json({
        location: city.name,
        latitude: lat,
        longitude: lon,
        time: data.list[0].dt,
        aqi: data.list[0].main.aqi,
        co: data.list[0].components.co,
        no: data.list[0].components.no,
        no2: data.list[0].components.no2,
        o3: data.list[0].components.o3,
        so2: data.list[0].components.so2,
        pm2_5: data.list[0].components.pm2_5,
        pm10: data.list[0].components.pm10,
        nh3: data.list[0].components.nh3,
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
