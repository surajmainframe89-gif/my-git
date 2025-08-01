const express = require("express");

let users = require("./MOCK_DATA.json");
const app = express();

const fs = require("fs");

const PORT = 8000;

// Server starts
app.listen(PORT, () => console.log('Server started on PORT:${PORT}'));

// Middleware to POST data from POSTMAN
app.use(express.urlencoded({extended: false}));

//Test route on /users
app.get("/users", (req, res) => {
    return res.json(users);
});
// Routes for /API/users/

app
   .route("/API/users/:id") 

// GET:
    .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id)
    return res.json(user);
})
    .patch((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id)
    
    // if userid doesn't exist
    if(user === -1){
        return res.status.json({message: "User not found"});
    }

    //if exists, update data 
    users[user] = {...users[user], ...req.body};
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {

        return res.json({ status: "Userid updated", id});
    });
    //const body = req.body;

})
    .delete((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id)
    
    // if userid doesn't exist
    if(user === -1){
        return res.status.json({message: "User not found"});
    }

    //if exists, delete user
    // Filter out the user to delete
    let updatedUsers = users.filter(u => u.id !== id);
    users=updatedUsers;
    // Write the updated array back to the file
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(updatedUsers, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ message: "Error writing file" });
        } 
        console.log('Calling boomerang del ->');   
        const call1 = require('./boomerang');
        return res.json({ status: "Userid deleted", id});
    });

})
// POST:
    app.post("/API/users", (req, res) => {
        const body = req.body;
        users.push({...body, id: users.length + 1 });

        fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
            console.log('Calling boomerang ->')
            const call2 = require('./boomerang');
            return res.json({ status: "Userid created", id: users.length });
        })
        
    });
