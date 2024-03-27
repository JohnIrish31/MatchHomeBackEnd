const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./matchHome.db', (err) => {
    if (err) {
        console.error('Error opening database connection:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        password TEXT NOT NULL,
        confirmPassword TEXT NOT NULL
    )`);
});

const dbFunctions = {
    // GET USERS
    getAllUsers: (callback) => {
        db.all('SELECT * FROM users', (err, rows) => {
            if (err) {
                console.error('Error fetching users:', err.message);
                callback(err, null);
            } else {
                callback(null, rows);
            }
        });
    },

    // REGISTER USER
    addUser: (firstName, lastName, password, confirmPassword, callback) => {
    if (password !== confirmPassword) {
        const error = new Error('Password and confirmPassword do not match');
        error.code = -1;
        callback(error, null);
        return;
    }
    db.run('INSERT INTO users (firstName, lastName, password, confirmPassword) VALUES (?, ?, ?, ?)', [firstName, lastName, password, confirmPassword], function (err) {
        if (err) {
            console.error('Error adding user:', err.message);
            callback(err, null);
        } else {
            callback(null, { User: "Successfully Created User With an Id of " + this.lastID });
        }
    });
},

    // LOGIN USER
    getUser: (firstName, password, callback) => {
        db.get('SELECT * FROM users WHERE firstName = ?', [firstName], (err, row) => {
            if (err) {
                console.error('Error fetching user:', err.message);
                if (callback) callback(err, null);
            } else {
                if (!row) {
                    if (callback) callback(null, { responseCode: -1, message: 'User not found' });
                } else {
                    if (row.password !== password) {
                        if (callback) callback(null, { responseCode: -2, message: 'Incorrect password' });
                    } else {
                        if (callback) callback(null, { responseCode: 200, message: 'Login Successful', id: row.id, firstName: row.firstName });
                    }
                }
            }
        });
    }
}

process.on('exit', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database connection:', err.message);
        } else {
            console.log('Disconnected from the SQLite database.');
        }
    });
});

module.exports = dbFunctions;
