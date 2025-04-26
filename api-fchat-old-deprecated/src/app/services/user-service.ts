
import { ModelStatic } from "sequelize";
import Service from "./service";

    
class UserService extends Service {
    
    constructor(model: ModelStatic<any>) {
        super(model)
    }
}

export default UserService
