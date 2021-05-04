const Campground = require('../models/campground')
const Review = require('../models/review')

module.exports.redirectShow = (req, res) => {
    const { id } = req.params;
    res.redirect(`/campground/${id}`)
}

module.exports.createReview = async (req, res) => {
    const review = await new Review(req.body.review);
    review.author = req.user._id;
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
        req.flash('error', 'Unable to Leave your Comment!');
        return res.redirect('/campground');
    }
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success', 'Successfully your Comment Added!')
    res.redirect(`/campground/${id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { reviewid, id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    const review = await Review.findByIdAndDelete(reviewid);
    req.flash('success', 'Successfully Deleted');
    res.redirect(`/campground/${id}`);
}