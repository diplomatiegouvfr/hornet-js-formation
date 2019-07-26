import { ServiceSecure } from "hornet-js-core/src/services/service-secure";
import { Promise } from "hornet-js-utils/src/promise-api";

/**
 * Interface des services de manipulation des personnes
 * @interface
 */
export abstract class PersonneService extends ServiceSecure {
    abstract rechercherPersonnes(data:any): Promise<any>;
    abstract supprimerPersonne(id: number): Promise<any>;
    abstract creer(data: any): Promise<any>;
}