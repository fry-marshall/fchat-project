import { ModelStatic } from "sequelize";
import Service from "./service";

    
class TokenBlackListService extends Service {
    
    constructor(model: ModelStatic<any>) {
        super(model)
    }
}

export default TokenBlackListService
