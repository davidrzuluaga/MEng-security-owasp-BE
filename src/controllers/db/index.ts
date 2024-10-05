import { Client } from "pg";

const client = new Client({
  user: "daviddb_owner",
  password: "yg1aIwlUVu9o",
  host: "ep-aged-paper-a4uzzvhq.us-east-1.aws.neon.tech",
  port: 5432,
  database: "daviddb",
  ssl: {
    rejectUnauthorized: false,
  },
});

export default client;
