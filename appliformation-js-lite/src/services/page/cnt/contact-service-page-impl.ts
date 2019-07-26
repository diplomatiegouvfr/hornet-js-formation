import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-logger/src/logger";
import { ServicePage } from "hornet-js-core/src/services/service-page";
import { URL_CONTACT } from "src/utils/urls";
import { ContactService } from "src/services/page/cnt/contact-service-page";
import { Promise } from "hornet-js-utils/src/promise-api";


const logger: Logger = Logger.getLogger("appliformation-js-lite.services.page.cnt.contact-service-page-impl");

/**
 * Implementation des services pour les contacts
 * @class
 * @implements {ContactService}
 * @extends {ServiceApi}
 */
export class ContactServiceImpl extends ServicePage implements ContactService {

    /**
     * Envoie d'un message sur contacts
     * @param {object} data message à envoyer
     */
    envoyer(data: any): Promise<any> {
        logger.trace("SERVICES - send : ", data);

        return this.fetch({
            method: "post",
            url: this.buildUrl(URL_CONTACT),
            data: data
        });
    }
}
