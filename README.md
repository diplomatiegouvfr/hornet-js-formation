# Exercice 3 : Service Server

## Enoncé
L’objectif de cet exercice est de créer un service data qui effectue la recherche (cf Exercice 2)
- Utiliser une BDD en mémoire (sqlite)
- Implémenter la couche `DAO` avec `squelize`
- Implémenter le service data qui invoque la couche `DAO` pour récupérer les résultats de recherche
- Modifier le service page pour appeler via http, le service data pour récupérer les données qui seront affichées dans le tableau

## Astuce
- Utiliser la correction de [l'exercice 2](https://github.com/diplomatiegouvfr/hornet-js-formation/tree/exercice_2_service_page/client_lite/appliformation-js-lite/) comme base de départ pour réaliser cet exercice

### Initialisation de la BDD
- Ajouter la définition de la table `Personne` dans le fichier `database/01_createTablesSqlite.sql`:

```
CREATE TABLE PERSONNE (
    ID_PERSONNE INTEGER PRIMARY KEY AUTOINCREMENT
    , NOM VARCHAR(50)
    , PRENOM VARCHAR(50)
    , SEXE VARCHAR(1)
    , AGE INTEGER
    , DESC_PERS VARCHAR(255) NULL);

```
- Ajouter dans le fichier `database/02_initDataSqlite.sql` :

```
INSERT INTO PERSONNE (ID_PERSONNE, NOM,  PRENOM, SEXE, AGE, DESC_PERS) VALUES (1, 'Lebon', 'Julien', 'M', 28, '');
INSERT INTO PERSONNE (ID_PERSONNE, NOM,  PRENOM, SEXE, AGE, DESC_PERS) VALUES (2, 'Trebern', 'Gilles', 'M', 66, '');
INSERT INTO PERSONNE (ID_PERSONNE, NOM,  PRENOM, SEXE, AGE, DESC_PERS) VALUES (3, 'Clam', 'Juliette', 'F', 28, '');
INSERT INTO PERSONNE (ID_PERSONNE, NOM,  PRENOM, SEXE, AGE, DESC_PERS) VALUES (4, 'Durant', 'Jacqueline', 'F', 58, '');
INSERT INTO PERSONNE (ID_PERSONNE, NOM,  PRENOM, SEXE, AGE, DESC_PERS) VALUES (5, 'Beat', 'Axel', 'M', 55, '');
INSERT INTO PERSONNE (ID_PERSONNE, NOM,  PRENOM, SEXE, AGE, DESC_PERS) VALUES (6, 'Beat', 'Axelle', 'F', 55, '');
INSERT INTO PERSONNE (ID_PERSONNE, NOM,  PRENOM, SEXE, AGE, DESC_PERS) VALUES (7, 'Lebrun', 'Adrien', 'M', 29, '');
INSERT INTO PERSONNE (ID_PERSONNE, NOM,  PRENOM, SEXE, AGE, DESC_PERS) VALUES (8, 'Dupont', 'Jack', 'M', 28, '');
INSERT INTO PERSONNE (ID_PERSONNE, NOM,  PRENOM, SEXE, AGE, DESC_PERS) VALUES (9, 'Doe', 'Jean', 'M', 28, '');
INSERT INTO PERSONNE (ID_PERSONNE, NOM,  PRENOM, SEXE, AGE, DESC_PERS) VALUES (10, 'Lenoir', 'Adeline', 'F', 28, '');
INSERT INTO PERSONNE (ID_PERSONNE, NOM,  PRENOM, SEXE, AGE, DESC_PERS) VALUES (11, 'Nouvelle', 'Sara', 'F', 28, '');
INSERT INTO PERSONNE (ID_PERSONNE, NOM,  PRENOM, SEXE, AGE, DESC_PERS) VALUES (12, 'Fages', 'Simon', 'M', 28, '');
INSERT INTO PERSONNE (ID_PERSONNE, NOM,  PRENOM, SEXE, AGE, DESC_PERS) VALUES (13, 'Larad', 'Alban', 'M', 28, '');
INSERT INTO PERSONNE (ID_PERSONNE, NOM,  PRENOM, SEXE, AGE, DESC_PERS) VALUES (14, 'Larad', 'Olivier', 'M', 38, '');
INSERT INTO PERSONNE (ID_PERSONNE, NOM,  PRENOM, SEXE, AGE, DESC_PERS) VALUES (15, 'Julien', 'Katrine', 'F', 28, '');
INSERT INTO PERSONNE (ID_PERSONNE, NOM,  PRENOM, SEXE, AGE, DESC_PERS) VALUES (16, 'Julien', 'Christelle', 'F', 18, '');

```
### Implémentation de la couche d'accès aux données
- Dans le dossier `models`, ajouter le fichier `seq-per-mod.ts` pour définir le modèle Sequelize correspondant à la table `Personne`

```
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
```

- Ajouter le fichier `per-mod` contenant le modèle métier de l'entité personne à utiliser dans l'application

```
import Bean from "hornet-js-bean/src/decorators/Bean";
import Map from "hornet-js-bean/src/decorators/Map";

@Bean
export class PersonneMetier {
    @Map()
    id: number;

    @Map()
    nom: string;

    @Map()
    prenom: string;

    @Map()
    sexe: string;

    @Map()
    age: number;

    @Map()
    description: string;
}
```

- Dans le fichier `src\dao\moel-dao.ts`, déclarer l'entité `personneEntity` comme suit :

```
    @Entity("personne", PersonneModel)
    public personneEntity: HornetSequelizeInstanceModel<PersonneAttributes>;
```
- Créer le fichier `per-dao.ts`, le `DAO` de l'entité personne :

```
import Map from "hornet-js-bean/src/decorators/Map";
import {
    HornetSequelizeInstanceModel
} from "hornet-js-database/src/sequelize/hornet-sequelize-attributes";
import { HornetGenericDAO } from "hornet-js-database/src/sequelize/hornet-generic-dao";
import { inject } from "hornet-js-core/src/inject/inject";
import { ModelDAO } from "src/dao/model-dao";
import { injectable } from "hornet-js-core/src/inject/injectable";
import { PersonneMetier } from "src/models/per-mod";
import { PersonneAttributes } from "src/models/seq-per.mod";

var Op = require("sequelize/lib/operators");

@injectable()
export class PersonneDAO extends HornetGenericDAO<ModelDAO, HornetSequelizeInstanceModel<PersonneAttributes>> {
    constructor(entity: string = "personneEntity", @inject(ModelDAO) modelDAO?: ModelDAO) {
        super(modelDAO[entity], modelDAO);
    }

    @Map(PersonneMetier)
    selectByCriteres(data): Promise<PersonneMetier[]> {
        let criteria = {
            where: {
                nom: { [Op.like]: `${data.nom}%`},
                sexe: data.sexe
            },
            attributes: ["id", "nom", "prenom", "sexe", "age", "description"]
        };

        if (data.age) {
            criteria.where["age"] = data.age
        }
        if (data.prenom) {
            criteria.where["prenom"] = { [Op.like]:  `${data.prenom}%`}
        }
        return this.entity.findAll(criteria);
    }
}
```

### Implémentation du service server

Le service data utilisera le `PersonneDAO` pour effectuer la recherche de personnes

- Dans le dossier `src/services/data`, ajouter le dossier `per`.
- Créer le fichier `per-service.ts` contenant l'interface du service data

```
import { ServiceSecure } from "hornet-js-core/src/services/service-secure";

/**
 * Interface des services de manipulation des personnes
 * @interface
 */
export abstract class PersonneService extends ServiceSecure {
    abstract rechercherPersonnes(data:any): Promise<any>
}

```

- Créer le fichier `per-service-impl.ts` contenant l'implémentation de l'interface `PersonneService` :

```

import { PersonneService } from "src/services/data/per/per-service";
import { PersonneMetier } from "src/models/per-mod";
import { PersonneDAO } from 'src/dao/per-dao';

export class PersonneServiceImpl extends PersonneService {

    private personneDAO: PersonneDAO = new PersonneDAO();

    rechercherPersonnes(data:any): Promise<Array<PersonneMetier>> {
        return this.personneDAO.selectByCriteres(data);
    }

}

```

### Implémentation de l'action

- L'action permet d'éxecuter le service data.
- Créer un dossier `per` dans `src/action` et y ajouter le fichier `per-actions.ts` :

```

import { RouteActionService } from 'hornet-js-core/src/routes/abstract-routes';
import { PersonneService } from 'src/services/data/per/per-service';

export class RechercherPersonneAction extends RouteActionService<any, PersonneService> {
  
      execute(): Promise<any> {
          if (this.attributes) {
  
              return this.getService().rechercherPersonnes(this.attributes);
          } else {
              Promise.resolve(true);
          }
      }
  }
```

### Implémentation du service page

Pour rappel, le service data expose un service REST depuis node.
L'IHM se sert de son service page pour invoquer le service data.

- Remplacer le contenu du fichier `src/services/page/per/per-service.impl.ts` par :

```
import { ServicePage } from "hornet-js-core/src/services/service-page";
import { PersonneService, Personne } from "src/services/page/per/per-service";
import { URL_PERSONNE } from '../../../utils/urls';
import { HornetRequest } from 'hornet-js-core/src/services/hornet-superagent-request';


/**
 * Implémentation de l'interface PersonneService
 */
export class PersonneServiceImpl extends ServicePage implements PersonneService {

    /**
     * Recherche les personnes repondant aux critères en entrée
     * @param data : critère de recherche
     */
    rechercherPersonnes(data: any): Promise<any> {
        let uri = `/rechercher/${data.nom}/${data.sexe}`;
        if(data.prenom) {
            uri = `${uri}/${data.prenom}`;
        }
        if(data.age) {
            uri = `${uri}/${data.age}`;
        }
        let request: HornetRequest = {
            url: this.buildUrl(URL_PERSONNE + uri),
            method: "get"
        };
        return this.fetch(request)
    }
}

```

### L'injecteur

l'objet `Injector` gère le registre d'injection : ajout, récupération et suppression d'une valeur.
- Injecter le service data dans le fichier `injector-context-services-data` :

```
import { Injector } from "hornet-js-core/src/inject/injector";
import { Scope } from "hornet-js-core/src/inject/injectable";
import { Utils } from "hornet-js-utils";
import { AuthService } from "src/services/data/auth/auth-service";

// Injector pour databaseConfigName doit être réalisé avant les imports des implementations de services car il est utilisé
// dans ceux ci
Injector.register("databaseConfigName", "config");

import { AuthServiceDataMockImpl } from "src/mock/services/data/auth/auth-service-impl-mock";
import { AuthServiceImpl } from "src/services/data/auth/auth-service-impl";
import { PersonneService } from 'src/services/data/per/per-service';
import { PersonneServiceImpl } from 'src/services/data/per/per-service-impl';

if (Utils.config.getOrDefault("mock.enabled", false) && Utils.config.getOrDefault("mock.serviceData.enabled", false)) {
    Injector.register(AuthService, AuthServiceDataMockImpl, Scope.SINGLETON);
} else {
    Injector.register(AuthService, AuthServiceImpl, Scope.SINGLETON);
    Injector.register(PersonneService, PersonneServiceImpl, Scope.SINGLETON);
}

```

### Définition des routes data

- Créer le fichier `per-server-routes.ts` dans le répertoire `src/routes/per` et y ajouter :

```
import PersonneRoutesClient from "src/routes/per/per-client-routes";
import { DataRouteInfos, PUBLIC_ROUTE } from 'hornet-js-core/src/routes/abstract-routes';
import * as RechercherPersonneAction  from 'src/actions/per/per-actions';
import { PersonneServiceImpl } from "src/services/data/per/per-service-impl";
import { Injector } from 'hornet-js-core/src/inject/injector';
import { PersonneService } from 'src/services/data/per/per-service';

export default class PersonneRoutesServer extends PersonneRoutesClient {
    constructor() {
        super();

        /* Route des datas */
         this.addDataRoute("/rechercher/([A-Za-z]+)/([A-Za-z]+)/([A-Za-z]*)/(\\d*)",
             (nom, sexe, prenom, age) => new DataRouteInfos(RechercherPersonneAction.RechercherPersonneAction, {nom: nom, sexe: sexe, prenom: prenom, age: age}, Injector.getRegistered(PersonneService)),
             PUBLIC_ROUTE,
             "get"
         );

         /* Route des datas */
         this.addDataRoute("/rechercher/([A-Za-z]+)/([A-Za-z]+)",
             (nom, sexe) => new DataRouteInfos(RechercherPersonneAction.RechercherPersonneAction, {nom: nom, sexe: sexe}, Injector.getRegistered(PersonneService)),
             PUBLIC_ROUTE,
             "get"
         );

         /* Route des datas */
         this.addDataRoute("/rechercher/([A-Za-z]+)/([A-Za-z]+)/([A-Za-z]+)",
             (nom, sexe, prenom) => new DataRouteInfos(RechercherPersonneAction.RechercherPersonneAction, {nom: nom, sexe: sexe, prenom:prenom}, Injector.getRegistered(PersonneService)),
             PUBLIC_ROUTE,
             "get"
         );

         /* Route des datas */
         this.addDataRoute("/rechercher/([A-Za-z]+)/([A-Za-z]+)/(\\d*)",
             (nom, sexe, age) => new DataRouteInfos(RechercherPersonneAction.RechercherPersonneAction, {nom: nom, sexe: sexe, age:age}, Injector.getRegistered(PersonneService)),
             PUBLIC_ROUTE,
             "get"
         );
   }
}

```
- Ajouter la lazy route data dans le fichier `src/routes/routes.ts`
