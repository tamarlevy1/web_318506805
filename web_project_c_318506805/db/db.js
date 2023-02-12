const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const mysql = require("mysql2");
const dbConfig = require("./db.config.js");

// Create a connection to the database
const connection = mysql.createConnection(dbConfig);

// open the MySQL connection
connection.connect((error) => {
    if (error) throw error;
    console.log("Successfully connected to the database");
});

//createDB - create database, drop tables, create tableas, insert rows
init = () => {
    //create db
    connection.query(
        `CREATE DATABASE IF NOT EXISTS web;`,
        function (err, data, fields) {
            if (err) {
                throw new Error(err.message);
            } else {
                console.log(`database 'web' created`);
            }
        }
    );

    //drop table hikes
    connection.query(
        `DROP TABLE IF EXISTS web.hikes;`,
        function (err, data, fields) {
            if (err) {
                throw new Error(err.message);
            }
            else {
                console.log(`dropped hikes table`);
            }
        }
    );

    //drop table users
    connection.query(
        `DROP TABLE IF EXISTS web.users;`,
        function (err, data, fields) {
            if (err) {
                throw new Error(err.message);
            }
            else {
                console.log(`dropped users table`);
            }
        }
    );


    //create table users
    connection.query(
        `CREATE TABLE IF NOT EXISTS web.users (
            id int NOT NULL AUTO_INCREMENT,
            username varchar(25) NOT NULL,
            password varchar(25) NOT NULL,
            fullname varchar(25) NOT NULL,
            phone varchar(25) NOT NULL,
            birthdate date NOT NULL,
            user_type varchar(25) NOT NULL,
            experience varchar(1000) NOT NULL,
            PRIMARY KEY (id)
        )`,
        function (err, data, fields) {
            if (err) {
                throw new Error(err.message);
            } else {
                console.log(`table 'web.users' created`);
            }
        }
    );

    //adding users to users table
    connection.query(
        `SELECT COUNT(*) as count FROM web.users`,
        function (err, data, fields) {
            if (err) {
                throw new Error(err.message);
            } else {
                results = JSON.parse(JSON.stringify(data));
                if (results[0].count === 0) {
                    // no users, loading some sample users from csv
                    let users = [];
                    fs.createReadStream(path.join(__dirname, "users.csv"))
                        .pipe(csv())
                        .on("data", (data) => users.push(data))
                        .on("end", () => {
                            for (let user of users) {
                                const query = `INSERT INTO \`web\`.\`users\`(\`username\`, \`password\`, \`fullname\`, \`phone\`, \`birthdate\`, \`user_type\`, \`experience\`) 
                                    VALUES ('${user.username}','${user.password}','${user.fullname}','${user.phone}','${user.birthdate}','${user.user_type}','${user.experience}')`;

                                connection.query(
                                    query,
                                    function (err, mysqlres) {
                                        if (err) {
                                            throw new Error(err.message);
                                        } else {
                                            console.log(    //show created user's ids
                                                `created a new user with id: ${mysqlres.insertId}`
                                            );
                                        }
                                    }
                                );
                            }
                        });
                }
            }
        }
    );

    //create hikes table
    connection.query(
        `CREATE TABLE IF NOT EXISTS web.hikes (
            id int NOT NULL AUTO_INCREMENT,
            hike_date date NOT NULL,
            area varchar(25) NOT NULL,
            num_of_participants varchar(25) NOT NULL,
            participants_age_group varchar(25) NOT NULL,
            salary int NOT NULL,
            hike_details varchar(1000) NOT NULL,
            counselor_id int,
            organizer_id int NOT NULL,
            status varchar(10) NOT NULL,
            PRIMARY KEY (id),
            CONSTRAINT \`hikes_ibfk_1\` FOREIGN KEY (\`counselor_id\`) REFERENCES \`web\`.\`users\` (\`id\`),
            CONSTRAINT \`hikes_ibfk_2\` FOREIGN KEY (\`organizer_id\`) REFERENCES \`web\`.\`users\` (\`id\`)
        )`,
        function (err, data, fields) {
            if (err) {
                throw new Error(err.message);
            }
            else {
                console.log(`table 'web.hikes' created`);
            }
        }
    );

    //adding records to hikes table
    connection.query(
        `SELECT COUNT(*) as count FROM web.hikes`,
        function (err, data, fields) {
            if (err) {
                throw new Error(err.message);
            } else {
                results = JSON.parse(JSON.stringify(data));
                if (results[0].count === 0) {
                    // no hikes, loading some sample hikes from csv
                    let hikes = [];
                    fs.createReadStream(path.join(__dirname, "hikes.csv"))
                        .pipe(csv())
                        .on("data", (data) => hikes.push(data))
                        .on("end", () => {
                            for (let hike of hikes) {
                                const query = `INSERT INTO \`web\`.\`hikes\`(\`hike_date\`, \`area\`, \`num_of_participants\`, \`participants_age_group\`, \`salary\`, \`hike_details\`, \`counselor_id\`, \`organizer_id\`, \`status\`) 
                                    VALUES ('${hike.hike_date}','${hike.area}','${hike.num_of_participants}','${hike.participants_age_group}',${hike.salary},'${hike.hike_details}',${hike.counselor_id},${hike.organizer_id},'${hike.status}')`;

                                connection.query(
                                    query,
                                    function (err, mysqlres) {
                                        if (err) {
                                            throw new Error(err.message);
                                        } else {
                                            console.log(    //show created hike's ids  
                                                `created a new hike with id: ${mysqlres.insertId}`
                                            );
                                        }
                                    }
                                );
                            }
                        });
                }
            }
        }
    );
};


module.exports = { connection, init };
