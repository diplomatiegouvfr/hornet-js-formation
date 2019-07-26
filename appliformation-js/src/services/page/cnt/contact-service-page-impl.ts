import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-logger/src/logger";
import { ServiceRequest } from "hornet-js-core/src/services/service-request";
import { URL_CONTACT, URL_CONTACT_ENVOYER } from "src/utils/urls";
import {ContactService} from "src/services/page/cnt/contact-service-page";

const logger: Logger = Logger.getLogger("appliformation-js.services.page.cnt.contact-service-page-impl");

/**
 * Implementation des services pour les contacts
 * @class
 * @implements {ContactService}
 * @extends {ServiceApi}
 */
export class ContactServiceImpl extends ServiceRequest implements ContactService {
    
    /**
     * Envoie d'un message sur contacts
     * @param {object} data message à envoyer
     */
    envoyer(data:any) : Promise<any> {
        logger.info("SERVICES - send : ", data);

        return this.fetch({
            method : "post",
            url : this.buildUrl(URL_CONTACT + URL_CONTACT_ENVOYER),
            data: data
        });
    }
}
