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