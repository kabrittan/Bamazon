
require("dotenv").config();

var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ,
    database: "bamazon_db"
});

var products = [];

connection.connect();
connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
        console.log("ID: " + res[i].id + " || Product: " + res[i].product_name + " || Price: $" + res[i].price);
        products.push(res[i].product_name);
    }

    inquirer.prompt([
        {
            name: "product",
            type: "list",
            message: "Which product would you like to purchase?",
            choices: products
        },
        {
            name: "quantity",
            message: "How many would you like to purchase?",
            validate: function (ans) {
                if (isNaN(ans) === true) {
                    console.log("\nPlease choose a numerical value.")
                    return false;
                    //if user input is not a number than it will not accept the value of the input
                }
                else {
                    return true;
                }
            }
        }
    