import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/sequelize";

interface ConversationAttributes{
    id?: string;
    user_id_1?: string;
    user_id_2?: string;
}

interface ConversationInstance extends Model<ConversationAttributes>, ConversationAttributes{}

const Conversation = sequelize.define<ConversationInstance>('conversation', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    }
})

export default Conversation;
