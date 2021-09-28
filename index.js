const mysql = require("mysql");
const logo = require("asciiart-logo");
const express = require("express");
const inquirer = require("inquirer");
const consoleTable = require("console.table"); // Comment this line out if you need index # prior to ID in table.
const { response } = require("express");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "UCLA@coding1",
  database: "Employees_db"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connection #" + connection.threadId);
  init();
});
// TO INITIATE APPLICATION
// DISPLAY LOGO TEXT
const logoText = logo({ name: "Employee Manager" }).render();
console.log(logoText);

// ECHERIRI Employees Management App
function init() {

  inquirer
    .prompt({
      type: "list",
      name: "start",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Departments",
        "View All Roles",
        "View All Employees By Department",
        "View All Employees By Manager",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "Add Employee Role",
        "Add New Department",
        "Remove Department"
      ]
    })

    .then((response) => {
      switch (response.start) {
        case "View All Employees": 
        viewEmployees(); 
        break;

        case "View All Departments": 
        viewDepartments();
        break;

        case "View All Roles": 
        viewRoles();
        break;

        case "View All Employees By Department": 
        viewEmployeesByDepartment();
        break;

        case "View All Employees By Manager": 
        viewEmployeesByManager(); 
        break;

        case "Add Employee": 
        addEmployee(); 
        break;

        case "Remove Employee": 
        removeEmployee(); 
        break;

        case "Update Employee Role": 
        updateEmployeeRole();
        break;

        case "Add Employee Role": 
        addRole();
        break;

        case "Remove Employee Role": 
        removeRole();
        break;
        
        case "Add New Department": 
        addDepartment();
        break;

        case "Remove Department": 
        removeDept();
        break;

        case "Update Employee Manager": 
        updateEmpManager();
        break;

        default:
          return quit();
      }
    })
};

// VIEW ALL EMPLOYEES  //
function viewEmployees() {
const employees = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS role,
CONCAT(manager.first_name,' ',manager.last_name) AS manager, department.name
FROM employee
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON role.department_id = department.id
LEFT JOIN employee manager ON employee.manager_id = manager.id`

connection.query(employees, (err, data) => {
  if (err) throw err;
  console.table(data);
  init()
})
};

//  VIEW ALL DEPARTMENTS //
function viewDepartments() {
  const departments = `SELECT * FROM department`
  connection.query(departments, (err,data) => {
    if (err) throw err;
    console.table(data);
    init();
  })
};

// VIEW ALL ROLES // 
function viewRoles() {
  const roles = `SELECT * FROM role`
  connection.query(roles, (err, data) => {
    if (err) throw err;
    console.table(data);
    init();
  })
};


// VIEW EMPLOYEES BY DEPARTMENTS //
function viewEmployeesByDepartment() {
  const department = ("SELECT * FROM department");
  
  connection.query(department, (err, response) => {
    if (err) throw err;
    const departments = response.map(element => {
      return { name: `${element.name}` }
    });
    
    inquirer.prompt([{
      type: "list",
      name: "dept",
      message: "Please select a department to view employees",
      choices: departments
    
    }]).then(answer => {
      const department = `SELECT employee.first_name, employee.last_name, employee.role_id AS role, CONCAT(manager.first_name,' ',manager.last_name) AS manager, department.name as department 
      FROM employee LEFT JOIN role on employee.role_id = role.id 
      LEFT JOIN department ON role.department_id =department.id LEFT JOIN employee manager ON employee.manager_id=manager.id
      WHERE ?`
      connection.query(department, [{ name: answer.dept }], function (err, res) {
        if (err) throw err;
        console.table(res)
        init();
      })
    })
  })
};



//  VIEW EMPLOYEES BY MANAGER //
function viewEmployeesByManager() {
  let employees = `SELECT * FROM employee e WHERE e.manager_id IS NULL`
  connection.query(employees, (err, res) => {
    if (err) throw err;
    const managers = res.map((element) => {
      return {
        name: `${element.first_name} ${element.last_name}`,
        value: element.id
      }
    });
    inquirer.prompt([{
      type: "list",
      name: "byManager",
      message: "Please select manager to view employees",
      choices: managers
    }])
    .then(response => {
      console.log(response.byManager)
      let manager = `SELECT employee.id, employee.first_name, employee.last_name, employee.role_id AS role, CONCAT(manager.first_name, ' ', manager.last_name) as manager, department.name AS department FROM employee
      LEFT JOIN role on employee.role_id = role.id
      LEFT JOIN department on department.id = role.department_id
      LEFT JOIN employee manager on employee.manager_id = manager.id
      WHERE employee.manager_id = ?`
      connection.query(manager, [response.byManager], (err, data) => {
        if (err) throw err;
        console.table(data);
        init()
      })
    })
  })
};

// TO ADD NEW EMPLOYEE
function addEmployee() {
  let addNew = `SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, role.title, department.name,
  role.salary, employee.manager_id 
  FROM employee
  INNER JOIN role on role.id = employee.role_id
  INNER JOIN department ON department.id = role.department_id`
  connection.query(addNew, (err, results) => {
    if (err) throw err;
    inquirer.prompt([
      {
        type: "input",
        name: "first_name",
        message: "Please enter employee first name"
      }, {
        type: "input",
        name: "last_name",
        message: "Please enter employee last name"
      }, {
        type: "list",
        name: "role",
        message: "Please select employee title",
        choices: results.map(role => {
          return { name: role.title, value: role.role_id }
        })
      }, {
        type: "input",
        name: "manager",
        message: "Please enter employee manager id"
      }])
      .then(answer => {
        console.log(answer);
        connection.query(
          "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)",
          [answer.first_name, answer.last_name, answer.role, answer.manager],
          function (err) {
            if (err) throw err
            console.log(`${answer.first_name} ${answer.last_name} added as a new employee`)
            init();
          })
        })
      })
    };
    
// TO REMOVE EMPLOYEE
function removeEmployee() {
  let terminate = `SELECT * FROM employee`
  connection.query(terminate, (err, res) => {
    if (err) throw err;
    inquirer.prompt([{
      type: "list",
      name: "employeeId",
      message: "Please select employee to remove",
      choices: res.map(employee => {
        return { name: `${employee.first_name} ${employee.last_name}`, value: employee.id }
      })
    }])
    .then(answer => {
      let terminate = `DELETE FROM employee WHERE ?`
      connection.query(terminate, [{ id: answer.employeeId }], (err) => {
        if (err) throw err;
        console.log("Employee removed");
        init();
      })
    })
  })
};

// TO REMOVE ROLE
function removeRole() {
  let downsize = `SELECT * FROM role`
  connection.query(downsize, (err, res) => {
    if (err) throw err;
    inquirer.prompt([{
      type: "list",
      name: "roleId",
      message: "Please select role to remove",
      choices: res.map(roles => {
        return { name: `${roles.title}`, value: roles.id }
      })
    }])
    .then(answer => {
      let downsize = `DELETE FROM role WHERE ?`
      connection.query(downsize, [{ id: answer.roleId }], (err) => {
        if (err) throw err;
        console.log("Role removed");
        init();
      })
    })
  })
};

// TO UPDATE EMPLOYEE ROLE
function updateEmployeeRole() {
  let update = ("SELECT * FROM employee");
  
  connection.query(update, (err, response) => {
    
    const employees = response.map((element) => {
      return {
        name: `${element.first_name} ${element.last_name}`,
        value: element.id
      }
    });
    inquirer.prompt([{
      type: "list",
      name: "employeeId",
      message: "Which employees role do you want to update",
      choices: employees
    }])
    .then(current => {
      connection.query("SELECT * FROM role", (err, data) => {
        
        const roles = data.map((role) => {
          return {
            name: role.title,
            value: role.id
          }
        });
        
        inquirer.prompt([{
          type: "list",
          name: "roleId",
          message: "What's the new role",
          choices: roles
        }])
        .then(updated => {
          const update = `UPDATE employee
          SET employee.role_id = ? 
          WHERE employee.id = ?`
          connection.query(update, [updated.roleId, current.employeeId], (err, res) => {
            var newPosition;
            
            // will return the updated role
            for (var i = 0; i < roles.length; i++) {
              if (roles[i].value == updated.roleId) {
                newPosition = roles[i].name;
              }
            }
            // will return the employee
            var employeeName;
            for (var j = 0; j < employees.length; j++) {
              if (employees[j].value == current.employeeId) {
                employeeName = employees[j].name;
              }
            }
            
            if (res.changedRows === 1) {
              console.log(`Successfully updated ${employeeName} to position of ${newPosition}`);
            } else {
              console.log(`Error: ${employeeName}'s current position is ${newPosition}`)
            }
            init();
          })
        })
      })
    })
  })
};

// TO ADD NEW ROLE
function addRole() {
  let newRole = `SELECT * FROM role`
  connection.query(newRole, (err, data) => {
    if (err) throw err
    inquirer.prompt([
      {
        type: "input",
        name: "roleId",
        message: "Please enter id for new role"
      }, {
        type: "input",
        name: "role",
        message: "Please enter title of new role"
      }, {
        type: "input",
        name: "salary",
        message: "Please enter salary for new role"
      }, {
        type: "input",
        name: "deptId",
        message: "Please enter department id for new role"
      }])
      .then((answers) => {
        let roleValues = `INSERT INTO role VALUES (?,?,?,?)`
        connection.query(roleValues, [answers.roleId, answers.role, answers.salary, answers.deptId], (err) => {
          if (err) throw err;
          console.log(`${answers.role} added as new role`)
          init();
        })
      })
    })
  }
  
  // TO ADD NEW DEPARTMENT
  function addDepartment() {
    let newDepartment = `SELECT * FROM department`
    connection.query(newDepartment, (err, res) => {
      if (err) throw err
      inquirer.prompt([{
        type: "input",
        name: "deptId",
        message: "Please enter id for new department"
      }, {
        type: "input",
        name: "deptName",
        message: "Please enter name for new department"
      }])
      .then(answers => {
        let deptValues = `INSERT INTO department VALUES (?,?)`
        connection.query(deptValues, [answers.deptId, answers.deptName], (err) => {
          if (err) throw err
          console.log(`${answers.deptName} added as a new department`)
          init();
        })
      })
    })
  };
  
  // TO REMOVE DEPARTMENT
  function removeDept() {
    let dropDept = `SELECT * FROM department`
    connection.query(dropDept, (err, res) => {
      if (err) throw err;
      inquirer.prompt([{
        type: "list",
        name: "deptId",
        message: "Please select a department to remove",
        choices: res.map(departments => {
          return { name: `${departments.name}`, value: departments.id }
        })
      }])
      .then(answer => {
        let dropDept = `DELETE FROM department WHERE ?`
        connection.query(dropDept, [{ id: answer.deptId }], (err) => {
          if (err) throw err;
          console.log("Department removed")
          init();
        })
      })
    })
  };
  
  // TO EXIT PROGRAM
  function quit() {
  const logoTxt = logo({ name: "GoodBye!" }).render();
  console.log(logoTxt);
  process.exit();
};