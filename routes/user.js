var User = require('../models/user')
    , userFirstname;

exports.index= function(req,res,done){
    process.nextTick(function(){
        var query =  User.findOne({ 'lsrId': req.body.email });
        query.exec(function(err, oldUser){
            if (oldUser){
                if(oldUser.lsrPassword === req.body.password){
                console.log('Existing User:' + oldUser.name + ' found and logged in!');
                done(null, oldUser);
                    //res.send('/','Welcome: '+oldUser.name);
                    //res.redirect('/loggedin/'+oldUser.name);
                    //res.render('index', {userName: oldUser.name});
                    userFirstname = oldUser.name.split(' ');
                    exports.userName = 'Hi '+userFirstname[0];
                    exports.userObj = oldUser;
                    exports.lastName = userFirstname[1];
                    exports.email =  oldUser.lsrId;
                    var minute = 60 * 1000;
                    if (req.body.remember){
                     console.log('Checked remmber..');
                     res.cookie('remember', 1, { maxAge: minute });
                     res.cookie('email', oldUser.lsrId, { maxAge: minute });
                     res.cookie('pwd', oldUser.lsrPassword, { maxAge: minute });
                     req.session.email = oldUser.lsrId;
                     req.session.pwd = oldUser.lsrPassword;
                     req.session.remember =req.body.remember;
                     console.log('req.cookie.email: '+res.cookie.email+','+req.session.remember );
                    }
                    res.redirect('/');
                } else {
                    res.send('/','Password entered is not valid.');
                }
            }else{
                //var newUser = new User();
                //newUser.lsrId = req.body.email;
                //newUser.lsrPassword = req.body.password;
                //newUser.save(function(err){
                //    if(err) throw err;
                  //  console.log('New user: ' + newUser.first_name + ' created and logged in!');
                    res.send('/login','User not found please Sign up');
                  //  done(null, newUser);
                //});
            }
        });
    });
};

exports.logout = function(req, res){
    exports.userName = 'Hi Guest';
    res.redirect('/');
};

exports.signup= function(req, res){
    res.render('signup.jade')
};


exports.signedup=function(req,res,done){
    process.nextTick(function(){
                var newUser = new User();
                newUser.lsrId = req.body.email;
                newUser.name = req.body.firstName+' '+req.body.lastName;
                newUser.lsrPassword = req.body.password;
                newUser.save(function(err){
                if(err) {
                    console.log(err);
                } else {
                    console.log('New user: ' + newUser.name + ' created and logged in!');
                    //res.send('allworked ');
                    done(null, newUser);
                    //res.send({redirect:'/loggedin'});
                    userFirstname = newUser.name.split(' ');
                    exports.userName = 'Hi '+userFirstname[0];
                    res.redirect('/sendignupmail');
                }
                });
           // }
        //});
    });
};

exports.reset=function(req,res,done){
    //var userObj = exports.userObj,
        //name = userObj.name.split(' ');
    //var firstName = name[0],
        //lastName = name[1];
        console.log('obj:'+exports.userObj);
        console.log('exports.FirstName :'+exports.firstName);
        console.log('exports.lastName :'+exports.lastName);
        console.log('exports.email '+exports.email);

    res.render('reset', {email: exports.email, firstName: exports.firstName, lastName: exports.lastName});
};

exports.resetPassword= function(req,res,done){
    process.nextTick(function(){
        var query =  User.findOne({ 'lsrId': req.body.email });
        query.exec(function(err, oldUser){
            if (oldUser){
                console.log('Existing User:' + oldUser.name + ' found and logged in!');
                oldUser.lsrPassword = req.body.password;
                oldUser.save(function(err){
                if(err) {
                    console.log(err);
                } else {
                    console.log('Password  has been changed for user : ' + oldUser.name);
                    done(null, oldUser);
                    userFirstname = oldUser.name.split(' ');
                    exports.userName = 'Hi '+userFirstname[0];
                    exports.userObj = oldUser;
                    exports.lastName = userFirstname[1];
                    exports.email =  oldUser.lsrId;
                    res.redirect('/sendresetpwdmail');
                }
                });
            } else {
                console.log('No User found');
                res.send('/login','User not found please Sign up');
            }
        });
    });
};