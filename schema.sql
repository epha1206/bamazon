CREATE DATABASE bamazon_db;
USE bamazon_db;

CREATE TABLE products (
item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
product_name VARCHAR(60) NOT NULL,
department_name VARCHAR(20) NOT NULL,
product_price DECIMAL(8, 2) NOT NULL,
stock_quantity INTEGER(11) NOT NULL,
PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, product_price, stock_quantity)
VALUES  ('Red Bull', 'Beverages', 1.99, 600),
        ('Axe Body Spray', 'Cosmetics', 3.99, 500),
        ('Macbook Pro', 'Electronics', 1200.99, 150),
        ('Xbox One', 'Electronics', 399.99, 300),
        ('Dove Body Wash', 'Cosmetics', 4.99, 700),
        ('Advil', 'Pharmacy', 3.99, 800),
        ('Band-Aids', 'Pharmacy', 2.99, 750),
        ('Sunny Delight', 'Beverages', 3.49, 900),
        ('Champions T-shirt', 'Clothing', 10.99, 200),
        ('Nike Shorts', 'Clothing', 19.99, 250),
        ('PS4', 'Electronics', 399.99, 350),
        ('JBL Speaker', 'Electronics', 49.99, 900);