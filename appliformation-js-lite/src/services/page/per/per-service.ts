/**
 * Interface du service personne
 */
export interface PersonneService {
    rechercherPersonnes(data): Promise<any>;
}

/**
 * Définition du type de l'objet utilisé par la vue
 */
export interface Personne {
    identifiant : number;
    nom : string;
    prenom: string;
    sexe: string;
    age: number;
    description: string
}

