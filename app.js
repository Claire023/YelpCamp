var express= require("express"); 
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

//seedDB();


//requiring routes
var commentRoutes = require("./routes/comments"), 
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index");


mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");


app.use(flash());


//PASSPORT CONFIG FOR USER LOGIN
app.use(require("express-session")({
	secret : "secret key", 
	resave :false,
	saveUninitialized: false
})); 



app.use(passport.initialize());
app.use(passport.session());



passport.use(new LocalStrategy(User.authenticate()));
//lit les données encodées dans la session
//décode ces données
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});



app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes),



app.listen(process.env.PORT, process.env.IP, function(){
	console.log("YelpCamp app started bitch!")
});
