
const sql = require("./db.js");

//logIn query
const login = function (req, res) {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
        return;
    }

    const { username, password } = req.body;
    sql.connection.query(
        `SELECT * FROM web.users WHERE username='${username}' AND password='${password}' LIMIT 1`,
        function (err, data, fields) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else if (!data.length) {
                res.status(401).json({
                    error: "User was not found for the given username and password",    //case when user is not in the db
                });
            } else {
                res.status(200).json({
                    user: data[0],
                });
            }
        }
    );
};

//create new user query 
const createNewUser = function (req, res) {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
    } else {
        sql.connection.query(
            "INSERT INTO web.users SET ?",
            req.body,
            (err, mysqlres) => {
                if (err) {
                    console.log("error: ", err);
                    res.status(400).send({
                        message: "error in creating user: " + err,
                    });
                } else {
                    console.log("created user: ", {
                        id: mysqlres.insertId,
                        ...req.body,
                    });
                    res.status(201).json({
                        message: "User created successfully",
                    });
                }
            }
        );
    }
};

//search user query 
const searchUsers = function (req, res) {
    let query = `SELECT * FROM web.users`;
    sql.connection.query(query, function (err, data, fields) {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({
                message: "error in searching users: " + err,
            });
            return;
        } else if (data) {
            res.status(200).send(data);
        }
    });
};

//get hike query 
const getHike = function (req, res) {
    // Validate request
    if (!req.params) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
    } else {
        const { id } = req.params;
        sql.connection.query(
            "SELECT * FROM web.hikes WHERE id = ?",
            id,
            (err, mysqlres) => {
                if (err) {
                    console.log("error in getting hike: ", err);
                    res.status(400).send({
                        message: "error in getting hike: " + err,
                    });
                } else {
                    res.status(200).json({
                        mysqlres,
                    });
                }
            }
        );
    }
};

//create new Hike query
const createNewHike = function (req, res) {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
    } else {
        sql.connection.query(
            "INSERT INTO web.hikes SET ?",
            req.body,
            (err, mysqlres) => {
                if (err) {
                    console.log("error: ", err);
                    res.status(400).send({
                        message: "error in creating hikes: " + err,
                    });
                } else {
                    console.log("created hike: ", {
                        id: mysqlres.insertId,
                        ...req.body,
                    });
                    res.status(201).json({
                        message: "Hike created successfully",
                    });
                }
            }
        );
    }
};

//update an existing Hike query
const updateHike = function (req, res) {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
    } else {
        sql.connection.query(
            `UPDATE web.hikes SET status = '${req.body.status}', counselor_id = ${req.body.counselor_id} WHERE id = ${req.params.id}`,
            function (err, data, fields) {
                if (err) {
                    console.log("error: ", err);
                    res.status(400).send({
                        message: "error in updating hike: " + err,
                    });
                    return;
                } else if (data) {
                    res.status(200).send(data);
                }
            }
        );
    }
};

//delete Hike query
const deleteHike = function (req, res) {
    // Validate request
    if (!req.params.id) {
        res.status(400).send({
            message: "hike id is required!",
        });
    } else {
        sql.connection.query(
            `DELETE FROM web.hikes WHERE id = ${req.params.id}`,
            function (err, data, fields) {
                if (err) {
                    console.log("error: ", err);
                    res.status(400).send({
                        message: "error in removing hike: " + err,
                    });
                    return;
                } else if (data) {
                    res.status(200).send(data);
                }
            }
        );
    }
};

//search specific hikes to show in tables query
const searchHikes = function (req, res) {
    const { status, organizer, counselor } = req.body;

    let query = `SELECT * FROM web.hikes `;
    if (status) {
        query += `WHERE status = '${status}'`;
    } else if (organizer) {
        query += `WHERE hike_organizer = '${organizer}'`;
    } else if (counselor) {
        query += `WHERE hike_counselor = '${counselor}'`;
    }

    sql.connection.query(query, function (err, data, fields) {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({
                message: "error in searching hikes: " + err,
            });
            return;
        } else if (data) {
            res.status(200).send(data);
        }
    });
};

module.exports = {
    login,
    createNewUser,
    searchUsers,
    searchHikes,
    getHike,
    createNewHike,
    updateHike,
    deleteHike,
};
