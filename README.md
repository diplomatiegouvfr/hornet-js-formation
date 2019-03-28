# Exercice 5 : Tests unitaires

## Enoncé
L'objectif de cet exercice est d'écrire :
- Un TU pour le formulaire de recherche réalisé précédemment.
    - Tester la présence des champs nom et prénom dans le `DOM`
    - Simuler un clic sur le bouton `Rechercher` sans renseigner le champ obligatoire `nom`
    - Vérifier que la barre de notification est affichée et que le champ `nom` est en erreur.
- Un TU pour la méthode `rechercherPersonnes` du service data
    - Effectuer une recherche avec des critères
    - Vérifier que le résultat est correct
    

## Astuce

### Les tests karma
- Le test concernant le formulaire est un test [karma](https://karma-runner.github.io/2.0/index.html) (librairie de test d'IHM déjà intégrée dans hornet.js)
- Créer dans le répertoire test, le dossier `per` et ajouter y le fichier `per-form-page.test.karma.tsx`

```
const chai = require('chai');
const expect = chai.expect;
import { Decorators } from "hornet-js-test/src/decorators";
import { runTest } from "hornet-js-test/src/test-run";
import * as assert from "assert";
import { HornetTestAssert } from "hornet-js-test/src/hornet-test-assert";
import * as React from "react";
import { HornetReactTest } from 'hornet-js-test/src/hornet-react-test';
import * as messages from "src/resources/messages-fr-FR.json";
import { Utils } from "hornet-js-utils";
import { RecherchePersonneForm } from 'src/views/per/per-form-page';
Utils.setConfigObj({});

// Déclaration de la classe de test
@Decorators.describe("Test Karma sur le formulaire de rechercher de personne")
class PersonneFormPageTest extends HornetReactTest {

    @Decorators.beforeEach
    beforeEach() {
        // Les messages i18n qui seront utilisés
        Utils.setCls("hornet.internationalization", { messages});
    }

    // Exemple de tests passant
    @Decorators.it("Test OK")
    testOk() {
        HornetTestAssert.assertEquals(1, 1, "mon message");
        this.end();
    }

    @Decorators.it("Test présence champs de recherche")
    testPresenceChamps() {
        // Le composant page à tester
        const form = <RecherchePersonneForm />
        // id timestampé : ceci pour ne pas avoir le même id pour deux éléments du DOM
        const id = this.generateMainId();
        // Rendu du composant à tester dans un div avec pour identifiant id
        this.renderIntoDocument(form, id);

        // Vérifie que le champ nom est bien présent dans le dom
        expect(document.querySelector(`#${id} #nom`)).to.exist
        // Vérifie que le champ prénom est bien présent dans le dom
        expect(document.querySelector(`#${id} #prenom`)).to.exist

        // On propage un clic sur le bouton rechercher sans  renseigner le champ nom
        this.triggerMouseEvent(document.querySelector(`#${id} #envoi`), "click");
        // Attendre que la validation du formulaire soit terminée
        setTimeout(() => {
            //Vérifier que la notification d'erreur est affichée
            expect(document.querySelector(`#${id} div.error-message`)).to.exist
            
            // Vérifier que le champ nom est en erreur
            expect(document.querySelector(`#${id} #nom`).getAttribute("class")).to.equal("has-error input");

            // Pour indiquer la fin du test
            this.end();
        }, 300);

    }
}

//lancement des Tests
runTest(new PersonneFormPageTest());

```

### les tests mocha
- Pour effectuer le test du service data, utiliser la librairie [mocha](https://mochajs.org/) déja intégrée dans hornet.js
- Ajouter le fichier `per-service-spec.ts` dans le dossier `test/per` :

```
import("src/injector-context-services-data");
import { Decorators } from "hornet-js-test/src/decorators";
import { BaseMochaTest } from "hornet-js-test/src/base-mocha-test";
import { HornetTestAssert } from "hornet-js-test/src/hornet-test-assert";
import { runTest } from "hornet-js-test/src/test-run";
import { ModelDAO } from "src/dao/model-dao"
import { PersonneServiceImpl } from 'src/services/data/per/per-service-impl';
import { PersonneService } from 'src/services/data/per/per-service';
import { Injector } from 'hornet-js-core/src/inject/injector';
import { Database } from "hornet-js-database/src/sequelize/database";
const chai = require("chai");
const expect = chai.expect;

@Decorators.describe("Test de la couche service data")
class PersonneServiceSpec extends BaseMochaTest {

    @Decorators.beforeEach
    beforeEach(done) {
        // Configuration de la base Sqlite servant au test: pour  simplifier, on utilise la même configuration que celle utilisée pour démarrer le server
        process.env.HORNET_CONFIG_DIR_APPLI =  "config";
        const files = [ "database/01_createTablesSqlite.sql",  "database/02_initDataSqlite.sql" ];
        Database.runScripts([ {
            configName: "config",
            files: files
        }]).then(() => {
            done();
        });
    }

    @Decorators.it("Test de recherche de personne")
    testDataRechercherPersonne() {
        //Injection de la configuration de la BDD
        Injector.removeRegistered("databaseConfigName");
        Injector.register("databaseConfigName", "config");
        // Récupération du service data
        const service: PersonneServiceImpl = Injector.getRegistered(PersonneService);
        // Lancement de la recherche de Lenoir de sexe féminin
        service.rechercherPersonnes({ nom: "Lenoir", sexe: "F" }).then((results) => {
            // Assertion sur le résultat de recherche
            HornetTestAssert
                .assertNotNull(results, "Le service de récupération des données de recherchee de personnes ne retourne pas les données");
            HornetTestAssert.assertEquals(1, results.length, "Le service n'a pas retourné la bonne réponse");
            HornetTestAssert.assertEquals("Lenoir", results[0].nom, "Le nom retourné n'est pas le bon");
            HornetTestAssert.assertEquals("Adeline", results[0].prenom, "Le prénom retourné n'est pas le bon");
            HornetTestAssert.assertEquals("F", results[0].sexe, "Le sexe retourné n'est pas le bon");
            HornetTestAssert.assertEquals(28, results[0].age, "L'âge' retourné n'est pas le bon");
            this.end();
        });

}
}
// lancement des Tests
runTest(new PersonneServiceSpec());

```