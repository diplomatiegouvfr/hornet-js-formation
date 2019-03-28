import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-utils/src/logger";
import * as React from "react";
import { Class } from "hornet-js-utils/src/typescript-utils";
import { HornetPage, HornetPageProps } from "hornet-js-react-components/src/widget/component/hornet-page";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
import { Spinner } from "hornet-js-react-components/src/widget/spinner/spinner";
import { HeaderPage } from "hornet-js-react-components/src/widget/header/header-page";
import { FooterPage } from "hornet-js-react-components/src/widget/footer/footer-page";
import { HornetContent } from "hornet-js-react-components/src/widget/component/hornet-content";
import { User } from "hornet-js-react-components/src/widget/user/user";
import { Menu } from "hornet-js-react-components/src/widget/navigation/menu";
import { LayoutSwitcher } from "hornet-js-react-components/src/widget/screen/layout-switcher";
import { ChangeLanguage } from "hornet-js-react-components/src/widget/language/change-language";
import { Dropdown, Position } from "hornet-js-react-components/src/widget/dropdown/dropdown";
import * as ChangeLanguageService from "hornet-js-core/src/services/default/change-language";
import { NavigationUtils } from "hornet-js-components/src/utils/navigation-utils";
import { NotificationSessionFooter } from "hornet-js-react-components/src/widget/notification/notification-session-footer";
import { MenuAccessibilite } from "hornet-js-react-components/src/widget/navigation/menu-accessibilite";


import * as _ from "lodash";
import * as classNames from "classnames";

const logger: Logger = Utils.getLogger("appliformation-js.views.layouts.hornet-app");

export interface HornetAppProps extends HornetPageProps, HornetComponentProps {
    componentContext: any;
    context: any;
    relativeLogoUrl: string;
    content: Class<HornetPage<any, any, any>>;
    headerTitleUrl: string;
}

export class HornetApp extends HornetPage<any, HornetAppProps, any> {

    menu: Menu;

    static defaultProps = {
        composantPage: null,
        workingZoneWidth: "1200px",
        logoUrl: Utils.buildStaticPath("/img/logoHornet.png"),
        headerTitleUrl: "http://intranet.diplomatie.gouv.fr/"
    };

    constructor(props: HornetAppProps, context?: any) {
        super(props, context);
        this.service = new ChangeLanguageService.ChangeLanguage();
        this.listenUrlChangeEvent();
    }


    componentDidMount() {
        super.componentDidMount();
        this.listenUpdatePageExpandEvent();
        if (this.state.error && this.state.error.hasBeenReported) {
            (this.state as any).error = undefined;
        } else if (this.state.error) {
            (this.state as any).error.hasBeenReported = true;
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.error && nextState.error.hasBeenReported) {
            nextState.error = undefined;
        }
    }

    prepareClient() {

    }

    /**
     * @inheritDoc
     */
    render(): JSX.Element {
        logger.trace("VIEW HornetApp render");

        let title = _.concat(this.i18n("header").logoTitle, this.state.applicationTitle).join(" ");

        let classes: any = {
            "mode-fullscreen": this.state.modeFullscreen
        };

        let messIntl = this.i18n("header");

        let applicationTitle = this.i18n("applicationTitle");

        let lienAide = (this.state.linkHelpVisible) ?
            <li><a title={messIntl.help + applicationTitle} href={this.genUrl("/aide")}>{messIntl.help}</a></li>
            : null;
        let lang = <ChangeLanguage handleChangeLanguage={this.handleChangeLanguage} position={Position.BOTTOMRIGHT}/>;
        let user = <User/>;
        let langBanner = <ChangeLanguage id="Change-Language-banner" handleChangeLanguage={this.handleChangeLanguage}
                                         position={Position.BOTTOMRIGHT}/>;
        let userBanner = <User id="user-banner"/>;

        // todo add to banner
        let wrappedUserLang = (
            <div className="userlang fr full-height">
                {userBanner}
                {langBanner}
                <LayoutSwitcher/>
            </div>
        );

        return (
            <div id="site" className={classNames(classes)}>
                <HeaderPage scrollHeight={35}>
                    <div id="header">
                        <MenuAccessibilite/>
                        <div id="header-expanded-zone" className={"inside " + this.state.classNameExpanded}
                             style={{maxWidth: this.state.currentWorkingZoneWidth}}>
                            <div className="fl full-height">
                                <a className="header-link"
                                   title={this.i18n("application.headerTitleText")}
                                   href={this.state.headerTitleUrl}>{this.i18n("application.headerTitle")}</a>
                            </div>
                            <div className="fr full-height user" style={{display: "inline-flex"}}>
                                {user}
                                {lang}
                                <LayoutSwitcher/>
                            </div>
                        </div>
                    </div>
                    <div id="banner">
                        <div id="banner-expanded-zone"
                             className={"inside " + this.state.classNameExpanded}
                             style={{maxWidth: this.state.currentWorkingZoneWidth}}>
                            <div className="fl menu-main-conteneur ">
                                <Menu showIconInfo={true} workingZoneWidth={this.state.currentWorkingZoneWidth}
                                      var={(menu: any) => {
                                          return this.menu = menu;
                                      }}/>
                            </div>
                            <div className="fl mls">
                                <a className="sub-header-link"
                                   href={this.genUrl(Utils.config.getOrDefault("welcomePage", "/"))} title={title}
                                   id="img-logo">
                                    <img src={this.state.logoUrl} alt={this.i18n("applicationTitle")}/>
                                </a>
                            </div>
                            <div className="fl mls">
                                <a className="sub-header-link"
                                   href={this.genUrl(Utils.config.getOrDefault("welcomePage", "/"))} title={title}>
                                    <h1 id="app-title">{this.i18n("applicationTitle")}</h1>
                                </a>
                            </div>
                            {wrappedUserLang}
                        </div>
                        <Spinner/>
                    </div>
                </HeaderPage>
                <HornetContent content={this.state.content} workingZoneWidth={this.state.workingZoneWidth}
                               error={this.state.error}/>
                <NotificationSessionFooter/>
                <FooterPage workingZoneWidth={this.state.currentWorkingZoneWidth}>
                    <div className="fl mll">
                        <ul className="footer-links">
                            <li>
                                <a href={this.genUrl("/planAppli")}
                                   title={messIntl.planTitle + applicationTitle}>{messIntl.plan}</a>
                            </li>
                            <li>
                                <a href={this.genUrl("/politiqueAccessibilite")}
                                   title={messIntl.accessTitle + applicationTitle}>{messIntl.access}</a>
                            </li>
                            <li><a href={this.genUrl("/contact")}
                                   title={messIntl.contactTitle + applicationTitle}>{messIntl.contact}</a>
                            </li>
                            {lienAide}
                        </ul>
                    </div>
                    <div className="fr mrl">
                        <p>{applicationTitle + " - v" + Utils.appSharedProps.get("appVersion")}</p>
                    </div>
                </FooterPage>
            </div>
        );
    }

    /**
     * Méthode permettant de passer en mode plein écran
     */
    onClickLinkFullscreen() {
        this.setState({
            modeFullscreen: !this.state.modeFullscreen
        });
    }

    /**
     * Méthode permettant de changer de langue
     * @param i18nLocale
     */
    private handleChangeLanguage(i18nLocale: string) {

        this.service.changeLanguage({"hornetI18n": i18nLocale}).then((retourApi) => {
            logger.trace("Retour API PartenaireApi.rechercher :", retourApi.body);
            Utils.setCls("hornet.internationalization", retourApi.body);
            window.location.reload();
        });
    }

    /**
     * Méthode permettant de réveiller le serveur node afin de ne pas perdre la session
     * @param i18nLocale
     */
    private handleWakeUpNode(i18nLocale: string) {

        this.service.changeLanguage({"hornetI18n": i18nLocale}).then((retourApi) => {
            logger.trace("Retour service changeLanguage :", retourApi.body);
            Utils.setCls("hornet.internationalization", retourApi.body);
            window.location.reload();
        });
    }
}
