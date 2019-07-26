import * as React from "react";
import { HornetPage, HornetPageProps } from "hornet-js-react-components/src/widget/component/hornet-page";
import { HornetComponentProps } from 'hornet-js-components/src/component/ihornet-component';
import { Form } from 'hornet-js-react-components/src/widget/form/form';
import { Row } from 'hornet-js-react-components/src/widget/form/row';
import { RadiosField } from 'hornet-js-react-components/src/widget/form/radios-field';
import { InputField } from 'hornet-js-react-components/src/widget/form/input-field';
import { ButtonsArea } from 'hornet-js-react-components/src/widget/form/buttons-area';
import { Button } from 'hornet-js-react-components/src/widget/button/button';
import { DataSource } from 'hornet-js-core/src/component/datasource/datasource';
import * as schema from "src/views/per/per-form-page.validation.json";
import * as schemaForCreationn from "src/views/per/per-form-creation.page.validation.json"
import { PersonneService, Personne } from "src/services/page/per/per-service";
import { DefaultSort } from 'hornet-js-core/src/component/datasource/options/datasource-option';
import { SortData } from 'hornet-js-core/src/component/sort-data';
import { Table } from 'hornet-js-react-components/src/widget/table/table';
import { Content } from 'hornet-js-react-components/src/widget/table/content';
import { Columns } from 'hornet-js-react-components/src/widget/table/columns';
import { Column } from 'hornet-js-react-components/src/widget/table/column';
import { Header } from 'hornet-js-react-components/src/widget/table/header';
import { AuthUtils } from 'hornet-js-utils/src/authentication-utils';
import { Roles } from 'src/utils/roles';
import { ActionColumn } from 'hornet-js-react-components/src/widget/table/column/action-column';
import { Notifications, NotificationType, NotificationManager } from 'hornet-js-core/src/notification/notification-manager';
import { Notification } from 'hornet-js-react-components/src/widget/notification/notification';
import { MenuActions } from 'hornet-js-react-components/src/widget/table/menu-actions';
import { ActionButton } from 'hornet-js-react-components/src/widget/table/action-button';
import { Modal } from "hornet-js-react-components/src/widget/dialog/modal";
import { SvgSprites } from "hornet-js-react-components/src/widget/icon/svg-sprites";


export class RecherchePersonneForm extends HornetPage<PersonneService, HornetPageProps, any> {

   
    // référence du formulaire
    private formRecherche: Form;
    private inputAge: InputField<any, any>;
    //Datasource du champ sexe
    private dataSourceSexe: DataSource<any>;
    // Datasource du champ sexeForCreation
    private dataSourceSexeForCreation: DataSource<any>;
    // message intl du formulaire
    private intlMessages = this.i18n("recherchePersonne.form");
    // Déclaration de la liste des objets qui seront utilisés dans le champs sexe
    private listSexe: any[] = [
        {
            value: this.intlMessages.sexe.feminin.code,
            libelle: this.intlMessages.sexe.feminin.libelle,
        },
        {
            value: this.intlMessages.sexe.masculin.code,
            libelle: this.intlMessages.sexe.masculin.libelle,
        }];

    // datasource utilisée pour le tableau de résultat de recherche
    private tableDataSource: DataSource<any>;
    // référence du tableau
    private maTable: Table;

    // référence du formulaire d'ajout de personne
    private formAjouter: Form;

    // référence de la modale
    private maModale: Modal;

    /**
     * @inheritDoc
     */
    constructor(props?: HornetComponentProps, context?: any) {
        super(props, context);
        // initialisation du datasource sexe avec les valeurs par possibles
        this.dataSourceSexe = new DataSource(this.listSexe, { value: "value", label: "libelle" });
        this.dataSourceSexeForCreation = new DataSource(this.listSexe, { value: "value", label: "libelle" });

        // Valeur par défaut du bouton radio sexe
        this.dataSourceSexe.select(this.dataSourceSexe.results[0]);
        // initialisation de la datasource utilisée par le tableau
        const sort: DefaultSort = new DefaultSort([new SortData("nom")]);
        this.tableDataSource = new DataSource<Personne>([], {}, [sort]);
    }

    /**
     * @inheritDoc
     */
    render(): JSX.Element {

        return (
            <div>
                <h2>Recherche de personnes</h2>
                <Notification id="notifPerPage" />
                {this.renderForm()}
                {this.renderTable()}
            </div>
        );
    }

    /**
     * Construit le formulaire de recherche
     */
    renderForm(): JSX.Element {
        return (
            <Form
                id="recherchePersForm"
                formMessages={this.intlMessages}
                schema={schema}
                onSubmit={this.onSubmit}
                ref={(form) => { this.formRecherche = form; }}
            >
                <Row>
                    <InputField id="nom"
                        name="nom"
                        required={true}
                        label={this.intlMessages.fields.nom.label} />
                    <InputField id="prenom"
                        name="prenom"
                        label={this.intlMessages.fields.prenom.label} />
                </Row>
                <Row>
                    <RadiosField name="sexe"
                        dataSource={this.dataSourceSexe}
                        label={this.intlMessages.fields.sexe.label}
                        labelClass="blocLabelUp"
                        required={true}
                        inline={RadiosField.Inline.FIELD}
                    />
                    <InputField id="age"
                        name="age"
                        label={this.intlMessages.fields.age.label}
                        type="number" ref={(elt) => { this.inputAge = elt; }} />
                </Row>

                <ButtonsArea>
                    <Button type="submit"
                        id="envoi"
                        name="action:envoi"
                        value="Valider"
                        className="hornet-button"
                        label={this.i18n("form.search")}
                        title={this.i18n("recherchePersFormitle")} />
                    <Button type="button"
                        id="reinitialiser"
                        name="action:reinitialiser"
                        value="Réinitialiser"
                        className="hornet-button"
                        label={this.i18n("form.reinit")}
                        title={this.i18n("form.reinitTitle")}
                        onClick={this.onReinitialiser} />
                </ButtonsArea>
            </Form>

        );
    }

    /**
     * Construit le tableau
     */
    renderTable(): JSX.Element {
        const intlTab: any = this.i18n("recherchePersonne.tableau");
        return (
            <div>
                <Table ref={(table) => { this.maTable = table; }} id="liste-personnes">
                    <Header title={intlTab.summary}>
                        <MenuActions>
                            <ActionButton title={intlTab.ajouter}
                                srcImg={<SvgSprites icon="add" height="1.5em" width="1.5em" color="#FFF" tabIndex={-1} />}
                                action={this.ajouterPersonne} priority={true} displayedWithoutResult={true} disabled={!this.isAdmin()}/>
                        </MenuActions>
                    </Header>
                    <Content dataSource={this.tableDataSource}>
                        <Columns>
                            <Column keyColumn="nom" title={intlTab.colonnes.nom} sortable={true} hiddenable={false} />
                            <Column keyColumn="prenom" title={intlTab.colonnes.prenom} sortable={true} />
                            <Column keyColumn="sexe" title={intlTab.colonnes.sexe} sortable={true} />
                            <Column keyColumn="age" title={intlTab.colonnes.age} sortable={true} />
                            <ActionColumn keyColumn="supprimer"
                                alt={intlTab.colonnes.suppressionTitle}
                                srcImg={<SvgSprites icon="delete" height="1.5em" width="1.5em" color="#0579be" tabIndex={-1} />}
                                action={this.supprimer}
                                messageAlert={intlTab.colonnes.supprimer.message}
                                titleAlert={intlTab.colonnes.supprimer.title}
                                disabled={() => !this.isAdmin()}
                            />
                        </Columns>
                    </Content>
                </Table>
                <Modal ref={(modal: Modal) => {
                    this.maModale = modal;
                }} withoutOverflow={true} underlayClickExits={false} focusDialog={false}
                    onClickClose={this.closeModal}>
                    <div className="content-modal-body">
                        <Form
                            id="modalForm"
                            ref={(form: Form) => {
                                this.formAjouter = form;
                            }}
                            schema={schemaForCreationn}
                            formMessages={this.intlMessages}
                            onSubmit={this.onSubmitAjouter}
                        >
                            <Row>
                                <InputField
                                    name="nom"
                                    required={true}
                                    label={this.intlMessages.fields.nom.label} />
                                <InputField
                                    name="prenom"
                                    required={true}
                                    label={this.intlMessages.fields.prenom.label} />
                            </Row>
                            <Row>
                                <RadiosField name="sexeCreation"
                                    dataSource={this.dataSourceSexeForCreation}
                                    label={this.intlMessages.fields.sexe.label}
                                    labelClass="blocLabelUp"
                                    required={true}
                                    inline={RadiosField.Inline.FIELD}
                                />
                                <InputField
                                    name="age"
                                    required={true}
                                    label={this.intlMessages.fields.age.label}
                                    type="number" />
                            </Row>
                            <ButtonsArea>
                                <Button type="submit" id="creerPersonne" name="action:save"
                                    value="Enregistrer" className="hornet-button" label={this.i18n("form.valid")}
                                    title={this.i18n("administration.validTitle")} />
                                <Button type="button" id="annuler" name="action:cancel"
                                    value="Annuler" className="hornet-button" label={this.i18n("form.cancel")}
                                    title={this.i18n("administration.cancelTitle")} onClick={this.closeModal} />
                            </ButtonsArea>
                        </Form>
                    </div>
                </Modal>
            </div>
        )
    }

    /**
     * Réinitialise le formulaire
     * @param e : Evènement click
     */
    private onReinitialiser(e: React.MouseEvent<HTMLElement>): void {
        e.preventDefault();
        // Sélection de la valeur par défaut(F) du bouton radio Sexe
        this.dataSourceSexe.select(this.dataSourceSexe.results[0]);

        // Suppression des éventuelles erreurs du formulaire
        this.formRecherche.cleanFormErrors();
        // Reset du champ age
        this.inputAge.resetValue(e);

        // Update des champs
        this.formRecherche.updateFields({});
    }

    /**
     *
     * @param formData
     */

    private onSubmit(formData: any): void {

        // on rend visible le tableau
        this.maTable.setState({ isVisible: true });

        // Recherche de la liste des personnes et mise à jour du datasource avec le résultat de recherche
        this.getService().rechercherPersonnes(formData).then((result) => {
            this.tableDataSource.deleteAll();
            this.tableDataSource.add(false, result);
        });

    }

    /**
     * @return true lorsque l'utilisateur courant a le rôle d'administrateur
     */
    private isAdmin(): boolean {
        return AuthUtils.hasRole(this.user, Roles.ADMIN_STR);
    }

    /**
     * Méthode de suppression d'une personne
     * @param personne élément correspondant à une ligne du tableau de personne
     */
    private supprimer(personne: any): void {

        // Message de succès de suppression depuis messages.json
        const notifSuccessText: string = this.i18n("info.message.IN-PER-SUP-01", {
            $0: personne.prenom,
            $1: personne.nom,
        });

        // Message d'erreur de suppression depuis messages.json
        const notifErrorText: string = this.i18n("error.message.ER-PER-SUP-01", {
            $0: personne.prenom,
            $1: personne.nom,
        });
        //Préparation des notification
        const errors: Notifications = new Notifications();
        const notif = new NotificationType();
        const confirmations: Notifications = new Notifications();
        notif.id = "DEL_PERSONNE_" + personne.id;

        // Appel de la méthode du service page de suppression d'une persoone
        this.getService().supprimerPersonne(personne.id).then((res) => {
            if (res <= 0) {
                notif.text = notifErrorText;
                errors.addNotification(notif);
            } else {
                notif.text = notifSuccessText;
                confirmations.addNotification(notif);
            }
            NotificationManager.notify("notifPerPage", "recherchePersForm", errors, confirmations);
            this.refresh();
        });
    }

    private ajouterPersonne() {
        this.maModale.setTitle(this.i18n("Ajouter une personne"))
            .setCloseLabel(this.i18n("Fermer la modale"))
            .open();

    }

    /**
     * Evènement exécuté après suppression d'une personne
     */
    private refresh(): void {
        if (this.formRecherche && this.formRecherche.validateAndSubmit) {
            this.formRecherche.validateAndSubmit();
            this.maTable.setState({ isVisible: true });
        }

    }

    /**
    * Ferme la modale de création/édition de secteur sans appliquer les changements.
    */
    private closeModal(): void {
        this.maModale.close();
    }

    /**
     * Crée une nouvelle persoone
     * @param data données du formulaire de création
     */
    private onSubmitAjouter(data: any): void {
        NotificationManager.cleanAll();

        // Message de succès de création de personne depuis messages.json
        const notifSuccessText: string = this.i18n("info.message.IN-PER-SAUV-01", {
            $0: data.prenom,
            $1: data.nom,
        });

        // Message d'erreur de création de persoone depuis messages.json
        const notifErrorText: string = this.i18n("error.message.ER-PER-SAUV-01", {
            $0: data.prenom,
            $1: data.nom,
        });

        //Préparation des notification
        const errors: Notifications = new Notifications();
        const notif = new NotificationType();
        const confirmations: Notifications = new Notifications();
        this.getService().creer(data).then((result) => {
            this.closeModal();
            if (!result.errors) {
                notif.text = notifSuccessText;
                confirmations.addNotification(notif);
            } else {
                notif.text = notifErrorText;
                errors.addNotification(notif);
            }
            NotificationManager.notify("notifPerPage", "recherchePersForm", errors, confirmations);
        });
    }
}