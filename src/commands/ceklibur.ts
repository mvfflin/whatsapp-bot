import axios from "axios";
import { Message, Whatsapp } from "venom-bot";

interface liburData {
  tanggal: string;
  keterangan: string;
  is_cuti: boolean;
}

const cekLibur = async (msg: Message, client: Whatsapp) => {
  const msgId = msg.id.toString();
  const chatId = msg.chatId;
  const args = msg.body.split(" ");
  const month = parseInt(args[1]);
  const year = parseInt(args[2]);
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
  } else if (year > new Date().getFullYear()) {
    return client.reply(
      chatId,
      `Kamu tidak bisa mengisi tahun dengan tahun diatas ${new Date().getFullYear()}`,
      msgId
    );
  }

  const isYearFetch = args[2] ? `&year=${args[2]}` : "";
  const isYearStr = args[2] ? ` tahun ${args[2]}` : "";
  const res = await axios.get(
    `https://dayoffapi.vercel.app/api?month=${args[1]}${isYearFetch}`
  );
  const data = await res.data;
  const dataLength = data.length;

  if (res.status == 404) {
    return client.reply(
      chatId,
      "Ada kesalahan, atau kamu menginput data yang tidak masuk akal",
      msgId
    );
  }

  if (data.length == 0) {
    return client.reply(
      chatId,
      `Tidak ada hari libur nasional pada bulan ke-${args[1]}${isYearStr}`,
      msgId
    );
  }

  return client.reply(
    chatId,
    `List libur pada bulan ${args[1]}${isYearStr} :\n${data.map(
      (data: liburData) => {
        return `\n- Tanggal : ${data.tanggal}\n- Ket. : ${
          data.keterangan
        }\n- Cuti/Libur? : ${data.is_cuti ? "Libur" : "Tidak Libur"}\n`;
      }
    )} `,
    msgId
  );
};

export default cekLibur;
