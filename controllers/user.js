const User = require('../models/user')

module.exports.renderRegister = (req, res) => {
    res.render('./form/register')
}

module.exports.registerUser = async (req, res) => {
    try {
        const { email, password, username } = req.body;
        const user = new User({
            email,
            username
        })
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Successfully Registered!!!');
            res.redirect('/campground');
        })

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register')
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('./form/login')
}

module.exports.loginUser = (req, res) => {
    req.flash('success', 'Welcome Back!');
    const url = req.session.path || '/campground';
    delete req.session.path;
    res.redirect(url);
}

module.exports.logoutUser = (req, res) => {
    req.logout();
    req.flash('success', 'Successfully Logged Out')
    res.redirect('/campground')
}