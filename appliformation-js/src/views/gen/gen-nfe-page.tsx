import * as React from "react";
import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-utils/src/logger";
import { HornetPage } from "hornet-js-react-components/src/widget/component/hornet-page";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";

const logger: Logger = Utils.getLogger("appliformation-js.views.gen-nfe-page");

export class NotFoundPage extends HornetPage<any, HornetComponentProps, any> {

    constructor(props?: HornetComponentProps, context?: any) {
        super(props, context);
    }

    prepareClient() {

    }

    /**
     * @inheritDoc
     */
    render(): JSX.Element {
        logger.trace("VIEW NotFoundPage render");
        let error = Utils.getCls("hornet.currentError");
        let messIntl = this.i18n("nfePage");
        let title = messIntl.title ;
        let link = messIntl.backToHome ;
        return (
            <div id="nfe-page">
                <div id="nf-img"></div>
                <h2 className="nfe-title">{title}</h2>
                <a href={this.genUrl(Utils.config.getOrDefault("welcomePage", "/"))} title={""} className="hornet-button nfe-button">
                    {link}
                </a>
            </div>
        );
    }
}
