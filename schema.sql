  
create database initech;

use initech;

create table department (
id INTEGER(11) AUTO_INCREMENT NOT NULL,
name VARCHAR(30) NOT NULL,
PRIMARY KEY (id)
);

create table role (
id INTEGER(11) AUTO_INCREMENT NOT NULL,
title VARCHAR(30) NOT NULL,
salary DECIMAL(10,2) NOT NULL,
department_id INTEGER(11) NOT NULL,
PRIMARY KEY (id)
);

create table employees (
id INTEGER(11) AUTO_INCREMENT not null,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INTEGER(11),
manager_id INTEGER(11) NULL,
PRIMARY KEY(id)
);