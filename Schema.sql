DROP DATABASE IF EXISTS EmployeeDB;
CREATE database EmployeeDB;

USE EmployeeDB;

CREATE TABLE department(
id INT NOT NULL,
department VARCHAR(30),
PRIMARY KEY (id)
);


CREATE TABLE role (
id INT NOT NULL,
title VARCHAR(30),
salary DECIMAL(12,3),
department_id INT,
PRIMARY KEY(id),
FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee(
id INT NOT NULL,
first_name VARCHAR(30),
last_name VARCHAR(30),
role_id INT,
manager_id INT NULL,
PRIMARY KEY(id),
FOREIGN KEY (role_id) REFERENCES role(id),
);

SELECT * FROM role, employee, department;