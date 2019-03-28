import * as Sequelize from "sequelize";
import { HornetSequelizeAttributes } from "hornet-js-database/src/sequelize/hornet-sequelize-attributes";

export interface RoleAttributes extends HornetSequelizeAttributes {
    idRole: number;
    rolNom: string;
}

export let RoleModel: Sequelize.DefineAttributes = {
    "idRole": {
        type: Sequelize.INTEGER,
        field: "id_role",
        primaryKey: true,
        allowNull: false,
        unique: "role_pkey"
    },
    "rolNom": {
        type: Sequelize.STRING(15),
        field: "rol_nom",
        allowNull: false
    }
};
