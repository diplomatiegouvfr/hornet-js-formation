import Bean from "hornet-js-bean/src/decorators/Bean";
import Map from "hornet-js-bean/src/decorators/Map";
import Alias from 'hornet-js-bean/src/decorators/Alias';

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

@Bean
export class PersonneDTO {
    @Map()
    id: number;

    @Map()
    nom: string;

    @Map()
    prenom: string;

    @Map()
    @Alias("sexeCreation")
    sexe: string;

    @Map()
    age: number;

    @Map()
    description: string;
}