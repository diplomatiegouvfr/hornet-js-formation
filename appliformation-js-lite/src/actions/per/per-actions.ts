import { RouteActionService } from 'hornet-js-core/src/routes/abstract-routes';
import { PersonneService } from 'src/services/data/per/per-service';

export class RechercherPersonneAction extends RouteActionService<any, PersonneService> {
  
      execute(): Promise<any> {
          if (this.attributes) {
  
              return this.getService().rechercherPersonnes(this.attributes);
          } else {
              Promise.resolve(true);
          }
      }
  }