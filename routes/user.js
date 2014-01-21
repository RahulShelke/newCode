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
                    res.redirect('/');
                }
                });
           // }
        //});
    });
};
