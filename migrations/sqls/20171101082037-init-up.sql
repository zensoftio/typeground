CREATE TABLE users
(
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255)
);
CREATE UNIQUE INDEX users_id_uindex ON users (id);