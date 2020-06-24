const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mysql = require('mysql');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
require('dotenv').config()



// app.use(express.static(path.join(__dirname + '/public')));
//app.use(express.static("public"));
app.use(express.static(__dirname + '/views')); //for the css files

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser());
app.use(session({secret:"Samsung",
                 resave: true,
                 saveUninitialized: true,
                 cookie: { maxAge: 6000000 } }));
app.set('view engine', 'ejs');



var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: 'prajal'
});


// connection.connect();

connection.query('SELECT * from abc', function (error, results, fields) {
  if (error) throw error;
  console.log(results[0].name);
});
 
// connection.end();


app.get('/', (req,res)=> {

  
   console.log(req.session.u);
   if(req.session.u===undefined)
   {
      res.render("index", {name:"y"});
   }
   else 
   {

    //res.render("welcome", {name: req.session.u});
    res.redirect('/welcome');
   }
 
  
})

var aa;



app.get('/welcome', (req,res)=> {
  // res.sendFile(path.join(__dirname + '/public/welcome.html'));
  // res.sendFile('welcome.html');
  console.log(req.session.u);
  if(req.session.u===undefined)
   {
      res.render("index", {name:"y"});
   }
   else 
   {
    var q  = "SELECT * FROM posts";

    var likecount = "update posts set likecount = (select count(user) from likes where posts.postid = likes.postid)";

    connection.query(likecount,  (errr, ressult)=> {
      if(errr)
      {
        throw errr;
      }
      else 
      {
        console.log("like query successful")
      }
    })
    

    connection.query(q, (err,rows,fields)=> {
      if(err)
      {
        console.log("Error in retrieving posts");
      }
      else 
      {
        console.log(rows);
        res.render("welcome", {name:req.session.u, val:rows});
        
        
      }
     

      
    })

     
   }
})


app.get('/register', (req,res)=> {
  // res.send("Here you can register");
  // res.sendFile(path.join(__dirname + '/public/register.html'));
  res.render("register")
})


app.post('/register', (req,res)=> {

  var uname  = req.body.u;
  var password = req.body.p;
  // console.log(uname);

  var isnum = /^\d+$/.test(password);

  // console.log(isnum);
  if(isnum)
  {
    
  // var values = [uname,password];

  var sql =  "INSERT INTO abc (name,num) VALUES ('" + uname + "', '" + password + "' )";
  connection.query(sql,(err,response) => {
    if(err)
    {
      throw err;
    }
    console.log('Record Inserted');
  });

  res.redirect('/');

  


  }
  else 
  {
    res.send("Password can only be numeric");
  }
   
});

var x;





app.post('/' , (req,res)=> {
   x = req.body.u;
  var y = req.body.p;

  

  connection.query("SELECT num from abc where name=?", [x], (err,rows,fields)=> {
    if(err)
    {
      console.log(err);
    }
    else 
    {
      
          if(rows.length!=0)
          {
            // console.log(rows[0].num);
            var p = rows[0].num;
            // console.log(y);
            if(p == y)
            {
              req.session.u = x;
              res.redirect('/welcome');
              
              
            }
            else 
            {
              //res.send("Password Incorrect");
              res.render("index",{name:'n'});
            }
          }
          else 
          {
            //res.send("Username is not registered");
            res.render("index",{name:'p'});
          }
    }

  });

})






app.get('/logout', (req,res)=> {
  req.session.destroy(function(err) {

    if(err)
    {
      console.log("Error in destroying the session");
    }
    else 
    {
      console.log("Session successfully destroyed")
    }
    
  }) 
  res.redirect('/');  
})





app.post('/postblog', (req,res)=> {
  // console.log(req.body.blog1);
  // console.log(req.body.title);


  var newpost = req.body.blog1;
  var heading = req.body.title;
  if(newpost==="")
  {
    res.send("Empty blog not allowed")
  }
  else 
  {
    var pp=Math.random();
    console.log(pp);


      var sql =  "INSERT INTO posts (postid,post,title,author) VALUES ('" + pp + "','" + newpost + "', '" + heading + "' , '" + req.session.u + "')";
      // var queryforlikes = "INSERT INTO likes (postid, no_of_likes) VALUES( '" +pp "' + 0) ";
      connection.query(sql,(err,response) => {
        if(err)
        {
          console.log(err);
          throw err;

        }
        console.log('Record Inserted');
      });


      // connection.query(queryforlikes,(err,response) => {
      //   if(err)
      //   {
      //     console.log(err);
      //     throw err;

      //   }
      //   console.log('Record Inserted');
      // });

      res.redirect('/')
    }
})


app.post('/deletepost', (req,res)=> {

  var posttodelete = req.body.post_to_be_deleted;
   //console.log(posttodelete);

  var qq  = "DELETE FROM posts WHERE post = '" + posttodelete + "' ";

    connection.query(qq, (err,ress)=> {
      if(err)
      {
        console.log("Error in deleting post");
      }
      else 
      {
        res.redirect('/');
        
      }
})
})



app.get('/myposts' , (req,res)=> {

  if(req.session.u===undefined)
   {
      res.render("index", {name:"y"});
   }
   else 
   {
      var qry  = "SELECT * FROM posts WHERE author = '" + req.session.u + "' ";

    connection.query(qry, (err,rows,fields)=> {
      if(err)
      {
        console.log("Error in retrieving posts");
      }
      else 
      {
         console.log(rows);
         res.render("myposts", {name:req.session.u, val:rows});
      }
    })
  }
});


app.post('/likepost', (req,res)=> {
   var post_id  = req.body.post_to_be_liked;
   var liker = req.session.u;

   

    var likequery = "INSERT INTO likes (postid,user) VALUES ('" + post_id + "','" + liker + "')";
    // "INSERT INTO posts (postid,post,title,author) VALUES ('" + pp + "','" + newpost + "', '" + heading + "' , '" + req.session.u + "')"
    connection.query(likequery, (err,response)=> {
      if(err)
      {
        console.log(err)
      }
      else 
      {
        console.log("likes updated ");
      }
    })
   res.redirect("welcome");
})





app.listen(3000);