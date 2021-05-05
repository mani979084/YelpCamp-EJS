const { cloudinary } = require('../cloudinary');
const Campground = require('../models/campground')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const token = process.env.MAP_TOKEN;
const geoCode = mbxGeocoding({ accessToken: token });



module.exports.renderIndex = async (req, res) => {
    const campg = await Campground.find({});
    if (!campg) {
        req.flash('error', 'Campground not found');
        return res.redirect('/');
    }
    res.render('./campground/home', { campg })
}

module.exports.renderNewCamp = (req, res) => {
    res.render('./campground/new')
}

module.exports.createCamp = async (req, res) => {
    const camp = await new Campground(req.body.campground);
    camp.author = req.user._id;
    let error = '';

    const geo = await geoCode.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    })
        .send();
    if (!geo.body.features.length) {
        const er = req.flash('error', 'Sorry Please Enter a Valid Location!')
        camp.geometry = { type: 'Point', coordinates: [78.9629, 20.5937] }
        error += er;
    } else {
        const editGeo = geo.body.features[0].geometry;
        camp.geometry = editGeo;
    }

    let msg = 'Successfully '

    if (!req.files.length) {
        camp.images.push({ url: 'https://res.cloudinary.com/mani9790/image/upload/v1619622308/thumbnail-default_v7bdna.jpg', filename: 'default' });
        msg += 'Created with Default Photos'
    } else {
        camp.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
        msg += 'Created with New Photos'
    }

    if (!error) {
        req.flash('success', msg);
    }
    await camp.save();
    res.redirect(`/campground/${camp._id}`);


}

module.exports.renderShow = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate({
        path: 'reviews',
        populate: 'author'

    }).populate('author');
    if (!camp) {
        req.flash('error', 'Campground not found');
        return res.redirect('/campground');
    }
    res.render('./campground/show', { camp })
}

module.exports.renderEdit = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render('./campground/edit', { camp })
}

module.exports.editCamp = async (req, res) => {
    const { id } = req.params;
    let error = '';
    const camp = await Campground.findByIdAndUpdate(id, req.body.campground);
    if (req.body.campground.location !== camp.location) {
        const geo = await geoCode.forwardGeocode({
            query: req.body.campground.location,
            limit: 1
        })
            .send();
        if (!geo.body.features.length) {
            const er = req.flash('error', 'Sorry please enter a valid location')
            error += er;
        } else {
            const editGeo = geo.body.features[0].geometry;
            camp.geometry = editGeo;
            await camp.save();
        }
    }

    if (!error) {
        req.flash('success', 'Successfully Updated');
    }
    res.redirect(`/campground/${camp._id}`);
}

module.exports.editphoto = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    let msg = 'Successfully ';

    if (req.files.length) {
        if (camp.images[0].filename === 'default') {
            await camp.updateOne({ $pull: { images: { filename: 'default' } } })
            msg += 'Removed Default and '
        }
        const img = req.files.map(f => ({ url: f.path, filename: f.filename }))
        camp.images.push(...img);
        await camp.save();
        msg += 'Updated with New Photos '
    } else {
        msg += 'Updated '
    }
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        const ncamp = await Campground.findById(id);
        msg += 'and Deleted Selected Images '
        if (!ncamp.images.length) {
            ncamp.images.push({ url: 'https://res.cloudinary.com/mani9790/image/upload/v1619622308/thumbnail-default_v7bdna.jpg', filename: 'default' });
            await ncamp.save();
            msg += '!'
        }
    }
    req.flash('success', msg);
    res.redirect(`/campground/${camp._id}/edit`);
}

module.exports.renderEditphoto = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render('campground/editphoto', { camp })
}

module.exports.deleteCamp = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndDelete(id);
    if (camp.images.length) {
        for (let img of camp.images) {
            await cloudinary.uploader.destroy(img.filename);
        }
    }
    req.flash('success', 'Successfully deleted');
    res.redirect('/campground')
}
