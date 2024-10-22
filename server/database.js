// database.js or the file where you set up Sequelize
import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "data/database.sqlite",
  // logging: false, // Disable logging if you prefer
});

export default sequelize;
