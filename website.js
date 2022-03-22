const { Strategy } = require("passport-discord");
const translate = require('translate-google')
const session = require("express-session");
const bodyparser = require("body-parser");
const Discord = require("discord.js");
const passport = require("passport");
const express = require("express");

module.exports.load = async (client, database) => {
  passport.serializeUser((user, done) => { done(null, user); });
  passport.deserializeUser((obj, done) => { done(null, obj); });
  passport.use(new Strategy({
    clientID: client.user.id,
    clientSecret: process.env.secret,
    callbackURL: process.env.url+`/login`,
    scope: ['identify', 'guilds', 'guilds.join']
  }, function(accessToken, refreshToken, profile, done) { process.nextTick(function() { return done(null, profile); }); }));
  express()
    .use(bodyparser.json())
    .use(bodyparser.urlencoded({ extended: true }))
    .engine("html", require("ejs").renderFile)
    .use(express.static(require('path').join(__dirname, '/public')))
    .set("view engine", "ejs")
    .use(session({ secret: process.env.secret, resave: false, saveUninitialized: false }))
    .use(passport.initialize())
    .use(passport.session())
    .get('/', function(req, res) {
      res.render(__dirname+'/views/main.ejs', {
        
      });
    })
    .listen(3000, function (err) {
      if (err) return console.log(`[Animes WebSite] => Site Error:\n${err}`)
      console.log(`[Animes WebSite] => WebSite Loaded!`)
    });
}