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
