const opts = [
  { label: "Noun", value: "noun" },
  { label: "Pronoun", value: "pronoun" },
  { label: "Verb", value: "verb" },
  { label: "Adverb", value: "adverb" },
  { label: "Adjective", value: "adjective" },
  { label: "Preposition", value: "preposition" },
  { label: "Conjunction", value: "conjunction" },
  { label: "Interjection", value: "interjection" },
  { label: "Article", value: "article" },
  { label: "Determiner", value: "determiner" },
  { label: "Auxiliary Verb", value: "auxiliary-verb" },
  { label: "Modal Verb", value: "modal-verb" },
  { label: "Gerund", value: "gerund" },
  { label: "Participle", value: "participle" },
  { label: "Infinitive", value: "infinitive" },
  { label: "Phrase", value: "phrase" },
  { label: "Idiom", value: "idiom" },
  { label: "Abbreviation", value: "abbreviation" },
  { label: "Prefix", value: "prefix" },
  { label: "Suffix", value: "suffix" },
];

const translateLang = [
  {
    label: "Afrikaans",
    value: "af-ZA",
  },
  {
    label: "Albanian",
    value: "sq-AL",
  },
  {
    label: "Amharic",
    value: "am-ET",
  },
  {
    label: "Arabic",
    value: "ar-SA",
  },
  {
    label: "Armenian",
    value: "hy-AM",
  },
  {
    label: "Azerbaijani",
    value: "az-AZ",
  },
  {
    label: "Bajan",
    value: "bjs-BB",
  },
  {
    label: "Balkan Gipsy",
    value: "rm-RO",
  },
  {
    label: "Basque",
    value: "eu-ES",
  },
  {
    label: "Bemba",
    value: "bem-ZM",
  },
  {
    label: "Bengali",
    value: "bn-IN",
  },
  {
    label: "Bielarus",
    value: "be-BY",
  },
  {
    label: "Bislama",
    value: "bi-VU",
  },
  {
    label: "Bosnian",
    value: "bs-BA",
  },
  {
    label: "Breton",
    value: "br-FR",
  },
  {
    label: "Bulgarian",
    value: "bg-BG",
  },
  {
    label: "Burmese",
    value: "my-MM",
  },
  {
    label: "Catalan",
    value: "ca-ES",
  },
  {
    label: "Cebuano",
    value: "ceb-PH",
  },
  {
    label: "Chamorro",
    value: "ch-GU",
  },
  {
    label: "Chinese (Simplified)",
    value: "zh-CN",
  },
  {
    label: "Chinese Traditional",
    value: "zh-TW",
  },
  {
    label: "Comorian (Ngazidja)",
    value: "zdj-KM",
  },
  {
    label: "Coptic",
    value: "cop-EG",
  },
  {
    label: "Creole English (Antigua and Barbuda)",
    value: "aig-AG",
  },
  {
    label: "Creole English (Bahamas)",
    value: "bah-BS",
  },
  {
    label: "Creole English (Grenadian)",
    value: "gcl-GD",
  },
  {
    label: "Creole English (Guyanese)",
    value: "gyn-GY",
  },
  {
    label: "Creole English (Jamaican)",
    value: "jam-JM",
  },
  {
    label: "Creole English (Vincentian)",
    value: "svc-VC",
  },
  {
    label: "Creole English (Virgin Islands)",
    value: "vic-US",
  },
  {
    label: "Creole French (Haitian)",
    value: "ht-HT",
  },
  {
    label: "Creole French (Saint Lucian)",
    value: "acf-LC",
  },
  {
    label: "Creole French (Seselwa)",
    value: "crs-SC",
  },
  {
    label: "Creole Portuguese (Upper Guinea)",
    value: "pov-GW",
  },
  {
    label: "Croatian",
    value: "hr-HR",
  },
  {
    label: "Czech",
    value: "cs-CZ",
  },
  {
    label: "Danish",
    value: "da-DK",
  },
  {
    label: "Dutch",
    value: "nl-NL",
  },
  {
    label: "Dzongkha",
    value: "dz-BT",
  },
  {
    label: "English",
    value: "en-GB",
  },
  {
    label: "Esperanto",
    value: "eo-EU",
  },
  {
    label: "Estonian",
    value: "et-EE",
  },
  {
    label: "Fanagalo",
    value: "fn-FNG",
  },
  {
    label: "Faroese",
    value: "fo-FO",
  },
  {
    label: "Finnish",
    value: "fi-FI",
  },
  {
    label: "French",
    value: "fr-FR",
  },
  {
    label: "Galician",
    value: "gl-ES",
  },
  {
    label: "Georgian",
    value: "ka-GE",
  },
  {
    label: "German",
    value: "de-DE",
  },
  {
    label: "Greek",
    value: "el-GR",
  },
  {
    label: "Greek (Classical)",
    value: "grc-GR",
  },
  {
    label: "Gujarati",
    value: "gu-IN",
  },
  {
    label: "Hausa",
    value: "ha-NE",
  },
  {
    label: "Hawaiian",
    value: "haw-US",
  },
  {
    label: "Hebrew",
    value: "he-IL",
  },
  {
    label: "Hindi",
    value: "hi-IN",
  },
  {
    label: "Hungarian",
    value: "hu-HU",
  },
  {
    label: "Icelandic",
    value: "is-IS",
  },
  {
    label: "Indonesian",
    value: "id-ID",
  },
  {
    label: "Inuktitut (Greenlandic)",
    value: "kl-GL",
  },
  {
    label: "Irish Gaelic",
    value: "ga-IE",
  },
  {
    label: "Italian",
    value: "it-IT",
  },
  {
    label: "Japanese",
    value: "ja-JP",
  },
  {
    label: "Javanese",
    value: "jv-ID",
  },
  {
    label: "Kabuverdianu",
    value: "kea-CV",
  },
  {
    label: "Kabylian",
    value: "kab-DZ",
  },
  {
    label: "Kannada",
    value: "kn-IN",
  },
  {
    label: "Kazakh",
    value: "kk-KZ",
  },
  {
    label: "Khmer",
    value: "km-KM",
  },
  {
    label: "Kinyarwanda",
    value: "rw-RW",
  },
  {
    label: "Kirundi",
    value: "rn-BI",
  },
  {
    label: "Korean",
    value: "ko-KR",
  },
  {
    label: "Kurdish",
    value: "ku-TR",
  },
  {
    label: "Kurdish Sorani",
    value: "ckb-IQ",
  },
  {
    label: "Kyrgyz",
    value: "ky-KG",
  },
  {
    label: "Lao",
    value: "lo-LA",
  },
  {
    label: "Latin",
    value: "la-VA",
  },
  {
    label: "Latvian",
    value: "lv-LV",
  },
  {
    label: "Lithuanian",
    value: "lt-LT",
  },
  {
    label: "Luxembourgish",
    value: "lb-LU",
  },
  {
    label: "Macedonian",
    value: "mk-MK",
  },
  {
    label: "Malagasy",
    value: "mg-MG",
  },
  {
    label: "Malay",
    value: "ms-MY",
  },
  {
    label: "Maldivian",
    value: "dv-MV",
  },
  {
    label: "Maltese",
    value: "mt-MT",
  },
  {
    label: "Manx Gaelic",
    value: "gv-IM",
  },
  {
    label: "Maori",
    value: "mi-NZ",
  },
  {
    label: "Marshallese",
    value: "mh-MH",
  },
  {
    label: "Mende",
    value: "men-SL",
  },
  {
    label: "Mongolian",
    value: "mn-MN",
  },
  {
    label: "Morisyen",
    value: "mfe-MU",
  },
  {
    label: "Nepali",
    value: "ne-NP",
  },
  {
    label: "Niuean",
    value: "niu-NU",
  },
  {
    label: "Norwegian",
    value: "no-NO",
  },
  {
    label: "Nyanja",
    value: "ny-MW",
  },
  {
    label: "Pakistani",
    value: "ur-PK",
  },
  {
    label: "Palauan",
    value: "pau-PW",
  },
  {
    label: "Panjabi",
    value: "pa-IN",
  },
  {
    label: "Papiamentu",
    value: "pap-CW",
  },
  {
    label: "Pashto",
    value: "ps-PK",
  },
  {
    label: "Persian",
    value: "fa-IR",
  },
  {
    label: "Pijin",
    value: "pis-SB",
  },
  {
    label: "Polish",
    value: "pl-PL",
  },
  {
    label: "Portuguese",
    value: "pt-PT",
  },
  {
    label: "Potawatomi",
    value: "pot-US",
  },
  {
    label: "Quechua",
    value: "qu-PE",
  },
  {
    label: "Romanian",
    value: "ro-RO",
  },
  {
    label: "Russian",
    value: "ru-RU",
  },
  {
    label: "Samoan",
    value: "sm-WS",
  },
  {
    label: "Sango",
    value: "sg-CF",
  },
  {
    label: "Scots Gaelic",
    value: "gd-GB",
  },
  {
    label: "Serbian",
    value: "sr-RS",
  },
  {
    label: "Shona",
    value: "sn-ZW",
  },
  {
    label: "Sinhala",
    value: "si-LK",
  },
  {
    label: "Slovak",
    value: "sk-SK",
  },
  {
    label: "Slovenian",
    value: "sl-SI",
  },
  {
    label: "Somali",
    value: "so-SO",
  },
  {
    label: "Sotho, Southern",
    value: "st-ST",
  },
  {
    label: "Spanish",
    value: "es-ES",
  },
  {
    label: "Sranan Tongo",
    value: "srn-SR",
  },
  {
    label: "Swahili",
    value: "sw-SZ",
  },
  {
    label: "Swedish",
    value: "sv-SE",
  },
  {
    label: "Swiss German",
    value: "de-CH",
  },
  {
    label: "Syriac (Aramaic)",
    value: "syc-TR",
  },
  {
    label: "Tagalog",
    value: "tl-PH",
  },
  {
    label: "Tajik",
    value: "tg-TJ",
  },
  {
    label: "Tamashek (Tuareg)",
    value: "tmh-DZ",
  },
  {
    label: "Tamil",
    value: "ta-LK",
  },
  {
    label: "Telugu",
    value: "te-IN",
  },
  {
    label: "Tetum",
    value: "tet-TL",
  },
  {
    label: "Thai",
    value: "th-TH",
  },
  {
    label: "Tibetan",
    value: "bo-CN",
  },
  {
    label: "Tigrinya",
    value: "ti-TI",
  },
  {
    label: "Tok Pisin",
    value: "tpi-PG",
  },
  {
    label: "Tokelauan",
    value: "tkl-TK",
  },
  {
    label: "Tongan",
    value: "to-TO",
  },
  {
    label: "Tswana",
    value: "tn-BW",
  },
  {
    label: "Turkish",
    value: "tr-TR",
  },
  {
    label: "Turkmen",
    value: "tk-TM",
  },
  {
    label: "Tuvaluan",
    value: "tvl-TV",
  },
  {
    label: "Ukrainian",
    value: "uk-UA",
  },
  {
    label: "Uma",
    value: "ppk-ID",
  },
  {
    label: "Uzbek",
    value: "uz-UZ",
  },
  {
    label: "Vietnamese",
    value: "vi-VN",
  },
  {
    label: "Wallisian",
    value: "wls-WF",
  },
  {
    label: "Welsh",
    value: "cy-GB",
  },
  {
    label: "Wolof",
    value: "wo-SN",
  },
  {
    label: "Xhosa",
    value: "xh-ZA",
  },
  {
    label: "Yiddish",
    value: "yi-YD",
  },
  {
    label: "Zulu",
    value: "zu-ZA",
  },
];

export { opts, translateLang };

