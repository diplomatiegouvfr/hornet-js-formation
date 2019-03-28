appliformation js lite 1.0.0
===============

__RGAA V3__

L'applitutoriel est une mise en pratique du RGAA V3 au travers du framework Hornet.

# Prérequis

* NodeJS 8.X
* hornet-js-builder 1.X installé en global:

```shell
npm install -g hornet-js-builder
```

* checkout du projet `appliformation-js-lite`

# Initialisation

Se positionner dans le répertoire du projet `appliformation-js-lite` et lancer la commande:

```shell
hb install
```

# Démarrage de l'application en mode développement

## Commande par défaut

la commande à exécuter en mode développement est la suivante:

```shell
hb w
```

Elle permet de lancer l'application en mode `watcher` afin que les modifications soient prises en compte (ce qui
entrainera un redémarrage du serveur node dans le cas d'une détection de modification).

## Options

Il est également possible d'ajouter à cette commande l'option:

```shell
hb w -i
```

Cette commande indique au builder de ne pas transpiler les fichiers typescript en javascript.
Elle est à utiliser dans le cas où l'IDE a été configuré de telle sorte que la transpilation ts->js
se fasse via ce dernier.


# Vérification

L'application est accessible depuis un navigateur à l'addresse : [http://localhost:8888/appliformation-js-lite/](http://localhost:8888/appliformation-js-lite)

## Packaging de l'application

```shell
hb package
```

Les livrables sont à récupérer dans le répertoire : `target`

- `appliformation-js-lite-1.0.0-static.zip`
- `appliformation-js-lite-1.0.0-dynamic.zip`

# Fichier de configuration de l'application : default.json

L'ensemble de la configuration applicative du serveur NodeJS se situe dans le fichier default.json contenu dans les sources de l'application.

Ce fichier ne doit pas être modifié, excepté pour le log console. Les modifications sont à apporter dans les fichiers d'infrastructure.

## Configuration applicative

| Paramètre | Description | Valeur |
|-----------|-------------|--------|
|contextPath| Contexte de l'application déployée|Par défaut vide|
|welcomePage|Page de démarrage de l'application|Passé en paramètre du ServerConfiguration|
|themeUrl|Url du thème CSS|[Protocol]://[host]:[port]/hornet/themeName|

```javascript
{
  "contextPath": "appliformation-js-lite",
  "welcomePage": "/accueil",
  ...<
}

```


## Configuration serveur

| Paramètre | Description | Valeur |
|-----------|-------------|--------|
|route|Route identifiée pour l'affinité de session nodejs|js1|
|port|Port de démarrage du serveur|8888|
|keepAlive|Activation du mode HTTP KeepAlive|true|
|maxConnections|Nombre maximal de connexions à l'instance nodejs|100|
|timeout|Timeout des réponses HTTP|300000|
|uploadFileSize|Taille maximale d'upload de fichier|1000000|
|sessionTimeout|Timeout des sessions utilisateur|1800000|

```javascript
  "server": {
    "route": "js1",
    "port": 8888,
    "keepAlive": true,
    "maxConnections": 100,
    "timeout": 300000,
    "uploadFileSize": 1000000,
    "sessionTimeout": 1800000
  }
```

## Configuration Cookie

Cette partie contient l'ensemble du paramétrage spécifique aux exécutions réalisées coté serveur, ainsi que ses spécificités de démarrage.

| Paramètre | Description | Valeur |
|-----------|-------------|--------|
|domain|Domaine du cookie|null|
|path|Path du cookie|null|
|httpOnly|Activation du mode HTTP KeepAlive|true|
|secure|Sécurisation du cookie|true|
|alwaysSetCookie|Ajout du cookie dans le Header|false|

```javascript
  "cookie": {
    //"domain": null,
    //"path": null,
    "httpOnly": true,
    "secure": false
    //"alwaysSetCookie": false
  }
```


## Configuration de la sécurité

Ce bloc contient l'ensemble des paramètres destinés à la configuration de helmet.

| Paramètre | Description | Valeur |
|-----------|-------------|--------|
|enabled|Activation de la sécurité| true |
|hpp|HTTP Parameter Pollution attacks| true |
|ienoopen|Middleware for IE security. Set X-Download-Options to noopen| true |
|noSniff|Keep clients from sniffing the MIME type| true |
|csp.enabled|Activation de CSP (Content Security Policy)| true |
|csp.defaultSrc|Nom de domaine par défaut des différentes ressources du site| ["'self'", {hostname}] |
|csp.scriptSrc|Nom de domaine des différentes ressources de scripts du site| ["'self'", "'unsafe-inline'", "'unsafe-eval'"]|
|csp.styleSrc|Nom de domaine des différentes ressources de css du site | ["'self'", {hostname}]|
|csp.fontSrc|Nom de domaine des différentes ressources de fonts du site| ["'self'", {hostname}]|
|csp.imgSrc|Nom de domaine des différentes ressources images du site | ["'self'", {hostname}]|
|csp.reportOnly|Si valorisé à true, génération d'un rapport d'erreur uniquement|false|
|csp.setAllHeaders|Valorisé à true si tous les headers doivent être remplis|false|
|csp.disableAndroid|Permet de désactiver la navigation via Android|false|
|csp.safari5|Permet de désactiver la navigation via safari5|false|
|xss.enabled|Activation de la protection contre les failles XSS|true|
|xss.setOnOldIE|Force le header X-XSS-Protection sur les anciens IE|true|
|hpkp.enabled|Activation du Public Key Pinning: HPKP, HTTPS certificates can be forged, allowing man-in-the middle attacks|bool|true|
|hpkp.maxAge|Durée de validité|7776000000|
|hpkp.sha256s|Liste des sha au format 256|["AbCdEf123=","ZyXwVu456="]|
|hpkp.includeSubdomains|Inclusion des sous domaines|true|
|hpkp.reportUri|URL de rapport|vide|
|hsts.enabled|Activation du HTTP Strict Transport Security: hsts|false|
|hsts.maxAge|Durée de validité|7776000000|
|hsts.includeSubdomains|Inclusion des sous domaines|true|
|hsts.preload|Activation du preload dans le header HSTS|false|
|csrf.enabled|Activation du mode CSRF : Cross-Site Request Forgery|true|
|csr.>maxTokensPerSession|Nombre de tokens par session|10|


```json
"security": {
    "enabled": true,
    "hpp": true,
    "ienoopen": true,
    "noSniff": true,
    "csp": {
      "enabled": true,
      "defaultSrc": [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'"
      ],
      "scriptSrc": [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'"
      ],
      "styleSrc":[
        "'self'",
        "[Protocol]://[host]:[port]",
        "'unsafe-inline'"
      ],
      "fontSrc":[
        "'self'",
        "[Protocol]://[host]:[port]"
      ],
      "imgSrc":[
        "'self'",
        "[Protocol]://[host]:[port]"
      ],
      "reportOnly": false,
      "setAllHeaders": false,
      "disableAndroid": false,
      "safari5": false
    },
    "frameguard": {
      "enabled": true,
      "mode": "deny",
      "allowFromPattern": ""
    },
    "xss": {
      "enabled": true,
      "setOnOldIE": true
    },
    "hpkp": {
      "enabled": true,
      "maxAge": 7776000000,
      "sha256s": [
        "AbCdEf123=",
        "ZyXwVu456="
      ],
      "includeSubdomains": true,
      "reportUri": null
    },
    "hsts": {
      "enabled": false,
      "maxAge": 10886400000,
      "includeSubdomains": true,
      "preload": false
    },
    "csrf": {
      "enabled": true,
      "maxTokensPerSession": 10
    }
  }
```

### Configuration des logs serveurs

Niveau de log :

| Paramètre | Description | Valeur |
|-----------|-------------|--------|
|level.[all]|niveau de log pour toute l'application|INFO|
|level.monappli.view|niveau de log spécifique pour une partie de l'application |optionnel|

```json
 "log": {
    "levels": {
      "[all]": "DEBUG",
      "hornet-js-components.table": "TRACE"
    }
    ...
```

Déclaration des appenders :

| Paramètre | Description | Valeur |
|-----------|-------------|--------|
|type|Type d'appender|*file* pour un fichier simple<br/>*dateFile* pour un fichier contenant la date<br/>*console* ...|
|filename| Chemin absolu ou relatif au lancement du fichier de log | /var/log/nodejs/appliformation-js-lite/appliformation-js-lite-1.log|
|pattern| Présent pour les types *dateFile* <br />Permet de donner un pattern de date qui sera ajouté au nom du fichier.|-yyyy-MM-dd|
|layout.type| Type d'affichage des messages|pattern|
|layout.pattern| Schéma d'affichage des messages |"%[%d{ISO8601}|%x{tid}|%x{user}|%p|%c|%x{fn}|%m%]"|


Ex: type console

```json
"appenders": [
	{
	    "type": "console",
	    "layout": {
	      "type": "pattern",
	      "pattern": "%[%d{ISO8601}|%x{tid}|%x{user}|%p|%c|%x{fn}|%m%]"
	    }
	}
]
```

ex : type fichier

```json
"appenders": [
	{
	    "type": "dateFile",
	    "filename": "log/app.log",
	    "layout": {
	      "type": "pattern",
	      "pattern": "%d{ISO8601}|%x{tid}|%x{user}|%p|%c|%x{fn}|%m"
	    }
	}
]
```

### Configuration des logs client

| Paramètre | Description | Valeur |
|-----------|-------------|--------|
|remote|Activatino des remotes log|false|
|level|niveau de log|INFO|

```json
  "logClient": {
    "remote": false,
    "level": "TRACE",
    ...
```

### Déclaration des appenders

Type BrowserConsole :


| Paramètre | Description | Valeur |
|-----------|-------------|--------|
|type|Type d'appender|BrowserConsole|
|layout.type| Type d'affichage des messages|THIN/BASIC/pattern/...|
|layout.pattern| Schéma d'affichage des messages |"%p|%c|%m%"|

```json
"appenders": {
    "BrowserConsole" : {
        "type": "BrowserConsole",
        "layout": {
          "type": "THIN"
        }
    }
}
```

Type Ajax :

| Paramètre | Description | Valeur |
|-----------|-------------|--------|
|type|Type d'appender|Ajax|
|layout.type| Type d'affichage des messages|THIN/BASIC/pattern/...|
|layout.pattern| Schéma d'affichage des messages |"%p|%c|%m%"|
|threshold|Seuil d'envoi des messages de log|100|
|timeout|Timeout d'envoie des messages|3000|
|url|url d'envoie des logs|/logs|

```json
"appenders": {
    "Ajax": {
        "type": "Ajax",
        "layout": {
          "type": "BASIC"
        },
        "threshold": 100,
        "timeout": 3000,
        "url": "/log"
    }
}
```

## Configuration d'une base de données

Il est possible d'ajouter une configuration permettant de se connecter à une base de données.

Les configurations de base de données déclarés dans la configuration peuvent ensuite être utilisées dans une classe implémentant `IModelDAO` du projet `hornet-js-database`.

| Paramètre | Description | Valeur |
|-----------|-------------|--------|
|database|Object contenant la liste des bases de données et leur configuration||
|config| Nom de la base de données avec sa configuration||
|uri|Chaine de connexion à une bdd [sgbd]://[user]@[host]:[ports]/[name]||
|options|Options nécessaires ou facultatives pour le sgbd||
|define|Option Sequelize, timestamps : activation des timestamps dans les tables BDD||
|loggingLevel|Level de log de sequelize||
|reload|Indicateur pour exécution des scripts sql à chaque démarrage|false par défaut

```json
    "database": {
        "config": {
          "uri": "postgres://user@localhost:5433/appliformation-js-lite",
          "options": {
            "operatorsAliases": false,
            "pool": {
              "max": 5,
              "min": 0,
              "idle": 1000
            },
            "define": {
              "timestamps": false
            },
            "loggingLevel": "INFO"
          },
          "reload": true
        }
      }
```

### Configuration de mock

Une fois le mode bouchon activé (définis sous la clé `mock.enabled` dans le fichier de configuration `default.json`), il faut definir les parties que l'on souhaite mocker : Soit les servicesPage soit les servicesData.


Rappels des clés à modifier:

|nom de la clé|exemple de valeur| Description|
|-------------|-----------------|------------|
|mock.enable|true|`true` Activer le mock de l'application|
|mock.servicePage.enabled|true| Bouchon des services pages |
|mock.serviceData.enabled|true| Bouchon des services data|

```json
  "mock": {
    "enabled": true,
    "servicePage": {
      "enabled": true
    },
    "serviceData": {
      "enabled": true
    }
  }
```

### Mode fullSPA

NOTE : Le mode fullSPA n'est pas encore complètement supporté par hornet, la configuration est présente à titre d'information

| Paramètre | Description | Valeur |
|-----------|-------------|--------|
|enabled|Activation du mode fullSPA|false|
|host|Host du mode fullSPA|""|
|name|nom du service pour le mode fullSPA|/services|

```json
"fullSpa": {
    "enabled": false,
    "host": "",
    "name": "/services"
  }
```

__NOTE__ : non opérationnel

### Configuration de l'authentification

Note : Il ne s'agit pas d'une configuration à proprement parlé de Hornet mais uniqument viable dans l'applitutoriel

| Paramètre | Description | Valeur |
|-----------|-------------|--------|
|loginUrl|Url de connexion à l'application|/login|
|logoutUrl|Url de déconnexion à l'application|/logout|

```json
  "authentication": {
    "loginUrl": "/login",
    "logoutUrl": "/logout"
  }
```

### Configuration du Request
#### Configuration du Cache

La gestion du cache est paramétrable côté client et serveur pour les requêtes.

| Paramètre | Description | Valeur |
|-----------|-------------|--------|
|enabled|Activation du cache sur les requêtes de services|true|
|timetolive|Durée de rétention du cache|60|

```json
"request": {
    "cache": {
      "client": {
        "enabled": false,
        "timetolive": 60
      },
      "server": {
        "enabled": false,
        "timetolive": 120
      }
    }
```

#### Configuration du timeout

| Paramètre | Description | Valeur |
|-----------|-------------|--------|
| response  | &nbsp;      | &nbsp; |
| deadline  | &nbsp;      | &nbsp; |

```json
"request": {
    "timeout": {
      "response": 10000,
      "deadline": 60000
    }
```

## Configuration des mails

| Paramètre | Description | Valeur |
|-----------|-------------|--------|
|config|Object de configuration pour nodeMailer|https://nodemailer.com/smtp/|
|mailRecever|Mail servant de destinataire à l'envoi de mail||

```javascript
"mail": {
    "config": {
      "host": "127.0.0.1",
      "port": 25,
      "secure": false,
      "connectionTimeout": 20000,
      "tls": {
        "rejectUnauthorized": false
      },
      "auth": {
        "user": "user",
        "pass": "pass"
      }
    }

  }
```
