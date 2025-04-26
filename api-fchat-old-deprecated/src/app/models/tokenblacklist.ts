import { DataTypes, Model } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import sequelize from "../../config/sequelize";

interface TokenBlackListAttributes{
    id?: string;
    token: string;
}

interface TokenBlackListInstance extends Model<TokenBlackListAttributes>, TokenBlackListAttributes{}

const TokenBlackList = sequelize.define<TokenBlackListInstance>('tokenblacklist', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        set(value){
            this.setDataValue('id', uuidv4())
        }
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }, 
})

export { TokenBlackList, TokenBlackListInstance, TokenBlackListAttributes};
