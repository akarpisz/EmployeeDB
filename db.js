const mysql = require("mysql");
const { prompt } = require("inquirer");
const conn = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "dru",
  password: "Garbage99!!",
  database: "EmployeeDB",
});

conn.connect((err) => {
  if (err) throw err;
  console.log("connected!");
});

let sqlQ =
  "SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.department ";
sqlQ += "FROM employee e LEFT JOIN role r ON r.id = e.role_id ";
sqlQ +=
  "LEFT JOIN department d ON d.id = r.department_id ORDER BY e.last_name;";

module.exports = {
  addEmployee: (query) => {
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
  },
  viewAll: () => {
    conn.query(sqlQ, (err, data) => {
      if (err) throw err;
      console.log("\n\n");
      console.table(data); //return previously
      console.log("\n");
      return console.log("enter y to exit, n to see data again");
      //   return prompt([
      //     {
      //       type: "confirm",
      //       name: "end",
      //       message: "Enter to return",
      //       default: true,
      //     },
      //   ]);
    });
  },
  viewDept: (dept) => {
    let sqlQ =
      "Select * FROM (SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.department ";
    sqlQ += "FROM employee e LEFT JOIN role r ";
    sqlQ += "ON r.id = e.role_id LEFT JOIN department d ";
    sqlQ += "ON d.id = r.department_id) joined ";
    sqlQ += "WHERE joined.department = ?";
    conn.query(sqlQ, [dept], (err, data) => {
      if (err) throw err;
      console.log("\n\n");
      console.table(data);
      return console.log("enter y to exit, n to see data again");
    });
  },
  showMngrs: () => {
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
  },
  byMangr: (manager) => {
    conn.query(
      "SELECT * FROM employee WHERE manager_id = ?",
      [`${parseInt(manager)}`],
      (err, data) => {
        if (err) {
          throw err;
        }
        console.log("\n");
        return console.table(data);
      }
    );
  },
  delQuery: (ans) => {
    console.log(ans);
    conn.query(
      "DELETE FROM employee WHERE id = ?",
      [`${parseInt(ans)}`],
      (err, result) => {
        if (err) {
          return err;
        }
        console.log("\nDelete Successful");
        return;
      }
    );
  },
};
