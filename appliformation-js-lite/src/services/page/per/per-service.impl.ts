import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-logger/src/logger";
import { ServicePage } from "hornet-js-core/src/services/service-page";
import { PersonneService, Personne } from "src/services/page/per/per-service";
import { Promise } from "hornet-js-utils/src/promise-api";


// mock à retourner à la vue
const personnes = [
    {
        "identifiant": 1,
        "nom": "Lebon",
        "prenom": "Julien",
        "sexe": "M",
        "age": 28,
        "description": ""
    },
    {
        "identifiant": 2,
        "nom": "Trebern",
        "prenom": "Gilles",
        "sexe": "M",
        "age": 66,
        "description": ""
    },
    {
        "identifiant": 3,
        "nom": "Clam",
        "prenom": "Juliette",
        "sexe": "F",
        "age": 28,
        "description": ""
    },

    {
        "identifiant": 4,
        "nom": "Durant",
        "prenom": "Jacqueline",
        "sexe": "F",
        "age": 58,
        "description": ""
    },

    {
        "identifiant": 5,
        "nom": "Beat",
        "prenom": "Axel",
        "sexe": "M",
        "age": 55,
        "description": ""
    },

    {
        "identifiant": 6,
        "nom": "Beat",
        "prenom": "Axelle",
        "sexe": "F",
        "age": 55,
        "description": ""
    },

    {
        "identifiant": 7,
        "nom": "Lebrun",
        "prenom": "Adrien",
        "sexe": "M",
        "age": 29,
        "description": ""
    },

    {
        "identifiant": 8,
        "nom": "Dupont",
        "prenom": "Jack",
        "sexe": "M",
        "age": 28,
        "description": ""
    },

    {
        "identifiant": 9,
        "nom": "Doe",
        "prenom": "Jean",
        "sexe": "M",
        "age": 28,
        "description": ""
    },
    {
        "identifiant": 10,
        "nom": "Lenoir",
        "prenom": "Adeline",
        "sexe": "F",
        "age": 28,
        "description": ""
    }
];



/**
 * Implémentation de l'interface PersonneService
 */
export class PersonneServiceImpl extends ServicePage implements PersonneService {

    /**
     * Recherche les personnes repondant aux critères en entrée
     * @param data : critère de recherche
     */
    rechercherPersonnes(data: any): Promise<any> {
        return Promise.resolve(personnes);
    }

}
