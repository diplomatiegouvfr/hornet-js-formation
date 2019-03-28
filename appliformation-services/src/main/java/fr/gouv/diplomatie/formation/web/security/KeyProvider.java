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
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;

import org.jose4j.base64url.Base64;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

import fr.gouv.diplomatie.formation.web.security.exceptions.JwtAuthenticationException;

/**
 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
 */
@Component
@PropertySource(value = {
"classpath:token.properties"})
public class KeyProvider {

    private final PrivateKey privateKey;
    private final PublicKey publicKey;
    private final byte[] key;

    public KeyProvider(
                @Value("${token.path}") final String path) throws IOException, URISyntaxException {
        // generate with ssh-keygen
        // GENERATE PRIVATE KEY in PKCS#1 format
        //openssl genrsa -f4 -out private.pem 4096
        // EXPORT PUBLIC KEY
        //openssl rsa -in private.pem -outform PEM -pubout -out public.pem
        // EXPORT PRIVATE KEY to PKCS#8 format
        //openssl pkcs8 -topk8 -inform pem -in private.pem -outform PEM -nocrypt -out private8.pem

        privateKey = convertPrivateKey(Files.readAllBytes(Paths.get(path + "/private8.pem")));
        publicKey = convertPublicKey(Files.readAllBytes(Paths.get(path + "/public.pem")));
        key = "ThisIsTheVerySuperGreatSecretKey".getBytes("UTF-8");
    }

    public PrivateKey getPrivateKey() {
        return privateKey;
    }

    public PublicKey getPublicKey() {
        return publicKey;
    }

    public byte[] getKey() {
        return key;
    }

    /**
     * genere une cle public depuis le contenu d'un fichier PEM
     * @param pem
     * @return la cle public
     */
    private PublicKey convertPublicKey(final byte[] pem) {
        PublicKey key = null;

        final String temp = new String(pem);
        final String publicKeyPEM = temp.replace(
            "-----BEGIN PUBLIC KEY-----\n", "")
                    .replace("-----END PUBLIC KEY-----", "");

        final byte[] decoded = Base64.decode(publicKeyPEM);
        final X509EncodedKeySpec pubKeySpec = new X509EncodedKeySpec(decoded);
        KeyFactory keyFactory;
        try {
            keyFactory = KeyFactory.getInstance("RSA");
            key = keyFactory.generatePublic(pubKeySpec);
        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            throw new JwtAuthenticationException("Public Key init error", e);
        }
        return key;
    }

    /**
     * genere une cle privee depuis le contenu d'un fichier PEM
     * @param pem
     * @return la cle privee
     */
    private PrivateKey convertPrivateKey(final byte[] pem) {
        PrivateKey key = null;

        try {

            final String temp = new String(pem);
            final String privKeyPEM = temp.replace(
                "-----BEGIN PRIVATE KEY-----\n", "")
                        .replace("-----END PRIVATE KEY-----", "");

            final byte[] decoded = Base64.decode(privKeyPEM);
            final PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(decoded);
            final KeyFactory kf = KeyFactory.getInstance("RSA");
            key = kf.generatePrivate(spec);
        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            throw new JwtAuthenticationException("Private Key init error", e);
        }
        return key;
    }
}
