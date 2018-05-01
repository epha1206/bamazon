//Dependencies
var inquirer = require("inquirer");
var mysql = require("mysql");

// Connection 
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'bamazon_db'
});

//Function will present a menu option and trigger appropriate logic.
function promptManagerAction() {
    //prompts manager to pick an option
    inquirer.prompt([
        {
            type: 'list',
            name: 'option',
            message: 'Please make a choice:',
            choices: ['View products for sale', 'View low inventory', 'Add to inventory', 'Add new product'],
            filter: function (val) {
                if (val === 'View products for sale'){
                    return 'sale';
                } else if (val === 'View low inventory'){
                    return 'lowInventory';
                } else if (val === 'Add to inventory'){
                    return 'addInventory';
                } else if (val === 'Add new product'){
                    return 'newProduct';
                } else {
                    console.log('ERROR: Unsupported operation!');
                    exit(1);
                }
            }
        }
    ]).then(function(input) {

        //sets off the correct option based on what the user inputs
        if (input.option === 'sale') {
            displayInventory();
        } else if (input.option === 'lowInventory') {
            displayLowInventory();
        } else if (input.option === 'addInventory') {
            addInventory();
        } else if (input.option === 'newProduct') {
            createNewProduct();
        } else {
            console.log('ERROR: Unsupported operation!');
            exit(1);
        }
    })
}

//Function will retrieve inventory from database and output it to console
function displayInventory() {

    //construct db query string
    queryStr = 'SELECT * FROM products';

    //make the query
    connection.query(queryStr, function(err, data) {
        if (err) throw err;

        console.log('Existing Inventory: ');
        console.log('...................\n');

        var strOut = '';
        for (var i = 0; i < data.length; i++) {
            strOut = '';
            strOut += 'Item ID: ' + data[i].item_id + ' // ';
            strOut += 'Product Name: ' + data[i].product_name + ' // ';
            strOut += 'Department: ' + data[i].department_name + ' // ';
            strOut += 'Price: $' + data[i].product_price + ' // ';
            strOut += 'Quantity: ' + data[i].stock_quantity + '\n';

            console.log(strOut);
        }
        console.log("-----------------------------------------------\n");

        //End connection
        connection.end();
    })
}

//Function will let you know which items are running low when they drop to 100
function displayLowInventory() {

    //Query string
    queryStr = 'SELECT * FROM products WHERE stock_quantity < 100';
    //Db query
    connection.query(queryStr, function(err, data) {
        if (err) throw err;

        console.log('Low inventory items (below 100): ');
        console.log('.............................\n');

       var strOut = '';
       for (var i = 0; i < data.length; i++) {
           strOut = '';
           strOut = 'Item ID: ' + data[i].item_id + ' // ';
           strOut = 'Product Name: ' + data[i].product_name + ' // ';
           strOut = 'Department: ' + data[i].department_name + ' // ';
           strOut = 'Price: $' + data[i].product_price + ' // ';
           strOut = "Quantity: " + data[i].stock_quantity + '\n';

           console.log(strOut);
       } 

       console.log("---------------------------------------------------\n");

       //end
       connection.end();
    })
}

//function makes sure the user is inputting whole integers only
function validateInteger(value) {
    var integer = Number.isInteger(parseFloat(value));
    var sign = Math.sign(value);

    if (integer && (sign === 1)) {
        return true;
    } else {
        return 'Please enter a whole number.';
    }
}

//Function makes sure the user is inputting positive numbers only
function validateNumeric(value) {
    var number = (typeof parseFloat(value)) === 'number';
    var positive = parseFloat(value) > 0;

    if (number && positive) {
        return true;
    } else {
        return 'Please enter a positive number.';
    }
}

//function will help user add more inventory to an item
 function addInventory() {

    //prompt user to pick an item
    inquirer.prompt([
        {
            type: 'input',
            name: 'item_id',
            message: 'Please enter Item ID for for stock_count update.';
            validate: validateInteger,
            filter: Number
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'How many would you like to add?',
            validate: vaildateInteger,
            filter: Number
        }
    ]).then(function(input) {
        var item = input.item_id;
        var addQuantity = input.quantity;

        //Query db to make sure user has the correct ID and to determine stock count
        var queryStr = 'SELECT * FROM products WHERE ?';

        connection.query(queryStr, {item_id: item}, function(err, data) {
            if (err) throw err;

            if (data.length === 0) {
                console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
                addInventory();
            
            } else {
                var productData = data[0];

                console.log('Updating Inventory...');

                //Make updating query string
                var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity + addQuantity) + ' WHERE item_id = ' + item;

                //Update the inventory
                connection.query(updateQueryStr, function(err, data) {
                    if (err) throw err;

                    console.log('Stock count for item ID ' + item + ' has been updated to ' + (productData.stock_quantity + addQuantity) + '.');
                    console.log("\n-------------------------------------------------------------------------\n");

                    connection.end();
                })
            }
        })
    })
 }