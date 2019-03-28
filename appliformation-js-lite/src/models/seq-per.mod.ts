import * as Sequelize from "sequelize";
import { HornetSequelizeAttributes } from "hornet-js-database/src/sequelize/hornet-sequelize-attributes";

export interface PersonneAttributes extends HornetSequelizeAttributes {
    id: number;
    nom: string;
    prenom: string;
    sexe: string;
    age: number;
    description: string;
}

export let PersonneModel: Sequelize.DefineAttributes = {
    id: {
        type: Sequelize.INTEGER,
        field: "id_personne",
        autoIncrement: true,
        primaryKey: true
    },
    nom: {
        type: Sequelize.STRING(50),
        field: "NOM"
    },
    prenom: {
        type: Sequelize.STRING(50),
        field: "PRENOM"
    },
    sexe: {
        type: Sequelize.STRING(1),
        field: "SEXE"
    },
   age: {
        type: Sequelize.INTEGER,
        field: "AGE"
    },
    description: {
        type: Sequelize.STRING(255),
        field: "desc_pers"
    }
};