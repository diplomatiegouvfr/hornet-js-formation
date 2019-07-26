import { AbstractRoutes, PageRouteInfos, PUBLIC_ROUTE } from "hornet-js-core/src/routes/abstract-routes";
import { URL_CONTACT,URL_PERSONNE } from "src/utils/urls";
import { HomePage } from "src/views/gen/gen-hom-page";
import { AidePage } from "src/views/gen/gen-aid-page";
import { PlanAppliPage } from "src/views/nav/nav-pap-page";
import { AccessibilitePage } from "src/views/gen/gen-acb-page";
import { Utils } from "hornet-js-utils";
import { DeclarationconformitePage } from "src/views/gen/gen-ddc-page";
import {Logger} from "hornet-js-logger/src/logger";

const logger: Logger = Logger.getLogger("appliformation-js-lite.routes.routes");

export class Routes extends AbstractRoutes {

    constructor() {
        super();
        if(Utils.isServer){
            this.addClientRoutes();
            this.addServerRoutes();
        }else{
            this.addClientRoutes();
        }
    }

    public addClientRoutes(){
        /* Routes des pages */
        this.addPageRoute("/accueil",
            () => new PageRouteInfos(HomePage),
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
        this.addLazyRoutes(URL_CONTACT, "cnt/gen-cnt-client-routes");

        /* Routes lazy */
        this.addLazyRoutes(URL_PERSONNE, "per/per-client-routes");
    }

    public addServerRoutes(){
        this.addLazyRoutes(URL_CONTACT, "cnt/gen-cnt-server-routes");
    }
}
