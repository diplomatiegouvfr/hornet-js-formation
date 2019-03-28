import Bean from "hornet-js-bean/src/decorators/Bean";
import Map from "hornet-js-bean/src/decorators/Map";

@Bean
export class PersonneMetier {
    @Map()
    id: number;

    @Map()
    nom: string;

    @Map()
    prenom: string;

    @Map()
    sexe: string;

    @Map()
    age: number;

    @Map()
    description: string;
}