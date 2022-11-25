// ----- Database models
const { error } = require("pdf-lib");
const User = require("../models/user.js");

// ----- Ressources required
const catchAsync = require("../utilities/catchasync.js")

// ----- Controllers below
module.exports.renderLoginPage = function (req, res) {
    res.render("user/login.ejs");
}

module.exports.renderUserPage = function (req, res) {
    res.render("user/profile.ejs");
}

module.exports.userLogin = function (req, res) {
    console.log(req.rawHeaders)
    const redirectUrl = req.session.returnTo || "/";
    req.flash("success", "Welcome back !")
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

module.exports.userLogout = function (req, res) {
    req.logout(
        function () {
            req.flash("success", "You have been logged out !");
            res.redirect("/");
        }
    );
};

module.exports.userRegister = catchAsync(async function (req, res) {
    try {
        if (req.body.createEmailInput !== req.body.createConfirmEmailInput) {
            return next(err);
        }
        const username = req.body.createUsernameInput
        const email = req.body.createEmailInput
        const password = req.body.createPasswordInput
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, function (err) {
            if (err) {
                return next(err);
            }
        });
        req.flash("success", "Welcome ! 👋")
        res.redirect("/")
    }
    catch (error) {
        req.flash('error', error.message);
        res.redirect('/user/login');
    }
    res.redirect('/user/login');
})

module.exports.userRecover = function (req, res) {
    console.log(req.body)
}

module.exports.userChangeUsername = catchAsync(async function (req, res) {
    console.log(req.user)
    const paramsUserId = req.params.userId
    const currentUserId = req.user.id
    console.log(paramsUserId, currentUserId)
    const matchingUser = await User.findById(paramsUserId)

    const { inputNewUsername, inputNewUsernameConfirm } = req.body
    if (inputNewUsername !== inputNewUsernameConfirm) {
        req.flash("error", "Usernames provided are not matching")
        return res.redirect(`/user/${paramsUserId}`)
    }

    if (!matchingUser) {
        req.flash("error", "The user ID provided does not match")
        return res.redirect("/")
    }
    if (paramsUserId !== currentUserId && !matchingUser.isAdmin) {
        req.flash("error", "You can't change the username of another user !")
        return res.redirect(`/user/${currentUserId}`)
    }

    let updatedEntry = {
        username: inputNewUsername
    }

    try {
        await User.findByIdAndUpdate(paramsUserId, updatedEntry)
        req.logout(function (err) {
            if (err) {
                console.log(err)
                req.flash("error", "There's been an error during the logout, but your username has been succesfully changed.")
                return res.redirect(`/user/login`)
            }
            req.flash("success", "Username changed successfully, you can login again with your new username")
            return res.redirect(`/user/login`)
        });
        // req.flash("success", "Username changed successfully, you can login again with your new username")
        // return res.redirect(`/user/login`)
    } catch (error) {
        req.flash("error", "There's been an error, the username has not been updated")
        console.log(error)
        return res.redirect(`/user/${paramsUserId}`)
    }
})

module.exports.userChangeEmail = catchAsync(async function (req, res) {
    const paramsUserId = req.params.userId
    const currentUserId = req.user.id
    const matchingUser = await User.findById(paramsUserId)

    const { inputNewEmail, inputNewEmailConfirm } = req.body

    if (inputNewEmail !== inputNewEmailConfirm) {
        req.flash("error", "Emails provided are not matching")
        return res.redirect(`/user/${paramsUserId}`)
    }

    if (!matchingUser) {
        req.flash("error", "The user ID provided does not match")
        return res.redirect("/")
    }
    if (paramsUserId !== currentUserId && !matchingUser.isAdmin) {
        req.flash("error", "You can't change the email of another user !")
        return res.redirect(`/user/${currentUserId}`)
    }

    let updatedEntry = {
        email: inputNewEmail
    }

    try {
        await User.findByIdAndUpdate(paramsUserId, updatedEntry)
        req.flash("success", "The email has been updated")
        return res.redirect(`/user/${paramsUserId}`)
    } catch (error) {
        req.flash("error", "There's been an error, the email has not been updated")
        console.log(error)
        return res.redirect(`/user/${paramsUserId}`)
    }
})

module.exports.userChangePassword = catchAsync(async function (req, res) {
    const paramsUserId = req.params.userId
    const currentUserId = req.user.id
    const matchingUser = await User.findById(currentUserId)
    const { inputCurrentPassword, inputNewPassword, inputNewPasswordConfirm } = req.body
    if (!currentUserId) {
        req.flash("error", "The ID provided does not match")
        return res.redirect("/start")
    }
    if (paramsUserId !== currentUserId && !matchingUser.isAdmin) {
        req.flash("error", "You can't change the password of another user !")
        return res.redirect(`/user/${currentUserId}`)
    }
    if (inputNewPassword !== inputNewPasswordConfirm) {
        req.flash("error", "Passwords are not matching")
        return res.redirect(`/user/${paramsUserId}`)
    }
    await matchingUser.changePassword(inputCurrentPassword, inputNewPassword, function (err) {
        if (err) {
            if (err.name === 'IncorrectPasswordError') {
                req.flash("error", "The current password provided is incorrect")
                return res.redirect(`/user/${paramsUserId}`)
            } else {
                console.log(err)
                req.flash("error", "There's been an error")
                return res.redirect(`/user/${paramsUserId}`)
            }
        } else {
            req.logout(function (err) {
                if (err) {
                    console.log(err)
                    req.flash("error", "There's been an error during the logout, but your password has been succesfully changed.")
                    return res.redirect(`/user/login`)
                }
                req.flash("success", "Password changed successfully, you can login again with your new password")
                return res.redirect(`/user/login`)
            });
        }
    })
})