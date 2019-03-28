DROP TABLE IF EXISTS ROLE_UTILISATEUR;
DROP TABLE IF EXISTS ROLE;
DROP TABLE IF EXISTS UTILISATEUR;
DROP TABLE IF EXISTS PERSONNE;

CREATE TABLE UTILISATEUR (
    ID_UTILISATEUR INTEGER PRIMARY KEY AUTOINCREMENT
    , UTI_LOGIN VARCHAR(10) NOT NULL
    , UTI_PASSWORD VARCHAR(40) NOT NULL
    , UTI_ENABLED BOOLEAN DEFAULT FALSE NOT NULL );

CREATE TABLE ROLE (
    ID_ROLE INTEGER PRIMARY KEY AUTOINCREMENT
    , ROL_NOM VARCHAR(30) NOT NULL);

CREATE TABLE ROLE_UTILISATEUR (
    ID_ROLE INTEGER NOT NULL
    , ID_UTILISATEUR INTEGER NOT NULL
    , CONSTRAINT FK_ROLE_UTILISATEUR_U FOREIGN KEY(ID_UTILISATEUR) REFERENCES UTILISATEUR(ID_UTILISATEUR)
    , CONSTRAINT FK_ROLE_UTILISATEUR_R FOREIGN KEY(ID_ROLE) REFERENCES ROLE(ID_ROLE)
    , CONSTRAINT PK_ROLE_UTILISATEUR PRIMARY KEY(ID_ROLE, ID_UTILISATEUR));

CREATE TABLE PERSONNE (
    ID_PERSONNE INTEGER PRIMARY KEY AUTOINCREMENT
    , NOM VARCHAR(50)
    , PRENOM VARCHAR(50)
    , SEXE VARCHAR(1)
    , AGE INTEGER
    , DESC_PERS VARCHAR(255) NULL);

