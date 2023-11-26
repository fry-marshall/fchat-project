import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/sequelize";

interface MessageAttributes{
    id?: string;
    content?: string;
    date?: string;
}

interface MessageInstance extends Model<MessageAttributes>, MessageAttributes{}

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
        type: DataTypes.TIME,
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
