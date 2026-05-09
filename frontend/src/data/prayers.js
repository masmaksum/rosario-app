// Teks doa Rosario dalam Bahasa Indonesia.
// Susunan mengikuti tata doa Rosario yang lazim dipakai di Gereja Katolik Indonesia.

export const PRAYERS = {
  "tanda-salib": {
    id: "tanda-salib",
    title: "Tanda Salib",
    text: "Dalam nama Bapa, dan Putera, dan Roh Kudus. Amin.",
  },
  "aku-percaya": {
    id: "aku-percaya",
    title: "Aku Percaya",
    text:
      "Aku percaya akan Allah, Bapa yang Mahakuasa, pencipta langit dan bumi. " +
      "Dan akan Yesus Kristus, Putera-Nya yang tunggal, Tuhan kita, " +
      "yang dikandung dari Roh Kudus, dilahirkan oleh Perawan Maria, " +
      "yang menderita sengsara dalam pemerintahan Pontius Pilatus, " +
      "disalibkan, wafat, dan dimakamkan; yang turun ke tempat penantian, " +
      "pada hari ketiga bangkit dari antara orang mati; yang naik ke surga, " +
      "duduk di sebelah kanan Allah Bapa yang Mahakuasa; dari situ Ia akan datang " +
      "mengadili orang yang hidup dan yang mati. Aku percaya akan Roh Kudus, " +
      "Gereja Katolik yang kudus, persekutuan para kudus, pengampunan dosa, " +
      "kebangkitan badan, kehidupan kekal. Amin.",
  },
  "bapa-kami": {
    id: "bapa-kami",
    title: "Bapa Kami",
    // P: kalimat pembuka oleh pemimpin
    leaderText: "Bapa kami yang ada di surga,",
    // P+U: sambungan bersama sampai Amin
    responseText:
      "dimuliakanlah nama-Mu, datanglah kerajaan-Mu, " +
      "jadilah kehendak-Mu di atas bumi seperti di dalam surga. " +
      "Berilah kami rezeki pada hari ini, dan ampunilah kesalahan kami, " +
      "seperti kami pun mengampuni yang bersalah kepada kami. " +
      "Dan janganlah masukkan kami ke dalam pencobaan, " +
      "tetapi bebaskanlah kami dari yang jahat. Amin.",
    text:
      "Bapa kami yang ada di surga, dimuliakanlah nama-Mu, datanglah kerajaan-Mu, " +
      "jadilah kehendak-Mu di atas bumi seperti di dalam surga. " +
      "Berilah kami rezeki pada hari ini, dan ampunilah kesalahan kami, " +
      "seperti kami pun mengampuni yang bersalah kepada kami. " +
      "Dan janganlah masukkan kami ke dalam pencobaan, tetapi bebaskanlah kami dari yang jahat. Amin.",
  },
  "salam-maria": {
    id: "salam-maria",
    title: "Salam Maria",
    // P: bagian pemimpin
    leaderText:
      "Salam Maria, penuh rahmat, Tuhan sertamu; " +
      "terpujilah engkau di antara wanita, " +
      "dan terpujilah buah tubuhmu, Yesus.",
    // P+U: sambungan umat
    responseText:
      "Santa Maria, Bunda Allah, doakanlah kami yang berdosa ini, " +
      "sekarang dan waktu kami mati. Amin.",
    text:
      "Salam Maria, penuh rahmat, Tuhan sertamu; terpujilah engkau di antara wanita, " +
      "dan terpujilah buah tubuhmu, Yesus. Santa Maria, Bunda Allah, " +
      "doakanlah kami yang berdosa ini, sekarang dan waktu kami mati. Amin.",
  },
  "kemuliaan": {
    id: "kemuliaan",
    title: "Kemuliaan",
    text:
      "Kemuliaan kepada Bapa, dan Putera, dan Roh Kudus. " +
      "Seperti pada permulaan, sekarang, selalu, dan sepanjang segala abad. Amin.",
  },
  "terpujilah": {
    id: "terpujilah",
    title: "Terpujilah",
    text: "Terpujilah nama Yesus, Maria, dan Santo Yosef. Sekarang dan selama-lamanya. Amin.",
  },
  "doa-fatima": {
    id: "doa-fatima",
    title: "Doa Fatima",
    text:
      "Ya Yesus yang baik, ampunilah dosa-dosa kami. Selamatkanlah kami dari api neraka " +
      "dan hantarkanlah jiwa-jiwa ke dalam Surga, terutama mereka yang sangat " +
      "membutuhkan kerahiman-Mu. Amin.",
  },
  // Tiga Salam Maria pembukaan — disertai intro yang berbeda.
  "salam-putri": {
    id: "salam-putri",
    title: "Salam, Putri Allah Bapa",
    intro: "Salam, Putri Allah Bapa.",
    leaderText:
      "Salam Maria, penuh rahmat, Tuhan sertamu; " +
      "terpujilah engkau di antara wanita, " +
      "dan terpujilah buah tubuhmu, Yesus.",
    responseText:
      "Santa Maria, Bunda Allah, doakanlah kami yang berdosa ini, " +
      "sekarang dan waktu kami mati. Amin.",
    text:
      "Salam Maria, penuh rahmat, Tuhan sertamu; terpujilah engkau di antara wanita, " +
      "dan terpujilah buah tubuhmu, Yesus. Santa Maria, Bunda Allah, " +
      "doakanlah kami yang berdosa ini, sekarang dan waktu kami mati. Amin.",
  },
  "salam-bunda": {
    id: "salam-bunda",
    title: "Salam, Bunda Allah Putra",
    intro: "Salam, Bunda Allah Putra.",
    leaderText:
      "Salam Maria, penuh rahmat, Tuhan sertamu; " +
      "terpujilah engkau di antara wanita, " +
      "dan terpujilah buah tubuhmu, Yesus.",
    responseText:
      "Santa Maria, Bunda Allah, doakanlah kami yang berdosa ini, " +
      "sekarang dan waktu kami mati. Amin.",
    text:
      "Salam Maria, penuh rahmat, Tuhan sertamu; terpujilah engkau di antara wanita, " +
      "dan terpujilah buah tubuhmu, Yesus. Santa Maria, Bunda Allah, " +
      "doakanlah kami yang berdosa ini, sekarang dan waktu kami mati. Amin.",
  },
  "salam-mempelai": {
    id: "salam-mempelai",
    title: "Salam, Mempelai Allah Roh Kudus",
    intro: "Salam, Mempelai Allah Roh Kudus.",
    leaderText:
      "Salam Maria, penuh rahmat, Tuhan sertamu; " +
      "terpujilah engkau di antara wanita, " +
      "dan terpujilah buah tubuhmu, Yesus.",
    responseText:
      "Santa Maria, Bunda Allah, doakanlah kami yang berdosa ini, " +
      "sekarang dan waktu kami mati. Amin.",
    text:
      "Salam Maria, penuh rahmat, Tuhan sertamu; terpujilah engkau di antara wanita, " +
      "dan terpujilah buah tubuhmu, Yesus. Santa Maria, Bunda Allah, " +
      "doakanlah kami yang berdosa ini, sekarang dan waktu kami mati. Amin.",
  },
  "salam-ya-ratu": {
    id: "salam-ya-ratu",
    title: "Salam, Ya Ratu",
    leaderText:
      "Salam, Ya Ratu, Bunda yang berbelas kasih, hidup, hiburan dan harapan kami. " +
      "Kami semua memanjatkan permohonan, kami amat susah, mengeluh, mengesah dalam lembah duka ini. " +
      "Ya Ibunda, ya pelindung kami, limpahkanlah kasih sayangMu yang besar kepada kami. " +
      "Dan Yesus, Putera-Mu yang terpuji itu, semoga Kau tunjukkan kepada kami. " +
      "O Ratu, O ibu, O Maria, Bunda Kristus.",
    responseText:
      "Doakanlah kami, ya Santa Bunda Allah. " +
      "Supaya kami dapat menikmati Janji Kristus.",
    text:
      "Salam, Ya Ratu, Bunda yang berbelas kasih, hidup, hiburan dan harapan kami. " +
      "Kami semua memanjatkan permohonan, kami amat susah, mengeluh, mengesah dalam lembah duka ini. " +
      "Ya Ibunda, ya pelindung kami, limpahkanlah kasih sayangMu yang besar kepada kami. " +
      "Dan Yesus, Putera-Mu yang terpuji itu, semoga Kau tunjukkan kepada kami. " +
      "O Ratu, O ibu, O Maria, Bunda Kristus. " +
      "Doakanlah kami, ya Santa Bunda Allah. Supaya kami dapat menikmati Janji Kristus.",
  },
  "marilah-berdoa": {
    id: "marilah-berdoa",
    title: "Doa Penutup",
    leaderText: "Marilah Berdoa:",
    responseText:
      "\u201cYa Allah, Putera-Mu telah memperoleh bagi kami ganjaran kehidupan kekal " +
      "melalui hidup, wafat dan kebangkitan-Nya. Kami mohon, agar dengan merenungkan " +
      "misteri Rosario Suci Santa Perawan Maria, kami dapat menghayati maknanya dan " +
      "memperoleh apa yang dijanjikan. Demi Kristus, Tuhan kami. Amin.\u201d",
    text:
      "Marilah Berdoa: Ya Allah, Putera-Mu telah memperoleh bagi kami ganjaran kehidupan kekal " +
      "melalui hidup, wafat dan kebangkitan-Nya. Kami mohon, agar dengan merenungkan " +
      "misteri Rosario Suci Santa Perawan Maria, kami dapat menghayati maknanya dan " +
      "memperoleh apa yang dijanjikan. Demi Kristus, Tuhan kami. Amin.",
  },
  "doa-penutup": {
    id: "doa-penutup",
    title: "Doa Penutup Rosario",
    text:
      "Salam, Ya Ratu, Bunda yang berbelas kasih, hidup, hiburan dan harapan kami. " +
      "Kami semua memanjatkan permohonan, kami amat susah, mengeluh, mengesah dalam lembah duka ini. " +
      "Ya Ibunda, ya pelindung kami, limpahkanlah kasih sayangMu yang besar kepada kami. " +
      "Dan Yesus, Putera-Mu yang terpuji itu, semoga Kau tunjukkan kepada kami. " +
      "O Ratu, O ibu, O Maria, Bunda Kristus.\n\n" +
      "Doakanlah kami, ya Santa Bunda Allah. Supaya kami dapat menikmati Janji Kristus.\n\n" +
      "Marilah Berdoa: “Ya Allah, Putera-Mu telah memperoleh bagi kami ganjaran kehidupan kekal " +
      "melalui hidup, wafat dan kebangkitan-Nya. Kami mohon, agar dengan merenungkan misteri Rosario Suci " +
      "Santa Perawan Maria, kami dapat menghayati maknanya dan memperoleh apa yang dijanjikan. " +
      "Demi Kristus, Tuhan kami. Amin.”",
  },
};
