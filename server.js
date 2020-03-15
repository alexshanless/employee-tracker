const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'alex31216',
    port: 3306,
    database: 'roster'
});

connection.connect(function (err) {
    if (err) throw err;
    init();
});

function init() {
    inquirer.prompt({
        name: 'action',
        type: 'rawlist',
        message: 'What would you like to do?',
        choices: [
            "Add an employee",
            'View an employee',
            'Add a role',
            'View a role',
            'Add a department',
            'View a department',
            'Quit'
        ]
    }).then(function (answer) {
        switch (answer.action) {
            case "Add an employee":
                addEmployee();
                break;

            case "View an employee":
                viewEmployee();
                break;

            case "Update an employee":
                updateEmployee();
                break;

            case 'Add a role':
                addRole();
                break;

            case 'View a role':
                viewRole();
                break;

            case 'Add a department':
                addDepartment();
                break;

            case 'Quit':
                connection.end();

        }
    })
}

function addEmployee() {
    inquirer.prompt([
        {
            name: 'first_name',
            type: 'input',
            message: "Please enter the employee's first name"
        },
        {
            name: 'last_name',
            type: 'input',
            message: "Please enter the employer's last name."
        },
        {
            name: 'roleID',
            type: 'input',
            message: "Please enter the employee' role ID."
        },
        {
            name: 'manager_id',
            type: 'input',
            message: "Please enter the employee's manager's ID number. Press enter if the employee has no manager",
            default: null
        }
    ]).then(function (answers) {
        connection.query(
            'insert into employee set ?',
            {
                first_name: answers.first_name,
                last_name: answers.last_name,
                roleID: answers.roleID,
                manager_id: answer.manager_id || null
            },
            function (err) {
                if (err) throw err;
                inquirer.prompt([
                    {
                        name: 'title',
                        type: 'input',
                        message: "Please enter employee's title"
                    },
                    {
                        name: 'salary',
                        type: 'input',
                        message: "Please enter employee's salary"
                    }
                ]).then(function (answers) {
                    connection.query(
                        'insert into role set ?',
                        {
                            title: answers.title,
                            salary: amswers.salary
                        },

                        function (err) {
                            if (err) throw err;
                            inquirer.prompt({
                                name: 'department_id',
                                type: 'input',
                                message: "Please enter the department ID number."
                            }).then(function (answer) {
                                'insert into department set ?',
                                {
                                    name: answer.department_id
                                },
                                    function (err) {
                                        if (err) throw err;
                                        init();
                                    }
                            });
                        }
                    );
                });
            }
        );
    });
}

function viewEmployee() {
    connection.query("select * from employee", function (err, results) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: 'choice',
                type: 'rawlist',
                choices: function () {
                    const choiceArray = [];
                    for (let i = 0; i < results.length; i++) {
                        console.table(results[i]);
                        choiceArray.push(results[i].first_name);
                    }
                    console.table(choiceArray);
                    return choiceArray;
                },
                message: 'Please select an employee to view'
            }
        ]).then(function (answer) {
            console.table(answer);
            inquirer.prompt({
                name: 'clear',
                type: 'boolean',
                message: 'Press enter key to continue'
            }).then(function (answer) {
                init();
            });
        });
    });
}

function updateEmployee() {
    connectiom.query('select * from employee', function (err, results) {
        if (err) throw err;
        inquierer.prompt([
            {
                name: 'choice',
                type: 'rawlist',
                choice: function () {
                    const choiceArray = [];
                    for (let i = 0; i < results.length; i++) {
                        console.table(results[i]);
                        choiceArray.push(results[i].first_name);
                    }
                    console.table(results[i]);
                    return choiceArray;
                },
                message: 'Please select an employee to update'
            }
        ]).then(function (answer) {
            var chosenItem;
            for (let i = 0; i < results.length; i++) {
                if (results[i].first_name === answer.choice) {
                    chosenItem = results[i];
                }
                console.log(chosenItem.title);
                connection.query(
                    'update role set ? where ?',
                    [
                        {
                            title: answer.title
                        },
                        {
                            id: chosenItem.id
                        }
                    ],
                    function (error) {
                        if (error) throw error;
                        init();
                    });
            }
        })
    })
}

function addRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'new_role',
            message: "What type of role would like to add?"
        },
        {
            type: 'input',
            name: 'new_salary',
            message: "What should the salary be for the new role?"
        },
        {
            type: 'input',
            name: 'new_deptID',
            message: "What is the department ID for the new role?"
        }
    ]).then(function (answer) {
        connection.query('insert into role set ?',
            {
                title: answer.new_role,
                salary: answer.new_salary,
                department_id: answer.new_deptID
            },
            function (err) {
                if (err) throw err;
                console.log('New role was added succesfully!');
                init();
            }
        );
    });
}

function viewRole() {
    connection.query("SELECT * FROM role", function (err, results) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "choice",
                type: "rawlist",
                choices: function () {
                    var choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        console.table(results[i]);
                        choiceArray.push(results[i].title);
                    }
                    console.table(choiceArray);
                    return choiceArray;
                },
                message: "Please select a role to view"
            }
        ]).then(function (answers) {
            console.table(answers);

            inquirer.prompt({
                name: "clear",
                type: "boolean",
                message: "Press enter key to continue"
            }).then(function (answer) {
                init();
            });
        });
    });

}

function addDepartment() {
    inquirer.prompt({
        type: "input",
        name: "new_department",
        message: "Please enter the new department name."
    }).then(function (answer) {
        connection.query("INSERT INTO department SET ?",
            {
                name: answer.new_department
            },
            function (err) {
                if (err) throw err;
                console.log("New department was added successfully!")
                init();
            });
    });
}

function viewDepartment() {
    connection.query("SELECT * FROM department", function (err, results) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "choice",
                type: "rawlist",
                choices: function () {
                    var choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        console.table(results[i]);
                        choiceArray.push(results[i].title);
                    }
                    console.table(choiceArray);
                    return choiceArray;
                },
                message: "Please select a department to view"
            }
        ]).then(function (answers) {
            console.table(answers);

            inquirer.prompt({
                name: "clear",
                type: "boolean",
                message: "Press enter key to continue"
            }).then(function (answer) {
                init();
            });
        });
    });
}