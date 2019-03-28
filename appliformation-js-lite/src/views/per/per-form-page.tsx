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
import { PersonneService, Personne } from "src/services/page/per/per-service";
import { DefaultSort } from 'hornet-js-core/src/component/datasource/options/datasource-option';
import { SortData } from 'hornet-js-core/src/component/sort-data';
import { Table } from 'hornet-js-react-components/src/widget/table/table';
import { Content } from 'hornet-js-react-components/src/widget/table/content';
import { Columns } from 'hornet-js-react-components/src/widget/table/columns';
import { Column } from 'hornet-js-react-components/src/widget/table/column';
import { Header } from 'hornet-js-react-components/src/widget/table/header';


export class RecherchePersonneForm extends HornetPage<PersonneService, HornetPageProps, any> {

    // référence du formulaire
    private formRecherche: Form;
    private inputAge: InputField<any, any>;
    //Datasource du champ sexe
    private dataSourceSexe: DataSource<any>;
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

    /**
     * @inheritDoc
     */
    constructor(props?: HornetComponentProps, context?: any) {
        super(props, context);
        // initialisation du datasource sexe avec les valeurs par possibles
        this.dataSourceSexe = new DataSource(this.listSexe, { value: "value", label: "libelle" });

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
                        title={this.i18n("partenairesListePage.form.searchTitle")} />
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

        )
    }

    /**
     * Construit le tableau
     */
    renderTable(): JSX.Element {
        const intlTab: any = this.i18n("recherchePersonne.tableau");
        return (
            <Table ref={(table) => { this.maTable = table; }} id="liste-personnes">
                <Header title={intlTab.summary} />
                <Content dataSource={this.tableDataSource}>
                    <Columns>
                        <Column keyColumn="nom" title={intlTab.colonnes.nom} sortable={true} hiddenable={false} />
                        <Column keyColumn="prenom" title={intlTab.colonnes.prenom} sortable={true} />
                        <Column keyColumn="sexe" title={intlTab.colonnes.sexe} sortable={true} />
                        <Column keyColumn="age" title={intlTab.colonnes.age} sortable={true} />
                    </Columns>
                </Content>
            </Table>
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
}