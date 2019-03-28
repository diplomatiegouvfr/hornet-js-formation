import { Send } from "src/actions/cnt/gen-cnt-actions";
import { ContactPage } from "src/views/cnt/gen-cnt-page";
import { AbstractRoutes, PageRouteInfos, DataRouteInfos, PUBLIC_ROUTE } from "hornet-js-core/src/routes/abstract-routes";
import { URL_CONTACT, URL_CONTACT_ENVOYER } from "src/utils/urls";
import { ContactServiceImpl } from "src/services/page/cnt/contact-service-page-impl";
import { ContactServiceDataImpl } from "src/services/data/cnt/contact-service-data-impl";

export default class ContactRoutes extends AbstractRoutes {
    constructor() {
        super();

        /* Route des pages */
        this.addPageRoute("/",
            () => new PageRouteInfos(ContactPage, null, ContactServiceImpl),
            PUBLIC_ROUTE
        );

        /* Route des datas */

        this.addDataRoute(URL_CONTACT_ENVOYER,
            () => new DataRouteInfos(Send, null, ContactServiceDataImpl),
            PUBLIC_ROUTE,
            "post"
        );
    }
}