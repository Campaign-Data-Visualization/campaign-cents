CREATE DATABASE testdata;

USE testdata;

CREATE TABLE test (
  id MEDIUMINT NOT NULL AUTO_INCREMENT, 
  test_id INTEGER(3),
  text VARCHAR(140),
  room_id INTEGER(3),
  time_stamp TIMESTAMP,
  PRIMARY KEY(id)
);

CREATE TABLE testusers (
  id MEDIUMINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(25),
  PRIMARY KEY(id)
);
/* Create other tables and define schemas for them here! */




/*  Execute this file from the command line by typing:
 *    mysql < schema.sql
 *  to create the database and the tables.*/




