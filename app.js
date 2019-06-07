var express        = require("express"),
    sanitizer      = require("express-sanitizer"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    Blog           = require("./models/blog"),
    methodOverride = require("method-override");

mongoose.connect("mongodb://localhost/blog_app", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(sanitizer());
app.use(methodOverride("_method"));



// HOME ROUTE 
app.get("/", function(req, res)
	{
		res.redirect("/blogs");
	});


//INDEX ROUTE
// RESTFUL ROUTES
app.get("/blogs", function(req, res)
	{
		Blog.find({}, function(err , blogs)
			{
  				if(err)
  				{
  					console.log(err);
  				}
  				else
  				{
            res.render("index", {blogs: blogs});
  				}
      });
	 });

//NEW ROUTE
app.get("/blogs/new", function(req, res)
	{
      res.render("new");
		});


//CREATE ROUTE
app.post("/blogs", function(req, res){
    	//Create Blog
    	req.body.blog.body = req.sanitize(req.body.blog.body);
    	console.log();
    	Blog.create(req.body.blog, function(err, newBlog)
    	{
         if(err)
         {
         	res.render("new");
         }
         else{
         	//then redirect to the index
         	res.redirect("/blogs");
         }
    	});
});

// Show route
app.get("/blogs/:id", function(req,res)
 {
    Blog.findById(req.params.id, function(err, foundBlog)
     {
             if(err)
             {
              res.redirect("/blogs");
             }
            else{
              res.render("show", {blog: foundBlog});
             }
    });
  });
	
//EDIT ROUTE
app.get("/blogs/:id/edit", function(req,res)
	{
		Blog.findById(req.params.id, function(err, foundBlog)
		{
             if(err)
             {
             	res.redirect("/blogs")
             }
             else{
             	res.render("edit", {blog: foundBlog});
             }
		}); 
	});

//UPDATE ROUTE
app.put("/blogs/:id", function(req, res)
{
    req.body.blog.body = req.sanitize(req.body.blog.body);	
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, UpdatedBlog)
    {
    	if(err)
       {
         res.redirect("/blogs");
      	}

    	else
    	 {
    		res.redirect("/blogs/" + req.params.id);
    	 } 
    });
});


//DELETE ROUTE
app.delete("/blogs/:id", function(req, res)
	{
		//Destroy blog 
		Blog.findByIdAndRemove(req.params.id, function(err)
            {
            	if(err)
            	{
            		res.redirect("/blogs");
            	}
            	else
            	{
            		res.redirect("/blogs");
            	}
            });
		//redirect somewhere
	});

app.listen(3333, "127.0.0.1", function()
{
    console.log("Blog App Server is running");
});


// mongod --directoryperdb --dbpath C:\Users\Master\Desktop\mongodb\data\db
