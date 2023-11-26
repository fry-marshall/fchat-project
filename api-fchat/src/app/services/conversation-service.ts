import { ModelStatic } from "sequelize";
import Service from "./service";

        
class ConversationService extends Service {
        
    constructor(model: ModelStatic<any>) {
        super(model)
    }
}

export default ConversationService
