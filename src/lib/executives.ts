import raphaelIyama from "@/assets/GCN 09 EX/Raphael Iyama.png";
import aliyuUmbugadu from "@/assets/GCN 09 EX/Aliyu Usman Umbugadu.png";
import sundayDaniel from "@/assets/GCN 09 EX/Sunday Daniel.png";
import blessingObi from "@/assets/GCN 09 EX/Blessing Obi.png";
import godiyaTitus from "@/assets/GCN 09 EX/Godiya Titus.png";
import batureJethro from "@/assets/GCN 09 EX/Bature Jethro.png";
import sundayBaiwa from "@/assets/GCN 09 EX/Sunday Baiwa Gift.png";
import aliIdaewor from "@/assets/GCN 09 EX/Ali Idaewor Abdul.png";
import estherMukanche from "@/assets/GCN 09 EX/Esther Amos mukanche.png";
import akpakaOluchi from "@/assets/GCN 09 EX/Akpaka Oluchi.png";
import linusLuka from "@/assets/GCN 09 EX/LINUS LUKA.png";
import godwinOloko from "@/assets/GCN 09 EX/Godwin Oloko.png";
import georgeAmos from "@/assets/GCN 09 EX/George Amos.png";

export interface Executive {
  name: string;
  role: string;
  state: string;
  image?: string;
}

export const EXECUTIVES: Executive[] = [
  {
    name: "Hon. Raphael Iyama Amhanogho",
    role: "President",
    state: "Abuja",
    image: raphaelIyama,
  },
  {
    name: "Aliyu Usman Umbugadu",
    role: "Vice President",
    state: "Abuja",
    image: aliyuUmbugadu,
  },
  {
    name: "Sunday Daniel",
    role: "Secretary",
    state: "Nasarawa",
    image: sundayDaniel,
  },
  {
    name: "Mrs Blessing Obi",
    role: "Assistant Secretary",
    state: "Abuja",
    image: blessingObi,
  },
  {
    name: "Godiya Titus",
    role: "Financial Secretary",
    state: "Abuja",
    image: godiyaTitus,
  },
  {
    name: "Bature Jethro",
    role: "Assistant Financial Secretary",
    state: "Nasarawa",
    image: batureJethro,
  },
  {
    name: "Sunday Baiwa Gift",
    role: "Treasurer",
    state: "Abuja",
    image: sundayBaiwa,
  },
  {
    name: "Ali Idaewor Abdul",
    role: "Welfare I",
    state: "Abuja",
    image: aliIdaewor,
  },
  {
    name: "Esther Amos Mukanche",
    role: "Welfare II",
    state: "Abuja",
    image: estherMukanche,
  },
  {
    name: "Akpaka Oluchi",
    role: "PRO II",
    state: "Enugu",
    image: akpakaOluchi,
  },
  {
    name: "Linus Luka",
    role: "PRO I",
    state: "Abuja",
    image: linusLuka,
  },
  {
    name: "Godwin Oloko",
    role: "Provost I",
    state: "Abuja",
    image: godwinOloko,
  },
  {
    name: "George Amos",
    role: "Provost II",
    state: "Nasarawa",
    image: georgeAmos,
  },
];
