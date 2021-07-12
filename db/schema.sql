-- Drops the EmployeeRoster_db if it already exists
DROP DATABASE IF EXISTS EmployeeRoster_db;

-- Creates Database EmployeeRoster_db, OK for use.
CREATE database EmployeeRoster_db;
USE EmployeeRoster_db;

-- Department Table Specs
CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

-- Role Table Specs
CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL (10,2) NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (id)
);

-- Employee Table Specs
CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NULL,
  last_name VARCHAR(30) NULL,
  role_id INT NULL,
  manager_id INT NULL,
  PRIMARY KEY (id)
);
