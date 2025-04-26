import { DataTypes, Model } from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "../../config/sequelize";

interface UserAttributes{
    id: string;
    fullname?: string,
    description?: string,
    email?: string;
    email_verified_token?: string;
    email_expiredtime?: string;
    email_verified?: boolean;
    forgotpasswordtoken?: string,
    forgotpasswordused?: boolean
    password?: string;
    profile_img?: string
}

interface UserInstance extends Model<UserAttributes>, UserAttributes{}

const User = sequelize.define<UserInstance>('user', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
    },
    fullname: {
        type: DataTypes.STRING,
        validate: {
            notEmpty: true
        }
    },
    description: {
        type: DataTypes.STRING,
        validate: {
            notEmpty: true
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        }
    },
    email_verified_token: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
        validate: {
            notEmpty: true,
        }
    },
    email_expiredtime: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    email_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    forgotpasswordtoken: {
        type: DataTypes.STRING,
    },
    forgotpasswordused: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        },
        set(value: string){
            if(typeof value !== "undefined"){
                this.setDataValue('password', bcrypt.hashSync(value, 10));
            }
        }
    },
    profile_img: {
        type: DataTypes.STRING,
        defaultValue: 'default.png'
    },
})

export { User, UserInstance, UserAttributes};
