import Service from "../services/service";
import MessageService from "../services/message-service";
import Controller from "./controller";
import Message from "../models/message";
import Helpers from "../../helpers/helpers";
import { Request, Response } from "express"
import { User } from "../models/user";
import Conversation from "../models/conversation";
import { v4 as uuidv4 } from "uuid";
import { Op, Sequelize } from "sequelize";

Conversation.belongsTo(User, { foreignKey: 'user_id_1', as: 'User1' })
Conversation.belongsTo(User, { foreignKey: 'user_id_2', as: 'User2' })
Message.belongsTo(User, { foreignKey: 'sender_id', as: 'Sender' })
Message.belongsTo(User, { foreignKey: 'receiver_id', as: 'Receiver' })
Message.belongsTo(Conversation, { foreignKey: 'conversation_id', as: 'Conversation' })


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
                    [Op.and]: [
                        {
                            [Op.or]: [
                                { user_id_1: user.id },
                                { user_id_2: user.id }
                            ]
                        },
                        Sequelize.literal('user_id_1 IS NOT NULL AND user_id_2 IS NOT NULL')
                    ]
                }
            })

            if(!conversations || conversations.length === 0){
                return res.status(200).json(Helpers.queryResponse({message: []}))
            }

            let response: any[] = []

            for(let conv of conversations){
                const messages = await Message.findAll({
                    where: {
                        conversation_id: conv.id,
                    },
                    order: [['date', 'ASC']],
                })
                if(messages.length > 0){
                    response.push(
                        {
                            conversation_id: conv.id,
                            messages
                        }
                    )
                }
            }
            return res.status(200).json(Helpers.queryResponse(response))

        } catch (e) {
            return res.status(500).json(Helpers.serverError)
        }
    }

    // to create an message
    async sendMessage(req: Request, res: Response) {
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
                }
                conversation = await Conversation.create(body)
                await conversation.setUser1(user)
                await conversation.setUser2(receiverUser)
            }

            const message = await Message.create({
                id: uuidv4(),
                content: req.body?.content,
            })

            await message.setSender(user)
            await message.setReceiver(receiverUser)
            await message.setConversation(conversation)


            const messages = await Message.findAll({
                where: {
                    conversation_id: conversation.id,
                    receiver_id: user.id
                }
            })

            if(messages.length > 0){

                for(let message of messages){
                    message.set({is_read: true})
                    await message.save()
                }
            }

            res.locals.io.emit(
                receiverUserId, {
                type: 'read_message',
                data: {
                    conversation_id: req.body.conversation_id,
                    messages
                }
            })

            res.locals.io.emit(receiverUserId, {
                type: 'new_message',
                data: {
                    id: message.id,
                    conversation_id: conversation.id,
                    content: message.content,
                    sender_id: user.id,
                    receiver_id: receiverUserId,
                    date: new Date().toISOString()
                }
            })

            return res.status(201).json(Helpers.queryResponse({conversation_id: conversation.id, message_id: message.id, msg: 'msg sent successfully', date: new Date().toISOString() }))

        } catch (e) {
            console.log(e)
            return res.status(500).json(Helpers.serverError)
        }
    }

     // to read a message
     async readMessage(req: Request, res: Response) {
        try {

            const user = res.locals.user;

            const messages = await Message.findAll({
                where: {
                    conversation_id: req.body.conversation_id,
                    receiver_id: user.id
                }
            })

            if(messages.length > 0){

                for(let message of messages){
                    message.set({is_read: true})
                    await message.save()
                }

                const senderId = messages[0].sender_id

                res.locals.io.emit(senderId, {
                    type: 'read_message',
                    data: {
                        conversation_id: req.body.conversation_id,
                        messages
                    }
                })
            }


            return res.status(202).json(Helpers.queryResponse({ msg: "Message read successfully" }))

        } catch (e) {
            return res.status(500).json(Helpers.serverError)
        }
    }
}

export default new MessageController(new MessageService(Message));
