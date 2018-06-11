var passport = require("passport")

var User = require("../models/user")

var localstrategy = require('passport-local').Strategy;
const GoogleStratergy = require('passport-google-oauth20');


passport.serializeUser(function(user,done){
  done(null,user.id)
})

passport.deserializeUser(function(id,done){
  User.findById(id,function(err,user){
    done(err,user)
  })
})


passport.use("local.signup",new localstrategy({
  usernameField: 'email',
  passwordField: "password",
  passReqToCallback:true
},function(req,email,password,done){
  User.findOne({'email':email},function(err,user){
    if(err){
      console.log(err);
      return done(err)
    }
    if(user){
      return done(null,false,{message:"email is already in use"})
    }
    var newUser = new User();
    newUser.email = email
    newUser.password = newUser.encryptPassword(password);
    newUser.username= req.body.username;
    newUser.save(function(err,result){
      if(err){
        console.log(err);
        return done(err)
      }
      return done(null,newUser)
    })
  })
}))



passport.use('local.signin',new localstrategy({
  usernameField:'email',
  passwordField:'password',
  passReqToCallback:true
},function(req,email,password,done){
  User.findOne({email:email},function(err,user){
    if(err){
      return done(err)
    }
    if(!user){
      return done(null,false,{message:'No User Found'})
    }
    if(!user.validPassword(password)){
      return done(null,false,{message:'wrong password'})
    }
    return done(null,user)
  })
}));

passport.use(
  new GoogleStratergy({
    //options for google stratergy
    callbackURL:'/user/google/redirect',
    clientID : '899127904424-fsobhfpf9of5amtf3l1pkjdkfbgp0u0b.apps.googleusercontent.com',
    clientSecret : 'ohojUUoNqqaiHTZAYmyG9rf3',
  }, (accessToken, refreshToken, profile, done)=>{
    //passport callback function
    User.findOne({googleId : profile.id}).then((currentUser)=>{
      if(currentUser){
        //already have a usern
        console.log("Already a user " + currentUser);
        done(null, currentUser);
      }
      else{
        new User({
          username : profile.displayName,
          googleId : profile.id,
          password : 'none',
          email    : profile._json.url,
        }).save().then((newUser)=>{
          console.log("The Profile of User is " + newUser);
          done(null, newUser);
        });
      }
    })
  })
)
