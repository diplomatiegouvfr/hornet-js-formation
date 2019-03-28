/**
 * Classe regroupant les rôles disponibles dans l'application appliformation-js
 */
export class Roles {

    static USER_STR = "appliformation-js_USER";
    static ADMIN_STR = "appliformation-js_ADMIN";

    static USER = [Roles.USER_STR];
    static ADMIN = [Roles.ADMIN_STR];

    static EVERYONE = [Roles.USER_STR, Roles.ADMIN_STR];
}
