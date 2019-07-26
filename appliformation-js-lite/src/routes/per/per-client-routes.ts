import { AbstractRoutes, PageRouteInfos, PUBLIC_ROUTE } from "hornet-js-core/src/routes/abstract-routes";
import { RecherchePersonneForm } from "src/views/per/per-form-page";
import { PersonneServiceImpl } from "src/services/page/per/per-service.impl";

export default class PersonneRoutesClient extends AbstractRoutes {
    constructor() {
        super();

        this.addPageRoute("/",
            () => new PageRouteInfos(RecherchePersonneForm, null, PersonneServiceImpl),
            PUBLIC_ROUTE
        );
    }
}