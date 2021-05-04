const mongoose = require('mongoose');
const Campground = require('../models/campground')
const cities = require('./citiesIn')
const { descriptors, places } = require('./seedHelpers')


mongoose.connect('mongodb://localhost:27017/yelpCamp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
    .then(() => {
        console.log('Database connected')
    })
    .catch(() => {
        console.log('Oops!!!error')
    })

const ran2 = (arr) => arr[Math.floor(Math.random() * arr.length)];


const newDb = async () => {
    await Campground.deleteMany({});
    for (i = 0; i <= 199; i++) {
        const price = Math.floor(Math.random() * 20) + 10;

        const camp = new Campground({
            author: '60842562a71ea6142865a8c7',
            location: `${cities[i].name}, ${cities[i].state}`,
            title: `${ran2(descriptors)}, ${ran2(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni debitis animi culpa tenetur rerum reprehenderit sed ipsum vero, temporibus odio nulla aliquid aspernatur hic molestias aut. Architecto nesciunt necessitatibus maxime.',
            price,
            geometry: {
                type: 'Point',
                coordinates: [cities[i].lon, cities[i].lat]
            },
            images: {
                url: 'https://res.cloudinary.com/mani9790/image/upload/v1619880978/yelpCamp/edvaslofwdlmryjxlrcc.jpg',
                filename: 'yelpCamp/edvaslofwdlmryjxlrcc'
            }
        })
        await camp.save();
    }

}

newDb()
    .then(() => {
        console.log('Data Updated')
        mongoose.connection.close();
    })