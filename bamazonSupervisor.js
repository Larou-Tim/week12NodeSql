var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');
var private = require("./password.js")

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

var menuOptions = ["* View Product Sales by Department",
    "* Create New Department",
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
                addDepartmentMenu();
                break;
            case menuOptions[2]:
                break;
        }
    });
}

function addDepartmentMenu() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the department?",
            name: "name",
        },
        {
            type: "input",
            message: "What is the departments overhead costs?",
            name: "overhead",
        },
        {
            type: "input",
            message: "How much has the department sold so far?",
            name: "sales",
        },


    ]).then(function (user) {
        updateDepartmentSales(user.name, user.overhead, user.sales);
    });

}

function viewProducts() {

    var table = new Table({
        head: ['department_id', 'department_name', "over_head_costs", "product_sales", "total_profit"]
        , colWidths: [20, 20, 20, 20, 20]
    });

    var query = "SELECT * FROM departments";

    connection.query(query, function (err, results) {
        if (err) throw err;
        for (var i in results) {
            table.push(
                [results[i].department_id, results[i].department_name, results[i].over_head_costs, results[i].total_sales, (results[i].total_sales - results[i].over_head_costs).toFixed(2)]
            );
        }
        console.log(table.toString());
        startMenu();
    });

}

function updateDepartmentSales(departmentName, overhead, sales) {
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
                sql: "UPDATE departments SET over_head_costs = ?, total_sales = ? WHERE department_name = ?",
                values: [overhead, sales, departmentName]
            };
            connection.query(query, function (err, results) {
                if (err) throw err;
            });
        }

        else {
            //if department is not there, add it
            var insertQuery = {
                sql: "INSERT INTO departments (department_name, over_head_costs ,total_sales) VALUES (?,?,?)",
                values: [departmentName, overhead, sales,]
            };
            connection.query(insertQuery, function (err, results) {
                if (err) throw err;
            });
        }
    });
    startMenu();
}