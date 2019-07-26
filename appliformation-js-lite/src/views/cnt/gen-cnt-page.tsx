import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-logger/src/logger";
import * as React from "react";
import { HornetPage } from "hornet-js-react-components/src/widget/component/hornet-page";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
import { Form } from "hornet-js-react-components/src/widget/form/form";
import { Row } from "hornet-js-react-components/src/widget/form/row";
import { InputField } from "hornet-js-react-components/src/widget/form/input-field";
import { TextAreaField } from "hornet-js-react-components/src/widget/form/textarea-field";
import { Notification } from "hornet-js-react-components/src/widget/notification/notification";
import {
    NotificationManager,
    Notifications,
    NotificationType
} from "hornet-js-core/src/notification/notification-manager";
import { Button } from "hornet-js-react-components/src/widget/button/button";
import { ContactService } from "src/services/page/cnt/contact-service-page";
import { ButtonsArea } from "hornet-js-react-components/src/widget/form/buttons-area";

import * as schema from "src/views/cnt/gen-cnt-page-validation.json";

const logger: Logger = Logger.getLogger("appliformation-js-lite.views.cnt.gen-cnt-page");

export class ContactPage extends HornetPage<ContactService, HornetComponentProps, any> {

    private formI18n = this.i18n("contactPage.form");

    constructor(props?: HornetComponentProps, context?: any) {
        super(props, context);
    }

    /**
     * Alimente le tableau de liste des secteurs.
     * @override
     */
    prepareClient(): void {

    }

    /**
     * Déclenche le submit du formulaire de contact
     * @param data
     */
    onSubmit(data: any) {
        this.getService().envoyer(data).then((result) => {
            if (!result.errors) {
                NotificationManager.notify(null, "contactForm",null, Notifications.makeSingleNotification("", this.i18n("info.message.IN-GE-CNT-01")));
            } else {
                let errors: Notifications = new Notifications();
                let notif = new NotificationType();
                notif.id = result.errors.reportId;
                notif.text = result.errors.message;
                errors.addNotification(notif);
                NotificationManager.notify(null, "contactForm", errors, null);
            }
        });
    }

    /**
     * @inheritDoc
     */
    render(): JSX.Element {
        return (
            <div>
                <h2>{this.i18n("contactPage.title")}</h2>
                <Notification id="notif"/>
                <Form
                    id="contactForm"
                    schema={schema}
                    formMessages={this.formI18n}
                    onSubmit={this.onSubmit}
                >

                    <Row className="row">
                        <InputField name="nom"
                                    label={this.formI18n.fields.nom.label}
                                    required={true}/>
                    </Row>
                    <Row>
                        <InputField name="prenom"
                                    label={this.formI18n.fields.prenom.label}
                                    required={true}/>
                    </Row>
                    <Row>
                        <InputField name="mail"
                                    label={this.formI18n.fields.mail.label}
                                    required={true}/>
                    </Row>
                    <Row>
                        <TextAreaField name="message"
                                       label={this.formI18n.fields.message.label}
                                       required={true}
                                       cols={60}
                                       rows={6}
                        />
                    </Row>
                    <ButtonsArea>
                        <Button type="submit" id="envoi" name="action:envoi"
                                value="Valider" className="hornet-button" label={this.i18n("form.valid")}
                                title={this.i18n("contactPage.form.validTitle")}/>
                    </ButtonsArea>
                </Form>
            </div>
        );
    }
}