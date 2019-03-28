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
export class RecherchePersonneForm extends HornetPage<any, HornetPageProps, any> {
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


    /**
     * @inheritDoc
     */
    constructor(props?: HornetComponentProps, context?: any) {
        super(props, context);
        // initialisation du datasource sexe avec les valeurs par possibles
        this.dataSourceSexe = new DataSource(this.listSexe, { value: "value", label: "libelle" });

        // Valeur par défaut du bouton radio sexe
        this.dataSourceSexe.select(this.dataSourceSexe.results[0]);

    }

    /**
     * @inheritDoc
     */
    render(): JSX.Element {
        return (
            <div>
                <h2>Recherche de personnes</h2>
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
            </div>
        );
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
        // Implémentation dans le prochain exercicie
    }
}