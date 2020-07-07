const inquirer = require("inquirer");
const { prompt } = inquirer;
const mysql = require("mysql");
const ctable = require("console.table");
const conn = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Biggie92#@!*",
  database: "employeedb",
});

let sqlQ =
  "SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.department ";
sqlQ += "FROM employee e LEFT JOIN role r ON r.id = e.role_id ";
sqlQ +=
  "LEFT JOIN department d ON d.id = r.department_id ORDER BY e.last_name;";

conn.connect((err) => {
  if (err) throw err;
  console.log("connected!");
});

const addToDB = async () => {
  prompt([
    {
      name: "id",
      message: "ID Number (4-digit):",
      validate: function (id) {
        return /\d{4}/.test(id);
      },
    },
    {
      name: "firstName",
      message: "Enter employee's first name:",
      validate: (firstName) => {
        return firstName.length > 0;
      },
    },
    {
      name: "lastName",
      message: "Enter employee last name:",
      validate: (lastName) => {
        return lastName.length > 0;
      },
    },
    {
      name: "role_id",
      message: "Enter Role ID:",
      type: "list",
      choices: [
        { value: 11, name: "Sales associate", short: "Sales associate - 11" },
        { value: 29, name: "Accountant", short: "Accountant - 29" },
        {
          value: 42,
          name: "Software engineer",
          short: "Software engineer - 42",
        },
        { value: 33, name: "Lawyer", short: "Lawyer - 33" },
      ],
    },
    {
      name: "manager_id",
      message: "Enter Manager's ID (0 for NULL) :",
    },
  ])
    .then((entry) => {
      console.log(entry);
      let query = [
        `${parseInt(entry.id)}`,
        `${entry.firstName}`,
        `${entry.lastName}`,
        `${parseInt(entry.role_id)}`,
        `${parseInt(entry.manager_id)}`,
      ];
      conn.query(
        "INSERT INTO employee(id, first_name, last_name, role_id, manager_id) VALUES (?,?,?,?,?);",
        query,
        (err) => {
          if (err) {
            throw err;
          } else {
            console.log("done");
          }
        }
      );
    })
    .then(() => {
      main();
    });
};

const viewAll = () => {
  conn.query(sqlQ, (err, data) => {
    if (err) throw err;
    console.log("\n");
    console.table(data);
    prompt([
      {
        type: "confirm",
        name: "end",
        message: "Enter to return",
        default: true,
      },
    ]).then((ans) => {
      if (ans.end) {
        main();
      } else {
        viewAll();
      }
    });
  });
};

const byDept = () => {
  prompt([
    {
      name: "dept",
      type: "list",
      choices: ["finance", "engineering", "legal", "sales"],
    },
  ]).then(async (ans) => {
    try {
      let dept = ans.dept;
      let sqlQ =
        "Select * FROM (SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.department ";
      sqlQ += "FROM employee e LEFT JOIN role r ";
      sqlQ += "ON r.id = e.role_id LEFT JOIN department d ";
      sqlQ += "ON d.id = r.department_id) joined ";
      sqlQ += "WHERE joined.department = ?";

      conn.query(sqlQ, [dept], (err, data) => {
        if (err) throw err;
        console.table(data);
        prompt([
          {
            type: "confirm",
            name: "end",
            message: "Enter to return",
          },
        ]).then((ans) => {
          if (ans.end) {
            main();
          } else {
            byDept();
          }
        });
      });
    } catch (err) {
      return err;
    }
  });
};

const delQuery = (ans) => {
  console.log(ans);
  conn.query(
    "DELETE FROM employee WHERE id = ?",
    [`${parseInt(ans)}`],
    (err, result) => {
      if (err) {
        return err;
      }
      console.log(result);
      console.log("Delete Successful");
      return main();
    }
  );
};

const delEmp = () => {
  conn.query(sqlQ, (err, data) => {
    if (err) throw err;
    console.table(data);

    prompt([
      {
        name: "del",
        message: "What is the id number of the employee you wish to delete?",
        validate: function (del) {
          return /\d{1,4}/.test(del);
        },
      },
    ]).then(async (ans) => {
      delQuery(ans.del);
    });
  });
};
const showMngrs = () => {
  let sqlQ = "SELECT id, first_name, last_name, title, department ";
  sqlQ += "FROM (";
  sqlQ +=
    "SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.department ";
  sqlQ += "FROM employee e LEFT JOIN role r ON r.id = e.role_id ";
  sqlQ +=
    "LEFT JOIN department d ON d.id = r.department_id ORDER BY e.last_name) AS Joined ";
  sqlQ += "WHERE title REGEXP 'Manager$'";

  conn.query(sqlQ, (err, data) => {
    if (err) {
      throw err;
    }
    console.log("\nPress Enter when finished\n");
    return console.table(data);
  });
};
const byMangr = () => {
  showMngrs();
  prompt([
    {
      name: "mang",
      message: "Enter Desired Manager's ID (0 for employees without managers):",
      validate: function (mang) {
        return /^\d{1,4}$/.test(mang);
      },
    },
  ]).then((ans) => {
    conn.query(
      "SELECT * FROM employee WHERE manager_id = ?",
      [`${parseInt(ans.mang)}`],
      (err, data) => {
        if (err) {
          throw err;
        }
        console.table(data);
        prompt([
          {
            type: "confirm",
            name: "end",
            message: "Enter to return",
          },
        ]).then((ans) => {
          if (ans.end) {
            main();
          } else {
            byMangr();
          }
        });
      }
    );
  });
};

const updateRole = () => {
  let empId;

  conn.query(sqlQ, async (err, data) => {
    if (err) {
      throw err;
    }
    console.table(data);
    const { whoChange } = await prompt([
      {
        name: "whoChange",
        message: "Who's role would you like to change (ID#)?",
        validate: function (whoChange) {
          return /^\d{1,4}$/.test(whoChange);
        },
      },
    ]);
    empId = whoChange;

    conn.query("SELECT * FROM role", (err, data) => {
      if (err) {
        throw err;
      }
      console.table(data);

      prompt([
        {
          name: "newRole",
          message: "Enter the new role ID for the employee:",
          validate: function (newRole) {
            return /\d{1,3}$/.test(newRole);
          },
        },
      ]).then((ans) => {
        console.log(ans);

        conn.query(
          "UPDATE employee SET role_id = ? WHERE id = ?",
          [parseInt(ans.newRole), parseInt(empId)],
          (err, result) => {
            if (err) {
              throw err;
            }
            console.log(result);
            return main();
          }
        );
      });
    });
  });
};

const updateMngr = () => {
  conn.query(sqlQ, (err, data) => {
    if (err) {
      throw err;
    }
    console.table(data);
    let emp;
    prompt([
      {
        name: "update",
        message: "Which employee (ID) will have their manager updated?:",
        validate: function (update) {
          return /\d{1,4}$/.test(update);
        },
      },
    ]).then((ans) => {
      emp = ans.update;
      showMngrs();
      prompt([
        {
          name: "mngr",
          message: "New manager ID for selected employee?:",
          validate: function (mngr) {
            return /\d{1,4}$/.test(mngr);
          },
        },
      ]).then((ans) => {
        conn.query(
          "UPDATE employee SET manager_id = ? WHERE id = ?",
          [ans.mngr, `${parseInt(emp)}`],
          (err, result) => {
            if (err) {
              throw err;
            }
            console.log(result);
            main();
          }
        );
      });
    });
  });
};

const main = async () => {
  try {
    const ans = await prompt([
      {
        name: "task",
        message: "What would you like to do?:",
        type: "list",
        choices: [
          "Add employee",
          "View all employees",
          "All employees by department",
          "All employees by manager",
          "Update employee roles",
          "Update Manager",
          "Remove employee",
          "Exit",
        ],
      },
    ]);

    switch (ans.task) {
      case "Add employee":
        await addToDB();
        break;
      case "View all employees":
        await viewAll();
        break;
      case "All employees by department":
        await byDept();
        break;
      case "All employees by manager":
        await byMangr();
        break;
      case "Update employee roles":
        await updateRole();
        break;
      case "Update Manager":
        await updateMngr();
        break;
      case "Remove employee":
        await delEmp();
        break;
      default:
        conn.end();
    }
  } catch (err) {
    return err;
  }
};
main();

//bonus:
//update emp role;
//update emp's mang;
//delete depts, roles, employees
//total utilized budget of department (combined salaries of all employees in dept)
