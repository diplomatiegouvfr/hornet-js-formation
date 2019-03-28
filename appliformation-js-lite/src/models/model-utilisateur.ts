import * as Sequelize from "sequelize";

export let UtilisateurModel: Sequelize.DefineAttributes = {
    "idUtilisateur": {
        type: Sequelize.INTEGER,
        field: "id_utilisateur",
        primaryKey: true,
        allowNull: false,
        unique: "utilisateur_pkey"
    },
    "utiLogin": {
        type: Sequelize.STRING(10),
        field: "uti_login",
        allowNull: false
    },
    "utiPassword": {
        type: Sequelize.STRING(40),
        field: "uti_password",
        allowNull: false
    },
    "utiEnabled": {
        type: Sequelize.BOOLEAN,
        field: "uti_enabled",
        allowNull: false
    }
};
