import th from "./langs/th";
import en from "./langs/en";
import { goalSettings } from "../shared/langs/goalSettings";

const forrceDefaultLang = "th";

const ta_lang = {
  en,
  th
};

//file options = ['goal']
const trans = (key, lang, file = "language") => {
  if (typeof lang == "undefined") lang = forrceDefaultLang;

  lang = lang.toLowerCase();
  if (lang != "en" && lang != "th") lang = "en";

  if (file == "language" || typeof file == undefined || typeof file == null) {
    if (typeof ta_lang[lang][key] != "undefined") return ta_lang[lang][key];
    else return "[" + key + "]";
  } else {
    file = file.toLowerCase();
    if (file == "goal") {
      if( key == null || key == undefined || key == '') return ;
      if (typeof goalSettings[key][lang] != undefined)
        return goalSettings[key][lang]['name'];
      else return "[goal." + key + "]";
    }
  }
};

export default trans;
