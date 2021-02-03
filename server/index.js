const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

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