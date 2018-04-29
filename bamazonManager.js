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
        
    })
}