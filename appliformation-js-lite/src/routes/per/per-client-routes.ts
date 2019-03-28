import { AbstractRoutes, PageRouteInfos, PUBLIC_ROUTE } from "hornet-js-core/src/routes/abstract-routes";
import { RecherchePersonneForm } from 'src/views/per/per-form-page';

export default class PersonneRoutesClient extends AbstractRoutes {
    constructor() {
        super();

        this.addPageRoute("/",
            () => new PageRouteInfos(RecherchePersonneForm, null, null),
            PUBLIC_ROUTE
        );
    }
}