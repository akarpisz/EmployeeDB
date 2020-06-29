USE employeedb;
INSERT INTO role(id, title, salary, department_id) 
VALUES 
(12, "Sales Manager", 55000, 10),
(21, "Finance Manager", 70000, 20),
(31, "Legal Dept. Manager", 130000, 30),
(46, "Engineering Manager", 100000, 45),
(11, "Sales Associate",	40000, 10),
(29, "Accountant", 60000, 20),
(33, "Lawyer", 120000,	30),
(42, "Software Engineer", 80000, 45);

INSERT INTO employee(id, first_name, last_name, role_id, manager_id)
VALUES
(1198, "Jimmy", "Buttze", 12, null), --sales manager--
(4482, "Ben", "Travious", 29, 0934), --fin.--
(0023, "Rick", "Sanchez", 46, null),-- engineering manager--
(0934, "Morty", "McMillion", 21, null),-- finance manager--
(7210, "Summer", "Breeze", 31, null), --legal manager--
(0613, "Drew", "Kay", 42, 0023), --eng--
(7725, "Brian", "Borgie", 33, 7210), --legal--
(1214, "Jason", "Fredman", 11, 1198), --sales--
(5599, "Samantha", "Boombaum", 29, 0934), --fin--
(0857, "Ted", "Bundy", 42, 0023), --eng--
(4132, "Thomas", "Chong", 33, 0710), --legal--
(8452, "Gorgan","Zola", 11, 1198), --sales--
(8451, "Ed", "Gein", 42, 0023) --eng--
;

INSERT INTO department(id, department) VALUES 
(10, "Sales"),
(20, "Finance"),
(30, "Legal"),
(45, "Engineering");