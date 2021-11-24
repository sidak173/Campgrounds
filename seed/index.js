const mongoose = require('mongoose');

require('dotenv').config();

const Campground = require('../models/campgrounds')
const cities = require('./cities');
const { descriptors, places } = require('./helpers');

mongoose.connect(process.env.DB_URL);  // or mongodb://localhost:27017/campgrounds


// File for seeding our database

const db = mongoose.connection;

const seedDb = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 100; ++i) {
        const random406 = Math.floor(Math.random() * 405); // 406 cities total
        const r1 = Math.floor(Math.random() * descriptors.length);
        const r2 = Math.floor(Math.random() * places.length);
        const price = Math.floor(Math.random() * 30) + 10;
        const camp = new Campground({
            location: `${cities[random406].city},${cities[random406].admin_name}`,
            title: `${descriptors[r1]} ${places[r2]}`,
            images: [{ url: "https://res.cloudinary.com/dy7obwtqp/image/upload/v1637707425/Campgrounds/ybb2h3o2qrnc9xsbmxml.jpg", filename: "Campgrounds/udoiusgbjikhyyk4uxz1" },
            { url: "https://res.cloudinary.com/dy7obwtqp/image/upload/v1637460059/Campgrounds/su1ujlezvwh6t8kvpetz.jpg", filename: "Campgrounds/cjhhnitcfgteuxdy83z1" }
            ],
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Veritatis, repellat modi! Nam ab suscipit reprehenderit ut. Tenetur nihil animi dolorem maxime ratione nam culpa dicta quam exercitationem. Fuga, nobis cumque?',
            price: price,
            author: '619d471c404c1ece54c7285e',
            geometry: {
                type: 'Point',
                coordinates: [cities[random406].lng, cities[random406].lat]
            }
        })
        await camp.save()
    }
}

seedDb().then(() => {
    mongoose.connection.close();
});

