// var behaviorService = require('./service/behaviorService');
var Behavior = require('./models/behavior');
var mongoose = require('mongoose');

mongoose.plugin(schema => { schema.options.usePushEach = true });
module.exports = function(app, passport) {

    app.get('/', userLogoutCheck, function(req, res) {
        res.render('index.ejs');
    });

    app.get('/login', userLogoutCheck, function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    app.post('/login', userLogoutCheck, passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));
    app.post('/Test',function (req,res) {
        console.log(req.body);
    });
    app.get('/signup', userLogoutCheck, function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });

    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.get('/profile', userLogInCheck, function(req, res) {
        res.cookie('useremail', req.user.local.email, { httpOnly: true });
        res.render('profile.ejs', {
            user: req.user,
            id :req.user.local.email
        });
    });


    app.get('/getLog', function(req, res) {
        mongoose.createConnection('mongodb://localhost:27017/AdaptiveWeb', function(err, db) {
            if (err) {
                console.log(err);
                throw err;
            }

            // data = '';
            console.log(req.cookies.useremail);
            var id = req.cookies.useremail;
            Behavior.find({userId: id}, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(data);
                    res.render('log.ejs',{
                        data: data,
                        user: id
                    });

                }
            })
        });
    });
    app.get('/layout', function(req, res) {

        mongoose.createConnection('mongodb://localhost:27017/AdaptiveWeb', function(err, db) {
            if (err) {
                console.log(err);
                throw err;
            }

            // data = '';
            console.log(req.cookies.useremail);
            var id = req.cookies.useremail;
            Behavior.find({userId: id}, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(data);
                    res.render('layout.ejs',{
                        data: data,
                        user: id
                    });

                }
            })
        });
    });

    app.get('/MyLogin', function(req, res) {

        mongoose.createConnection('mongodb://localhost:27017/AdaptiveWeb', function(err, db) {
            if (err) {
                console.log(err);
                throw err;
            }

            // data = '';
            console.log(req.cookies.useremail);
            var id = req.cookies.useremail;
            Behavior.find({}, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(data);
                    res.render('tip.ejs',{
                        data: data,
                        userId: id
                    });
                    // res.render('log.jade', {data: data});

                }
            })
        });
    });

    app.post('/behavior', function(req, res) {
        // data = req.body.request;
        console.log(req.body.request);

        // console.log(req.body.timeStamp);
        if (req.cookies.useremail && req.body.request.hasOwnProperty('timestamp')
            && req.body.request.hasOwnProperty('url') && req.body.request.hasOwnProperty('activity') ) {
            var Link = req.body.request.url;
            var TimeStamp = req.body.request.timestamp;
            var Activity = req.body.request.activity;
            var data = null;
            var tags = req.body.request.hasOwnProperty('tags') ? req.body.request.tags : null;
            if(Activity === 'UpVote!')
                data = "Tags of Questions are :  " + req.body.request.tags;
            if(Activity === 'DownVote!')
                data = "Tags of Questions are :  " + req.body.request.tags;
            if(Activity === 'BookMark!')
                data = "Tags of Questions are :  " + req.body.request.tags;
            if(Activity === 'ClickOnQuestion!')
                data = "Text of the question is:"+Link;
            if(Activity === 'Copy')
                data = "Copied Text: " + req.body.request.text; //Selected Text
            if(Activity === 'PageBrowse!')
                data = "Browsed Link:" + req.body.request.url;
            console.log()
            const log =  Behavior({
                Link: Link,
                dateTime: TimeStamp,
                activity: Activity,
                tags:tags,
                data: data,
                userId: req.cookies.useremail
            });

            console.log(log);

            log.save(function (err, post) {
                if(err) {
                    console.log(err);
                } else {
                    res.send("Success");
                }
            })
        } else {
            console.log(req.body);
            res.send(req.body);
        }
        
    });
    app.get('/interest',function (req,res) {
        res.render('interest');
    });
    app.get('/logout', function(req, res) {
        req.logout();
        res.clearCookie('useremail');
        res.redirect('/login');
    });

    app.get('/ActivityTracker', function(req, res) {

        mongoose.createConnection('mongodb://localhost:27017/AdaptiveWeb', function(err, db) {
            if (err) {
                console.log(err);
                throw err;
            }
            console.log(req.cookies.useremail);
            var id = req.cookies.useremail;
            Behavior.find({}, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    res.render('ActivityTracker.ejs',{
                        data: data,
                        user: id
                    });
                    // res.render('log.jade', {data: data});

                }
            })
        });
    });
    app.get('/DailyUsage', function(req, res) {

        mongoose.createConnection('mongodb://localhost:27017/AdaptiveWeb', function(err, db) {
            if (err) {
                console.log(err);
                throw err;
            }

            // data = '';
            console.log(req.cookies.useremail);
            var id = req.cookies.useremail;
            Behavior.find({}, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(data);
                    res.render('DailyUsage.ejs',{
                        data: data,
                        userId: id
                    });
                }
            })
        });
    });
    function userLogInCheck(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/');
    }

    function userLogoutCheck(req, res, next) {
        if (!req.isAuthenticated())
            return next();
        res.redirect('/profile');
    }
}
