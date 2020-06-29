const inquirer = require("inquirer");
const { prompt } = inquirer;
const mysql = require("mysql");
const ctable = require("console.table");
const Prompt = require("inquirer/lib/prompts/base");
const conn = mysql.createConnection({
  host: "localhost",
  //CLEARDB_DATABASE_URL: mysql://b94cee627272fc:a79c6aad@us-cdbr-east-05.cleardb.net/heroku_580a23871c3d8b7?reconnect=true
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
      message: "Enter Manage's ID (0 for NULL) :",
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
  // let sqlQ =
  //   "SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.department ";
  // sqlQ += "FROM employee e LEFT JOIN role r ON r.id = e.role_id ";
  // sqlQ +=
  //   "LEFT JOIN department d ON d.id = r.department_id ORDER BY e.last_name;";
  conn.query(sqlQ, (err, data) => {
    if (err) throw err;
    console.log("\n");
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
    ]).then((ans) => {
      delQuery(ans.del);
    });
  });
};

const byMangr = () => {
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
    console.table(data);
    prompt([
      {
        name: "mang",
        message: "Enter Desired Manager's ID:",
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
        }
      );
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
          "Update employee manager",
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
        break;
      case "Update employee manager":
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
//all emps;
//all emp by dept;
//all emp by mang;
//add emp,
//remove emp;
//update emp role;
//update emp's mang;

//bonus:
//update employee managers
//view employees by manager
//delete depts, roles, employees

//total utilized budget of department (combined salaries of all employees in dept)

//CLEARDB_DATABASE_URL: mysql://b94cee627272fc:a79c6aad@us-cdbr-east-05.cleardb.net/heroku_580a23871c3d8b7?reconnect=true
