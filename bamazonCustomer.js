//Dependencies
var inquirer = require('inquirer');
var mysql = require('mysql');

//Connection
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,

	// Your username
	user: 'root',

	// Your password
	password: '',
	database: 'bamazon_db'
});

// Makes sure user can only put in positive number
function validateInput(value) {
    var integer = Number.isInteger(parseFloat(value));
    var sign = Math.sign(value);

    if (integer && (sign === 1)) {
        return true;
    } else {
        return 'Please enter a positive whole number.';
    }
}

//Prompt user for item and quantity they would like to purchase
function promptUserPurchase() {

    //Item selection prompt
    inquirer.prompt([
        {
            type: 'input',
            name: 'item_id',
            message: 'Please enter the item Id of the item you would like to purchase.',
            validate: validateInput,
            filter: Number
        },
        {
            type: 'input',
            name: 'stock_quantity',
            message: 'How many would you like?',
            filter: Number
        }
    ]).then(function(input) {
            var item = input.item_id;
            var quantity = input.stock_quantity;

            //query database to confirm item id and quantity
            var queryStr = 'SELECT * FROM products WHERE ?';

            connection.query(queryStr, {item_id: item}, function(err, data) {
                if (err) throw err;

                if (data.length === 0) {
                    console.log('ERROR: Invalid item ID. Please select a valid ID.');
                    displayInventory();
                
                } else {
                    var productData = data[0];

                    //if quantity selected is available
                    if (quantity <= productData.stock_quantity) {
                        console.log('We have item in stock. Thank you for placing order!');

                        //updating query string
                        var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + 'WHERE item_id = ' + item;

                        //Update inventory
                        connection.query(updateQueryStr, function(err, data) {
                            if (err) throw err;

                            console.log('Your order has been placed. Your total is $' + productData.product_price * quantity);
                            console.log('Thank you for shopping with us!');
                            console.log("\n-----------------------------------------------\n");

                            //End database connection
                            connection.end();
                        })
                    } else {
                        console.log('Sorry, there is no more of this item in stock');
                        console.log('Please adjust your order.');
                        console.log("\n-----------------------------------------------\n");

                        displayInventory();
                    };
                };
            });
    });
};

