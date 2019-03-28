# Initialisation d'un projet hornet-js

Nous utilisons `yeoman` pour générer les projet hornet.js
Pour rapelle `yeoman` est un générateur de projet qui se base sur des templates.
Le template qui sera utilisé pour générer un projet hornet-js est `generator-hornet-js`
Il faut installer `yeoman` et `generator-hornet-js` en global

```
npm install -g yo
npm install -g generator-hornet-js

```
Se positionner dans le workspace dans lequel sera généré le projet :
 ```
mkdir appliformation-js
cd appliformation-js
yo hornet-js
 ```
- Nom de votre projet : appliformation-js
- Version de votre projet (1.0.0 par défaut) : 1.0.0
- Description de votre projet : application hornet.js de formation
- Version du framework (hornet-js) : 5.2.3
- Thême de l'application : hornet-themes-intranet
- Version du thême de l'application : 5.2.3
- Host de la partie service : http://localhost:8080
- ContextPath de la partie service : appliformation-services
- Mode full spa : false

