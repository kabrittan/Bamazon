//Dependencies and required variables
require("dotenv").config();
//Password protection
var mysqlPW = require("./pwKey.js");
var password = mysqlPW.mysqlPW.mysql_pw;
var inquirer = require("inquirer");
var mysql = require("mysql");
//Establish connection
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: password,
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
    ]).then(function (answers) {
        var arrPosition = products.indexOf(answers.product);
        //this will refer to the object of the chosen product
        var qty = parseInt(answers.quantity);
        if (qty < res[arrPosition].stock_quantity) {
            var newQty = res[arrPosition].stock_quantity - qty;
            //this will be used to update the quantities in mySQL
            var tax = parseFloat((qty * res[arrPosition].price * 0.073).toFixed(2));
            //We live in Arizona, we have to pay taxes on online sales
            var total = (tax + (answers.quantity * res[arrPosition].price)).toFixed(2);
            console.log("Your purchase:\n" + answers.product + " || QTY: " + qty + " || Price/Unit: $" + res[arrPosition].price
                + "\nTax at 7.3%: $" + tax + "\nShipping and Handling: $0.00 (bPrime member)\nTotal: $" + total);
            updateQuantity(newQty, answers.product);
            //updates quanity in mySQL
            connection.end();
        }
        else {
            console.log("We do not have enough " + answers.product + " in stock to fulfill your order.  We currently have " + res[arrPosition].stock_quantity + " in stock at this time.");
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
        ], function (err, res) {
            if (err) throw err;
        }
    );
};

/*
Running this should do the following:
-display all items for sale; include id, name, and price
-prompt user to make a choice:
    -1. id of product to buy
    -2. how many units
-use customer request to check that there are enough units available
    -if not, notify customer and end order
    if so, update sql to show new total units available, show customer total cost of purchase
    nmp needed: mysql, inquirer
*/