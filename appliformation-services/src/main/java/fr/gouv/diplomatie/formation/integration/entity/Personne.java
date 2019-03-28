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