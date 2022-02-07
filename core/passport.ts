import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import { IUserModel, UserModel } from "../models/UserModel";
import { generateMD5 } from "../utils/generateHash";


passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const user = await UserModel.findOne({ $or: [{ username }, { email: username }] })
            if (!user) {
                return done(null, false)
            }

            if (user.password !== generateMD5(password + "s3cr3t")) {
                return done(null, false)
            } else {
                return done(null, user)
            }

        } catch (err) {
            return done(null, err)
        }
    }
))



passport.use(new JWTStrategy({
    secretOrKey: "s3cr3t",
    jwtFromRequest: ExtractJwt.fromHeader("token")
},
    async (payload: { data: IUserModel }, done) => {
        try {
            const user = await UserModel.findById(payload.data._id)
            if (!user) {
                return done(null, false)
            }

            return done(null, user)

        } catch (err) {
            return done(null, err)
        }
    }
))



passport.serializeUser((user: any, done) => {
    done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
    const user = await UserModel.findById(id)
    done(null, user)
})



export { passport }