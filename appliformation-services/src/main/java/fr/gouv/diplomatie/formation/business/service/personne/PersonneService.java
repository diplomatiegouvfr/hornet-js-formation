package fr.gouv.diplomatie.formation.business.service.personne;

import java.util.List;

import fr.gouv.diplomatie.formation.business.bo.Personne;

public interface PersonneService {
	List<Personne> listerPersonnes(String nom, String prenom, String sexe, Integer age);
}
