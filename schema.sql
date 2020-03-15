drop database if exists roster;
create database roster;

use roster;

create table employee(
    id int auto_increment not null,
    first_name varchar(30) not null,
    last_name varchar(30) not null,
    roleID int not null,
    manager_id int default null,
    primary key(id)
);

create table role(
    title varchar(30) not null,
    salary decimal(10,2) not null, 
    department_id int default 1 null
);

create table department(
name varchar(30) not null
);

select * from employee, role, department;