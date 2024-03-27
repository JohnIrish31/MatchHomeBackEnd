const express = require('express');
const db = require('./database.js');

const app = express();
const PORT = process.env.PORT || 8200;

app.use(express.json());


app.get('/api/allUser', (req, res) => {
    db.getAllUsers((err, users) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(users);
        }
    });
});


app.post('/api/registration', (req, res) => {
    const { firstName, lastName, password, confirmPassword } = req.body;
    if (!firstName || !lastName || !password || !confirmPassword) {
        res.status(400).json({ error: 'All Input is required' });
        return;
    }
    db.addUser(firstName, lastName, password, confirmPassword, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json(result);
        }
    });
});

app.post('/api/login', (req, res) => {
    const { firstName, password } = req.body;
    if (!firstName || !password) {
        return res.status(400).json({ responseCode: -4, message: 'All fields are required' });
    }
    db.getUser(firstName, password, (err, user) => {
        if (err) {
            return res.status(500).json({ responseCode: -5, error: err.message });
        } 
        return res.status(200).json(user);
    });
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
