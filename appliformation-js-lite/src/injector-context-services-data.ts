import { Injector } from "hornet-js-core/src/inject/injector";
import { Scope } from "hornet-js-core/src/inject/injectable";
import { Utils } from "hornet-js-utils";
import { AuthService } from "src/services/data/auth/auth-service";

// Injector pour databaseConfigName doit être réalisé avant les imports des implementations de services car il est utilisé
// dans ceux ci
Injector.register("databaseConfigName", "config");

import { AuthServiceDataMockImpl } from "src/mock/services/data/auth/auth-service-impl-mock";
import { AuthServiceImpl } from "src/services/data/auth/auth-service-impl";
import { PersonneService } from 'src/services/data/per/per-service';
import { PersonneServiceImpl } from 'src/services/data/per/per-service-impl';

if (Utils.config.getOrDefault("mock.enabled", false) && Utils.config.getOrDefault("mock.serviceData.enabled", false)) {
    Injector.register(AuthService, AuthServiceDataMockImpl, Scope.SINGLETON);
} else {
    Injector.register(AuthService, AuthServiceImpl, Scope.SINGLETON);
    Injector.register(PersonneService, PersonneServiceImpl, Scope.SINGLETON);
}


