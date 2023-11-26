import Service from "../services/service";
import MessageService from "../services/message-service";
import Controller from "./controller";
import Message from "../models/message";
import Helpers from "../../helpers/helpers";
import { Request, Response } from "express"
import { User } from "../models/user";
import Conversation from "../models/conversation";
import { v4 as uuidv4 } from "uuid";
import { Op } from "sequelize";


class MessageController extends Controller {

    constructor(service: Service) {
        super(service);
    }

    // to get all a conversation of a user
    async getAll(req: Request, res: Response) {
        try {

            const user = res.locals.user;

            let conversations = await Conversation.findAll({
                where: {
                    [Op.or]: [
                        {
                            user_id_1: user.id,
                        },
                        {
                            user_id_2: user.id
                        },
                    ],
                }
            })

            if(!conversations || conversations.length === 0){
                return res.status(404).json(Helpers.queryResponse({msg: 'There are no conversations with this user'}))
            }

            let response: any[] = []

            for(let conv of conversations){
                const messages = await Message.findAll({
                    where: {
                        conversation_id: conv.id,
                    },
                    order: [['date', 'ASC']],
                })

                response.push(
                    {
                        conversation_id: conv.id,
                        messages
                    }
                )
            }

            return res.status(201).json(Helpers.queryResponse(conversations))

        } catch (e) {
            return res.status(500).json(Helpers.serverError)
        }
    }

    // to create an message
    async insert(req: Request, res: Response) {
        try {

            const user = res.locals.user;
            const receiverUserId = req.body?.receiver_id;

            if (receiverUserId === user.id) {
                return res.status(400).json(Helpers.queryResponse({ msg: 'Receiver user cannot be the sender user' }))
            }

            const receiverUser = await User.findByPk(receiverUserId)
            if (!receiverUser) {
                return res.status(404).json(Helpers.queryResponse({ msg: 'Receiver user doesn\'t exist' }))
            }


            let conversation = await Conversation.findOne({
                where: {
                    [Op.or]: [
                        {
                            user_id_1: user.id,
                            user_id_2: receiverUserId,
                        },
                        {
                            user_id_1: receiverUserId,
                            user_id_2: user.id
                        },
                    ],
                }
            })

            if(!conversation){
                const body = {
                    id: uuidv4(),
                    user_id_1: receiverUserId,
                    user_id_2: user.id
                }
                conversation = await Conversation.create(body)

            }

            const response = await this.service.insert({
                id: uuidv4(),
                content: req.body?.content,
                sender_id: user.id,
                receiver_id: receiverUserId,
                conversation_id: conversation.id
            })

            if (response.is_error){
                return res.status(400).send(response);
            }

            return res.status(201).json(Helpers.queryResponse({ id: (response as any).data.id, msg: 'msg sent successfully' }))

        } catch (e) {
            return res.status(500).json(Helpers.serverError)
        }
    }
}

export default new MessageController(new MessageService(Message));
