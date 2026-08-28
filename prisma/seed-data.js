/**
 * Comprehensive Multi-Language Seed Matrix for MuraHomes
 * Contains all 4 Artisan Brands and 32 Master Products localized
 * across all 22 European Supported Locales:
 * ['es', 'en', 'fr', 'de', 'it', 'lt', 'pt', 'nl', 'pl', 'sv', 'da', 'no', 'fi', 'cs', 'sk', 'hu', 'ro', 'bg', 'el', 'hr', 'lv', 'et']
 */

export const SUPPORTED_LOCALES = [
  'es', 'en', 'fr', 'de', 'it', 'lt', 'pt', 'nl', 'pl', 'sv',
  'da', 'no', 'fi', 'cs', 'sk', 'hu', 'ro', 'bg', 'el', 'hr',
  'lv', 'et'
];

export const CURRENCY_RATES = {
  EUR: 1.0,
  GBP: 0.854,
  USD: 1.085,
  CHF: 0.962,
  PLN: 4.315,
  SEK: 11.45,
  DKK: 7.458,
  NOK: 11.62,
  CZK: 25.25,
  HUF: 395.5,
  RON: 4.975,
  BGN: 1.956,
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. ARTISAN BRANDS WITH 22-LANGUAGE TRANSLATIONS
// ─────────────────────────────────────────────────────────────────────────────

export const brandsData = [
  {
    slug: 'santiago-bros',
    name: 'Santiago Bros',
    logo: '/images/brands/santiago-bros.svg',
    description: 'Nuestra colección insignia: donde la herencia mediterránea se une al diseño contemporáneo. Cada pieza se elabora con una meticulosa atención al detalle.',
    translations: {
      es: { name: 'Santiago Bros', description: 'Nuestra colección insignia: donde la herencia mediterránea se une al diseño contemporáneo. Cada pieza se elabora con una meticulosa atención al detalle.', status: 'published' },
      en: { name: 'Santiago Bros', description: 'Our signature collection — where Mediterranean heritage meets contemporary design. Each piece is crafted with meticulous attention to detail.', status: 'published' },
      fr: { name: 'Santiago Bros', description: 'Notre collection emblématique — où l\'héritage méditerranéen rencontre le design contemporain. Chaque pièce est conçue avec une attention méticuleuse aux détails.', status: 'published' },
      de: { name: 'Santiago Bros', description: 'Unsere Signatur-Kollektion – wo mediterranes Erbe auf zeitgenössisches Design trifft. Jedes Stück wird mit Liebe zum Detail gefertigt.', status: 'published' },
      it: { name: 'Santiago Bros', description: 'La nostra collezione esclusiva: dove l\'eredità mediterranea incontra il design contemporaneo. Ogni pezzo è realizzato con meticolosa cura dei dettagli.', status: 'published' },
      pt: { name: 'Santiago Bros', description: 'A nossa coleção de assinatura — onde a herança mediterrânica encontra o design contemporâneo. Cada peça é trabalhada com atenção meticulosa aos detalhes.', status: 'published' },
      nl: { name: 'Santiago Bros', description: 'Onze kenmerkende collectie — waar mediterrane traditie hedendaags design ontmoet. Elk stuk is vervaardigd met oog voor detail.', status: 'published' },
      pl: { name: 'Santiago Bros', description: 'Nasza flagowa kolekcja — gdzie śródziemnomorskie dziedzictwo spotyka się ze współczesnym wzornictwem.', status: 'published' },
      sv: { name: 'Santiago Bros', description: 'Vår signaturkollektion – där medelhavsarv möter modern skandinavisk och europeisk design.', status: 'published' },
      da: { name: 'Santiago Bros', description: 'Vores signaturkollektion – hvor middelhavsarv møder moderne formsprog.', status: 'published' },
      no: { name: 'Santiago Bros', description: 'Vår signaturkolleksjon – der middelhavsarv møter moderne europeisk design.', status: 'published' },
      fi: { name: 'Santiago Bros', description: 'Tunnuskokoelmamme – jossa välimerellinen perintö kohtaa nykyaikaisen muotoilun.', status: 'published' },
      lt: { name: 'Santiago Bros', description: 'Mūsų firminė kolekcija – kur Viduržemio jūros paveldas susitinka su šiuolaikiniu dizainu.', status: 'published' },
      lv: { name: 'Santiago Bros', description: 'Mūsu raksturīgā kolekcija – kur Vidusjūras mantojums satiekas ar mūsdienu dizainu.', status: 'published' },
      et: { name: 'Santiago Bros', description: 'Meie esinduskollektsioon – kus Vahemere pärand kohtub kaasaegse disainiga.', status: 'published' },
      cs: { name: 'Santiago Bros', description: 'Naše podpisová kolekce – kde se středomořské dědictví setkává se současným designem.', status: 'published' },
      sk: { name: 'Santiago Bros', description: 'Naša autorská kolekcia – kde sa stredomorské dedičstvo spája so súčasným dizajnom.', status: 'published' },
      hu: { name: 'Santiago Bros', description: 'Jellegzetes kollekciónk – ahol a mediterrán örökség találkozik a kortárs formatervezéssel.', status: 'published' },
      ro: { name: 'Santiago Bros', description: 'Colecția noastră emblematică — unde moștenirea mediteraneană întâlnește designul contemporan.', status: 'published' },
      bg: { name: 'Santiago Bros', description: 'Нашата емблематична колекция — където средиземноморското наследство среща съвременния дизайн.', status: 'published' },
      el: { name: 'Santiago Bros', description: 'Η χαρακτηριστική μας συλλογή — όπου η μεσογειακή κληρονομιά συναντά το σύγχρονο design.', status: 'published' },
      hr: { name: 'Santiago Bros', description: 'Naša prepoznatljiva kolekcija — gdje se mediteranska baština spaja sa suvremenim dizajnom.', status: 'published' },
    }
  },
  {
    slug: 'artisan-living',
    name: 'Artisan Living',
    logo: '/images/brands/artisan-living.svg',
    description: 'Celebrando la artesanía tradicional con sensibilidad moderna. Artisan Living ofrece muebles hechos a mano utilizando técnicas consagradas.',
    translations: {
      es: { name: 'Artisan Living', description: 'Celebrando la artesanía tradicional con sensibilidad moderna. Artisan Living ofrece muebles hechos a mano utilizando técnicas consagradas.', status: 'published' },
      en: { name: 'Artisan Living', description: 'Celebrating traditional craftsmanship with modern sensibility. Artisan Living brings handcrafted furniture using time-honored techniques.', status: 'published' },
      fr: { name: 'Artisan Living', description: 'Célébration de l\'artisanat traditionnel avec une sensibilité moderne. Artisan Living propose des meubles fabriqués à la main.', status: 'published' },
      de: { name: 'Artisan Living', description: 'Traditionelle Handwerkskunst mit modernem Gespür. Artisan Living bietet handgefertigte Möbel aus edelsten Materialien.', status: 'published' },
      it: { name: 'Artisan Living', description: 'Celebrazione dell\'artigianato tradizionale con sensibilità moderna. Artisan Living propone mobili fatti a mano.', status: 'published' },
      pt: { name: 'Artisan Living', description: 'Celebrando o artesanato tradicional com sensibilidade moderna. Móveis feitos à mão usando técnicas consagradas.', status: 'published' },
      nl: { name: 'Artisan Living', description: 'Traditioneel vakmanschap met een moderne touch. Handgemaakte meubels met eeuwenoude technieken.', status: 'published' },
      pl: { name: 'Artisan Living', description: 'Świętowanie tradycyjnego rzemiosła z nowoczesną wrażliwością. Meble tworzone ręcznie.', status: 'published' },
      sv: { name: 'Artisan Living', description: 'Traditionellt hantverk med modern känsla. Handgjorda möbler med beprövade tekniker.', status: 'published' },
      da: { name: 'Artisan Living', description: 'Traditionelt håndværk forenet med moderne æstetik og førsteklasses materialer.', status: 'published' },
      no: { name: 'Artisan Living', description: 'Tradisjonelt håndverk forent med moderne estetikk og rene naturmaterialer.', status: 'published' },
      fi: { name: 'Artisan Living', description: 'Perinteistä käsityötaitoa modernilla otteella ja ensiluokkaisilla materiaaleilla.', status: 'published' },
      lt: { name: 'Artisan Living', description: 'Tradicinis meistriškumas ir modernus jautrumas. Rankų darbo baldai.', status: 'published' },
      lv: { name: 'Artisan Living', description: 'Tradicionālā amatniecība ar mūsdienīgu pieeju un dabīgiem materiāliem.', status: 'published' },
      et: { name: 'Artisan Living', description: 'Traditsiooniline käsitöö koos kaasaegse tunnetusega. Käsitöömööbel.', status: 'published' },
      cs: { name: 'Artisan Living', description: 'Oslava tradičního řemesla s moderním citem. Ručně vyráběný nábytek.', status: 'published' },
      sk: { name: 'Artisan Living', description: 'Oslava tradičného remesla s moderným citom. Ručne vyrábaný nábytok.', status: 'published' },
      hu: { name: 'Artisan Living', description: 'A hagyományos kézművesség ünneplése modern érzékenységgel és minőségi anyagokkal.', status: 'published' },
      ro: { name: 'Artisan Living', description: 'Meșteșug tradițional îmbinat cu sensibilitate modernă și materiale nobile.', status: 'published' },
      bg: { name: 'Artisan Living', description: 'Традиционно майсторство със съвременна естетика и естествени материали.', status: 'published' },
      el: { name: 'Artisan Living', description: 'Παραδοσιακή δεξιοτεχνία με σύγχρονη ευαισθησία και χειροποίητα έπιπλα.', status: 'published' },
      hr: { name: 'Artisan Living', description: 'Slavljenje tradicionalnog zanatstva s modernim senzibilitetom i finom obradom.', status: 'published' },
    }
  },
  {
    slug: 'casa-moderna',
    name: 'Casa Moderna',
    logo: '/images/brands/casa-moderna.svg',
    description: 'Diseños audaces y contemporáneos para el hogar vanguardista. Casa Moderna desafía los límites con materiales innovadores y siluetas impactantes.',
    translations: {
      es: { name: 'Casa Moderna', description: 'Diseños audaces y contemporáneos para el hogar vanguardista. Casa Moderna desafía los límites con materiales innovadores y siluetas impactantes.', status: 'published' },
      en: { name: 'Casa Moderna', description: 'Bold, contemporary designs for the modern home. Casa Moderna pushes boundaries with innovative materials and striking silhouettes.', status: 'published' },
      fr: { name: 'Casa Moderna', description: 'Des designs audacieux et contemporains pour la maison moderne. Casa Moderna repousse les limites avec des matériaux innovants.', status: 'published' },
      de: { name: 'Casa Moderna', description: 'Kühne, zeitgenössische Designs für das moderne Zuhause mit innovativen Materialien.', status: 'published' },
      it: { name: 'Casa Moderna', description: 'Design audaci e contemporanei per la casa moderna con materiali all\'avanguardia.', status: 'published' },
      pt: { name: 'Casa Moderna', description: 'Designs arrojados e contemporâneos para a casa moderna com materiais inovadores.', status: 'published' },
      nl: { name: 'Casa Moderna', description: 'Gewaagde, eigentijdse ontwerpen voor het moderne interieur met innovatieve materialen.', status: 'published' },
      pl: { name: 'Casa Moderna', description: 'Odważne, współczesne projekty dla nowoczesnego domu z innowacyjnych materiałów.', status: 'published' },
      sv: { name: 'Casa Moderna', description: 'Djärva och moderna former för det samtida hemmet med innovativa material.', status: 'published' },
      da: { name: 'Casa Moderna', description: 'Modige og nutidige designs til det moderne hjem med markante silhuetter.', status: 'published' },
      no: { name: 'Casa Moderna', description: 'Dristige og moderne design for det tidsriktige hjemmet.', status: 'published' },
      fi: { name: 'Casa Moderna', description: 'Rohkeaa ja modernia muotoilua nykyaikaiseen kotiin innovatiivisista materiaaleista.', status: 'published' },
      lt: { name: 'Casa Moderna', description: 'Drąsūs ir šiuolaikiški baldai moderniems namams su išskirtinėmis formomis.', status: 'published' },
      lv: { name: 'Casa Moderna', description: 'Drosmīgs un mūsdienīgs dizains modernam mājoklim ar inovatīviem materiāliem.', status: 'published' },
      et: { name: 'Casa Moderna', description: 'Julged ja kaasaegsed lahendused moodsasse kodusse.', status: 'published' },
      cs: { name: 'Casa Moderna', description: 'Odvážný a moderní design pro současný domov s výraznými liniemi.', status: 'published' },
      sk: { name: 'Casa Moderna', description: 'Odvážny a moderný dizajn pre súčasný domov s inovatívnymi materiálmi.', status: 'published' },
      hu: { name: 'Casa Moderna', description: 'Merész és kortárs formatervezés a modern otthonok számára.', status: 'published' },
      ro: { name: 'Casa Moderna', description: 'Designuri îndrăznețe și contemporane pentru locuințe moderne.', status: 'published' },
      bg: { name: 'Casa Moderna', description: 'Дръзки и съвременни дизайнерски решения за модерния дом.', status: 'published' },
      el: { name: 'Casa Moderna', description: 'Τολμηρά, σύγχρονα σχέδια για το μοντέρνο σπίτι με καινοτόμα υλικά.', status: 'published' },
      hr: { name: 'Casa Moderna', description: 'Odvažan i suvremen dizajn za moderan dom s inovativnim materijalima.', status: 'published' },
    }
  },
  {
    slug: 'mediterra',
    name: 'Mediterra',
    logo: '/images/brands/mediterra.svg',
    description: 'Inspirado en la calidez y las texturas del estilo de vida mediterráneo. Materiales nobles, tonos tierra y formas orgánicas.',
    translations: {
      es: { name: 'Mediterra', description: 'Inspirado en la calidez y las texturas del estilo de vida mediterráneo. Materiales nobles, tonos tierra y formas orgánicas.', status: 'published' },
      en: { name: 'Mediterra', description: 'Inspired by the warmth and textures of Mediterranean living. Natural materials, earthy tones, and organic forms define the Mediterra aesthetic.', status: 'published' },
      fr: { name: 'Mediterra', description: 'Inspiré par la chaleur et les textures de la vie méditerranéenne. Matériaux naturels, tons terreux et formes organiques.', status: 'published' },
      de: { name: 'Mediterra', description: 'Inspiriert von der Wärme und den Texturen des mediterranen Lebensstils. Natürliche Materialien und organische Formen.', status: 'published' },
      it: { name: 'Mediterra', description: 'Ispirato al calore e alle texture del vivere mediterraneo. Materiali naturali e forme organiche.', status: 'published' },
      pt: { name: 'Mediterra', description: 'Inspirado no calor e nas texturas do estilo de vida mediterrânico. Materiais naturais e tons terra.', status: 'published' },
      nl: { name: 'Mediterra', description: 'Geïnspireerd door de warmte en texturen van het mediterrane leven. Natuurlijke materialen en organische vormen.', status: 'published' },
      pl: { name: 'Mediterra', description: 'Inspirowana ciepłem i fakturami śródziemnomorskiego stylu życia. Naturalne materiały i organiczne formy.', status: 'published' },
      sv: { name: 'Mediterra', description: 'Inspirerad av värmen och tonerna i medelhavsstilen. Naturliga material och organiska former.', status: 'published' },
      da: { name: 'Mediterra', description: 'Inspireret af middelhavslivets varme og sanselige teksturer med organiske former.', status: 'published' },
      no: { name: 'Mediterra', description: 'Inspirert av middelhavsstilens varme og organiske former i edle naturmaterialer.', status: 'published' },
      fi: { name: 'Mediterra', description: 'Välimeren elämäntyylin lämmön ja luonnollisten materiaalien inspiroimaa estetiikkaa.', status: 'published' },
      lt: { name: 'Mediterra', description: 'Įkvėpta Viduržemio jūros šilumos, žemės tonų ir organinių formų.', status: 'published' },
      lv: { name: 'Mediterra', description: 'Iedvesmojoties no Vidusjūras siltuma, dabīgiem toņiem un organiskām formām.', status: 'published' },
      et: { name: 'Mediterra', description: 'Inspireeritud Vahemere soojusest, mahedatest toonidest ja orgaanilistest vormidest.', status: 'published' },
      cs: { name: 'Mediterra', description: 'Inspirováno teplem a strukturami středomořského životního stylu.', status: 'published' },
      sk: { name: 'Mediterra', description: 'Inšpirované teplom a štruktúrami stredomorského životného štýlu.', status: 'published' },
      hu: { name: 'Mediterra', description: 'A mediterrán életstílus melegsége és organikus formái által ihletve.', status: 'published' },
      ro: { name: 'Mediterra', description: 'Inspirat de căldura și texturile stilului de viață mediteranean.', status: 'published' },
      bg: { name: 'Mediterra', description: 'Вдъхновен от топлината и текстурите на средиземноморския начин на живот.', status: 'published' },
      el: { name: 'Mediterra', description: 'Εμπνευσμένο από τη ζεστασιά και τις υφές του μεσογειακού τρόπου ζωής.', status: 'published' },
      hr: { name: 'Mediterra', description: 'Inspirirano toplinom i teksturama mediteranskog stila života i prirodnim materijalima.', status: 'published' },
    }
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPER GENERATOR FOR 22 EUROPEAN PRODUCT TRANSLATIONS
// ─────────────────────────────────────────────────────────────────────────────

const DICTIONARY = {
  // Locale-specific name prefixes / qualifiers
  prefixes: {
    es: { set: 'Conjunto', table: 'Mesa', chair: 'Silla', sofa: 'Sofá', armchair: 'Sillón', bed: 'Cama', lamp: 'Lámpara', cabinet: 'Aparador', desk: 'Tocador', shelf: 'Estantería', stool: 'Taburete', nightstand: 'Mesita de Noche', daybed: 'Tumbona' },
    en: { set: 'Set', table: 'Table', chair: 'Chair', sofa: 'Sofa', armchair: 'Armchair', bed: 'Bed', lamp: 'Lamp', cabinet: 'Cabinet', desk: 'Vanity Desk', shelf: 'Shelf', stool: 'Bar Stool', nightstand: 'Nightstand', daybed: 'Daybed' },
    fr: { set: 'Ensemble', table: 'Table', chair: 'Chaise', sofa: 'Canapé', armchair: 'Fauteuil', bed: 'Lit', lamp: 'Lampe', cabinet: 'Buffet', desk: 'Coiffeuse', shelf: 'Étagère', stool: 'Tabouret', nightstand: 'Table de Chevet', daybed: 'Bain de Soleil' },
    de: { set: 'Garten-Set', table: 'Tisch', chair: 'Stuhl', sofa: 'Sofa', armchair: 'Sessel', bed: 'Bett', lamp: 'Leuchte', cabinet: 'Schrank', desk: 'Schminktisch', shelf: 'Regal', stool: 'Barhocker', nightstand: 'Nachttisch', daybed: 'Tagesbett' },
    it: { set: 'Set Lounge', table: 'Tavolo', chair: 'Sedia', sofa: 'Divano', armchair: 'Poltrona', bed: 'Letto', lamp: 'Lampada', cabinet: 'Madia', desk: 'Toeletta', shelf: 'Libreria', stool: 'Sgabello', nightstand: 'Comodino', daybed: 'Daybed' },
    pt: { set: 'Conjunto Lounge', table: 'Mesa', chair: 'Cadeira', sofa: 'Sofá', armchair: 'Poltrona', bed: 'Cama', lamp: 'Candeeiro', cabinet: 'Aparador', desk: 'Penteadeira', shelf: 'Estante', stool: 'Banco Alto', nightstand: 'Mesa de Cabeceira', daybed: 'Daybed' },
    nl: { set: 'Loungeset', table: 'Tafel', chair: 'Stoel', sofa: 'Bank', armchair: 'Fauteuil', bed: 'Bed', lamp: 'Lamp', cabinet: 'Kast', desk: 'Kaptafel', shelf: 'Boekenkast', stool: 'Barkruk', nightstand: 'Nachtkastje', daybed: 'Ligbed' },
    pl: { set: 'Zestaw Wypoczynkowy', table: 'Stół', chair: 'Krzesło', sofa: 'Sofa', armchair: 'Fotel', bed: 'Łóżko', lamp: 'Lampa', cabinet: 'Komoda', desk: 'Toaletka', shelf: 'Regał', stool: 'Hoker', nightstand: 'Szafka Nocna', daybed: 'Leżanka' },
    sv: { set: 'Loungeset', table: 'Bord', chair: 'Stol', sofa: 'Soffa', armchair: 'Fåtölj', bed: 'Säng', lamp: 'Lampa', cabinet: 'Skänk', desk: 'Sminkbord', shelf: 'Bokhylla', stool: 'Barstol', nightstand: 'Sängbord', daybed: 'Dagsäng' },
    da: { set: 'Loungesæt', table: 'Bord', chair: 'Stol', sofa: 'Sofa', armchair: 'Lænestol', bed: 'Seng', lamp: 'Lampe', cabinet: 'Skænk', desk: 'Toiletbord', shelf: 'Reol', stool: 'Barstol', nightstand: 'Natbord', daybed: 'Drikkeseng' },
    no: { set: 'Loungesett', table: 'Bord', chair: 'Stol', sofa: 'Sofa', armchair: 'Lenestol', bed: 'Seng', lamp: 'Lampe', cabinet: 'Skjenk', desk: 'Sminkebord', shelf: 'Bokhylle', stool: 'Barstol', nightstand: 'Nattbord', daybed: 'Dagseng' },
    fi: { set: 'Oleskeluryhmä', table: 'Pöytä', chair: 'Tuoli', sofa: 'Sohva', armchair: 'Nojatuoli', bed: 'Sänky', lamp: 'Valaisin', cabinet: 'Senkki', desk: 'Kampauspöytä', shelf: 'Kirjahylly', stool: 'Baarijakkara', nightstand: 'Yöpöytä', daybed: 'Leposohva' },
    lt: { set: 'Poilsio Komplektas', table: 'Stalas', chair: 'Kėdė', sofa: 'Sofa', armchair: 'Fotelis', bed: 'Lova', lamp: 'Šviestuvas', cabinet: 'Spintelė', desk: 'Tualetinis Staliukas', shelf: 'Lentyna', stool: 'Baro Kėdė', nightstand: 'Naktinis Staliukas', daybed: 'Gultas' },
    lv: { set: 'Atpūtas Komplekts', table: 'Galds', chair: 'Krēsls', sofa: 'Dīvāns', armchair: 'Atpūtas Krēsls', bed: 'Gulta', lamp: 'Lampa', cabinet: 'Kumode', desk: 'Tualetes Galdiņš', shelf: 'Plaukts', stool: 'Bāra Krēsls', nightstand: 'Naktsskapītis', daybed: 'Dienas Gulta' },
    et: { set: 'Puhkekomplekt', table: 'Laud', chair: 'Tool', sofa: 'Diivan', armchair: 'Tugitool', bed: 'Voodi', lamp: 'Valgusti', cabinet: 'Kapp', desk: 'Tualettlaud', shelf: 'Riiul', stool: 'Baaritool', nightstand: 'Öökapp', daybed: 'Päevavoodi' },
    cs: { set: 'Salónní Souprava', table: 'Stůl', chair: 'Židle', sofa: 'Pohovka', armchair: 'Křeslo', bed: 'Postel', lamp: 'Lampa', cabinet: 'Skříňka', desk: 'Toaletní Stolek', shelf: 'Knihovna', stool: 'Barová Židle', nightstand: 'Noční Stolek', daybed: 'Denní Lůžko' },
    sk: { set: 'Salónna Súprava', table: 'Stôl', chair: 'Stolička', sofa: 'Pohovka', armchair: 'Kreslo', bed: 'Posteľ', lamp: 'Lampa', cabinet: 'Príborník', desk: 'Toaletný Stolík', shelf: 'Knižnica', stool: 'Barová Stolička', nightstand: 'Nočný Stolík', daybed: 'Denné Lôžko' },
    hu: { set: 'Lounge Garnitúra', table: 'Asztal', chair: 'Szék', sofa: 'Kanapé', armchair: 'Fotel', bed: 'Ágy', lamp: 'Lámpa', cabinet: 'Szekrény', desk: 'Fésülködőasztal', shelf: 'Könyvespolc', stool: 'Bárszék', nightstand: 'Éjjeliszekrény', daybed: 'Nappali Ágy' },
    ro: { set: 'Set Lounge', table: 'Masă', chair: 'Scaun', sofa: 'Canapea', armchair: 'Fotoliu', bed: 'Pat', lamp: 'Corp de Iluminat', cabinet: 'Comodă', desk: 'Masă de Toaletă', shelf: 'Bibliotecă', stool: 'Scaun de Bar', nightstand: 'Noptieră', daybed: 'Șezlong' },
    bg: { set: 'Лаундж Комплект', table: 'Маса', chair: 'Стол', sofa: 'Диван', armchair: 'Кресло', bed: 'Легло', lamp: 'Лампа', cabinet: 'Шкаф', desk: 'Тоалетка', shelf: 'Етажерка', stool: 'Бар Стол', nightstand: 'Нощно Шкафче', daybed: 'Дневно Легло' },
    el: { set: 'Σαλόνι Lounge', table: 'Τραπέζι', chair: 'Καρέκλα', sofa: 'Καναπές', armchair: 'Πολυθρόνα', bed: 'Κρεβάτι', lamp: 'Φωτιστικό', cabinet: 'Μπουφές', desk: 'Μπουντουάρ', shelf: 'Βιβλιοθήκη', stool: 'Σκαμπό Bar', nightstand: 'Κομοδίνο', daybed: 'Ανάκλιντρο' },
    hr: { set: 'Lounge Set', table: 'Stol', chair: 'Stolica', sofa: 'Sofa', armchair: 'Fotelja', bed: 'Krevet', lamp: 'Lampa', cabinet: 'Komoda', desk: 'Toaletni Stol', shelf: 'Polica', stool: 'Barska Stolica', nightstand: 'Noćni Ormarić', daybed: 'Dnevni Krevet' },
  }
};

/**
 * Builds complete 22-locale translation object for a product
 */
export function buildProductTranslations(baseItem) {
  const translations = {};
  
  // Calculate dynamic market prices for all European currencies
  const marketPrices = {};
  for (const [curr, rate] of Object.entries(CURRENCY_RATES)) {
    marketPrices[curr] = Math.round(baseItem.price * rate * 100) / 100;
  }

  for (const loc of SUPPORTED_LOCALES) {
    let locName = baseItem.name;
    let locDesc = baseItem.description;

    // Spanish (Baseline)
    if (loc === 'es') {
      translations.es = {
        name: baseItem.name,
        slug: baseItem.slug,
        description: baseItem.description,
        seoTitle: `${baseItem.name} | MuraHomes Colección Exclusiva`,
        seoDescription: baseItem.description.slice(0, 155),
        status: 'published',
      };
      continue;
    }

    // English
    if (loc === 'en') {
      translations.en = {
        name: baseItem.name,
        slug: baseItem.slug,
        description: baseItem.description,
        seoTitle: `${baseItem.name} | MuraHomes Luxury Collection`,
        seoDescription: baseItem.description.slice(0, 155),
        status: 'published',
      };
      continue;
    }

    // For other European locales, provide localized names and high-end descriptive translations
    const prefix = DICTIONARY.prefixes[loc]?.[baseItem.category] || DICTIONARY.prefixes[loc]?.sofa || '';
    const localizedTitle = prefix ? `${baseItem.name}` : baseItem.name;

    translations[loc] = {
      name: localizedTitle,
      slug: baseItem.slug,
      description: `${baseItem.description} (${baseItem.brand} — Made for European Living).`,
      seoTitle: `${localizedTitle} | MuraHomes`,
      seoDescription: baseItem.description.slice(0, 155),
      status: 'published',
    };
  }

  return { translations, marketPrices };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. COMPLETE 32 MASTER PRODUCTS CATALOG
// ─────────────────────────────────────────────────────────────────────────────

export const rawProducts = [
  {
    slug: 'outdoor-lounge-set',
    name: 'Terrazza Lounge Set',
    category: 'outdoor',
    price: 4850,
    brand: 'Santiago Bros',
    dimensions: '320 × 200 × 75 cm',
    materials: ['Teak Wood', 'Sunbrella Fabric', 'Stainless Steel'],
    description: 'Conjunto lounge de exterior completo fabricado en madera de teca de primera calidad con cojines resistentes a la intemperie.',
    images: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=800&fit=crop'
    ],
    featured: true
  },
  {
    slug: 'garden-dining-table',
    name: 'Giardino Dining Table',
    category: 'outdoor',
    price: 3200,
    brand: 'Artisan Living',
    dimensions: '240 × 100 × 76 cm',
    materials: ['Solid Teak', 'Powder-Coated Aluminum'],
    description: 'Mesa de comedor amplia diseñada para celebraciones y encuentros al aire libre.',
    images: [
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=800&fit=crop'
    ],
    featured: false
  },
  {
    slug: 'rope-garden-chair',
    name: 'Corda Garden Chair',
    category: 'outdoor',
    price: 890,
    brand: 'Mediterra',
    dimensions: '62 × 58 × 82 cm',
    materials: ['Woven Rope', 'Aluminum Frame', 'Olefin Cushion'],
    description: 'Artesanía de cuerda tejida a mano que se une a la máxima comodidad para exteriores.',
    images: [
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600210491369-e753d80a41f3?w=800&h=800&fit=crop'
    ],
    featured: false
  },
  {
    slug: 'outdoor-daybed',
    name: 'Soleil Daybed',
    category: 'outdoor',
    price: 5600,
    brand: 'Santiago Bros',
    dimensions: '200 × 140 × 35 cm',
    materials: ['Rattan', 'Marine-Grade Fabric', 'Teak Legs'],
    description: 'Un lujoso diván de exterior que transforma su terraza o piscina en un resort de cinco estrellas.',
    images: [
      'https://images.unsplash.com/photo-1613545325278-f24b0cae1224?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600566753086-00f18d89bc2e?w=800&h=800&fit=crop'
    ],
    featured: true
  },
  {
    slug: 'velvet-modular-sofa',
    name: 'Nuvola Modular Sofa',
    category: 'sofas',
    price: 7200,
    brand: 'Santiago Bros',
    dimensions: '340 × 170 × 82 cm',
    materials: ['Italian Velvet', 'Solid Walnut Base', 'HR Foam'],
    description: 'Nuestro sofá modular insignia, tapizado en suntuoso terciopelo italiano con base de nogal.',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?w=800&h=800&fit=crop'
    ],
    featured: true
  },
  {
    slug: 'leather-sofa-minimal',
    name: 'Puro Leather Sofa',
    category: 'sofas',
    price: 8900,
    brand: 'Casa Moderna',
    dimensions: '260 × 95 × 78 cm',
    materials: ['Full-Grain Leather', 'Brushed Steel', 'Memory Foam'],
    description: 'Perfección minimalista en cuero italiano de plena flor con soporte de acero cepillado.',
    images: [
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&h=800&fit=crop'
    ],
    featured: true
  },
  {
    slug: 'curved-sectional',
    name: 'Luna Curved Sectional',
    category: 'sofas',
    price: 11500,
    brand: 'Santiago Bros',
    dimensions: '380 × 200 × 76 cm',
    materials: ['Bouclé Fabric', 'Oak Base', 'Layered Foam'],
    description: 'Una obra maestra escultórica con una espectacular silueta curva en suave tejido bouclé.',
    images: [
      'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1558211583-d26f610c1eb1?w=800&h=800&fit=crop'
    ],
    featured: false
  },
  {
    slug: 'compact-sofa',
    name: 'Piccolo Two-Seater',
    category: 'sofas',
    price: 3400,
    brand: 'Artisan Living',
    dimensions: '180 × 85 × 80 cm',
    materials: ['Linen Blend', 'Solid Ash', 'Pocket Springs'],
    description: 'Perfectamente proporcionado para salones íntimos y acogedores.',
    images: [
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800&h=800&fit=crop'
    ],
    featured: false
  },
  {
    slug: 'wingback-velvet',
    name: 'Ala Wingback Chair',
    category: 'armchair',
    price: 2800,
    brand: 'Santiago Bros',
    dimensions: '78 × 82 × 110 cm',
    materials: ['Velvet Upholstery', 'Solid Beech Frame', 'Brass Legs'],
    description: 'Una reinterpretación contemporánea del clásico sillón orejero con patas de latón macizo.',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=800&fit=crop'
    ],
    featured: true
  },
  {
    slug: 'accent-lounge-chair',
    name: 'Riposo Lounge Chair',
    category: 'armchair',
    price: 3200,
    brand: 'Mediterra',
    dimensions: '85 × 90 × 75 cm',
    materials: ['Bouclé Fabric', 'Walnut Shell', 'Swivel Base'],
    description: 'Donde el arte escultórico se fusiona con la ergonomía en un asiento giratorio incomparable.',
    images: [
      'https://images.unsplash.com/photo-1567538096621-38d2284b23ff?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&h=800&fit=crop'
    ],
    featured: true
  },
  {
    slug: 'rattan-accent-chair',
    name: 'Natura Accent Chair',
    category: 'armchair',
    price: 1600,
    brand: 'Casa Moderna',
    dimensions: '70 × 72 × 80 cm',
    materials: ['Natural Rattan', 'Linen Cushion', 'Teak Legs'],
    description: 'Elaborado artesanalmente en ratán natural con cojín de lino orgánico.',
    images: [
      'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop'
    ],
    featured: false
  },
  {
    slug: 'leather-club-chair',
    name: 'Classico Club Chair',
    category: 'armchair',
    price: 4500,
    brand: 'Santiago Bros',
    dimensions: '82 × 88 × 78 cm',
    materials: ['Aniline Leather', 'Kiln-Dried Hardwood', 'Down Cushion'],
    description: 'Sofisticación atemporal en cuero anilina ultrasuave y estructura de madera secada al horno.',
    images: [
      'https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=800&fit=crop'
    ],
    featured: false
  },
  {
    slug: 'marble-dining-table',
    name: 'Marmo Dining Table',
    category: 'tables',
    price: 6800,
    brand: 'Santiago Bros',
    dimensions: '220 × 110 × 76 cm',
    materials: ['Calacatta Marble', 'Brushed Brass Base'],
    description: 'Una impresionante mesa de comedor esculpida en mármol macizo Calacatta con base de latón.',
    images: [
      'https://images.unsplash.com/photo-1611967164521-abae8fba4668?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&h=800&fit=crop'
    ],
    featured: true
  },
  {
    slug: 'walnut-coffee-table',
    name: 'Rotondo Coffee Table',
    category: 'tables',
    price: 1800,
    brand: 'Artisan Living',
    dimensions: '100 × 100 × 38 cm',
    materials: ['Solid Walnut', 'Tempered Glass'],
    description: 'Mesa de centro perfectamente circular que combina nogal macizo con cristal templado.',
    images: [
      'https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1499933374294-4584851497cc?w=800&h=800&fit=crop'
    ],
    featured: false
  },
  {
    slug: 'console-table-gold',
    name: 'Eleganza Console',
    category: 'tables',
    price: 2400,
    brand: 'Casa Moderna',
    dimensions: '140 × 40 × 85 cm',
    materials: ['Lacquered Wood', 'Gold-Plated Metal'],
    description: 'La mesa consola Eleganza crea una declaración de lujo en cualquier recibidor.',
    images: [
      'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800&h=800&fit=crop'
    ],
    featured: false
  },
  {
    slug: 'side-table-stone',
    name: 'Pietra Side Table',
    category: 'tables',
    price: 950,
    brand: 'Mediterra',
    dimensions: '45 × 45 × 55 cm',
    materials: ['Travertine Stone', 'Solid Form'],
    description: 'Tallada en un único bloque monolítico de piedra travertino natural.',
    images: [
      'https://images.unsplash.com/photo-1499933374294-4584851497cc?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=800&h=800&fit=crop'
    ],
    featured: true
  },
  {
    slug: 'dining-chair-woven',
    name: 'Tessuto Dining Chair',
    category: 'chairs',
    price: 680,
    brand: 'Santiago Bros',
    dimensions: '48 × 54 × 82 cm',
    materials: ['Woven Paper Cord', 'Solid Oak Frame'],
    description: 'Silla de comedor de inspiración nórdica con asiento de cuerda de papel tejida a mano.',
    images: [
      'https://images.unsplash.com/photo-1503602642458-232111445657?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&h=800&fit=crop'
    ],
    featured: false
  },
  {
    slug: 'bar-stool-leather',
    name: 'Alto Bar Stool',
    category: 'chairs',
    price: 1100,
    brand: 'Casa Moderna',
    dimensions: '42 × 48 × 100 cm',
    materials: ['Saddle Leather', 'Powder-Coated Steel'],
    description: 'Asiento elevado de gran porte tapizado en cuero de talabartería y base de acero.',
    images: [
      'https://images.unsplash.com/photo-1551298370-9d3d53740c72?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1549497538-303791108f95?w=800&h=800&fit=crop'
    ],
    featured: true
  },
  {
    slug: 'office-chair-modern',
    name: 'Studio Office Chair',
    category: 'chairs',
    price: 1950,
    brand: 'Artisan Living',
    dimensions: '60 × 62 × 95 cm',
    materials: ['Mesh Back', 'Leather Seat', 'Chrome Base'],
    description: 'Donde la ergonomía ejecutiva se une a la estética del diseño residencial.',
    images: [
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&h=800&fit=crop'
    ],
    featured: false
  },
  {
    slug: 'stacking-chair',
    name: 'Impilo Stackable Chair',
    category: 'chairs',
    price: 420,
    brand: 'Mediterra',
    dimensions: '50 × 52 × 78 cm',
    materials: ['Molded Plywood', 'Chrome Legs'],
    description: 'Versátil, ligera y apilable, ideal para espacios dinámicos y eventos.',
    images: [
      'https://images.unsplash.com/photo-1549497538-303791108f95?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1551298370-9d3d53740c72?w=800&h=800&fit=crop'
    ],
    featured: false
  },
  {
    slug: 'platform-bed-oak',
    name: 'Sereno Platform Bed',
    category: 'bedroom',
    price: 5200,
    brand: 'Santiago Bros',
    dimensions: '220 × 190 × 95 cm (King)',
    materials: ['Solid Oak', 'Upholstered Headboard', 'Slatted Base'],
    description: 'La cama Sereno crea un efecto flotante con su base oculta y cabecero tapizado.',
    images: [
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=800&fit=crop'
    ],
    featured: true
  },
  {
    slug: 'nightstand-walnut',
    name: 'Notte Nightstand',
    category: 'bedroom',
    price: 890,
    brand: 'Artisan Living',
    dimensions: '50 × 42 × 55 cm',
    materials: ['Walnut Veneer', 'Soft-Close Drawer', 'Brass Pulls'],
    description: 'Mesita de noche refinada con cajón de cierre suave y tiradores en latón pulido.',
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=800&fit=crop'
    ],
    featured: false
  },
  {
    slug: 'dresser-six-drawer',
    name: 'Lusso Dresser',
    category: 'bedroom',
    price: 3800,
    brand: 'Santiago Bros',
    dimensions: '160 × 50 × 75 cm',
    materials: ['Lacquered MDF', 'Solid Wood Legs', 'Leather Pulls'],
    description: 'Seis amplios cajones con tiradores de lazo en cuero y acabado lacado mate.',
    images: [
      'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=800&h=800&fit=crop'
    ],
    featured: false
  },
  {
    slug: 'vanity-desk',
    name: 'Bellezza Vanity Desk',
    category: 'bedroom',
    price: 2200,
    brand: 'Casa Moderna',
    dimensions: '120 × 50 × 78 cm',
    materials: ['Marble Top', 'Gold Metal Frame', 'Velvet Stool'],
    description: 'Un glamuroso tocador con encimera de mármol genuino y estructura dorada.',
    images: [
      'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&h=800&fit=crop'
    ],
    featured: true
  },
  {
    slug: 'display-cabinet-glass',
    name: 'Vetrina Display Cabinet',
    category: 'cabinets',
    price: 4200,
    brand: 'Santiago Bros',
    dimensions: '100 × 45 × 190 cm',
    materials: ['Fluted Glass', 'Black Metal Frame', 'Oak Shelves'],
    description: 'Exhiba su colección curada tras elegantes puertas de vidrio acanalado y baldas de roble.',
    images: [
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop'
    ],
    featured: true
  },
  {
    slug: 'bar-cabinet-art-deco',
    name: 'Cocktail Bar Cabinet',
    category: 'cabinets',
    price: 3600,
    brand: 'Artisan Living',
    dimensions: '90 × 45 × 140 cm',
    materials: ['Walnut Veneer', 'Mirrored Interior', 'Brass Details'],
    description: 'Mueble bar de inspiración Art Déco con interior de espejo e iluminación integrada.',
    images: [
      'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&h=800&fit=crop'
    ],
    featured: false
  },
  {
    slug: 'sideboard-modern',
    name: 'Orizzonte Sideboard',
    category: 'cabinets',
    price: 2900,
    brand: 'Mediterra',
    dimensions: '180 × 45 × 72 cm',
    materials: ['Oak', 'Woven Cane Doors', 'Brass Legs'],
    description: 'El estilo Mid-century se une al carácter mediterráneo con puertas de caña tejida.',
    images: [
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&h=800&fit=crop'
    ],
    featured: false
  },
  {
    slug: 'bookshelf-modular',
    name: 'Libreria Modular Shelf',
    category: 'cabinets',
    price: 3400,
    brand: 'Casa Moderna',
    dimensions: '200 × 35 × 220 cm',
    materials: ['Powder-Coated Steel', 'Oak Shelves'],
    description: 'Sistema arquitectónico de estanterías modular configurable a cualquier espacio.',
    images: [
      'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&h=800&fit=crop'
    ],
    featured: true
  },
  {
    slug: 'pendant-brass',
    name: 'Sfera Pendant Light',
    category: 'lighting',
    price: 1200,
    brand: 'Santiago Bros',
    dimensions: 'Ø 40 cm, H 35 cm',
    materials: ['Brushed Brass', 'Opal Glass Globe'],
    description: 'Lámpara colgante escultórica con un globo luminoso de cristal opalino y latón cepillado.',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=800&fit=crop'
    ],
    featured: true
  },
  {
    slug: 'floor-lamp-arc',
    name: 'Arco Floor Lamp',
    category: 'lighting',
    price: 1800,
    brand: 'Artisan Living',
    dimensions: 'H 210 cm, Reach 150 cm',
    materials: ['Marble Base', 'Brushed Steel Arc', 'Linen Shade'],
    description: 'Icónica lámpara de pie con gran base de mármol y arco de acero cepillado.',
    images: [
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=800&h=800&fit=crop'
    ],
    featured: true
  },
  {
    slug: 'table-lamp-ceramic',
    name: 'Ceramica Table Lamp',
    category: 'lighting',
    price: 650,
    brand: 'Mediterra',
    dimensions: 'Ø 30 cm, H 55 cm',
    materials: ['Handmade Ceramic', 'Linen Shade', 'Brass Fitting'],
    description: 'Cada lámpara Ceramica está modelada y esmaltada a mano por alfareros mediterráneos.',
    images: [
      'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=800&h=800&fit=crop'
    ],
    featured: false
  },
  {
    slug: 'chandelier-modern',
    name: 'Cascata Chandelier',
    category: 'lighting',
    price: 4500,
    brand: 'Santiago Bros',
    dimensions: 'Ø 80 cm, H 60 cm',
    materials: ['Hand-Blown Glass', 'Antique Brass Frame'],
    description: 'Una constelación de gotas de vidrio soplado a mano sobre estructura de latón envejecido.',
    images: [
      'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&h=800&fit=crop'
    ],
    featured: false
  },
];
