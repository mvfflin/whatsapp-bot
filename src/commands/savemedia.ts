import { writeFileSync, unlinkSync, existsSync, mkdirSync } from "fs";
import { Message, Whatsapp, MessageType } from "venom-bot";

const saveMedia = async (msg: Message, client: Whatsapp) => {
  const chatid = msg.id.toString();
  const quotedMsg = await msg.quotedMsgObj;
  const randomInt = Math.floor(Math.random() * 99999).toString();
  if (!quotedMsg) {
    return await client.reply(
      msg.chatId,
      "Tidak ada chat yang di reply untuk mengambil image",
      chatid
    );
  }

  const buffer = await client.decryptFile(quotedMsg);
  if (!existsSync(`${__dirname}/../../temp/`)) {
    mkdirSync(`${__dirname}/../../temp/`);
  }
  writeFileSync(`${__dirname}/../../temp/save-media-${randomInt}.png`, buffer);
  await client.sendImage(
    msg.chatId,
    `${__dirname}/../../temp/save-media-${randomInt}.png`,
    "sended-media.png",
    "Ini filenya kakak"
  );
  unlinkSync(`${__dirname}/../../temp/save-media-${randomInt}.png`);
};

export default saveMedia;
