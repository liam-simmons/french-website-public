const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const LocalStrategy = require("passport-local").Strategy;

const User = require("./models/user");

//json web tokens stategy
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromHeader("authorization"),
      secretOrKey: process.env.JWT_SECRET
    },
    async (payload, done) => {
      try {
        // find user specified in token
        const user = await User.findById(payload.sub);
        // if user doesnt exist:
        if (!user) {
          return done(null, false);
        }
        //otherwise return user
        done(null, user);
      } catch {
        done(error, false);
      }
    }
  )
);

//local strategy
passport.use(
  new LocalStrategy({}, async (username, password, done) => {
    try {
      //find user given username

      const user = await User.findOne({
        username_lower: username.toLowerCase()
      });
      //if not:
      if (!user) return done(null, false);
      //check if the password is correct
      const isMatch = await user.isValidPassword(password);
      //if not:
      if (!isMatch) {
        return done(null, false);
      }

      //return user
      done(null, user);
    } catch {
      done(error, false);
    }
  })
);
