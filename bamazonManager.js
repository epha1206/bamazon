//Dependencies
var inquirer = require("inquirer");
var mysql = require("mysql");

// Connection 
var connection = mysql.createconnection({
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