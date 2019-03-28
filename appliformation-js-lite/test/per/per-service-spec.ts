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
        Injector.removeRegistered("databaseConfigName");
        Injector.register("databaseConfigName", "config");
        const service: PersonneServiceImpl = Injector.getRegistered(PersonneService);
        service.rechercherPersonnes({ nom: "Lenoir", sexe: "F" }).then((results) => {
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
