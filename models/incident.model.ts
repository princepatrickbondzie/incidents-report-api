import { Model, DataTypes } from "sequelize";
import sequelize from "../db/db";

class Incident extends Model {
  public client_id!: number;
  public incident_desc!: string;
  public city!: string;
  public country!: string;
  public date!: Date;
  public weather_report!: object;
}

Incident.init(
  {
    client_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    incident_desc: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    weather_report: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "incidents",
    timestamps: false,
    // modelName: "incident",
  }
);

export default Incident;
