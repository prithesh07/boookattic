var express 			 =require("express");
	app 				 =express(),
	bodyParser 			 =require("body-parser"),
	mongoose			 =require("mongoose"),
	passport			 =require("passport"),
	LocalStrategy		 =require("passport-local"),
	User 				 =require("./models/user"),
	Book 				 =require("./models/book"),
	passportLocalMongoose=require("passport-local-mongoose");


mongoose.connect("mongodb://localhost/demo");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
	secret:"Yo",
	resave:false,
	saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get("/", function(req, res){
    res.render("new");
});
app.get("/landing",isnotLoggedIn, function(req, res){
    res.render("landing");
});

app.get("/bookdetail",isLoggedIn, function(req, res){
	var id = req.query.title;
    Book.find({},function(err,allBooks){
		res.render("bookdetail",{currentUser:req.user,Book:allBooks,name:id});
	});
});

app.post("/landing",passport.authenticate("local",{
	successRedirect:"/campgrounds",
	failureRedirect:"/landing?status=fail"
}),function(req,res){
		});

app.get("/register", function(req, res){
    res.render("register");
});

app.get("/addBook",isLoggedIn, function(req, res){
	Book.find({},function(err,allBooks){
		res.render("addBook",{currentUser:req.user,Book:allBooks});
	});
    
});
app.post("/campgrounds",isLoggedIn, function(req, res){
	var title=req.body.Title;
	var author=req.body.Author;
	var url=req.body.Url;
	var price=req.body.Price;
	var cat=req.body.Category;
	var desc=req.body.Description;
	var rate=req.body.Rating;

	Book.create(
	{
	   title: title,
	   author:author,
	   rating:rate,
	   price:price,
	   type:cat,
	   image: url,
	   description: desc
	},function(err,book){
		console.log(book);
	}
		
)
    res.redirect("/campgrounds");
});
app.post("/deleteBook",isLoggedIn, function(req, res){
	var id = req.query.title;
	var myquery = { title: id};
	
	Book.remove(myquery, function(req, res) {
				
	  });

	res.redirect("/campgrounds");
    
});

app.post("/deleteBook",isLoggedIn, function(req, res){
	var id = req.query.title;
	var myquery = { title: id};
	
	Book.remove(myquery, function(req, res) {
				
	  });

	res.redirect("/campgrounds");
    
});

app.post("/edit",isLoggedIn, function(req, res){
	var titl=req.body.Title;
	var author=req.body.Author;
	var url=req.body.Url;
	var price=req.body.Price;
	var cat=req.body.Category;
	var desc=req.body.Description;
	var rate=req.body.Rating;
	var id = req.query.title;
	
	var myquery = { title: titl};
	console.log(myquery);

	
	Book.remove(myquery, function(req, res) {
				
	  });

	

	Book.create(
	{
	   title: titl,
	   author:author,
	   rating:rate,
	   price:price,
	   type:cat,
	   image: url,
	   description: desc
	},function(err,book){
		console.log(book);
	}
		
)
   res.redirect("/campgrounds");
    
});


app.get("/editBook",isLoggedIn, function(req, res){
	var id = req.query.title;
	Book.find({},function(err,allBooks){
		res.render("editBook",{currentUser:req.user,Book:allBooks,name:id});
	});
    
});




app.post("/register", function(req, res){
    req.body.username;
	req.body.password;
	User.register(new User({username:req.body.username}),req.body.password,function(err,user){
		if(err)
			{
				console.log(err);
				return res.render("register");
			}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/campgrounds");
			
		})
	});
	
});


app.get("/logout", function(req, res){
   req.logout();
	res.redirect("/");
});



app.get("/campgrounds",isLoggedIn, function(req, res){
	Book.find({},function(err,allBooks){
		res.render("campgrounds",{currentUser:req.user,Book:allBooks});
	});
    
});


function isLoggedIn(req,res,next)
{
	if(req.isAuthenticated())
	{
		return next();
	}
	res.redirect("/landing");
}

function isnotLoggedIn(req,res,next)
{
	if(!req.isAuthenticated())
	{
		return next();
	}
	res.redirect("/campgrounds");
}


app.listen(process.env.PORT || 3009, process.env.IP, function(){
   console.log("The Book Atiic has started!");
});