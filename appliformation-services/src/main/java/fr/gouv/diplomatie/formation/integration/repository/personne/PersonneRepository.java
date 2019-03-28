package fr.gouv.diplomatie.formation.integration.repository.personne;


import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;

import fr.gouv.diplomatie.formation.integration.entity.Personne;

public interface PersonneRepository extends CrudRepository<Personne, Long>, JpaSpecificationExecutor<Personne>{

}
