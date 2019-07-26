# Initialisation d'un projet hornet-js-lite

Nous utilisons `yeoman` pour générer les projet hornet.js
Pour rapelle `yeoman` est un générateur de projet qui se base sur des templates.
Le template qui sera utilisé pour générer un projet hornet-js-lite est `generator-hornet-js-lite`
Il faut installer `yeoman` et `generator-hornet-js-lite` en global

```
npm install -g yo
npm install -g generator-hornet-js-lite
```

pensez aux liens symboliques :
```
ln -s $HOME/.npm-global/bin/yo
```
Se positionner dans le workspace dans lequel sera généré le projet :

```
mkdir appliformation-js-lite
cd appliformation-js-lite
yo hornet-js-lite

```
- Nom de votre projet : appliformation-js-lite
- Version de votre projet (1.0.0 par défaut) : 1.0.0
- Description de votre projet : application hornet-js-lite de formation
- Version du framework (hornet-js-lite) : 5.4.1
