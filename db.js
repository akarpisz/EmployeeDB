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
      console.log("\n");
      return console.table(data);
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
};
