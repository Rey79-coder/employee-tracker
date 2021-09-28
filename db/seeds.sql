-- Specifies Database
USE EmployeeRoster_db;

-- Department
INSERT INTO department (name) 
VALUES
("Sales"),
("Engineering"),
("Finance"),
("Legal");

-- Role
INSERT INTO role (title, salary, department_id)
VALUES
("Sales Lead", 100000, 1),
("Salesperson", 200000, 2),
("Lead Engineer", 240000, 3),
("Software Engineer", 120000, 4),
("Accountant", 140000, 5),
("Legal Team Lead", 180000, 6),
("Lawyer", 130000, 7),
("Lead Engineer", 100000, 8),
("Desinger and Developer", 240000, 9);

-- Table
INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES
("John", "Doe", 3, null),
("Mike", "Chan", 2, 1),
("Ashley", "Rodriguez", 2, 1),
("Kevin", "Tupik", 2, 1),
("Malia", "Brown", 2, 1),
("Sarah", "Lourd", 1, null),
("Tom", "Allen", 3, 6),
("Christian", "Eckenrode", 3, 6),
("Reyna", "Vera", 9, 7);