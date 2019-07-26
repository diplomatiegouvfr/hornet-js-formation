import * as React from "react";
import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-logger/src/logger";
import { HornetPage } from "hornet-js-react-components/src/widget/component/hornet-page";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
import { Plan } from "hornet-js-react-components/src/widget/navigation/plan";

const logger: Logger = Logger.getLogger("appliformation-js-lite.views.nav.nav-pap-page");

/**
 * Ecran du plan de l'application
 */
export class PlanAppliPage extends HornetPage<any, HornetComponentProps, any> {

    prepareClient() {
    }

    /**
     * @inheritDoc
     */
    render(): JSX.Element {
        logger.info("VIEW PlanAppliPage render");
        return (
            <div>
                <h2>{this.i18n("navigation.plan")}</h2>
                <Plan/>
            </div>
        );
    }
}
