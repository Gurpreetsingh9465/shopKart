var passport = require("passport")

var User = require("../models/user")

var localstrategy = require('passport-local').Strategy;



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
}))
