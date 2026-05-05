const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "..", "data", "chats.json");

function readChats() {
  try {
    return JSON.parse(fs.readFileSync(dataPath, "utf8"));
  } catch (error) {
    return [];
  }
}

function writeChats(chats) {
  fs.writeFileSync(dataPath, JSON.stringify(chats, null, 2));
}

function saveChat(chat) {
  const chats = readChats();
  const exists = chats.some((savedChat) => savedChat.id === chat.id);

  if (!exists) {
    chats.push({
      id: chat.id,
      type: chat.type,
      title: chat.title || null,
      username: chat.username || null,
      firstName: chat.first_name || null,
      lastName: chat.last_name || null,
      createdAt: new Date().toISOString()
    });
    writeChats(chats);
  }
}

function removeChat(chatId) {
  const chats = readChats().filter((chat) => chat.id !== chatId);
  writeChats(chats);
}

module.exports = {
  readChats,
  saveChat,
  removeChat
};
