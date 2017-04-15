var mysql = require("mysql");
var inquirer = require("inquirer");

var menuOptions = ["* View Products for Sale",
    "* View Low Inventory",
    "* Add to Inventory",
    "* Add New Product",
    "* Exit"];

startMenu();

function startMenu() {

    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do today?",
            choices: menuOptions,
            name: "menu",
        }

    ]).then(function (user) {

        switch (user.menu) {
            case menuOptions[0]:
                viewProducts();
                break;
            case menuOptions[1]:
                viewLowInventory();
                break;
            case menuOptions[2]:
                addInventoryMenu();
                break;
            case menuOptions[3]:
                addProductMenu();
                break;
            case menuOptions[4]:
                break;
        }
    });
}

function addInventoryMenu() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the ID of the product?",
            name: "productID",
        },
        {
            type: "input",
            message: "How many units are you adding?",
            name: "newStock",
        },


    ]).then(function (user) {
        addInventory(user.productID, user.newStock);
    });

}

function addProductMenu() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the product?",
            name: "name",
        },
        {
            type: "input",
            message: "What Department is this product?",
            name: "department",
        },
        {
            type: "input",
            message: "What is the price this product?",
            name: "price",
        },
        {
            type: "input",
            message: "How many units of this product?",
            name: "stock",
        },


    ]).then(function (user) {
        addProduct(user.name, user.department, user.price, user.stock);
    });

}

// SQL functions
// ---------------------------------
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: 'root',
    password: 'M..7608891648',
    database: 'bamazon_DB'
});

connection.connect(function (err) {
    if (err) {
        console.log(err);
    }
});

function viewProducts() {

    var query = "SELECT item_id, product_name, price, stock_quantity FROM products";

    connection.query(query, function (err, results) {
        if (err) throw err;
        for (var i in results) {
            console.log("");
            console.log("\t Item #" + results[i].item_id);
            console.log("\t Item Name:", results[i].product_name);
            console.log("\t Item Price", results[i].price);
            console.log("\t Item Quantity:", results[i].stock_quantity);
        }
        console.log("");
        startMenu();
    });
}

function viewLowInventory() {
    var query = "SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5";

    connection.query(query, function (err, results) {
        if (err) throw err;
        for (var i in results) {
            console.log("");
            console.log("\t Item #" + results[i].item_id);
            console.log("\t Item Name:", results[i].product_name);
            console.log("\t Item Price", results[i].price);
            console.log("\t Item Quantity:", results[i].stock_quantity);
        }
        console.log("");
        startMenu();
    });
}

function addInventory(ID, newQuantity) {
    var selectQuery = {
        sql: "select stock_quantity FROM products WHERE item_id = ?",
        values: [ID]
    };

    connection.query(selectQuery, function (err, results) {
        if (err) throw err;


        var newTotal = results[0].stock_quantity + parseInt(newQuantity);

        var updateQuery = {
            sql: "UPDATE products SET stock_quantity = ? WHERE item_id = ?",
            values: [newTotal, ID]
        };
        connection.query(updateQuery, function (err, results) {
            if (err) throw err;
            startMenu();
        });


    });
}

function addProduct(name, department, price, stock) {

    var insertQuery = {
        sql: "INSERT INTO products (product_name,department_name,price,stock_quantity) VALUES (?,?,?,?)",
        values: [name, department, price, stock]
    };
    connection.query(insertQuery, function (err, results) {
        if (err) throw err;
        startMenu();
    });
}
