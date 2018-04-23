var inquirer = require("inquirer");
var mysql = require("mysql");
//Establish connection
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "Assyla!011609",
    database: "bamazonDB"
});
