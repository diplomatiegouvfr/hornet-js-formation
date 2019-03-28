# Exercice 0 : hornet-services
L'objectif de cet exercice est d'exposer un service de recherche de personnes avec hornet-services

## Astuce
Les critères de recherche sont :

```
nom : type string, obligatoire
prenom: type string, facultatif
age : type integer, facultatif
sexe: type string, obligatoire

```

Le service retourne la liste de personnes répondant aux critères en entrée.
Pour les critères `nom` et `prenom`, il faut chercher les personnes dont le `nom` et `prenom` commencent par les données en entrée  (%like en sql).

Nous utiliserons une base de données en mémoire.
Nous utiliserons le projet généré à partir du tutoriel [Initialisation d'un projet hornet-services](https://github.com/diplomatiegouvfr/hornet-js-formation/tree/tuto_init_project_hornet_services)

### Création de la table personne et init des données
- Ajouter dans le fichier `01-createTablesHsqldb.sql` le script de création de la table personne

```sql
CREATE TABLE PERSONNE (
    ID_PERSONNE INTEGER PRIMARY KEY AUTOINCREMENT,
    NOM VARCHAR(50),
    PRENOM VARCHAR(50),
    SEXE VARCHAR(1),
    AGE INTEGER,
    DESC_PERS VARCHAR(255) NULL 
 );
 
```

- Ajouter dans le fichier `02-initDataHsqldb.sql` :

```sql
INSERT INTO PERSONNE (ID_PERSONNE, NOM,  PRENOM, SEXE, AGE,  DESC_PERS) VALUES (1, ‘Lebon’, ‘Julien’, ‘M’, 28, ‘’);
INSERT INTO PERSONNE (ID_PERSONNE, NOM,  PRENOM, SEXE, AGE,  DESC_PERS) VALUES (2, ‘Trebern’, Gilles, ‘M’, 66, ‘’);
INSERT INTO PERSONNE (ID_PERSONNE, NOM,  PRENOM, SEXE, AGE,  DESC_PERS) VALUES (3, ‘Clam’, ‘Juliette’, ‘F’, 28, ‘’);
INSERT INTO PERSONNE (ID_PERSONNE, NOM,  PRENOM, SEXE, AGE,  DESC_PERS) VALUES (4, ‘Durant’, ‘Jacqueline’, ‘F’, 58, ‘’);
INSERT INTO PERSONNE (ID_PERSONNE, NOM,  PRENOM, SEXE, AGE,  DESC_PERS) VALUES (5, ‘Beat’, ‘Axel’, ‘M’, 55, ‘’);
INSERT INTO PERSONNE (ID_PERSONNE, NOM,  PRENOM, SEXE, AGE,  DESC_PERS) VALUES (6, ‘Beat’, ‘Axelle’, ‘F’, 55, ‘’);
INSERT INTO PERSONNE (ID_PERSONNE, NOM,  PRENOM, SEXE, AGE,  DESC_PERS) VALUES (7, ‘Lebrun’, ‘Adrien’, ‘M’, 29, ‘’);
INSERT INTO PERSONNE (ID_PERSONNE, NOM,  PRENOM, SEXE, AGE,  DESC_PERS) VALUES (8, ‘Dupont’, ‘Jack’, ‘M’, 28, ‘’);
INSERT INTO PERSONNE (ID_PERSONNE, NOM,  PRENOM, SEXE, AGE,  DESC_PERS) VALUES (9, ‘Doe’, ‘Jean’, ‘M’, 28, ‘’);
INSERT INTO PERSONNE (ID_PERSONNE, NOM,  PRENOM, SEXE, AGE,  DESC_PERS) VALUES (10, ‘Lenoir’, ‘Adeline’, ‘F’, 28, ‘’);
INSERT INTO PERSONNE (ID_PERSONNE, NOM,  PRENOM, SEXE, AGE,  DESC_PERS) VALUES (11, ‘Nouvelle’, ‘Sara’, ‘F’, 28, ‘’);
INSERT INTO PERSONNE (ID_PERSONNE, NOM,  PRENOM, SEXE, AGE,  DESC_PERS) VALUES (12, ‘Fages’, ‘Simon’, ‘M’, 28, ‘’);
INSERT INTO PERSONNE (ID_PERSONNE, NOM,  PRENOM, SEXE, AGE,  DESC_PERS) VALUES (13, ‘Larad’, ‘Alban’, ‘M’, 28, ‘’);
INSERT INTO PERSONNE (ID_PERSONNE, NOM,  PRENOM, SEXE, AGE,  DESC_PERS) VALUES (14, ‘Larad’, ‘Olivier’, ‘M’, 38, ‘’);
INSERT INTO PERSONNE (ID_PERSONNE, NOM,  PRENOM, SEXE, AGE,  DESC_PERS) VALUES (15, ‘Julien’, ‘Katrine’, ‘F’, 28, ‘’);
INSERT INTO PERSONNE (ID_PERSONNE, NOM,  PRENOM, SEXE, AGE,  DESC_PERS) VALUES (16, ‘Julien’, ‘Christelle’, ‘F’, 18, ‘’);
```
Ces requêtes seront exécutées au démarrage de l'application

### Implémentation de la couche accès aux données.

Cette partie contient la définition de l'entité et la déclaration du repository `Spring`.

#### Définition de l'entité

Créer dans le package `entity` l’entité correspondant à la table `personne`

```java

package fr.gouv.diplomatie.formation.integration.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "PERSONNE")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Personne implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 4607267337558691446L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@NotNull
	@Column(name = "id_personne")
	public Long id;

	@NotNull
	@Column(name = "nom")
	public String nom;
	
	@NotNull
	@Column(name = "prenom")
	public String prenom;
	
	@NotNull
	@Column(name = "sexe")
	public String sexe;
	
	@NotNull
	@Column(name = "age")
	public Integer age;
	
	@NotNull
	@Column(name = "desc_pers")
	public String description;
}

```

#### Définition du repository

Créer dans le package `repository` l'interface `PersonneRepository`


```java

package fr.gouv.diplomatie.formation.integration.repository.personne;


import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;

import fr.gouv.diplomatie.formation.integration.entity.Personne;

public interface PersonneRepository extends CrudRepository<Personne, Long>, JpaSpecificationExecutor<Personne>{

}

```

NB : Cette interface ne déclare aucune méthode car celle qui sera utilisée est déjà définie dans `JpaSpecificationExecutor`

Ajouter le code suivant dans la classe `SpecificationUtils`

```java

 public static <T> Specification<T> like(final String property, final String compareTo) {

        return (root, query, builder) -> {
            return builder.like(root.get(property), compareTo);
        };
}

```

### Implémentation de la couche service

Dans cette partie, nous allons définir le BO (business object) qui représente le modèle métier  `Personne` et le `service` qui interroge la couche d'accès aux données pour récupérer le résultat de recherche

#### Définition du BO

Créer dans le package `bo` la classe `Personne` :

```java

package fr.gouv.diplomatie.formation.business.bo;


public class Personne {
	private Long identifiant;

	private String nom;
	private String prenom;
	private String sexe;
	private Integer age;
	private String description;
	
	public Long getIdentifiant() {
		return identifiant;
	}
	public void setIdentifiant(Long identifiant) {
		this.identifiant = identifiant;
	}
	public String getNom() {
		return nom;
	}
	public void setNom(String nom) {
		this.nom = nom;
	}
	public String getPrenom() {
		return prenom;
	}
	public void setPrenom(String prenom) {
		this.prenom = prenom;
	}
	public String getSexe() {
		return sexe;
	}
	public void setSexe(String sexe) {
		this.sexe = sexe;
	}
	public Integer getAge() {
		return age;
	}
	public void setAge(Integer age) {
		this.age = age;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	
	public static Personne fromEntity(fr.gouv.diplomatie.formation.integration.entity.Personne entity){
		if(entity != null) {
			Personne personne = new Personne();
			personne.setAge(entity.age);
			personne.setDescription(entity.description);
			personne.setIdentifiant(entity.id);
			personne.setNom(entity.nom);
			personne.setPrenom(entity.prenom);
			personne.setSexe(entity.sexe);
			return personne;
		}
		return null;
		
	}
}

```

#### Implémentation du service

Créer dans le package `service` l’interface `PersonneService`

```java

package fr.gouv.diplomatie.formation.business.service.personne;

import java.util.List;

import fr.gouv.diplomatie.formation.business.bo.Personne;

public interface PersonneService {
	List<Personne> listerPersonnes(String nom, String prenom, String sexe, Integer age);
}

```

Créer dans le package `service` la classe `PersonneServiceImpl`


```java

package fr.gouv.diplomatie.formation.business.service.personne;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.stereotype.Service;

import fr.gouv.diplomatie.formation.business.bo.Personne;
import fr.gouv.diplomatie.formation.integration.repository.personne.PersonneRepository;
import fr.gouv.diplomatie.formation.integration.repository.personne.PersonneSpecification;

@Service
public class PersonneServiceImpl implements PersonneService{
	PersonneRepository personneRepository;
	
	public PersonneServiceImpl(PersonneRepository personneRepository) {
		this.personneRepository=personneRepository;
	}

	@Override
	public List<Personne> listerPersonnes(String nom, String prenom, String sexe, Integer age) {
		List<fr.gouv.diplomatie.formation.integration.entity.Personne> personnes =
				personneRepository.findAll(PersonneSpecification.NomAndPrenomAndSexeAndAge(nom, prenom, sexe, age));
		if(personnes != null) {
			return personnes.stream().map(Personne :: fromEntity).collect(Collectors.toList());
		}
		return Collections.emptyList();
	}

}

```

### Implémentation du controller

Créer dans le package `controller` le controller `PersonneController`

```java

package fr.gouv.diplomatie.formation.web.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import fr.gouv.diplomatie.formation.business.bo.Personne;
import fr.gouv.diplomatie.formation.business.service.personne.PersonneService;

@RestController
@RequestMapping(value = "/personnes", produces = {MediaType.APPLICATION_JSON_VALUE})
public class PersonneController {
PersonneService service;
	
	public PersonneController(PersonneService service) {
		this.service=service;
	}
	
	
    @RequestMapping(value = "/lister", method = RequestMethod.GET)
    @ResponseStatus(value = HttpStatus.OK)
    public ResponseEntity<List<Personne>> listerPeronnes(@RequestParam String nom, @RequestParam(required=false)
    	String prenom, @RequestParam String sexe, @RequestParam(required=false) Integer age) {

    	return ResponseEntity.ok(service.listerPersonnes(nom, prenom, sexe, age));
    }
}
```

Le service est prêt à être testé. Il faut déployer l'application dans tomcat depuis Eclipse ou exécuter la commande `mvn spring-boot:run -Pdev-spring-boot`

Accéder à http://localhost:8080/appliformation-services/personnes/lister?nom=L&sexe=M&age=28 et remarquer la réponse du service
