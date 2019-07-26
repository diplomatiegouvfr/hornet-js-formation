# Exercice 1 : Vue et route

## Enoncé
L’objectif de cet exercice est de créer un formulaire de recherche de personnes.
- Ce formulaire doit contenir les champs:
    - Nom : type input obligatoire
    - Prenom: type input facultatif
    - Sexe : type bouton radio obligatoire (par défaut valorisé à F)
    - Age : type input factultatif
    - Submit : type submit pour soumettre le formulaire
    - Reset : type button pour réinitialiser le formulaire
- Ce formulaire se trouve dans une page accessible via la route `/personnes`

Aperçu :

![Aperçu](./sources/capture.png)

## Astuce
- Utiliser le squelette généré à partir de [Tutoriel init projet hornet](https://github.com/diplomatiegouvfr/hornet-js-formation/tree/tuto_init_projet_hornet-js-lite)
- Créer dans la dossier `src/views` un dossier `per`
- Dans le dossier `src/views/per`, Créer le fichier `per-form-page.tsx`
- Utiliser les composants `Form`, `InputField`, `RadiosField`, `Button` (cf [showroom](https://diplomatiegouvfr.github.io/hornet-showroom-online/))
- Dans le fichier `src/resources/messages-fr-FR.json`, ajouter les messages qui seront utilisés dans `per-form-page.tsx`
- Ajouter dans le dossier `src/views` le fichier `per-form-page-validation.json` contenant le schéma de validation du formulaire
- Créer le dossier `per` dans le répertoire `src/routes` et ajouter le fichier `per-client-routes.ts`.
- Définir dans `per-client-routes` la route permettant d'accéder à la page `per-form-page.tsx`
- Dans le fichier `routes.ts`, ajouter le lazy route  `per-client-routes`

