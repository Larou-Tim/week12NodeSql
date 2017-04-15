var mysql = require("mysql");
var inquirer = require("inquirer");

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



inquirer.prompt([
    {
        type: "input",
        message: "What the ID of the product you would like to buy?",
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

function selectQuery(ID, quantity) {
    var query = {
        sql: "SELECT * FROM products WHERE item_id = ?",
        values: [ID]
    };
    connection.query(query, function (err, results) {
        if (err) throw err;
        if (results[0].stock_quantity >= quantity) {
            updateQuery(ID, (results[0].stock_quantity - quantity));
            console.log("This transaction cost:", results[0].price * quantity)
        }
        else {
            console.log("Insufficient Quantity! We only have",
                results[0].stock_quantity, results[0].product_name);
        }
    });
}

function updateQuery(ID, newQuantity) {
    var query = {
        sql: "UPDATE products SET stock_quantity = ? WHERE item_id = ?",
        values: [newQuantity, ID]
    };
    connection.query(query, function (err, results) {
        if (err) throw err;
    });
}