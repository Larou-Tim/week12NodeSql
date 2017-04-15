var mysql = require("mysql");
var inquirer = require("inquirer");
var private = require("./ignore/password.js")

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: 'root',
    password: private.private,
    database: 'bamazon_DB'
});

connection.connect(function (err) {
    if (err) {
        console.log(err);
    }
});

startMenu(); 

function startMenu() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the ID of the product you would like to buy?",
            name: "prodID",
        },
        {
            type: "input",
            message: "How many would you like to buy?",
            name: "amount",
        },

    ]).then(function (user) {
        selectQuery(user.prodID, user.amount);
    });
}

function selectQuery(ID, quantity) {
    var query = {
        sql: "SELECT * FROM products WHERE item_id = ?",
        values: [ID]
    };
    connection.query(query, function (err, results) {
        if (err) throw err;
        if (results[0].stock_quantity >= quantity) {
            var currentCost = results[0].price * quantity;
            var currentRevenue = results[0].product_sales || 0;

            updateQuery(ID, (results[0].stock_quantity - quantity), (currentRevenue + currentCost));
            updateDepartmentSales(results[0].department_name, (currentRevenue + currentCost));
            console.log("This transaction cost:", currentCost)
        }
        else {
            console.log("Insufficient Quantity! We only have",
                results[0].stock_quantity, results[0].product_name);
        }
        startMenu();
    });
}

function updateQuery(ID, newQuantity, totalSales) {
    var query = {
        sql: "UPDATE products SET stock_quantity = ?, product_sales = ?  WHERE item_id = ?",
        values: [newQuantity, totalSales, ID]
    };
    connection.query(query, function (err, results) {
        if (err) throw err;
    });
}

function updateDepartmentSales(departmentName, newTotal) {
    //test if department is already there
    var query = {
        sql: "SELECT * FROM departments WHERE department_name = ?",
        values: [departmentName]
    };
    connection.query(query, function (err, results) {
        if (err) throw err;

        if (results[0]) {
            //if department is there update it
            var query = {
                sql: "UPDATE departments SET total_sales = ? WHERE department_name = ?",
                values: [newTotal, departmentName]
            };
            connection.query(query, function (err, results) {
                if (err) throw err;
            });
        }

        else {
            //if department is not there, add it
            var insertQuery = {
                sql: "INSERT INTO departments (department_name, over_head_costs ,total_sales) VALUES (?,?,?)",
                values: [departmentName, (newTotal * .8), newTotal]
            };
            connection.query(insertQuery, function (err, results) {
                if (err) throw err;
            });
        }
    });




}

