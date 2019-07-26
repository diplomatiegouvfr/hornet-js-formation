import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-logger/src/logger";
import { ServiceRequest } from "hornet-js-core/src/services/service-request";
import { Mailer, NodeMailerMessage } from "hornet-js-core/src/mail/mailer";
import { ContactService } from "src/services/page/cnt/contact-service-page";
import { Template } from "hornet-js-utils/src/template";
import { HornetComponent } from "hornet-js-react-components/src/widget/component/hornet-component";
import { Promise } from "hornet-js-utils/src/promise-api";

const logger: Logger = Logger.getLogger("appliformation-js-lite.services.data.cnt.contact-service-data-impl");

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
    envoyer(data: any): Promise<any> {
        logger.trace("SERVICES - send : ", data);

        let valuesToWriteIntoMessage = {
            name: data.nom,
            firstname: data.prenom,
            mail: data.mail,
            content: data.message
        };

        let templatedMessage =
            new Template(HornetComponent.getI18n("contactPage.mailTemplate"))
            .process(valuesToWriteIntoMessage, "?");

        let mailToSend: NodeMailerMessage = {
            from: Utils.config.getOrDefault("mail.mailSender", undefined),
            to: Utils.config.getOrDefault("mail.mailReceiver", undefined),
            subject: HornetComponent.getI18n("contactPage.subject"),
            text: templatedMessage
        };

        return new Promise<any>((resolve) => {
            return Mailer.sendMail(mailToSend, Utils.config.getOrDefault("mail.config", undefined))
            .then((result) => {
                resolve({resolve: result});
            }).catch((error) => {
                resolve({errors: error});
            });
        });
    }
}
