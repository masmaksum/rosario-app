// Empat kelompok Peristiwa Rosario dalam Bahasa Indonesia.
// Setiap peristiwa memiliki:
//   - leaderText (P):  teks yang dibacakan oleh Pemimpin (biasanya kutipan Kitab Suci + referensi).
//   - responseText (P+U):  doa tanggapan yang diucapkan Pemimpin bersama Umat.

export const MYSTERIES = [
  {
    id: "gembira",
    name: "Peristiwa Gembira",
    short: "Joyful Mysteries",
    description:
      "Merenungkan sukacita Inkarnasi: kabar gembira hingga Yesus ditemukan di Bait Allah.",
    color: "joyful",
    recommendedDays: ["Senin", "Sabtu"],
    events: [
      {
        order: 1,
        title: "Maria menerima kabar gembira dari Malaikat Gabriel",
        scripture: "Lukas 1:26-38",
        leaderText:
          "Salam, hai engkau yang dikaruniai, Tuhan menyertai engkau. Jangan takut, hai Maria, sebab engkau beroleh kasih karunia di hadapan Allah. Sesungguhnya engkau akan mengandung dan akan melahirkan seorang anak laki-laki dan hendaklah engkau menamai Dia Yesus.",
        responseText:
          "Bapa, jika Engkau bersabda maka semuanya terjadi. Bersabdalah ya Bapa, aku ini adalah hamba-Mu. Terjadilah padaku menurut kehendak-Mu.",
      },
      {
        order: 2,
        title: "Maria mengunjungi Elisabeth",
        scripture: "Lukas 1:42-43",
        leaderText:
          "Diberkatilah engkau di antara semua perempuan dan diberkatilah buah rahimmu. Siapakah aku ini sampai ibu Tuhanku datang mengunjungi aku?",
        responseText:
          "Bapa, hatiku memuliakan Dikau dan jiwaku bersorak-sorai, karena Engkau Allah penuh kasih. Engkau menciptakan dan memelihara kami, anak-anak-Mu.",
      },
      {
        order: 3,
        title: "Yesus dilahirkan di Betlehem",
        scripture: "Lukas 2:7",
        leaderText:
          "Maria melahirkan seorang anak laki-laki... Lalu dibungkusnya dengan kain lampin dan dibaringkannya di dalam palungan, karena tidak ada tempat bagi mereka di rumah penginapan.",
        responseText:
          "Bapa, kami bersyukur karena Engkau telah merelakan Putra-Mu menjadi manusia demi menebus dan mengampuni dosa-dosa kami. Jadikanlah kami layak menjadi anak-anak-Mu.",
      },
      {
        order: 4,
        title: "Yesus dipersembahkan dalam Bait Allah",
        scripture: "Lukas 2:34-35",
        leaderText:
          "Simeon berkata kepada Maria: “Sesungguhnya Anak ini ditentukan untuk menjatuhkan atau membangkitkan banyak orang di Israel dan untuk menjadi suatu tanda yang menimbulkan perbantahan. Kelak suatu pedang akan menembus jiwamu sendiri.”",
        responseText:
          "Bapa, kami mempersembahkan segenap diri kami kepada-Mu. Terimalah kami sebagai persembahan yang layak, demi jasa Putera-Mu, Juruselamat kami.",
      },
      {
        order: 5,
        title: "Yesus ditemukan dalam Bait Allah",
        scripture: "Lukas 2:49-50",
        leaderText:
          "“Mengapa kamu mencari Aku? Tidakkah kamu tahu, bahwa Aku harus berada di dalam rumah Bapa-Ku?” Tetapi mereka tidak mengerti apa yang dikatakan-Nya kepada mereka.",
        responseText:
          "Bapa, Putra-Mu sepenuhnya hidup demi kemuliaan-Mu dan keselamatan kami. Bentuklah kami menjadi serupa dengan Putra-Mu.",
      },
    ],
  },
  {
    id: "sedih",
    name: "Peristiwa Sedih",
    short: "Sorrowful Mysteries",
    description:
      "Merenungkan sengsara Tuhan: dari Taman Getsemani hingga wafat-Nya di salib.",
    color: "sorrowful",
    recommendedDays: ["Selasa", "Jumat"],
    events: [
      {
        order: 1,
        title: "Yesus berdoa kepada Bapa-Nya dalam sakratul maut",
        scripture: "Matius 26:39",
        leaderText:
          "“Ya Bapa-Ku, jikalau Engkau berkenan, ambillah cawan ini dari hadapan-Ku, tetapi janganlah menurut kehendak-Ku, melainkan kehendak-Mu yang terjadi.”",
        responseText:
          "Bapa, ajarilah kami selalu mengikuti kehendak-Mu pada saat kami dicobai. Engkau pasti menyertai kami sebagai Bapa, karena Engkau sangat menyayangi kami.",
      },
      {
        order: 2,
        title: "Yesus didera",
        scripture: "Markus 15:19-20",
        leaderText:
          "Mereka memukul kepala-Nya dengan buluh, dan meludahi-Nya dan berlutut menyembah-Nya. Sesudah mengolok-olokkan Dia, mereka menanggalkan jubah ungu yang dipakai-Nya dan mengenakan lagi pakaian-Nya.",
        responseText:
          "Bapa, berilah kami rahmat untuk selalu mengingat sengsara-Mu, agar kami dapat berdiri teguh dan memikul salib dengan kasih.",
      },
      {
        order: 3,
        title: "Yesus dimahkotai duri",
        scripture: "Markus 15:17-18",
        leaderText:
          "Mereka menganyam sebuah mahkota duri dan menaruh di atas kepala-Nya. Kemudian mereka mulai memberi hormat kepada-Nya, katanya: “Salam, hai raja orang Yahudi!”",
        responseText:
          "Bapa, Putra-Mu dimahkotai duri, tetapi Ia tidak pernah membenci algojonya. Ajarilah kami mengampuni dan memberkati sesama kami.",
      },
      {
        order: 4,
        title: "Yesus memanggul salib-Nya ke Gunung Kalvari",
        scripture: "Yohanes 19:16b",
        leaderText:
          "Sambil memikul salib-Nya, Ia pergi keluar ke tempat yang bernama tempat tengkorak, yang dalam bahasa Ibrani disebut Golgota.",
        responseText:
          "Bapa, ajarilah kami memikul salib kehidupan ini tanpa mengeluh dan dengan penuh iman, supaya kami sungguh serupa dengan Yesus, Putra-Mu sendiri.",
      },
      {
        order: 5,
        title: "Yesus wafat di salib",
        scripture: "Lukas 23:46",
        leaderText:
          "Yesus berseru dengan suara nyaring: “Ya Bapa, ke dalam tangan-Mu Kuserahkan nyawa-Ku.” Sesudah berkata demikian Ia menyerahkan nyawa-Nya.",
        responseText:
          "Bapa, hadirlah dekat kami bersama Putra dan Roh-Mu pada saat kami menghadapi kematian, dan terimalah kami dalam kerajaan kasih-Mu yang kekal.",
      },
    ],
  },
  {
    id: "mulia",
    name: "Peristiwa Mulia",
    short: "Glorious Mysteries",
    description:
      "Merenungkan kemenangan Kristus: kebangkitan, kenaikan, hingga pemahkotaan Maria.",
    color: "glorious",
    recommendedDays: ["Rabu", "Minggu"],
    events: [
      {
        order: 1,
        title: "Yesus bangkit dari antara orang mati",
        scripture: "Matius 28:5-6",
        leaderText:
          "Malaikat itu berkata: “Janganlah kamu takut, sebab aku tahu kamu mencari Yesus yang disalibkan itu. Ia tidak di sini, sebab Ia telah bangkit, sama seperti yang telah dikatakan-Nya.”",
        responseText:
          "Bapa, mampukanlah kami melanjutkan misi Putra-Mu yaitu memberitakan Injil kepada semua orang agar kerajaan-Mu menjadi nyata di bumi ini.",
      },
      {
        order: 2,
        title: "Yesus naik ke surga",
        scripture: "Kisah Para Rasul 1:9-11",
        leaderText:
          "Sesudah Ia mengatakan demikian, Ia diangkat ke surga disaksikan oleh mereka, dan awan menutup-Nya dari pandangan mereka. “Hai orang Galilea, mengapa kamu berdiri melihat ke langit? Yesus ini yang diangkat ke surga meninggalkan kamu, akan kembali dengan cara yang sama seperti kamu melihat Dia naik ke surga.”",
        responseText:
          "Bapa, Engkau tumpuan hidup dan harapan kami. Tanamkanlah dalam diri kami keyakinan bahwa Engkau menyertai kami selalu hingga akhir zaman.",
      },
      {
        order: 3,
        title: "Roh Kudus turun atas para Rasul",
        scripture: "Kisah Para Rasul 2:2,4",
        leaderText:
          "Tiba-tiba terdengarlah bunyi dari langit seperti tiupan angin keras yang memenuhi seluruh rumah di mana mereka duduk... Lalu mereka semua dipenuhi Roh Kudus dan mulai berbicara dalam bahasa lain, seperti yang diberikan oleh Roh itu kepada mereka untuk dikatakan.",
        responseText:
          "Bapa, semoga Roh Kudus-Mu membimbing hidup kami dalam kasih dan kebenaran-Mu, serta menjadikan kami layak di hadapan-Mu.",
      },
      {
        order: 4,
        title: "Maria diangkat ke surga",
        scripture: "1 Tesalonika 4:14,17",
        leaderText:
          "Jikalau kita percaya bahwa Yesus telah mati dan telah bangkit, maka kita percaya juga bahwa dengan perantaraan Yesus, Allah akan mengumpulkan bersama-sama dengan Dia mereka yang telah meninggal. Sesudah itu kita yang hidup, yang masih tinggal, akan diangkat bersama-sama dengan mereka dalam awan menyongsong Tuhan di angkasa. Demikianlah kita akan selama-lamanya bersama-sama dengan Tuhan.",
        responseText:
          "Bapa, berilah kami iman yang hidup, dan jadikanlah kami saksi-Mu di hadapan sesama kami.",
      },
      {
        order: 5,
        title: "Maria dimahkotai di surga",
        scripture: "Wahyu 12:1",
        leaderText:
          "Tampaklah suatu tanda besar di langit, seorang perempuan berselubungkan matahari, dengan bulan di bawah kakinya dan sebuah mahkota dari dua belas bintang di atas kepalanya.",
        responseText:
          "Bapa, satu-satunya sumber kasih sejati, kobarkanlah dalam diri kami semangat kasih-Mu kepada Bunda Putra-Mu, sebab kami memandangnya sebagai teladan pengikut Yesus.",
      },
    ],
  },
  {
    id: "terang",
    name: "Peristiwa Terang",
    short: "Luminous Mysteries",
    description:
      "Merenungkan pewartaan Yesus: dari pembaptisan hingga penetapan Ekaristi.",
    color: "luminous",
    recommendedDays: ["Kamis"],
    events: [
      {
        order: 1,
        title: "Yesus dibaptis di Sungai Yordan",
        scripture: "Matius 3:16-17",
        leaderText:
          "Sesudah dibaptis, Yesus segera keluar dari air dan pada waktu itu juga langit terbuka dan Ia melihat Roh Allah seperti burung merpati turun ke atas-Nya, lalu terdengarlah suara dari surga yang mengatakan: “Inilah Anak-Ku yang terkasih, kepada-Nya Aku berkenan.”",
        responseText:
          "Bapa, kami pun Engkau beri misi sebagai anak-Mu dan pengikut Yesus. Buatlah kami menerima tugas itu dengan hati terbuka dan penuh sukacita.",
      },
      {
        order: 2,
        title: "Yesus menyatakan diri-Nya dalam pesta pernikahan di Kana",
        scripture: "Yohanes 2:11",
        leaderText:
          "Atas permintaan Maria bunda-Nya, Yesus mengatasi kekurangan anggur. Hal itu dilakukan Yesus sebagai yang pertama dari tanda-tanda-Nya dan dengan itu Ia telah menyatakan kemuliaan-Nya dan murid-murid-Nya percaya kepada-Nya.",
        responseText:
          "Bapa, tolonglah kami mampu menghadapi setiap masalah hidup ini dengan tenang sambil mengandalkan kasih-Mu kepada kami.",
      },
      {
        order: 3,
        title: "Yesus memberitakan Kerajaan Allah dan menyerukan pertobatan",
        scripture: "Matius 4:17,23",
        leaderText:
          "“Bertobatlah, sebab Kerajaan Surga sudah dekat!” Yesus pun berkeliling di seluruh Galilea, Ia mengajar dalam rumah-rumah ibadat dan memberitakan Injil Kerajaan Surga serta menyembuhkan orang-orang di antara bangsa itu.",
        responseText:
          "Bapa, pertobatkanlah kami, ampunilah dosa kami. Jadikanlah kami mampu mengampuni orang yang telah menyakiti kami.",
      },
      {
        order: 4,
        title: "Yesus menampakkan kemuliaan-Nya",
        scripture: "Matius 17:2,5",
        leaderText:
          "Yesus berubah rupa di sebuah gunung yang tinggi, wajah-Nya bercahaya seperti matahari. Allah bersabda kepada tiga Rasul Yesus, “Inilah Anak-Ku yang terkasih, kepada-Nyalah Aku berkenan, dengarkanlah Dia.”",
        responseText:
          "Bapa, ajarilah kami mendengarkan Yesus dan sepenuhnya menerima ajaran-Nya. Izinkanlah kami semakin mengenal Dia, terutama dalam sengsara-Nya.",
      },
      {
        order: 5,
        title: "Yesus menetapkan Ekaristi",
        scripture: "Markus 14:22-24",
        leaderText:
          "Yesus mengambil roti, mengucap syukur, memecah-mecahkannya lalu memberikannya kepada mereka dan berkata: “Ambillah, inilah tubuh-Ku.” Sesudah itu Ia mengambil cawan, mengucap syukur lalu memberikannya kepada mereka. Ia berkata: “Inilah darah-Ku yang ditumpahkan bagi banyak orang.”",
        responseText:
          "Bapa, sucikan dan kuduskanlah kami pada saat kami menerima Tubuh dan Darah Putra-Mu yang terkasih. Pakailah kami seturut kehendak-Mu.",
      },
    ],
  },
];

export const DAY_RECOMMENDATION = {
  // 0 = Minggu (Sunday)
  0: "mulia",
  1: "gembira",
  2: "sedih",
  3: "mulia",
  4: "terang",
  5: "sedih",
  6: "gembira",
};

export const DAY_NAMES_ID = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

export function getMysteryById(id) {
  return MYSTERIES.find((m) => m.id === id);
}

export function getRecommendedMysteryId(date = new Date()) {
  return DAY_RECOMMENDATION[date.getDay()];
}
