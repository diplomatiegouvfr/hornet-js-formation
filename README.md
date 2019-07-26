# Exercice 4 : Sécurisation de l'application et manipulation avancée du composant Table

## Enoncé
L’objectif de cet exercice est de sécuriser l'accès à l'application et de montrer des notions avancées du composant `Table`
- Sur la base de la correction de [l'exercice 3](https://github.com/diplomatiegouvfr/hornet-js-formation/tree/exercice_3_service_data/server_lite), ajouter sur chaque ligne du tableau de résultat de recherche, un bouton permettant de supprimer la personne de la ligne en BDD. Cette action est possible uniquement si on est connecté en tant qu'admin
- Ajouter la fonctionnalité de création de personne, pour cela, un bouton sera placé sur le header du tableau qui permet d'ouvrir une modale contenant le formulaire de création de personne


![Aperçu](./sources/capture.png)


## Astuce
- S'inspirer de l'exercice 3 pour  définir les méthodes de `DAO`, les services server et client, les actions et les routes pour supprimer et créer une personnes

### Suppression de personne
- Utiliser le composant `ActionColumn`(cf showroom pour plus d'informations) pour ajouter à chaque ligne du tableau une colonne contenant un boutton permettant de supprimer la ligene.
- Ce bouton est désactivé si l'utilisateur connecté n'est pas admin.
- Au clic sur ce bouton, la méthode de suppression du service page est appelé avec en entrée l'id de le personne de la ligne.

```
// Colonne à ajouter pour avoir le bouton servant à la suppression //supprimer
<ActionColumn keyColumn="supprimer"
            alt={intlTab.colonnes.suppressionTitle} // suppressionTitle //à déclater dans messages.json
            srcImg={Picto.blue.supprimer}
            action={this.supprimer}
            messageAlert={intlTab.colonnes.supprimer.message}
            //message à déclater dans messages.json
            titleAlert={intlTab.colonnes.supprimer.title}
            //title à déclater dans messages.json
            disabled={() => !this.isAdmin()}/>

//Méthode permettant de déterminer si le user connecté est admin
private isAdmin(): boolean {
    return AuthUtils.hasRole(this.user, Roles.ADMIN_STR);
}

private supprimer(personne: any): void {
    // appel du service page de suppression
}

```
### Création de personne
- Pour l'ajout d'une nouvelle personne, utiliser le composant `ActionButton` (cf showroom pour plus d'informations)
- 
```
<Header title={intlTab.summary}>
        <MenuActions>
            <ActionButton title={intlTab.ajouter}
            srcImg={Picto.white.add}
            action={this.ajouterPersonne} priority={true} displayedWithoutResult={true} disabled={!this.isAdmin()}/>
         </MenuActions>
</Header>

// Utiliser le composant Modal

<Modal
    <Form>
        // déclarer les éléments du formulaire de création de personne
        // Ce formulaire ressemble à celui de recherche de personne
    </Form>            
</Modal>

private ajouterPersonne() {
   // ouverture de la modale
}

```

