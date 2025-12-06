// Sequelize instance and model registration for SQLite
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
  logging: false,
});

// Define models here to avoid circular requires
const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: true, unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: true },
  avatarUrl: { type: DataTypes.STRING, allowNull: true },
  anonymous: { type: DataTypes.BOOLEAN, defaultValue: true },
  isEmailVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  emailVerificationToken: { type: DataTypes.STRING, allowNull: true },
  emailVerificationTokenExpiry: { type: DataTypes.DATE, allowNull: true },
});

const DiscussionTopic = sequelize.define('DiscussionTopic', {
  title: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  tags: { type: DataTypes.TEXT, allowNull: true }, // comma-separated tags
});

const ChatMessage = sequelize.define('ChatMessage', {
  content: { type: DataTypes.TEXT, allowNull: false },
});

// Associations
User.hasMany(DiscussionTopic, { as: 'topics', foreignKey: 'creatorId' });
DiscussionTopic.belongsTo(User, { as: 'creator', foreignKey: 'creatorId' });

DiscussionTopic.hasMany(ChatMessage, { as: 'messages', foreignKey: 'topicId' });
ChatMessage.belongsTo(DiscussionTopic, { as: 'topic', foreignKey: 'topicId' });
ChatMessage.belongsTo(User, { as: 'author', foreignKey: 'authorId' });

module.exports = {
  sequelize,
  User,
  DiscussionTopic,
  ChatMessage,
  DataTypes,
};
