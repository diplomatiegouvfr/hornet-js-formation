import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-logger/src/logger";
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
        if (data.prenom) {
            uri = `${uri}/${data.prenom}`;
        }
        if (data.age) {
            uri = `${uri}/${data.age}`;
        }
        let request: HornetRequest = {
            url: this.buildUrl(URL_PERSONNE + uri),
            method: "get"
        };
        return this.fetch(request)
    }

    /**
     * Supprime une personne en base
     * @param id : id de la personne à supprimer
     */
    supprimerPersonne(id: number): Promise<any> {
        return this.fetch({ method: "delete", url: this.buildUrl(`${URL_PERSONNE}/${id}`) });
    }


    creer(data: any): Promise<any> {
        return this.fetch({ method: "post", url: this.buildUrl(URL_PERSONNE), data: data });
    }


}
