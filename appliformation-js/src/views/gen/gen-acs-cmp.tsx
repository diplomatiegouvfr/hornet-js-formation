import * as React from "react";
import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-logger/src/logger";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
import { HornetComponent } from "hornet-js-react-components/src/widget/component/hornet-component";

const logger: Logger = Logger.getLogger("appliformation-js.views.gen.gen-acs-cmp");

export interface AccessibleComponentProps extends HornetComponentProps {
    linkHelpVisible: boolean,
    linkContactVisible: boolean,
    applicationTitle: string,
    linkFullscreenVisible: boolean,
    onClickLinkFullscreen: any,
    changeInternationalization: Function
}

export class AccessibleComponent extends HornetComponent<AccessibleComponentProps ,any> {
    /**
     * @inheritDoc
     */
    render(): JSX.Element {
        logger.trace("VIEW AccessibleBar render");
        let applicationTitle = this.state.applicationTitle;
        let messIntl = this.i18n("header");

        let lienContact = (this.state.linkContactVisible) ?
            <li><a href={this.genUrl("/contact")}>{messIntl.contact}</a></li>
            : null;
        let lienAide = (this.state.linkHelpVisible) ?
            <li><a href={this.genUrl("/aide")}>{messIntl.help}</a></li>
            : null;

        let lienFullscreen = (this.props.linkFullscreenVisible === true) ?
            <li className="fullscreen">
                <a onClick={this.props.onClickLinkFullscreen} className="icone_action">
                    <img
                        src={AccessibleComponent.genUrlTheme("/img/header/resize-page.png")}
                        alt={""}
                        title={""}
                    />
                </a>
            </li>
            : null;

        return (
            <nav id="infos">
                <div className="logoDiplo">
                    <a id="img_menu_acces"
                       title={this.i18n("application.headerTitle")}
                       href="http://intranet.diplomatie.gouv.fr/">
                        <img src={AccessibleComponent.genUrlTheme("/img/header/logo_diplonet_barre.png")}
                             alt={this.i18n("application.headerTitle")}/>
                    </a>
                </div>
                <ul id="access_liens">
                    <li>
                        <a href="#nav" title={messIntl.menuTitle + applicationTitle}>{messIntl.menu}</a>
                    </li>
                    <li>
                        <a href="#bd" title={messIntl.contentTitle + applicationTitle}>{messIntl.content}</a>
                    </li>
                    <li>
                        <a href={this.genUrl("/planAppli")}
                           title={messIntl.planTitle + applicationTitle}>{messIntl.plan}</a>
                    </li>
                    <li>
                        <a href={this.genUrl("/politiqueAccessibilite")}
                           title={messIntl.accessTitle + applicationTitle}>{messIntl.access}</a>
                    </li>
                    {lienContact}
                    {lienAide}
                    <li>
                        <a href="#"
                           title="langue fr" onClick={this.props.changeInternationalization.bind(this, "fr-FR")}>FR</a>
                    </li>
                    <li>
                        <a href="#"
                           title="langue en" onClick={this.props.changeInternationalization.bind(this, "en-EN")}>EN</a>
                    </li>
                    {lienFullscreen}
                </ul>
            </nav>
        );
    }
}