//Running this application will first display all of the items available for sale, including the ids, names, and prices of products for sale.

//Dependencies and required variables
//require("dotenv").config();
//Password protection
//var mysqlPW = require("./pwKey.js");
//var password = mysqlPW.mysqlPW.mysql_pw;
//I couldn't get this to work, so I am having to enter my sql password!!!
var inquirer = require("inquirer");
var mysql = require("mysql");
//Establish connection
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "Assyla!011609",
    database: "bamazonDB"
});

var products = [];

connection.connect();
connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log("\nWelcome to YOUR on-line drug store!!\n");
    for (var i = 0; i < res.length; i++) {
        console.log("Id: " + res[i].id + " * Item: " + res[i].product_name + " * Price: $" + res[i].product_price);
        products.push(res[i].product_name);
    }
    //Displays all products and prices

    inquirer.prompt([
        {
            name: "product",
            type: "list",
            message: "\nWhich product would you like to purchase first?\n",
            choices: products
        },
        {
            name: "quantity",
            message: "How many would you like to purchase?",
            validate: function(resp) {
                if (isNaN(resp) === true) {
                    console.log("\nPlease choose a number.")
                    return false;
                    //If user inputs anything other than a number, it will prompt user to choose a number
                } else {
                    return true;
                }
            }
        }
    ]).then(function(response) {
        var prodArray = products.indexOf(response.product);
        //Reference the chosen product
        var qty = parseInt(response.quantity);
        if (qty < res[prodArray].stock_quantity) {
            var newQty = res[prodArray].stock_quantity - qty;
            //Updates quantity in DB
            console.log("Your purchase:\n" + response.product + " * Quantity: " + qty + " * Cost: $" + res[prodArray].product_price
                + "\nTotal: $" + total);
            updateQuantity(newQty, response.product);
            connection.end();
        } else {
            console.log("Insufficient quantity of " + response.product + " in stock to fulfill your request.  We currently have " + res[prodArray].stock_quantity + " in stock at this time.");
            connection.end();
        }
    });
});

function updateQuantity(newQty, product) {
    connection.query(
        "UPDATE products SET ? WHERE ?", [
            {
                stock_quantity: newQty
            },
            {
                product_name: product
            }
        ], function(err, res) {
            if (err) throw err;
        }
    );
};
