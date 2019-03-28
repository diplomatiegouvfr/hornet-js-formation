# Initialisation d'un projet hornet-services

La génération d'un projet se fait à partir d’un archetype maven
- Cloner l’archetype maven depuis git https://github.com/diplomatiegouvfr/archetype-hornet-service (utiliser le tag 5.2.0)
- lancer la commande $ mvn install sur l’archetype
- Depuis le workspace, lancer la commande suivante :
    ```
    mvn archetype:generate -DarchetypeGroupId=fr.gouv.diplomatie.hornet -DarchetypeArtifactId=archetype-hornet-service -DarchetypeVersion=${hornetservicesversion}
    ```
    - groupId : fr.gouv.diplomatie.formation
    - artifactId : appliformation-services
    - version : 1.0-SNAPSHOT
    - package : fr.gouv.diplomatie.formation
    - Confirmer la saisie en tapant sur la touche Y
- Dans le répertoire appliformation-services créé, lancer : $ mvn install
