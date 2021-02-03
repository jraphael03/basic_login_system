const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

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

    db.query("INSERT INTO users (username, password) VALUES (?,?)", 
    [username, password], (err, result) => {
        if(err){
            console.log(err)
        } else{
            console.log('success');
        }
    })
})



// CREATING A LOGIN PATH 
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, result) => {
        if(err){
            res.send({err: err})
        } 
        //IF THERE ISN'T AN ERROR
            if(result.length > 0) {
                res.send(result)
            } else {
                res.send({message: "Username and/or Password is incorrect"})
            }
        }
    );
});


app.listen(port, () => {
  console.log("port is listening on port: " + port);
});