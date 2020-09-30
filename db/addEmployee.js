
module.exports.addEmployee = function(query) {

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
}

// module.exports = {
//     addEmployee:addEmployee
// }