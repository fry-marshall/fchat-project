import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/sequelize";
import { UserInstance } from "./user";
import { ConversationInstance } from "./conversation";

interface MessageAttributes{
    id?: string;
    content?: string;
    date?: string;
    sender_id?: string;
    receiver_id?: string;
    conversation_id?: string
}

interface MessageInstance extends Model<MessageAttributes>, MessageAttributes{
    setSender: (user: UserInstance) => Promise<void>;
    setReceiver: (user: UserInstance) => Promise<void>;
    setConversation: (user: ConversationInstance) => Promise<void>;
}

const Message = sequelize.define<MessageInstance>('message', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        validate: {
            notEmpty: true
        }
    },
},{
    createdAt: false,
    updatedAt: false
})

export default Message;
