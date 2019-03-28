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
package fr.gouv.diplomatie.formation.mail.service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import org.apache.commons.lang3.text.WordUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import hornet.framework.exception.BusinessException;
import hornet.framework.mail.MailService;

/**
 * Implementation pour l'envoi d'un mail de contact.
 *
 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
 */
public class MailContactServiceImpl implements MailContactService {

    /** Recuperation du logger. */
    private static final Logger LOGGER = LoggerFactory.getLogger(MailContactService.class);

    /** JavaMailSender. */
    @Autowired
    private transient MailService mailService;

    /** L'Objet du message de contact. */
    private final transient String objetContactMail;

    /** Le Corps du message de contact. */
    private final transient String corpsContactMail;

    /**
     * Les destinataires du mail de contact.
     */
    private final transient String[] destinataires;

    /** Nom de l'application. */
    private final transient String applicationName;

    /** Url de l'application. */
    private final transient String applicationUrl;

    /** Champ ReplyTo. */
    @SuppressWarnings("unused")
    private static final String NO_REPLY = "NoReply";

    /**
     * Constructeur.
     *
     * @param mailService
     *            Hornet MailService
     * @param applicationUrl
     *            Url de l'application
     * @param applicationName
     *            Nom de l'application
     * @param objetContactMail
     *            Objet du message de contact
     * @param corpsContactMail
     *            Corps du message de contact
     * @param destinataires
     *            Les destinataires du mail de contact
     */
    public MailContactServiceImpl(
                final String applicationUrl, final String applicationName,
                final String objetContactMail, final String corpsContactMail, final String[] destinataires) {

        this.applicationUrl = applicationUrl;
        this.applicationName = applicationName;
        this.objetContactMail = objetContactMail;
        this.corpsContactMail = corpsContactMail;
        this.destinataires = destinataires.clone();
    }

    /** {@inheritDoc} */
    @Override
    public void envoyerMail(final String nom, final String prenom, final String fromAddress,
                final String message) {

        try {
            final String sujet =
                        String.format(objetContactMail, applicationName,
                            WordUtils.capitalize(prenom), WordUtils.capitalize(nom));

            final Map<String, Object> params = new HashMap<String, Object>();
            params.put("nom", WordUtils.capitalize(nom));
            params.put("prenom", WordUtils.capitalize(prenom));
            params.put("corps", message);
            final SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy 'à' HH:mm:ss", Locale.FRENCH);
            params.put("date", sdf.format(new Date()));
            params.put("applicationName", applicationName);
            params.put("applicationUrl", applicationUrl);

            // Exemple d'utilisation d'un NO_REPLY ou d'ajout d'un CC
            // params.put(MailServiceImpl.SMTP_HEADER_REPLYTO, NO_REPLY);
            // params.put(MailServiceImpl.SMTP_HEADER_CC, "root@localhost.com");

            mailService.envoyerDepuisModele(fromAddress, sujet, corpsContactMail, params,
                destinataires);

        } catch (final Exception e) {
            MailContactServiceImpl.LOGGER.error("Erreur lors de la tentative d'envoi de mail de contact.", e);
            throw new BusinessException("ERR-CODE-MAIL-001", e);
        }

    }

}
