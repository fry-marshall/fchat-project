import { ModelStatic } from "sequelize";
import Service from "./service";

        
class MessageService extends Service {
        
    constructor(model: ModelStatic<any>) {
        super(model)
    }
}

export default MessageService
