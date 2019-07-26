import * as React from "react";
import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-logger/src/logger";
import { HornetPage } from "hornet-js-react-components/src/widget/component/hornet-page";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";

const logger: Logger = Logger.getLogger("appliformation-js-lite.views.gen.gen-hom-page");

/**
 * Ecran de page d'accueil de l'application
 */
export class HomePage extends HornetPage<any, HornetComponentProps,any> {

    prepareClient() {
    }

    /**
     * @inheritDoc
     */
    render(): JSX.Element {
        logger.info("VIEW HomePage render");
        return (
            <div id="pageAccueil">
                <h2>Accueil</h2>
            </div>
        );
    }
}