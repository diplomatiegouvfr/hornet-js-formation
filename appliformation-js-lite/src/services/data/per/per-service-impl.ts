import { PersonneService } from "src/services/data/per/per-service";
import { PersonneMetier } from "src/models/per-mod";
import { PersonneDAO } from "src/dao/per-dao";
import { Promise } from "hornet-js-utils/src/promise-api";

export class PersonneServiceImpl extends PersonneService {

    private personneDAO: PersonneDAO = new PersonneDAO();

    rechercherPersonnes(data:any): Promise<PersonneMetier[]> {
        return this.personneDAO.selectByCriteres(data);
    }

}
