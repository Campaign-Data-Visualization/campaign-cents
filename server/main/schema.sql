
CREATE DATABASE money2;

USE money2;

CREATE TABLE koch (
  col1 VARCHAR(255),
  col2 VARCHAR(255),
  col3 VARCHAR(255),
  col4 VARCHAR(255)
);

LOAD DATA INFILE "/campaign-cents/server/main/koch1.csv"
INTO TABLE koch
COLUMNS TERMINATED BY ','
LINES TERMINATED BY '\r';

/* Create other tables and define schemas for them here! */




/*  Execute this file from the command line by typing:
 *    mysql < schema.sql
 *  to create the database and the tables.*/




