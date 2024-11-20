import pg from "pg";

    const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "dbtodo",
    password: "3li@admin",
    port: 5444,
    });
  
  db.connect();

  export default db;