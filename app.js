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
    , nodemailer = require("nodemailer")
    , graph = require('fbgraph')
    , twitter_update_with_media = require('./routes/twitter_update_with_media')
    , OAuth = require('oauth').OAuth
    , request = require('request');

var mongo = require('mongodb');
var BSON = mongo.BSONPure;

var app = express();

var config = require('./config');

var User = require('./models/user');

var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy;

//var TWITTER_CONSUMER_KEY = "aX5yhKcQU5YHQLKS08vRgg";
//var TWITTER_CONSUMER_SECRET = "cX37DlsPLeW55zXAmrs1douL4B87Yd536EutZ2QqpA";
//var TWITTER_ACCESS_TOKEN = "1657184522-i1xfC0Gju1oVnCY04CfMDJFeJHr5LyRfVrVIofM";
//var TWITTER_ACCESS_TOKEN_SECRET = "Zn8hPlyaTGZE0DTdgJbcHEuUItOTT30v2sL6KyxLd9PQD";

var TWITTER_CONSUMER_KEY = "52Lcfw9QgMhKm7BqcPtw";
var TWITTER_CONSUMER_SECRET = "tuQMpdCPVjwdSKEj7ZffqK0WY9DQ6dlthbYg80hdjw";
var TWITTER_ACCESS_TOKEN = "2267178872-PMLEtySIQJPg4VSz9PTewZKabdskvCK1q8HybvC";
var TWITTER_ACCESS_TOKEN_SECRET = "B1FYIaHBpdNOld5pSeIVQscIvjFbvaMA4NSV5jSfQPHnl";


var LINKEDIN_API_KEY = "7548htje2eqzby";
var LINKEDIN_SECRET_KEY = "XRFs9G1wHbRviTQK";
var LINKEDIN_ACCESS_TOKEN = "5d7acc65-50e1-4dfe-9e0a-5e65755c8357";
var LINKEDIN_ACCESS_TOKEN_SECRET = "d50b99d8-b56b-4b1b-b11c-9f386e79879a";

//var LINKEDIN_API_KEY = "77970wh9b8os92";
//var LINKEDIN_SECRET_KEY = "XTj0TNj0eTbnU5cS";

var selectedImage,
    shareOnFbClicked = '',
    propPrice = '0', propBeds = '0', propArea = '0', propBuilt = '0', propBaths = '0', propType = '0',
    oaLinkedin = new OAuth("https://api.linkedin.com/uas/oauth/requestToken",
        "https://api.linkedin.com/uas/oauth/accessToken",
        LINKEDIN_API_KEY, LINKEDIN_SECRET_KEY, "1.0A", "https://www.mysite.com:3030/oauth/callback", "HMAC-SHA1");
    user.userName = 'Hi Guest';

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
var fbAccessToken = '';

//strategy for facebook login
passport.use(new FacebookStrategy({
        clientID: config.development.fb.appId,
        clientSecret: config.development.fb.appSecret,
        callbackURL: config.development.fb.url+ '/' + 'fbauthed',
        passReqToCallback: true
    },
    function(req,accessToken, refreshToken, profile, done){
        process.nextTick(function(){
            var query =  User.findOne({ 'fbId': profile.id });
            query.exec(function(err, oldUser){
                if (oldUser){
                    console.log('Existing User:' + oldUser.name + ' found and logged in!');
                    fbAccessToken = accessToken;
                    graph.setAccessToken(accessToken);
                    var wallPost = {
                        message: "Property Details...", //TODO: Please put the right information before go to production.
                        picture: config.development.fb.url+'/images/'+selectedImage,
                        description: 'Price: '+propPrice + ' , Beds: '+ propBeds + ' , Area: '+ propArea+ ' , Built: '+ propBuilt + ' , Baths: '+ propBaths + ' , Type: '+ propType
                    };
                     graph.post('me' + "/feed?access_token="+accessToken, wallPost, function(err, res) {
                         if(err) {
                            console.log('FaceBook Posting Error:' + err);
                            //throw err;
                        }
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
                        if(err) {
                            console.log(err);
                            //throw err;
                        }
                        console.log('FB New user: ' + newUser.name + ' created and logged in!');
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
        callbackURL: config.development.twitter.url
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
//                    console.log ("profile", profile);
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
                        if(err) {
                            console.log(err);
                            //throw err;
                        }
                        console.log ("profile", profile);
                        console.log('Twitter New user: ' + newUser.name + ' created and logged in!');
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
                      luwm.post('Property details...', path.join(__dirname,'/public/images/'+selectedImage), function(err, response) {
                      if (err) {
                        console.log(err);
                      }
                    });
                    done(null, oldUser);
                    console.log ("profile", profile);
                } else {
                    var newUser = new User();
                    if(profile.name !== 'undefined'){
                    newUser.name = profile.displayName;}
                    newUser.linkedinId = profile.id;
                    newUser.save(function(err) {
                        if(err) {
                            console.log(err);
                            //throw err;
                        }
                        console.log ("profile", profile);
                        console.log('LinkedIn New user: ' + newUser.name + ' created and logged in!');
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
app.get('/locationmap/:propid', productRoutes.locationMap);

app.get('/compare',productRoutes.compare);

app.get('/logout', user.logout);

//Routing
app.post('/lsrLogin',user.index);
app.post('/login',user.index);
app.get('/signup', user.signup);
app.post('/signedup', user.signedup);
app.get('/index1',function(req,res){
    res.render('indexnew.jade')
});

//facebook login
app.get('/', routes.index);
//app.get('http://www.facebook.com', routes.index);

app.get('/fbauth', passport.authenticate('facebook', {/*display:'popup',*/ scope: ['email', 'user_birthday', 'user_hometown', 'user_friends','read_stream', 'publish_stream'] }));
app.get('/loggedin', ensureLoggedIn('/'), routes.index);

//app.get('/fbauthed', passport.authenticate('facebook',{
//    failureRedirect: '/',
//    successRedirect: '/'
//}));

app.get('/fbauthed', function(req, res, next) {
  passport.authenticate('facebook', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      console.log('custome callback...'+ user.username);
      if(shareOnFbClicked){
        shareOnFbClicked = '';
        return res.redirect('http://facebook.com');
      } else {
        return res.redirect('/');
      }
    });
  })(req, res, next);
});

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

app.get('/sendignupmail', function(req, res){
    var transport = nodemailer.createTransport("SMTP", {
        service: "Gmail",
        auth: {
            user: "tagtest123456@gmail.com",
            pass: "tag123456"
        }
    });
    var mailOptions = {
        from: "tagtest123456@gmail.com",
        to: "tagtest123456@gmail.com",
        subject: "Welcome to LSR portal",
 //       text: req.params.image,
        html:
'<div><p style="padding-left:0">Hi  '+user.userName +'</p></div>'+
'<div><p>Welcome and thanks to signup to LSR portal. Hope you get what you came here for.</p></div>'        
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


app.get('/sendmail/images/:image/:price/:beds/:area/:built/:baths/:type', function(req, res){
    var transport = nodemailer.createTransport("SMTP", {
        service: "Gmail",
        auth: {
            user: "tagtest123456@gmail.com",
            pass: "tag123456"
        }
    });
    var mailOptions = {
        from: "tagtest123456@gmail.com",
        to: "tagtest123456@gmail.com",
        subject: "Property Details...",
 //       text: req.params.image,
        html: 
'<div id="price"><p style="padding-left:0">Price: '+req.params.price+'</p></div><div id="property">'+
'<div id="property_details"><h4>Property Details</h4></div><div id="property_types"><ul><li id="beds">Beds: '+req.params.beds+
'</li><li id="area">Area: '+req.params.area+'</li><li>Built: '+req.params.built+'</li><li id="baths">Baths: '+req.params.baths+'</li><li id="type">Type: '+req.params.type+
'</li></ul></div></div>'+
'<div id="description_prop"><h4>Descriptions</h4><p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat.</p></div>'+
'</div></div></li></ul></div>',
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


app.get('/sharefacebook/:image/:price/:beds/:area/:built/:baths/:type', function(req, res){
    shareOnFbClicked = 'true';
    selectedImage = req.params.image;
    propPrice = (req.params.price)? req.params.price : '0';
    propBeds = (req.params.beds)? req.params.beds : '0';
    propArea = (req.params.area)? req.params.area : '0';
    propBuilt = (req.params.built)? req.params.built : '0';
    propBaths = (req.params.baths)? req.params.baths : '0';
    propType = (req.params.type)? req.params.type : '0';
    res.redirect('/fbauth');
});
app.get('/sharetwitter/:image/:price/:beds/:area/:built/:baths/:type', function(req, res){
    selectedImage = req.params.image;
    //res.redirect('/auth/twitter');
    propPrice = (req.params.price)? req.params.price : '0';
    propBeds = (req.params.beds)? req.params.beds : '0';
    propArea = (req.params.area)? req.params.area : '0';
    propBuilt = (req.params.built)? req.params.built : '0';
    propBaths = (req.params.baths)? req.params.baths : '0';
    propType = (req.params.type) ? req.params.type : '0';

  //   var oauth = {
  //   consumer_key: TWITTER_CONSUMER_KEY,
  //   consumer_secret: TWITTER_CONSUMER_SECRET,
  //   token: TWITTER_ACCESS_TOKEN,
  //   token_secret: TWITTER_ACCESS_TOKEN_SECRET
  // };

  //   var form, r,
  //   api_url = 'http://api.twitter.com/1.1/statuses/update_with_media.json';

  //     r = request.post(api_url, {
  //       oauth: oauth
  //     }, function(err, res, body) {
  //       if (!err && res.statusCode == 200) {
  //           console.log("Posted to Twitter");
  //       } else {
  //           console.log("Unable to post tweet.");
  //       }
  //   });
  //   form = r.form();
  //   form.append('status', 'Property Details - Price: '+ propPrice + ', Beds: '+ propBeds  + ', Area: ' + propArea  + ', Built: '+propBuilt + ', Baths: '+propBaths + ', Type: '+propType );
  //   form.append('media[]', fs.createReadStream(path.normalize(path.join(__dirname,'/public/images/'+selectedImage))));
    var propDetails = 'Property Details - Price: '+ propPrice + ', Beds: '+ propBeds  + ', Area: ' + propArea  + ', Built: '+propBuilt + ', Baths: '+propBaths + ', Type: '+propType ;
    tuwm.post(propDetails, path.join(__dirname,'/public/images/'+selectedImage), function(err, response) {
        if (err) {
        console.log(err);
        }
        console.log('Posted the property on Twitter successfully.');
    });
    res.redirect('http://twitter.com');

});

app.get('/sharelinkedin/:image/:price/:beds/:area/:built/:baths/:type', function(req, res){
    selectedImage = req.params.image;

    var post_data = '<share>'
    +'<comment>Property details...</comment>'
    +'<content>'
    //+'<title>Picture: '+req.params.image+'</title>'
    +'<title>Price:'+req.params.price
    +', Beds: '+req.params.beds
    +', Areds :'+req.params.area
    +', Built:'+req.params.built
    +', Baths:'+req.params.baths
    +', Type:'+req.params.type
    +'</title>'
    +'<submitted-url>'+config.development.serverUrl+'/images/'+req.params.image+'</submitted-url>'
   // +'<submitted-image-url>http://farm4.staticflickr.com/3332/3451193407_b7f047f4b4_o.jpg</submitted-image-url>'
    +'</content>'
    +'<visibility><code>anyone</code></visibility>'
    +'</share>';

    oaLinkedin.post("http://api.linkedin.com/v1/people/~/shares", LINKEDIN_ACCESS_TOKEN, LINKEDIN_ACCESS_TOKEN_SECRET, post_data, 'application/xml; charset=UTF-8',
     function(error, data){
        if(error){
            console.log("error:"+error);

        } else {
            console.log("Posted on LinkedIn :"+data);
        }
     });

    res.redirect("http://www.linkedin.com");
    //res.end();
});