import PersonneRoutesClient from "src/routes/per/per-client-routes";
import { DataRouteInfos, PUBLIC_ROUTE } from 'hornet-js-core/src/routes/abstract-routes';
import * as RechercherPersonneAction  from 'src/actions/per/per-actions';
import { PersonneServiceImpl } from "src/services/data/per/per-service-impl";
import { Injector } from 'hornet-js-core/src/inject/injector';
import { PersonneService } from 'src/services/data/per/per-service';

export default class PersonneRoutesServer extends PersonneRoutesClient {
    constructor() {
        super();

        /* Route des datas */
         this.addDataRoute("/rechercher/([A-Za-z]+)/([A-Za-z]+)/([A-Za-z]*)/(\\d*)",
             (nom, sexe, prenom, age) => new DataRouteInfos(RechercherPersonneAction.RechercherPersonneAction, {nom: nom, sexe: sexe, prenom: prenom, age: age}, Injector.getRegistered(PersonneService)),
             PUBLIC_ROUTE,
             "get"
         );

         /* Route des datas */
         this.addDataRoute("/rechercher/([A-Za-z]+)/([A-Za-z]+)",
             (nom, sexe) => new DataRouteInfos(RechercherPersonneAction.RechercherPersonneAction, {nom: nom, sexe: sexe}, Injector.getRegistered(PersonneService)),
             PUBLIC_ROUTE,
             "get"
         );

         /* Route des datas */
         this.addDataRoute("/rechercher/([A-Za-z]+)/([A-Za-z]+)/([A-Za-z]+)",
             (nom, sexe, prenom) => new DataRouteInfos(RechercherPersonneAction.RechercherPersonneAction, {nom: nom, sexe: sexe, prenom:prenom}, Injector.getRegistered(PersonneService)),
             PUBLIC_ROUTE,
             "get"
         );

         /* Route des datas */
         this.addDataRoute("/rechercher/([A-Za-z]+)/([A-Za-z]+)/(\\d*)",
             (nom, sexe, age) => new DataRouteInfos(RechercherPersonneAction.RechercherPersonneAction, {nom: nom, sexe: sexe, age:age}, Injector.getRegistered(PersonneService)),
             PUBLIC_ROUTE,
             "get"
         );
  
  
}
}