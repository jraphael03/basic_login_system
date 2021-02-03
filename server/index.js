const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const bodyParser = require("body-parser");      //  Parses all of the body elements from the frontend
const cookieParser = require('cookie-parser');  //  Parses all of the cookies we have
const session = require('express-session');     // Session maintains the sessions we create (ex: refresh page or open new tabs and staying logged in)

const app = express();
const port = 5000;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"], //urls we want to save
    methods: ["GET", "POST"],           //methods we are using
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
    key: "userId",        //key is the name of cookie you are going to create
    secret: "subscribe",     //secrets should be difficult to figure out very long
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24,      //cookie will expire in 24 hours9
    }
}))

// CONNECT TO DB
const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: 'Opendoors744784',
    database: 'LoginSystem'
})


// CREATE A POST FOR REGISTER
app.post('/register', (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    bcrypt.hash(password, saltRounds, (err, hash) => {              // USING BCRYPT AND HASH TO PROTECT THE PASSWORD
        if (err) {
            console.log(err)
        }
        db.query(
            "INSERT INTO users (username, password) VALUES (?,?)",
            [username, hash],       //PASS HASH INSTEAD OF PASSWORD TO PASS THE HASH VERSION OF THE VARIABLE
            (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("success");
            }
            }
        );
    })
})


// CREATE LOGIN GET FOR SESSION (THIS IS CREATED AFTER POST FOR LOGIN)
app.get("/login", (req, res) => {
    if (req.session.user){
        res.send({ loggedIn: true, user: req.session.user })        // if there is a session with a user object already created in our server send the following object, logged in and the user
    } else {
        res.send({ loggedIn: false })                               // if there is not a session called req.session.user logged in will equal false
    }
})


// CREATING A LOGIN PATH 
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query("SELECT * FROM users WHERE username = ?;", 
        username, (err, result) => {
        if(err){
            res.send({err: err})
        } 
        //IF THERE ISN'T AN ERROR
            if(result.length > 0) {
                bcrypt.compare(password, result[0].password, (error, response) => {     // COMPARE TO THE RESULT OF THE PASSWORD TO THE USER WE ARE TRYING TO ACCESS
                    if (response){
                        // BEFORE WE SEND RESULT TO THE FRONT END WE WANT TO CREATE A SESSION THAT CONTAINS THE COOKIE
                        req.session.user = result       //create a session named user equal to our result (login)
                        console.log(req.session.user);
                        res.send(result)            //if combination is correct
                    } else{
                        res.send({message: "Username and/or Password is incorrect"})       //if combination is incorrect
                    }
                })
            } else {
                res.send({message: "User does not exist"})          //if user does not exist
            }
        }
    );
});


app.listen(port, () => {
  console.log("port is listening on port: " + port);
});