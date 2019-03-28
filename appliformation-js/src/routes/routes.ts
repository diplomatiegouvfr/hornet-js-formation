import { AbstractRoutes, PageRouteInfos, PUBLIC_ROUTE } from "hornet-js-core/src/routes/abstract-routes";
import {
    URL_CONTACT
} from "src/utils/urls";
import { HomePage } from "src/views/gen/gen-hom-page";
import { AidePage } from "src/views/gen/gen-aid-page";
import { PlanAppliPage } from "src/views/nav/nav-pap-page";
import { AccessibilitePage } from "src/views/gen/gen-acb-page";
import { DeclarationconformitePage } from "src/views/gen/gen-ddc-page";
import { NotFoundPage } from "src/views/gen/gen-nfe-page";


export class Routes extends AbstractRoutes {
    constructor() {
        super();

        /* Routes des pages */
        this.addPageRoute("/accueil",
            () => new PageRouteInfos(HomePage),
            PUBLIC_ROUTE
        );

        this.addPageRoute("/404",
            () => new PageRouteInfos(NotFoundPage),
            PUBLIC_ROUTE

        );

        this.addPageRoute("/aide",
            () => new PageRouteInfos(AidePage),
            PUBLIC_ROUTE
        );

        this.addPageRoute("/planAppli",
            () => new PageRouteInfos(PlanAppliPage),
            PUBLIC_ROUTE
        );

        this.addPageRoute("/politiqueAccessibilite",
            () => new PageRouteInfos(AccessibilitePage),
            PUBLIC_ROUTE
        );

        this.addPageRoute("/declarationConformite",
            () => new PageRouteInfos(DeclarationconformitePage),
            PUBLIC_ROUTE
        );

        /* Routes lazy */
        this.addLazyRoutes(URL_CONTACT, "cnt/gen-cnt-routes");

    }
}
