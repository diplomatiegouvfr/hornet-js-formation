import { Utils } from "hornet-js-utils";

import { AuthService } from "src/services/data/auth/auth-service";
import { AuthServiceImpl } from "src/services/data/auth/auth-service-data-impl";

import { Injector } from "hornet-js-core/src/inject/injector";
import { Scope } from "hornet-js-core/src/inject/injectable";
import { AuthServiceDataMockImpl } from 'src/mock/services/data/auth/auth-service-data-mock-impl';

if (Utils.config.getOrDefault("mock.enabled", false) && Utils.config.getOrDefault("mock.serviceData.enabled", false)) {
    Injector.register(AuthService, AuthServiceDataMockImpl, Scope.SINGLETON);
} else {
    Injector.register(AuthService, AuthServiceImpl, Scope.SINGLETON);
}


