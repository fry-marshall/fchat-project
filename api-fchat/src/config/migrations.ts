import Message from "../app/models/message"
import Conversation from "../app/models/conversation"
import { User } from "../app/models/user"
import { TokenBlackList } from "../app/models/tokenblacklist"

(async () => {
	await User.sync({ alter: true });
	await TokenBlackList.sync({ alter: true });
	Conversation.belongsTo(User, {foreignKey: 'user_id_1'})
	Conversation.belongsTo(User, {foreignKey: 'user_id_2'})
	await Conversation.sync({ alter: true });
	Message.belongsTo(User, {foreignKey: 'sender_id'})
	Message.belongsTo(User, {foreignKey: 'receiver_id'})
	Message.belongsTo(Conversation, {foreignKey: 'conversation_id'})
	await Message.sync({ alter: true });
})();
