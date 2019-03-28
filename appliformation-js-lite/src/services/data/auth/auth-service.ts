import { ServiceSecure } from "hornet-js-core/src/services/service-secure";

/**
 * Interface des services pour l'authentification
 * @interface
 */
export abstract class AuthService extends ServiceSecure {
    abstract auth(data): Promise<any>;
}
