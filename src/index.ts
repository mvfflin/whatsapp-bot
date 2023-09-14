import { Message, Whatsapp, create } from "venom-bot";
import { cekLibur, jadwalShalat, saveMedia } from "./commands";

create({
  session: "muffin bot",
})
  .then((client) => start(client))
  .catch((err) => {
    console.error("somethings wrong", err);
  });

const start = async (client: Whatsapp) => {
  client.onAnyMessage((msg: Message) => {
    console.log(msg.body.split(" ").at(1));
    if (msg.body.startsWith("!test")) {
      const chatid = msg.id.toString();
      client.reply(msg.from, "hai bang ini tes ajah", chatid);
      if (msg.fromMe) {
        client.reply(msg.to, "hai bang ini tes ajah", chatid);
      }
    } else if (msg.body.startsWith("!jadwalshalat")) {
      jadwalShalat(msg, client);
    } else if (msg.body.startsWith("!savemedia")) {
      saveMedia(msg, client);
    } else if (msg.body.startsWith("!ceklibur")) {
      cekLibur(msg, client);
    }
  });
};
