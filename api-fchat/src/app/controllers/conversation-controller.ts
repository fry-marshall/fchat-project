import Service from "../services/service";
import ConversationService from "../services/conversation-service";
import Controller from "./controller";
import Conversation from "../models/conversation";

        
class ConversationController extends Controller {
        
    constructor(service: Service) {
        super(service);
    }
}

export default new ConversationController(new ConversationService(Conversation));
