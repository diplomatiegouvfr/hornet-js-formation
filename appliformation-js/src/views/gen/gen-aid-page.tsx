import * as React from "react";
import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-logger/src/logger";
import { HornetPage } from "hornet-js-react-components/src/widget/component/hornet-page";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
import { Notification } from "hornet-js-react-components/src/widget/notification/notification";

const logger: Logger = Logger.getLogger("appliformation-js.views.gen.gen-aid-page");

export class AidePage extends HornetPage<any,HornetComponentProps,any> {

    prepareClient(): void {
    }

    /**
     * @inheritDoc
     */
    render(): JSX.Element {
        logger.trace("VIEW AidePage render");
        return (
            <div>
                <h2>Aide</h2>
                <Notification id="n1"/>
                <div className="pure-g-r">
                    <div className="pure-u-3-4">
                        <h3>Objet de l'application</h3>
                            <p className="texte">Cette application permet de donner un aperçu
                            des éléments intégrés Hornet à travers l'exemple fonctionnel d'un
                            magasin.</p>
                            <h3>Objet de cette page</h3>
                            <p className="texte">Cette page en particulier permet de
                            visualiser le rendu des balises
                                &lt;h2&gt;,
                                    &lt;h3&gt;,
                                        &lt;h4&gt;,
                                            &lt;h5&gt; et
                                                &lt;h6&gt; au travers d'un contenu statique.</p>
                                                    <h4>Données de l’application</h4>
                                                    <h5>Partenaires</h5>
                                                    <p className="texte">Les données de l’application font référence
                            à des personnes fictives.</p>
                                                    <h5>Secteurs</h5>
                                                    <p className="texte">
                                                        Les secteurs d’activité ont été choisi au hasard, n’hésitez pas à les compléter.</p>
                                                    <h5>Le magasin</h5>
                                                    <h6>Notre magasin</h6>
                                                    <p className="texte">
                                                        Notre magasin est fictif, tout comme nos utilisateurs.</p>
                                                    <h6>Où sommes nous ?</h6>
                                                    <p className="texte">
                                                        La commune de l’Etang-Salé existe. Elle est limitrophe des Avirons
                                                        et de Saint-Louis, situés respectivement au nord et à l'est de
                                                        celle-ci. Elle compte sur son territoire une belle forêt littorale,
                                                        la forêt de l'Étang-Salé. Ceci explique sa devise : « Entre mer et
                                                        forêt ». L'Étang-Salé doit son nom à un petit plan d'eau autrefois
                                                        alimenté par les marais. À sa place, aujourd'hui un bel étang,
                                                        royaume des enfants, des petits pêcheurs et des modèles réduits. La
                                                        commune se partage entre trois zones : la station balnéaire, le
                                                        centre-ville, et les hameaux des hauts, ainsi qu'un vaste arrière
                                                        pays montagneux. La longue plage de sable noir n'est pas son moindre
                                                        atout. Autrefois, la modeste bourgade était appelée \u0022village\u0022 par
                                                        les gens du Sud. On y allait en vacances en août. Le reste de
                                                        l'année, l'endroit redevenait le royaume des familles pêcheurs
                                                        \u0022canotte\u0022. Après la forêt, restaurée par l'ONF, on entre dans le
                                                        centre-ville, aux cours encombrées de fruitiers et de fleurs. Plus
                                                        hauts se rencontrent des hameaux de moyenne altitudes, les Canots,
                                                        le Maniron, le Cap ... [ extrait de la page &nbsp;
                                                        <a
                                                            href="http://fr.wikipedia.org/wiki/L%27%C3%89tang-Sal%C3%A9">Wikipédia</a>
                                                        &nbsp;
                                                            au 25/04/2013]
                                                    </p>
                                                    <p className="texte">Bonne navigation.</p>
                    </div>
                </div>
            </div>
        );
    }
}
