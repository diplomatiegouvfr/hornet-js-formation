/**
 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
 * <p/>
 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
 * <p/>
 * Ce logiciel est un programme informatique servant à faciliter la création
 * d'applications Web conformément aux référentiels généraux français : RGI, RGS et RGAA
 * <p/>
 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
 * respectant les principes de diffusion des logiciels libres. Vous pouvez
 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA
 * sur le site "http://www.cecill.info".
 * <p/>
 * En contrepartie de l'accessibilité au code source et des droits de copie,
 * de modification et de redistribution accordés par cette licence, il n'est
 * offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
 * seule une responsabilité restreinte pèse sur l'auteur du programme,  le
 * titulaire des droits patrimoniaux et les concédants successifs.
 * <p/>
 * A cet égard  l'attention de l'utilisateur est attirée sur les risques
 * associés au chargement,  à l'utilisation,  à la modification et/ou au
 * développement et à la reproduction du logiciel par l'utilisateur étant
 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 * manipuler et qui le réserve donc à des développeurs et des professionnels
 * avertis possédant  des  connaissances  informatiques approfondies.  Les
 * utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
 * logiciel à leurs besoins dans des conditions permettant d'assurer la
 * sécurité de leurs systèmes et ou de leurs données et, plus généralement,
 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
 * <p/>
 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
 * termes.
 * <p/>
 * <p/>
 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
 * <p/>
 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
 * <p/>
 * This software is a computer program whose purpose is to facilitate creation of
 * web application in accordance with french general repositories : RGI, RGS and RGAA.
 * <p/>
 * This software is governed by the CeCILL license under French law and
 * abiding by the rules of distribution of free software.  You can  use,
 * modify and/ or redistribute the software under the terms of the CeCILL
 * license as circulated by CEA, CNRS and INRIA at the following URL
 * "http://www.cecill.info".
 * <p/>
 * As a counterpart to the access to the source code and  rights to copy,
 * modify and redistribute granted by the license, users are provided only
 * with a limited warranty  and the software's author,  the holder of the
 * economic rights,  and the successive licensors  have only  limited
 * liability.
 * <p/>
 * In this respect, the user's attention is drawn to the risks associated
 * with loading,  using,  modifying and/or developing or reproducing the
 * software by the user in light of its specific status of free software,
 * that may mean  that it is complicated to manipulate,  and  that  also
 * therefore means  that it is reserved for developers  and  experienced
 * professionals having in-depth computer knowledge. Users are therefore
 * encouraged to load and test the software's suitability as regards their
 * requirements in conditions enabling the security of their systems and/or
 * data to be ensured and,  more generally, to use and operate it in the
 * same conditions as regards security.
 * <p/>
 * The fact that you are presently reading this means that you have had
 * knowledge of the CeCILL license and that you accept its terms.
 *
 */

/**
 * applitutoriel-js-lite - Application tutoriel utilisant le Framework hornet
 *
 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
 * @version v5.3.0
 * @link git+https://github.com/diplomatiegouvfr/applitutoriel-modules.git
 * @license CECILL-2.1
 */
// Bootstrap de lancement de l'application
// permet la résolution de modules dans des répertoires autres que "node_modules"
const Module = require("module").Module;
import * as fs from "fs";
import * as path from "path";

const appDirectory = process.cwd();
// On conserve la méthode originale pour rétablir le fonctionnement normal en cas d'un requireGlobal
Module._oldNodeModulePaths = Module._nodeModulePaths;

const NODE_MODULES = "node_modules";

Module.prototype._oldCompile = Module.prototype._compile;
Module.prototype._compile = function (content, filename) {
    if ((path.extname(filename) === ".scss") || (path.extname(filename) === ".svg")) {
        content = "module.exports = {};";
    }
    return this._oldCompile(content, filename);
};


// on surcharge la méthode de résolution interne nodejs pour gérer d'autres répertoires
Module._newNodeModulePaths = function (from) {
    var paths = Module._oldNodeModulePaths.call(this, from);
    paths.push(path.join(appDirectory));
    paths.push(path.join(appDirectory, NODE_MODULES));

    let modulePath = from
    do {
        if(fs.existsSync(path.join(modulePath, NODE_MODULES))) {
            paths.push(path.join(modulePath, NODE_MODULES));
        }
        modulePath = path.dirname(modulePath)
    } while(modulePath.length > 1)
    return paths;
};
Module._nodeModulePaths = Module._newNodeModulePaths;


////////////////////////////////////////////////////////////////////////////////////////////////////
// Gestion du cas particulier du main (car nodejs le considère différent des autres modules ...)  //
require.main.paths = [];
require.main.paths.push(path.join(process.cwd()));
require.main.paths.push(path.join(process.cwd(), NODE_MODULES));

////////////////////////////////////////////////////////////////////////////////////////////////////

// gestion des sourcemap dans les stack nodejs
require("source-map-support").install();

// autorise le format json5 dans les extensions .json
import { JSONLoader } from "hornet-js-utils/src/json-loader";
JSONLoader.allowJSON5();

// auto configuration des logs server
import { ServerLogConfigurator } from "hornet-js-core/src/log/server-log-configurator";
ServerLogConfigurator.configure();

// initialisation des infos de l'application courante
import { AppSharedProps } from "hornet-js-utils/src/app-shared-props";
import { Utils } from "hornet-js-utils";
const packageJson = require("./package");
AppSharedProps.set("appName", packageJson.name);
AppSharedProps.set("appVersion", packageJson.version);
AppSharedProps.set("appDescription", packageJson.description);
AppSharedProps.set("appAuthor", packageJson.author);
AppSharedProps.set("sessionTimeout", Utils.config.get("server.sessionTimeout"));
AppSharedProps.set("notifSessionTimeout", Utils.config.get("server.notifications.sessionTimeoutDelay"));

// lancement de l'application
import { Server } from "src/server";
Server.startApplication();
