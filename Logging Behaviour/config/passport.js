var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = require('../app/models/user');

mongoose.plugin(schema => { schema.options.usePushEach = true });
module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function(req, email, password, done) {
        console.log("In local signup , email, password",email,password);
        process.nextTick(function() {
            User.findOne({'local.email': email}, function (err, user) {
                if (err) {
                    console.log(err);
                    return done(err);
                }
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    console.log("USer not found so creating a new");
                    var newUser = new User();
                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password);
                    newUser.save(function (err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    }));

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function(req, email, password, done) {
        User.findOne({ 'local.email': email }, function(err, user) {
            if (err)
                return done(err);

            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.'));

            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
            var d = new Date();
            var a = new Date();
            var Days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
            var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            var year = a.getFullYear();
            var month = months[a.getMonth()];
            var date = a.getDate();
            var hour = a.getHours();
            var min = a.getMinutes();
            var sec = a.getSeconds();
            var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
            console.log(time);
            user.loginHistory.push(time);
            user.save(function(err) {
                if (err)
                    throw err;
                return done(null, user);
            });
            return done(null, user);
        });

    }));

};
