const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mysql = require('mysql');


// app.use(express.static(path.join(__dirname + '/public')));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.set('view engine', 'ejs');


var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'neetapra@1',
  database: 'prajal'
});


// connection.connect();

connection.query('SELECT * from abc', function (error, results, fields) {
  if (error) throw error;
  console.log(results[0].name);
});
 
// connection.end();


app.get('/', (req,res)=> {
  res.render('index.html');
})


app.get('/welcome', (req,res)=> {
  res.sendFile(path.join(__dirname + '/public/welcome.html'));
  // res.sendFile('welcome.html');
  
})


app.get('/register', (req,res)=> {
  // res.send("Here you can register");
  res.sendFile(path.join(__dirname + '/public/register.html'));
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



app.post('/' , (req,res)=> {
  var x = req.body.u;
  var y = req.body.p;

  // console.log(x);
  // console.log(y);

  // if(x==y)
  // {
  //     res.redirect('/welcome');
  // }

  // res.send("User Name and Password does not match");

  connection.query("SELECT num from abc where name=?", [x], (err,rows,fields)=> {
    if(err)
    {
      console.log(err);
    }
    else 
    {
      
          if(rows.length!=0)
          {
            console.log(rows[0].num);
            var p = rows[0].num;
            console.log(y);
            if(p == y)
            {
              res.redirect('/welcome');
            }
            else 
            {
              res.send("Password Incorrect");
            }
          }
          else 
          {
            res.send("Username is not registered");
          }
    }

  });

})


// app.post('/', (req,res)=> {
//   res.send('Hi');
// })


app.listen(3000);