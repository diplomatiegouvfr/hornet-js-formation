import { Send } from "src/actions/cnt/gen-cnt-actions";
import { DataRouteInfos, PUBLIC_ROUTE } from "hornet-js-core/src/routes/abstract-routes";
import { ContactServiceImpl } from "src/services/data/cnt/contact-service-data-impl";
import ContactRoutesClient from "src/routes/cnt/gen-cnt-client-routes";

export default class ContactRoutesServer extends ContactRoutesClient {
    constructor() {
        super();

        /* Route des datas */
         this.addDataRoute("/",
             () => new DataRouteInfos(Send, null, ContactServiceImpl),
             PUBLIC_ROUTE,
             "post"
         );
    }
}