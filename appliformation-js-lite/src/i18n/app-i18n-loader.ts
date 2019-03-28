import { I18nLoader } from "hornet-js-core/src/i18n/i18n-loader";
import * as path from "path";

export class AppliI18nLoader extends I18nLoader {

    constructor() {
        super(path.join(__dirname, "..", "resources"));
    }
}
