import axios from "axios";
import { Message, Whatsapp } from "venom-bot";

const cekLibur = async (msg: Message, client: Whatsapp) => {
  const msgId = msg.id.toString();
  const chatId = msg.chatId;
  const args = msg.body.split(" ");
  const month = parseInt(args[1]);
  if (!args[1]) {
    return client.reply(
      chatId,
      `Tolong isi bulan, sertakan tahun jika kamu menginginkannya\nContoh :\n- !ceklibur 5 (bulan ke-5 tahun ini)\n- !ceklibur 5 2022 (bulan ke-5 tahun 2022, note : tahun tidak bisa diisi dengan tahun yang akan datang.)`,
      msgId
    );
  } else if (month > 12) {
    return client.reply(
      chatId,
      `Hanya terdapat 12 bulan dalam satu tahun, tapi kamu mengisi dengan angka ${month}`,
      msgId
    );
  }

  const isYear = !args[2] ? `&year=${args[2]}` : "";
  const res = await axios.get(
    `https://dayoffapi.vercel.app/api?month=${args[1]}${isYear}`
  );
  const data = await res.data;
  console.log(data);
};

export default cekLibur;
