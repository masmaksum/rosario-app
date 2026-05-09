// Mysteria Rosarii — Lingua Latina.
// Fons: decade.txt (MYSTERIES_LA exemplum).
// Orthographia: Iesus / Iesu / Iesum, sine accentibus.

export const MYSTERIES_LA = [
  {
    id: "joyful",
    name: "Mysteria Gaudiosa",
    shortName: "Gaudiosa",
    color: "joyful",
    recommendedDays: ["monday", "saturday"],
    events: [
      { order: 1, title: "Annuntiatio Beatae Mariae Virginis",                   fullTitle: "Primum Mysterium Gaudiosum: Annuntiatio Beatae Mariae Virginis" },
      { order: 2, title: "Visitatio Beatae Mariae Virginis",                     fullTitle: "Secundum Mysterium Gaudiosum: Visitatio Beatae Mariae Virginis" },
      { order: 3, title: "Nativitas Domini Nostri Iesu Christi",                 fullTitle: "Tertium Mysterium Gaudiosum: Nativitas Domini Nostri Iesu Christi" },
      { order: 4, title: "Praesentatio Domini Nostri Iesu Christi in Templo",    fullTitle: "Quartum Mysterium Gaudiosum: Praesentatio Domini Nostri Iesu Christi in Templo" },
      { order: 5, title: "Inventio Domini Nostri Iesu Christi in Templo",        fullTitle: "Quintum Mysterium Gaudiosum: Inventio Domini Nostri Iesu Christi in Templo" },
    ],
  },
  {
    id: "sorrowful",
    name: "Mysteria Dolorosa",
    shortName: "Dolorosa",
    color: "sorrowful",
    recommendedDays: ["tuesday", "friday"],
    events: [
      { order: 1, title: "Agonia Domini Nostri Iesu Christi in Horto",               fullTitle: "Primum Mysterium Dolorosum: Agonia Domini Nostri Iesu Christi in Horto" },
      { order: 2, title: "Flagellatio Domini Nostri Iesu Christi",                   fullTitle: "Secundum Mysterium Dolorosum: Flagellatio Domini Nostri Iesu Christi" },
      { order: 3, title: "Coronatio Spinis",                                         fullTitle: "Tertium Mysterium Dolorosum: Coronatio Spinis" },
      { order: 4, title: "Baiulatio Crucis",                                         fullTitle: "Quartum Mysterium Dolorosum: Baiulatio Crucis" },
      { order: 5, title: "Crucifixio et Mors Domini Nostri Iesu Christi",            fullTitle: "Quintum Mysterium Dolorosum: Crucifixio et Mors Domini Nostri Iesu Christi" },
    ],
  },
  {
    id: "glorious",
    name: "Mysteria Gloriosa",
    shortName: "Gloriosa",
    color: "glorious",
    recommendedDays: ["wednesday", "sunday"],
    events: [
      { order: 1, title: "Resurrectio Domini Nostri Iesu Christi",                fullTitle: "Primum Mysterium Gloriosum: Resurrectio Domini Nostri Iesu Christi" },
      { order: 2, title: "Ascensio Domini Nostri Iesu Christi in Caelum",         fullTitle: "Secundum Mysterium Gloriosum: Ascensio Domini Nostri Iesu Christi in Caelum" },
      { order: 3, title: "Descensus Spiritus Sancti",                             fullTitle: "Tertium Mysterium Gloriosum: Descensus Spiritus Sancti" },
      { order: 4, title: "Assumptio Beatae Mariae Virginis in Caelum",            fullTitle: "Quartum Mysterium Gloriosum: Assumptio Beatae Mariae Virginis in Caelum" },
      { order: 5, title: "Coronatio Beatae Mariae Virginis in Caelo",             fullTitle: "Quintum Mysterium Gloriosum: Coronatio Beatae Mariae Virginis in Caelo" },
    ],
  },
  {
    id: "luminous",
    name: "Mysteria Luminosa",
    shortName: "Luminosa",
    color: "luminous",
    recommendedDays: ["thursday"],
    events: [
      { order: 1, title: "Baptisma Domini Nostri Iesu Christi in Iordane",                         fullTitle: "Primum Mysterium Luminosum: Baptisma Domini Nostri Iesu Christi in Iordane" },
      { order: 2, title: "Autorevelatio Domini Nostri Iesu Christi apud Nuptias Canenses",         fullTitle: "Secundum Mysterium Luminosum: Autorevelatio Domini Nostri Iesu Christi apud Nuptias Canenses" },
      { order: 3, title: "Proclamatio Regni Dei et Invitatio ad Conversionem",                     fullTitle: "Tertium Mysterium Luminosum: Proclamatio Regni Dei et Invitatio ad Conversionem" },
      { order: 4, title: "Transfiguratio Domini Nostri Iesu Christi",                              fullTitle: "Quartum Mysterium Luminosum: Transfiguratio Domini Nostri Iesu Christi" },
      { order: 5, title: "Institutio Eucharistiae",                                                fullTitle: "Quintum Mysterium Luminosum: Institutio Eucharistiae" },
    ],
  },
];
