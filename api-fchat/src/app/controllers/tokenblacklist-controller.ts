import { TokenBlackList } from "../models/tokenblacklist";
import Service from "../services/service";
import TokenBlackListService from "../services/tokenblacklist-service";
import Controller from "./controller";

    
class TokenBlackListController extends Controller {
    
    constructor(service: Service) {
        super(service);
    }
}
export default new TokenBlackListController(new TokenBlackListService(TokenBlackList));
