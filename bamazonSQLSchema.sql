
CREATE DATABASE bamazon_DB;


USE bamazon_DB;

CREATE TABLE products (
	item_id INTEGER(10) auto_increment NOT NULL,
    product_name VARCHAR(144) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price decimal(10,2) NOT NULL,
    stock_quantity  INTEGER(10) NOT NULL,
    product_sales decimal(10,2),
    PRIMARY KEY (item_id)
);

INSERT INTO products (
	product_name,
    department_name,
	price,
    stock_quantity)
VALUES 
( "Glass Water Bottle", "Sports", 20.99, 20),
( "Nalgene Water Bottle", "Sports", 10.95, 50),
( "Aeropress Coffee and Espresso Maker", "Kitchen", 29.98, 15),
( "MiniPresso GR Espresso Maker", "Kitchen", 50.95, 10),
( "HooToo TripMate Elite", "Technology", 35.99, 5),
( "Apple TV", "Technology", 20.99, 6),
( "LEGO Batman Movie The Scuttler", "Toys", 63.45, 2),
( "Takenoko Board Game", "Toys", 43.20, 13),
( "Nintendo Switch with Gray Joy-Con", "Video Games", 299.00, 3),
( "The Legend of Zelda: Breath of the Wild", "Video Games", 57.99, 23)
;


CREATE TABLE departments (
	department_id INTEGER(10) auto_increment NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    over_head_costs decimal(10,2) NOT NULL,
    total_sales  decimal(10,2) NOT NULL,
    PRIMARY KEY (department_id)
);


select * from products;

select * from departments;
