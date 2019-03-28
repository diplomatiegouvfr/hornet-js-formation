import { ServiceRequest } from "hornet-js-core/src/services/service-request";

/**
 * Interface des services pour l'authentification
 * @interface
 */
export abstract class AuthService extends ServiceRequest {
    abstract auth(data): Promise<any>;
}
