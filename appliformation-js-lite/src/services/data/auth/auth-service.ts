import { ServiceSecure } from "hornet-js-core/src/services/service-secure";
import { Promise } from "hornet-js-utils/src/promise-api";

/**
 * Interface des services pour l'authentification
 * @interface
 */
export abstract class AuthService extends ServiceSecure {
    abstract auth(data): Promise<any>;
}
