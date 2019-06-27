CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
COMMIT;

CREATE TABLE users
(
  id UUID CONSTRAINT "users_pkey" PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  name VARCHAR(255)
);
CREATE UNIQUE INDEX users_id_uindex ON users (id);
