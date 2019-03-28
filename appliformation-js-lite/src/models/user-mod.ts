import Bean from "hornet-js-bean/src/decorators/Bean";
import Map from "hornet-js-bean/src/decorators/Map";
import Alias from "hornet-js-bean/src/decorators/Alias";

@Bean
export class RoleMetier {
    @Map()
    @Alias("idRole")
    id: number;
    @Map()
    @Alias("rolNom")
    name: string;
}

@Bean
export class UtilisateurMetier {
    @Map()
    id: number;

    @Map()
    login: string;

    @Map()
    password: string;

    @Map()
    enabled: boolean;

    @Map(RoleMetier)
    @Alias("listeRole")
    roles: Array<RoleMetier>;
}
