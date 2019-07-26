import { Promise } from "hornet-js-utils/src/promise-api";
/**
 * Interface des services pour les contacts
 * @interface
 */
export interface ContactService {
    envoyer(data): Promise<any>;
}
