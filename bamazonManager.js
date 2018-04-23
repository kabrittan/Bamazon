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
var department = [];

inquirer.prompt([
    {
        name: "action",
        type: "rawlist",
        message: "What would you like to do first?",
        choices: ["View Current Products", "View Low Inventory", "Add New Inventory", "Add New Product"]
    }
]).then(function(resp) {
    switch (resp.action) {
        case "View Current Products":
            viewProd();
            break;

        case "View Low Inventory":
            lowInv();
            break;

        case "Add New Inventory":
            addInv();
            break;

        case "Add New Product":
            addProduct();
            break;
    }
});

function viewProd() {
    //This part is basically a copy and paste from bamazonCustomer
    connection.connect();
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("Id: " + res[i].id + " * Item: " + res[i].product_name + " * Price: $" + res[i].product_price + " * Current Quantity: " + res[i].stock_quantity);
        }
    });
    connection.end();
}

function lowInv() {
    connection.connect();
    connection.query("SELECT * FROM products WHERE stock_quantity < 10", function(err,res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("Low inventory on the following products:\nId:" + res[i].id + " * Item: " + res[i].product_name + " * Quantity: " + res[i].stock_quantity);
        } 
    });
    connection.end();
}
