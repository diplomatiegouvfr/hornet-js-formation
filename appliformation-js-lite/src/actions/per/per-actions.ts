import { RouteActionService } from 'hornet-js-core/src/routes/abstract-routes';
import { PersonneService } from 'src/services/data/per/per-service';
import { DataValidator } from 'hornet-js-core/src/validation/data-validator';
import * as schema from "src/views/per/per-form-creation.page.validation.json";

export class RechercherPersonneAction extends RouteActionService<any, PersonneService> {
    // getDataValidator(): DataValidator {
    //       return new DataValidator(schema);
    //   }
  
      execute(): Promise<any> {
          if (this.attributes) {
  
              return this.getService().rechercherPersonnes(this.attributes);
          } else {
              Promise.resolve(true);
          }
      }
  }


  export class SupprimerPersonneAction extends RouteActionService<any, PersonneService> {
  
      execute(): Promise<any> {
          if (this.attributes) {
  
              return this.getService().supprimerPersonne(this.attributes.id);
          } else {
              Promise.resolve(true);
          }
      }
  }

  export class CreerPersonneAction extends RouteActionService<any, PersonneService> {
  
      getDataValidator(): DataValidator {
          return new DataValidator(schema);
      }
    execute(): Promise<any> {
        if (this.req.body) {
            return this.getService().creer(this.req.body);
        } else {
            Promise.resolve(true);
        }
    }
}