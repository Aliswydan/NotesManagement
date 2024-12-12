CREATE DATABASE IF NOT EXISTS dbtodo;

CREATE TABLE IF NOT EXISTS TODO(
    todo_id SERIAL PRIMARY KEY,
    title VARCHAR(55),
    description VARCHAR(255)
)


CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL
);