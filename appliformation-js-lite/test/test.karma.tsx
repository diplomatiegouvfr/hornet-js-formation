import { Decorators } from "hornet-js-test/src/decorators";
import { runTest } from "hornet-js-test/src/test-run";
import { HornetTestAssert } from "hornet-js-test/src/hornet-test-assert";
import { BaseTest } from "hornet-js-test/src/base-test";
import * as React from "react";

@Decorators.describe("Test Karma")
class KarmaTest extends BaseTest {
    @Decorators.it("Test OK")
    testOk() {
        HornetTestAssert.assertEquals(1, 1, "mon message");
        this.end();
    }
}

//lancement des Tests
runTest(new KarmaTest());
