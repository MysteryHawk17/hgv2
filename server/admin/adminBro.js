const AdminJS = require("adminjs");
const app = require("../index");
const AdminJSExpress = require("@adminjs/express");
const AdminJSMongoose = require("@adminjs/mongoose");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const session = require('express-session')
const Connect = require('connect-mongo')
require("dotenv").config();
const AnnouncementModel = require("../models/announcement_model");
const FeedModel = require("../models/feed_model");
const WingModel = require("../models/wing_model");
const LevelModel = require("../models/level_model");
const TopicModel = require("../models/topic_model");
const SubtopicModel = require("../models/subtopic_model");
const AssignmentModel = require("../models/assignment_model");
const UserModel = require("../models/user_model");
const MongoStore = require("connect-mongo");

const authenticate = async (email, password) => {
  const user = await UserModel.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password)) && user.isAdmin) {
    return Promise.resolve(user);
  }
  console.log(user);
  return Promise.reject(user).catch((err) => {
    console.log(err);
  });
};
AdminJS.registerAdapter(AdminJSMongoose);
const admin = new AdminJS({
  databases: [mongoose],
  branding: {
    companyName: "House of Geeks",
    logo: false,
  },
  rootPath: "/admin",
});
// const ConnectSession = new Connect(session)
const sessionStore = new MongoStore({
    mongoUrl:process.env.MONGO_URI,
    ttl: 14 * 24 * 60 * 60
  
})
const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  admin,
  // app,
  {
    authenticate,
    cookieName: "adminjs",
    cookiePassword: "sessionsecret",
  },
  null,
  {
    store: sessionStore,
    resave: true,
    httpOnly: false,
    saveUninitialized: true,
    secret: "sessionsecret",
    // cookie: {
    //   httpOnly: process.env.NODE_ENV === "production",
    //   secure: process.env.NODE_ENV === "production",
    // },
  }
  // app

  // preDefinedRouter
);

module.exports = { admin, adminRouter };
