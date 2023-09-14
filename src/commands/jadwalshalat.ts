import axios from "axios";
import { Message, Whatsapp } from "venom-bot";

interface jadwalObj {
  tanggal: string;
  imsyak: string;
  shubuh: string;
  terbit: string;
  dhuha: string;
  dzuhur: string;
  ashr: string;
  magrib: string;
  isya: string;
}

const jadwalShalat = async (msg: Message, client: Whatsapp) => {
  const chatid = msg.id.toString();
  const arg = msg.body.split(" ");
  if (!arg[1]) {
    client.reply(
      msg.from,
      "Tentukan lokasi jadwal sholat dengan cara !jadwalshalat <lokasi/daerah>\nContoh : !jadwalshalat bekasi",
      chatid
    );
    if (msg.fromMe) {
      client.reply(
        msg.to,
        "Tentukan lokasi jadwal sholat dengan cara !jadwalshalat <lokasi/daerah>\nContoh : !jadwalshalat bekasi",
        chatid
      );
    }
  } else if (arg[1] != "listkota") {
    try {
      const getCities = await axios.get(
        "https://raw.githubusercontent.com/lakuapik/jadwalsholatorg/master/kota.json"
      );
      const cities = getCities.data;
      const findCity = cities.find((city: string) => {
        return city == arg[1];
      });
      if (findCity) {
        const date = new Date();
        let year = date.getFullYear().toString();
        let month = date.getMonth() + 1;
        let monthStr = month.toString();
        let tanggal = date.getDate();
        let fixMonth: string;
        if (monthStr.length == 1) {
          fixMonth = `0${monthStr}`;
        } else {
          fixMonth = monthStr;
        }
        const res = await axios.get(
          `https://raw.githubusercontent.com/lakuapik/jadwalsholatorg/master/adzan/${findCity}/${year}/${fixMonth}.json`
        );
        const data = res.data;
        const jadwalHariIni: jadwalObj = data.find(
          (obj: jadwalObj) => obj.tanggal == `${year}-${fixMonth}-${tanggal}`
        );
        client.reply(
          msg.from,
          `Jadwal Sholat di ${findCity} hari ini :\n\nImsyak : ${jadwalHariIni.imsyak}\nShubuh : ${jadwalHariIni.shubuh}\nTerbit : ${jadwalHariIni.terbit}\nDhuha : ${jadwalHariIni.dhuha}\nDzuhur : ${jadwalHariIni.dzuhur}\nAshr : ${jadwalHariIni.ashr}\nMaghrib : ${jadwalHariIni.magrib}\nIsya : ${jadwalHariIni.isya}`,
          chatid
        );
        if (msg.fromMe) {
          client.reply(
            msg.to,
            `Jadwal Sholat di ${findCity} hari ini :\n\nImsyak : ${jadwalHariIni.imsyak}\nShubuh : ${jadwalHariIni.shubuh}\nTerbit : ${jadwalHariIni.terbit}\nDhuha : ${jadwalHariIni.dhuha}\nDzuhur : ${jadwalHariIni.dzuhur}\nAshr : ${jadwalHariIni.ashr}\nMaghrib : ${jadwalHariIni.magrib}\nIsya : ${jadwalHariIni.isya}`,
            chatid
          );
        }
      } else {
        client.reply(
          msg.from,
          "Kota tidak ditemukan! coba lihat list kota yang tersedia dengan !jadwalshalat listkota",
          chatid
        );
        if (msg.fromMe) {
          client.reply(
            msg.to,
            "Kota tidak ditemukan! coba lihat list kota yang tersedia dengan !jadwalshalat listkota",
            chatid
          );
        }
      }
    } catch (err) {
      console.error("alamak", err);
      client.reply(msg.from, "Ada yang salah, tolong hubungi atmin 😱", chatid);
      if (msg.fromMe) {
        client.reply(msg.to, "Ada yang salah, tolong hubungi atmin 😱", chatid);
      }
    }
  } else if (arg[1] == "listkota") {
    const getCities = await axios.get(
      "https://raw.githubusercontent.com/lakuapik/jadwalsholatorg/master/kota.json"
    );
    const cities: Array<string> = getCities.data;
    const list = cities.toString();
    const fixList = list.replace(/,/g, "\n");

    client.reply(
      msg.from,
      `Ini list kota yang ada untuk jadwal shalat :\n${fixList}`,
      chatid
    );
    if (msg.fromMe) {
      client.reply(
        msg.to,
        `Ini list kota yang ada untuk jadwal shalat :\n${fixList}`,
        chatid
      );
    }
  }
};

export default jadwalShalat;
