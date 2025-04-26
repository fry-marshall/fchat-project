import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/sequelize";
import { UserInstance } from "./user";

interface ConversationAttributes{
    id?: string;
    user_id_1?: string;
    user_id_2?: string;
}

export interface ConversationInstance extends Model<ConversationAttributes>, ConversationAttributes{
    setUser1: (user: UserInstance) => Promise<void>;
    setUser2: (user: UserInstance) => Promise<void>;
}

const Conversation = sequelize.define<ConversationInstance>('conversation', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    }
})

export default Conversation;
