import {AuthenticationMiddleware} from "src/middleware/authentication";
import {AuthService} from "src/services/data/auth/auth-service";

import { Injector } from "hornet-js-core/src/inject/injector";

export class AuthenticationAPIMiddleware extends AuthenticationMiddleware {

    protected api: AuthService;

    constructor() {
        super();
        this.api = Injector.getRegistered(AuthService);
    }
}
