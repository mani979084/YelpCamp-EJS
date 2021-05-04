const mongoose = require('mongoose');
const Review = require('./review');

const Schema = mongoose.Schema;



const imageSchema = new Schema({
    url: String,
    filename: String
})

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_380')
})

const opts = { toJSON: { virtuals: true } };

const campgroundSchema = new Schema({
    title: String,
    price: Number,
    images: [imageSchema],
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true

        },
        coordinates: {
            type: [Number],
            required: true
        }

    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

}, opts);


campgroundSchema.virtual('properties.popupMarkup').get(function () {
    return `<br><strong><a href='/campground/${this._id}'>${this.title}</a></strong>
    <p>${this.description.substring(0, 20)}...</p>
    `;
})

campgroundSchema.post('findOneAndDelete', async (doc) => {
    if (doc) {
        await Review.deleteMany({ _id: { $in: doc.reviews } })
    }
})

module.exports = mongoose.model('Campground', campgroundSchema);
