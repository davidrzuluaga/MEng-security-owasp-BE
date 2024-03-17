import { QueryTypes } from "sequelize";

import sequelize from "./index";

export async function testConnection() {
  try {
    console.time("Conexión and sync");
    await sequelize.authenticate();
    await sequelize.sync();
    console.timeEnd("Conexión and sync");

    console.time("simple consult");
    const result = await sequelize.query("SELECT 1+1 as sum", {
      type: QueryTypes.SELECT,
    });
    console.timeEnd("simple consult");
  } catch (error) {
    console.error("Error to connect to database:", error);
  } finally {
    await sequelize.close();
  }
}
