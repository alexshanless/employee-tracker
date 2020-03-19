let mysql = require("mysql");
let inquirer = require("inquirer");
let colors = require("colors");

let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "alex31216",
    database: "initech"
});

connection.connect(function (err) {
    if (err) throw err;
    start();
});

function start() {
    //   console.log("inside the start()");
    inquirer
        .prompt([
            {
                name: "action",
                type: "list",
                message: "what would you like to do?",
                choices: ["Add", "View", "Update", "Delete"]
            },
            {
                name: "option",
                type: "list",
                message: "Select from these options?",
                choices: ["Employee", "Role", "Department"]
            }
        ])
        .then(function (res) {
            console.log(`You have chosen to ${res.action} ${res.option}`.bgGreen);

            switch (res.action) {
                case "Add":
                    createData(res.option);
                    break;
                case "View":
                    readData(res.option);
                    break;
                case "Update":
                    updateData(res.option);
                    break;
                case "Delete":
                    deleteData(res.option);
                    break;
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}
//**********data function*************
function createData(option) {
    switch (option) {
        case "Employee":
            connection.query("Select * from role", function (err, res) {
                if (err) throw err;
                const roles = res.map(object => {
                    return {
                        name: object.title,
                        value: object.id
                    };
                });
                roles.push("None");

                connection.query("select * from employees", function (err, res) {
                    if (err) throw err;
                    const employees = res.map(object => {
                        return {
                            name: `${object.first_name} ${object.last_name}`,
                            value: object.id
                        };
                    });
                    employees.unshift({
                        name: "No manager",
                        value: null
                    });

                    inquirer
                        .prompt([
                            {
                                name: "first_name",
                                type: "input",
                                message: "What is the employee's first name?"
                            },
                            {
                                name: "last_name",
                                type: "input",
                                message: "What is the employees last name?"
                            },
                            {
                                name: "role",
                                type: "list",
                                message: "What is the employee's role?",
                                choices: roles
                            },
                            {
                                name: "manager",
                                type: "list",
                                message: "Who is the employee's manager?",
                                choices: employees
                            }
                        ])
                        .then(function (res) {
                            if (res.role === "N/A") {
                                genRolePrompt();
                            } else {
                                console.log(
                                    `Inserting ${res.first_name} ${res.last_name} as a new employee`
                                        .bgGreen
                                );
                                connection.query(
                                    "Insert INTO employees SET ?",
                                    {
                                        first_name: res.first_name,
                                        last_name: res.last_name,
                                        role_id: res.role,
                                        manager_id: res.manager
                                    },
                                    function (err, res) {
                                        if (err) throw err;
                                        console.log("Employee Added");
                                        continuePrompt();
                                    }
                                );
                            }
                        })
                        .catch(function (err) {
                            console.log(err);
                        });
                });
            });
            break;

        case "Role":
            connection.query("Select * FROM department", function (err, res) {
                if (err) throw err;
                const departments = res.map(object => {
                    return {
                        name: object.name,
                        value: object.id
                    };
                });
                departments.push("N/A");

                inquirer
                    .prompt([
                        {
                            name: "title",
                            type: "input",
                            message: "What is the title of the role?"
                        },
                        {
                            name: "salary",
                            type: "number",
                            message: "What is the salary of the new role?"
                        },
                        {
                            name: "department",
                            type: "list",
                            message: "What is the employee's department?",
                            choices: departments
                        }
                    ])
                    .then(function (res) {
                        if (res.department === "N/A") {
                            genDepartmentPrompt();
                        } else {
                            console.log("New role created".bgGreen);
                            connection.query(
                                "INSERT INTO role SET ?",
                                {
                                    title: res.title,
                                    salary: res.salary,
                                    department_id: res.department
                                },
                                function (err, res) {
                                    if (err) throw err;
                                    console.log("Role Inserted".bgGreen);
                                    continuePrompt();
                                }
                            );
                        }
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            });
            break;

        case "Department":
            inquirer
                .prompt([
                    {
                        name: "departmentname",
                        type: "input",
                        message: "New department name?"
                    }
                ])
                .then(function (res) {
                    console.log("New Department incoming.....".bgGreen);
                    connection.query(
                        "INSERT INTO department SET ?",
                        {
                            name: res.departmentname
                        },
                        function (err, res) {
                            if (err) throw err;
                            console.log("Department inserted".bgGreen);
                            continuePrompt();
                        }
                    );
                })
                .catch(function (err) {
                    console.log(err);
                });
            break;
    }
}
//*******read data********

function readData(res) {
    switch (res) {
        case "Employee":
            console.log("Selecting all Employees".bgGreen);
            connection.query("Select * FROM employees", function (err, res) {
                if (err) throw err;
                console.table(res);
                continuePrompt();
            });
            break;
        case "Role":
            console.log("Selecting all roles".bgGreen);
            connection.query("Select * from role", function (err, res) {
                if (err) throw err;
                console.table(res);
                continuePrompt();
            });
            break;
        case "Department":
            console.log("Selecting all Departments".bgGreen);
            connection.query("SELECT * FROM Department", function (err, res) {
                if (err) throw err;
                console.table(res);
                continuePrompt();
            });
            break;
    }
}
//********update stuffs */

function updateData(option) {
    switch (option) {
        case "Employee":
            connection.query("select * from employees", function (err, res) {
                if (err) throw err;
                const employees = res.map(object => {
                    return {
                        name: `${object.first_name} ${object.last_name}`,
                        value: object.id
                    };
                });
                connection.query("Select * FROM role", function (err, res) {
                    if (err) throw err;
                    const roles = res.map(object => {
                        return {
                            name: object.title,
                            value: object.id
                        };
                    });
                    console.log("Updating employee".bgGreen);
                    inquirer
                        .prompt([
                            {
                                name: "employee",
                                type: "list",
                                message: "Which employee would you like to update?",
                                choices: employees
                            },
                            {
                                name: "role",
                                type: "list",
                                message: "What's their new role?",
                                choices: roles
                            }
                        ])
                        .then(function (res) {
                            console.log("Updating existing employee".bgGreen);
                            connection.query(
                                "UPDATE employees set ? where ?",
                                [{ role_id: res.role }, { id: res.employee }],
                                function (err, res) {
                                    if (err) throw err;
                                    console.log("Employee Updated".bgGreen);
                                    continuePrompt();
                                }
                            );
                        })
                        .catch(function (err) {
                            console.log(err);
                        });
                });
            });
            break;
        case "Role":
            console.log("Unable to update Role".bgRed);
            continuePrompt();
            break;
        case "Department":
            console.log("Unable to update Department".bgRed);
            continuePrompt();
            break;
    }
}

//*******Delete stuffs */

function deleteData(option) {
    switch (option) {
        case "Employee":
            connection.query("Select * from employees", function (err, res) {
                if (err) throw err;
                const employees = res.map(object => {
                    return {
                        name: `${object.first_name} ${object.last_name}`,
                        value: object.id
                    };
                });
                inquirer
                    .prompt([
                        {
                            name: "employee",
                            type: "list",
                            message: "Which employee would you like to delete?",
                            choices: employees
                        }
                    ])
                    .then(function (res) {
                        console.log("deleting employee".bgGreen);
                        connection.query(
                            "DELETE FROM employees where ?",
                            [
                                {
                                    id: res.employee
                                }
                            ],
                            function (err, res) {
                                if (err) throw err;
                                console.log("employee removed".bgGreen);
                                continuePrompt();
                            }
                        );
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            });
            break;
        case "Role":
            console.log("Unable to remove a role".bgRed);
            continuePrompt();
            break;
        case "Department":
            console.log("Unable to remove a department".bgRed);
            continuePrompt();
            break;
    }
}

//*************Continue */

function continuePrompt() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "Would you like to continue to exit?",
            choices: ["CONTINUE", "EXIT"]
        })
        .then(function (res) {
            console.log(`${res.action}...\n`.brightBlue.bgGreen);
            switch (res.action) {
                case "EXIT":
                    console.log(
                        "I'm gonna need you to go ahead and come in tomorrow. So if you could be here at around....9 that'd be great"
                            .red.bgYellow
                    );
                    connection.end();
                    break;
                case "CONTINUE":
                    start();
                    break;
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}

function genDepartmentPrompt() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message:
                "Please finish adding this role by creating the appropriate department.",
            choices: ["CONTINUE", "EXIT"]
        })
        .then(function (res) {
            console.log(`${res.action}...\n`);
            switch (res.action) {
                case "EXIT":
                    connection.end();
                    break;
                case "CONTINUE":
                    start();
                    break;
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}