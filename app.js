//CopyRight Tag Solutions pvt.ltd 2013
var express = require('express')
    , routes = require('./routes')
    , productRoutes = require('./routes/product')
    , user = require('./routes/user')
    , http = require('http')
    , https = require('https')
    , fs = require('fs')
    , path = require('path')
    , mongoose = require('mongoose')
    , TwitterStrategy = require('passport-twitter').Strategy
    , LinkedInStrategy = require('passport-linkedin').Strategy
    ,nodemailer = require("nodemailer")
    ,graph = require('fbgraph')
    ,twitter_update_with_media = require('./routes/twitter_update_with_media');

var mongo = require('mongodb');
var BSON = mongo.BSONPure;

var app = express();

var config = require('./config');

var User = require('./models/user');

var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy;

var TWITTER_CONSUMER_KEY = "aX5yhKcQU5YHQLKS08vRgg";
var TWITTER_CONSUMER_SECRET = "cX37DlsPLeW55zXAmrs1douL4B87Yd536EutZ2QqpA";
 var TWITTER_ACCESS_TOKEN = "1657184522-i1xfC0Gju1oVnCY04CfMDJFeJHr5LyRfVrVIofM";
var TWITTER_ACCESS_TOKEN_SECRET = "Zn8hPlyaTGZE0DTdgJbcHEuUItOTT30v2sL6KyxLd9PQD";

var LINKEDIN_API_KEY = "77970wh9b8os92";
var LINKEDIN_SECRET_KEY = "XTj0TNj0eTbnU5cS";
var selectedImage;

var tuwm = new twitter_update_with_media({
    consumer_key: TWITTER_CONSUMER_KEY,
    consumer_secret: TWITTER_CONSUMER_SECRET,
    token: TWITTER_ACCESS_TOKEN,
    token_secret: TWITTER_ACCESS_TOKEN_SECRET
});

//set up the passport

passport.serializeUser(function(user, done){
    done(null, user._id);
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
});

//strategy for facebook login
passport.use(new FacebookStrategy({
        clientID: config.development.fb.appId,
        clientSecret: config.development.fb.appSecret,
        callbackURL: config.development.fb.url+ '/' +'fbauthed',
        passReqToCallback: true
    },
    function(req,accessToken, refreshToken, profile, done){
        process.nextTick(function(){
            var query =  User.findOne({ 'fbId': profile.id });
            query.exec(function(err, oldUser){
                if (oldUser){
                    console.log('Existing User:' + oldUser.name + ' found and logged in!');
                    graph.setAccessToken(accessToken);
                    var wallPost = {
                        message: "Property Details...", //TODO: Please put the right information before go to production.
                        picture: config.development.fb.url+'/images/'+selectedImage
                    };
                     graph.post('me' + "/feed?access_token="+accessToken, wallPost, function(err, res) {
                         if(err) throw err;
                         // returns the post id
                             console.log(res); // { id: xxxxx}
                         });
                    done(null, oldUser);
                    /*console.log ("accesToken ", accessToken);
                    console.log ("refreshToken", refreshToken);
                    console.log ("profile", profile);*/
                }else{
                    var newUser = new User();
                    newUser.fbId = profile.id;
                    if(profile.name !== 'undefined'){
                    newUser.name = profile.displayName;}
                    else if(profile.username !== 'undefined'){
                    newUser.username = profile._json.username;}
                    else if(profile.first_name !== 'undefined'){
                    newUser.first_name = profile._json.first_name;}
                    else if(profile.last_name !== 'undefined'){
                    newUser.last_name = profile._json.last_name;}
                    else if(profile.email !== 'undefined'){
                    newUser.email = profile.emails[0].value;}
                    else if(profile.gender !== 'undefined'){
                    newUser.gender = profile.gender;}
                    else if(profile.birthday !== 'undefined'){
                    newUser.birthday = profile._json.birthday;}
                    else if(typeof profile.hometown !== 'undefined'){
                    newUser.hometown = profile._json.hometown.name;}
                    else if(typeof profile.location !== 'undefined'){
                    newUser.location = profile._json.location.name; }
                    else(profile.friends !== 'undefined')
                    newUser.friends = profile._json.friends;
                    newUser.save(function(err){
                        if(err) throw err;
                        console.log('New user: ' + newUser.name + ' created and logged in!');
                        done(null, newUser);
                    });
                }
            });
        });
    }
));

//strategy for twitter login
passport.use(new TwitterStrategy({
        consumerKey: TWITTER_CONSUMER_KEY,
        consumerSecret: TWITTER_CONSUMER_SECRET,
        //callbackURL: "https://206.72.207.4:3030/auth/twitter/callback"
        callbackURl: config.development.twitter.url
    },
    function(token, tokenSecret, profile, done) {
        process.nextTick(function () {
            var query = User.findOne({ 'twitterId': profile.id });
            query.exec(function (err, oldUser) {
                console.log(oldUser);
                if(oldUser) {
                    tuwm.post('Property details...', path.join(__dirname,'/public/images/'+selectedImage), function(err, response) {
                        if (err) {
                            console.log(err);
                            }
                        console.log('Posted the property on Twitter successfully.');
                        });
                    console.log('User: ' + oldUser.name + ' found and logged in!');
                    done(null, oldUser);
                    console.log ("profile", profile);
                } else {
                    var newUser = new User();
                    newUser.twitterId = profile.id;
                    if(profile.name !== 'undefined'){
                    newUser.name = profile.displayName;}
                    else if(profile.username !== 'undefined'){
                    newUser.username = profile.username;}
                    else(profile.location !== 'undefined')
                    newUser.location = profile._json.location;
                    newUser.save(function(err) {
                        if(err) {throw err;}
                        console.log ("profile", profile);
                        console.log('New user: ' + newUser.name + ' created and logged in!');
                        done(null, newUser);
                    });
                }
            });
        });
    }
));


//strategy for linkedin login
passport.use(new LinkedInStrategy({
        consumerKey: LINKEDIN_API_KEY,
        consumerSecret: LINKEDIN_SECRET_KEY,
        //callbackURL: "https://206.72.207.4:3030/auth/linkedin/callback"
        callbackURL: config.development.linkedin.url
    },
    function(token, tokenSecret, profile, done) {
        process.nextTick(function () {
            var query = User.findOne({ 'linkedinId': profile.id });
            query.exec(function (err, oldUser) {
                console.log(oldUser);
                if(oldUser) {
                    console.log('User: ' + oldUser.name + ' found and logged in!');
                    done(null, oldUser);
                    console.log ("profile", profile);
                } else {
                    var newUser = new User();
                    if(profile.name !== 'undefined'){
                    newUser.name = profile.displayName;}
                    newUser.linkedinId = profile.id;
                    newUser.save(function(err) {
                        if(err) {throw err;}
                        console.log ("profile", profile);
                        console.log('New user: ' + newUser.name + ' created and logged in!');
                        done(null, newUser);
                    });
                }
            });
        });
    }
));

//Random Comment in file
// all environments
app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('sslport', process.env.SSLPORT || 3030);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.compress());
    app.use(express.cookieParser());
    app.use(express.bodyParser({keepExtensions:true, uploadDir:path.join(__dirname,'public/images')}));
    app.use(express.session({ secret: '09efbe9a8a1fb61432451259ddc5bf76'}));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.methodOverride());
    app.use (function (req, res, next) {
        if(req.secure) {
            next();
        } else {
            res.redirect('https://' + req.host +':'+app.get('sslport')+ req.url);
        }
    });
    app.use(app.router);
    app.use(express.static(__dirname + "/public"));
});


http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

//mongoose.connect('mongodb://localhost/LSR');
var options = {
    key: fs.readFileSync('domain.tld.key'),
    cert: fs.readFileSync('domain.tld.crt')
};

https.createServer(options,app).listen(app.get('sslport'), function(){
    console.log('Express server listening on port ' + app.get('sslport'));
});


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log('Successfully mongodb is connected');
});

//console.log(productSchema.LatLng.latitude[0])

app.get('/', productRoutes.home);
app.get('/properties', productRoutes.index);
app.get('/properties/add', productRoutes.new);
app.post('/properties', productRoutes.create);
app.param('name', productRoutes.pass);
app.get('/properties/:name', productRoutes.show);
app.get('/properties/:name/edit', productRoutes.edit);
app.put('/properties/:name', productRoutes.update);
app.delete('/properties/:name', productRoutes.remove);
app.post('/search',productRoutes.search);
app.get('/search',productRoutes.getsearch);
app.get('/search/:propid',productRoutes.searchProp);
app.get('/searchList',productRoutes.searchList);
app.get('/s',function(req,res){
    res.render('s.html');
});
app.get('/locationmap/:propid',productRoutes.locationMap);

app.get('/compare',productRoutes.compare);

//Routing
app.post('/lsrLogin',user.index);
app.get('/signup', user.signup);
app.post('/signedup', user.signedup);
app.get('/index1',function(req,res){
    res.render('indexnew.jade')
});

//facebook login
app.get('/', routes.index);
app.get('/fbauth', passport.authenticate('facebook', {/*display:'popup',*/ scope: ['email', 'user_birthday', 'user_hometown', 'user_friends','read_stream','publish_stream'] }));
app.get('/loggedin', ensureLoggedIn('/'), routes.index);
app.get('/fbauthed', passport.authenticate('facebook',{
    failureRedirect: '/',
    successRedirect: '/'
}));


//twitter login
app.get('/auth/twitter',
    passport.authenticate('twitter'));

app.get('/auth/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });


//linkedin login
app.get('/auth/linkedin',
    passport.authenticate('linkedin'));

app.get('/auth/linkedin/callback',
    passport.authenticate('linkedin', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });



app.get('/logout', function(req, res){
    req.logOut();
    res.redirect('/');
});

app.get('/settings', ensureAuthenticated,  function(req, res){
    res.render('settings')
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
};

app.get('/sendmail/images/:image/:price/:beds/:area/:built/:baths/:type', function(req, res){
    var transport = nodemailer.createTransport("SMTP", {
        service: "Gmail",
        auth: {
            user: "tagtest123456@gmail.com",
            pass: "tag123456"
        }
    });
    var mailOptions = {
        from: "chinna.wip@gmail.com",
        to: "chinna_wip@yahoo.com",
        subject: "Property Details...",
        //text: req.params.image,
        html:
            +'<div id="price"><p style="padding-left:0">Price: '+req.params.price+'</p></div><div id="property">'+
                +'<div id="property_details"><h4>Property Details</h4></div><div id="property_types"><ul><li id="beds">Beds: '+req.params.beds+
                +'</li><li id="area">Area: '+req.params.area+'</li><li>Built: '+req.params.built+'</li><li id="baths">Baths: '+req.params.baths+'</li><li id="type">Type: '+req.params.type+
                +'</li></ul></div></div>'+
                +'<div id="description_prop"><h4>Descriptions</h4><p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat.</p></div>'+
                +'</div></div></li></ul></div>',
        attachments: [{
            filePath: path.join(__dirname,'/public/images/'+req.params.image)
        }]
    };
    transport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
            return;
        }else {
            transport.close();
        //   console.log('Mail sent...');
        }
        res.redirect('/search');
});
});

app.get('/sharefacebook/:image',function(req,res){
    selectedImage = req.params.image;
    res.redirect('/fbauth');
});

app.get('/sharetwitter/:image', function(req, res){
    selectedImage = req.params.image;
    res.redirect('/auth/twitter');
});
app.get('/sharelinkedin/:image', function(req, res){
    selectedImage = req.params.image;
    res.redirect('/auth/linkedin');
});

