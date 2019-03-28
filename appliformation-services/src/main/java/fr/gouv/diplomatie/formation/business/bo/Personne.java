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