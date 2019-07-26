
/**
 * Interface du service personne
 */
export interface PersonneService {
    rechercherPersonnes(data): Promise<any>;
    supprimerPersonne(id: number): Promise<any>;
    creer(data): Promise<any>;
}



/**
 * Définition du type de l'objet utilisé par la vue
 */
export interface Personne {
    id: number;
    nom: string;
    prenom: string;
    sexe: string;
    age: number;
    description: string
}

