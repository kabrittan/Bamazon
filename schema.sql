DROP DATABASE IF EXISTS bamazonDB;

CREATE database bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  id INTEGER AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(45) NULL,
  department_name VARCHAR(45) NULL,
  product_price DECIMAL(10,2) NULL,
  stock_quantity INTEGER(11) NOT NULL,
  PRIMARY KEY (id)
);