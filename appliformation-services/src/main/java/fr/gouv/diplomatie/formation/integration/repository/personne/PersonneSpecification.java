package fr.gouv.diplomatie.formation.integration.repository.personne;

import org.springframework.data.jpa.domain.Specification;

import fr.gouv.diplomatie.formation.integration.entity.Personne;
import fr.gouv.diplomatie.formation.integration.repository.SpecificationUtils;

public class PersonneSpecification extends SpecificationUtils<Personne> {

    public static Specification<Personne> NomAndPrenomAndSexeAndAge(final String nom, final String prenom,
                final String sexe, final Integer age) {

        Specification<Personne> specification = (root, query, builder) -> null;

        if (nom != null) {
            specification = specification.and(PersonneSpecification.like("nom", nom+"%"));
        }
        if (prenom != null) {
            specification = specification.and(PersonneSpecification.like("prenom", prenom+"%"));
        }
        if (sexe != null) {
            specification = specification.and(PersonneSpecification.equal("sexe", sexe));
        }
        
        if (age != null) {
            specification = specification.and(PersonneSpecification.equal("age", age));
        }

        return specification;

    }

}
