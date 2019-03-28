import { ContactPage } from "src/views/cnt/gen-cnt-page";
import { AbstractRoutes, PageRouteInfos, PUBLIC_ROUTE } from "hornet-js-core/src/routes/abstract-routes";
import { ContactServiceImpl } from "src/services/page/cnt/contact-service-page-impl";

export default class ContactRoutesClient extends AbstractRoutes {
    constructor() {
        super();

        this.addPageRoute("/",
            () => new PageRouteInfos(ContactPage, null, ContactServiceImpl),
            PUBLIC_ROUTE
        );
    }
}