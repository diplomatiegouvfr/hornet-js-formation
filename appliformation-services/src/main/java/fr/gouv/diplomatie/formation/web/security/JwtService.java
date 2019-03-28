/**
 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
 * <p/>
 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
 * <p/>
 * Ce logiciel est un programme informatique servant à faciliter la création d'applications Web conformément
 * aux référentiels généraux français : RGI, RGS et RGAA
 * <p/>
 * Ce logiciel est régi par la licence CeCILL soumise au droit français et respectant les principes de
 * diffusion des logiciels libres. Vous pouvez utiliser, modifier et/ou redistribuer ce programme sous les
 * conditions de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA sur le site
 * "http://www.cecill.info".
 * <p/>
 * En contrepartie de l'accessibilité au code source et des droits de copie, de modification et de
 * redistribution accordés par cette licence, il n'est offert aux utilisateurs qu'une garantie limitée. Pour
 * les mêmes raisons, seule une responsabilité restreinte pèse sur l'auteur du programme, le titulaire des
 * droits patrimoniaux et les concédants successifs.
 * <p/>
 * A cet égard l'attention de l'utilisateur est attirée sur les risques associés au chargement, à
 * l'utilisation, à la modification et/ou au développement et à la reproduction du logiciel par l'utilisateur
 * étant donné sa spécificité de logiciel libre, qui peut le rendre complexe à manipuler et qui le réserve
 * donc à des développeurs et des professionnels avertis possédant des connaissances informatiques
 * approfondies. Les utilisateurs sont donc invités à charger et tester l'adéquation du logiciel à leurs
 * besoins dans des conditions permettant d'assurer la sécurité de leurs systèmes et ou de leurs données et,
 * plus généralement, à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
 * <p/>
 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez pris connaissance de la licence
 * CeCILL, et que vous en avez accepté les termes.
 * <p/>
 * <p/>
 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
 * <p/>
 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
 * <p/>
 * This software is a computer program whose purpose is to facilitate creation of web application in
 * accordance with french general repositories : RGI, RGS and RGAA.
 * <p/>
 * This software is governed by the CeCILL license under French law and abiding by the rules of distribution
 * of free software. You can use, modify and/ or redistribute the software under the terms of the CeCILL
 * license as circulated by CEA, CNRS and INRIA at the following URL "http://www.cecill.info".
 * <p/>
 * As a counterpart to the access to the source code and rights to copy, modify and redistribute granted by
 * the license, users are provided only with a limited warranty and the software's author, the holder of the
 * economic rights, and the successive licensors have only limited liability.
 * <p/>
 * In this respect, the user's attention is drawn to the risks associated with loading, using, modifying
 * and/or developing or reproducing the software by the user in light of its specific status of free software,
 * that may mean that it is complicated to manipulate, and that also therefore means that it is reserved for
 * developers and experienced professionals having in-depth computer knowledge. Users are therefore encouraged
 * to load and test the software's suitability as regards their requirements in conditions enabling the
 * security of their systems and/or data to be ensured and, more generally, to use and operate it in the same
 * conditions as regards security.
 * <p/>
 * The fact that you are presently reading this means that you have had knowledge of the CeCILL license and
 * that you accept its terms.
 *
 */
package fr.gouv.diplomatie.formation.web.security;

import java.io.IOException;
import java.net.URISyntaxException;
import java.security.Key;

import org.jose4j.jws.AlgorithmIdentifiers;
import org.jose4j.jws.JsonWebSignature;
import org.jose4j.jwt.JwtClaims;
import org.jose4j.jwt.MalformedClaimException;
import org.jose4j.jwt.consumer.InvalidJwtException;
import org.jose4j.jwt.consumer.JwtConsumer;
import org.jose4j.jwt.consumer.JwtConsumerBuilder;
import org.jose4j.keys.HmacKey;
import org.jose4j.lang.JoseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
 */
@Component
public class JwtService {
    private static final String ISSUER = "fr.gouv.diplomatie.formation";
    public static final String USER_CLAIM = "user";
    private KeyProvider secretKeyProvider;
    private ObjectMapper mapper;

    @Autowired
    public JwtService(KeyProvider secretKeyProvider) {
        this.secretKeyProvider = secretKeyProvider;
        this.mapper = new ObjectMapper();
    }

    /**
     * Renvoie un JWS basé sur des clés asymetriques
     * @param key
     * @param claim
     * @return JWS
     * @throws IOException
     * @throws URISyntaxException
     */
    public String signedAsymetricTokenFor(final String key, final Object claim) {
    	
    	String token = null;
        
        try {

            // JWT
            JwtClaims claims = initClaims();
            claims.setSubject("userProfile");
            claims.setClaim(USER_CLAIM, this.mapper.writeValueAsString(claim));

            // JWS
            JsonWebSignature jws = new JsonWebSignature();
            jws.setPayload(claims.toJson());
            jws.setAlgorithmHeaderValue(AlgorithmIdentifiers.RSA_USING_SHA512);
            jws.setKey(secretKeyProvider.getPrivateKey());

            token = jws.getCompactSerialization();
            
		} catch (JoseException | JsonProcessingException e) {
			e.printStackTrace();
		}
        
        return  token;

    }
    
    /**
     * Renvoie un JWS
     * @param key
     * @param claim
     * @return JWS
     * @throws JoseException 
     * @throws JsonProcessingException 
     * @throws IOException
     * @throws URISyntaxException
     */
    public String signedTokenFor(final String key, final Object claim) throws JoseException, JsonProcessingException {
    	
    	String token = null;
        
        // JWT
        JwtClaims claims = initClaims();
        claims.setSubject("userProfile");
        claims.setClaim(USER_CLAIM, this.mapper.writeValueAsString(claim));

        // JWS
        JsonWebSignature jws = new JsonWebSignature();
        jws.setPayload(claims.toJson());
        jws.setAlgorithmHeaderValue(AlgorithmIdentifiers.HMAC_SHA256);
        jws.setKey(new HmacKey(secretKeyProvider.getKey()));

        token = jws.getCompactSerialization();
            
        return  token;

    }
    
    /**
     * Verifie un token JWT signé avec une clé asymétrique
     * @param token
     * @param c type du claim
     * @return
     * @throws IOException 
     * @throws InvalidJwtException 
     * @throws MalformedClaimException 
     * @throws JsonMappingException 
     * @throws JsonParseException 
     */
    public <T> T verifyAsymetricSignedToken(final String token, Class<T> c) throws JsonParseException, JsonMappingException, MalformedClaimException, InvalidJwtException, IOException {
    	
    	return this.verifySignedToken(token, secretKeyProvider.getPublicKey(), c);
    }
    
    /**
     * Verifie un token JWT signé avec une clé asymétrique
     * @param token
     * @param key
     * @param c type du claim
     * @return
     * @throws InvalidJwtException 
     * @throws IOException 
     * @throws MalformedClaimException 
     * @throws JsonMappingException 
     * @throws JsonParseException 
     */
    public <T> T verifySignedToken(final String token, final Key key, Class<T> c) throws InvalidJwtException, JsonParseException, JsonMappingException, MalformedClaimException, IOException {
    	
    	T claim = null;

        JwtConsumer jwtConsumer = new JwtConsumerBuilder()
                .setRequireExpirationTime()
                .setRequireSubject()
                .setExpectedAudience("myApplication")
                .setExpectedIssuer(ISSUER + ".myApplication")
                .setVerificationKey(key) // verification de la signature
                .build();

        //  Validate the JWT and process it to the Claims
        JwtClaims jwtClaims = jwtConsumer.processToClaims(token);
        System.out.println("JWT validation succeeded! " + jwtClaims);
        claim = mapper.readValue(jwtClaims.getStringClaimValue(USER_CLAIM), c);
        
        return claim;
    }
    
    /**
     * initialise un token JWT
     * @return les claims
     */
    private JwtClaims initClaims() {
    	
    	JwtClaims claims = new JwtClaims();
        claims.setIssuer(ISSUER + ".myApplication");  // createur du token
        claims.setAudience("myApplication"); // client du token
        claims.setExpirationTimeMinutesInTheFuture(120); // duree vie du token
        claims.setGeneratedJwtId(); // a unique identifier for the token
        claims.setIssuedAtToNow();  // when the token was issued/created (now)
        
        return claims;
    }
}