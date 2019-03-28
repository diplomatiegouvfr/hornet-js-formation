import { PersonneService } from "src/services/data/per/per-service";
import { PersonneMetier } from "src/models/per-mod";
import { PersonneDAO } from 'src/dao/per-dao';

export class PersonneServiceImpl extends PersonneService {

    private personneDAO: PersonneDAO = new PersonneDAO();

    rechercherPersonnes(data:any): Promise<Array<PersonneMetier>> {
        return this.personneDAO.selectByCriteres(data);
    }

}
