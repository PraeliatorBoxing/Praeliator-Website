type IntakeLocale = "en" | "es" | "ja" | "fr";

type FaqKnowledgeEntry = {
  topic: string;
  keywords: string[];
  answers: Record<IntakeLocale, string>;
};

const faqKnowledge: FaqKnowledgeEntry[] = [
  {
    topic: "Praeliator identity and luxury position",
    keywords: [
      "praeliator",
      "brand",
      "house",
      "luxury",
      "true luxury",
      "real luxury",
      "premium",
      "serious",
      "what is praeliator",
      "who are you",
      "casa",
      "lujo",
      "marca",
      "ラグジュアリー",
      "maison",
      "luxe",
    ],
    answers: {
      en: "Praeliator presents itself as a private luxury boxing house rather than a mass-market equipment brand. The standard is restraint, object quality, controlled access, and continuity after acquisition, so the pair is treated more like a retained object than a generic sports purchase.",
      es: "Praeliator se presenta como una casa privada de lujo dedicada al boxeo, no como una marca masiva de equipo. El estándar está en la contención, la calidad del objeto, el acceso controlado y la continuidad después de la adquisición, de modo que el par se trata más como un objeto retenido que como una compra deportiva genérica.",
      ja: "Praeliator は大衆向けの用品ブランドではなく、私的なラグジュアリー・ボクシングハウスとして構成されています。その基準は抑制、対象物としての品質、管理されたアクセス、取得後の継続性にあり、ペアは一般的なスポーツ購入品ではなく、保持される対象物として扱われます。",
      fr: "Praeliator se présente comme une maison privée de luxe consacrée à la boxe, et non comme une marque d'équipement de masse. Le standard repose sur la retenue, la qualité d'objet, l'accès contrôlé et la continuité après acquisition, de sorte que la paire est traitée comme un objet retenu plutôt que comme un achat sportif générique.",
    },
  },
  {
    topic: "Boxing as art and object philosophy",
    keywords: [
      "art",
      "boxing as art",
      "object",
      "piece of art",
      "why",
      "philosophy",
      "aesthetic",
      "editorial",
      "arte",
      "objeto",
      "哲学",
      "art objet",
    ],
    answers: {
      en: "Praeliator treats boxing as an art form and the glove as a resolved object, not only a piece of equipment. That is why the site emphasizes silhouette, material, presentation, custody, and aftercare instead of acting like a normal product listing or open public storefront.",
      es: "Praeliator trata el boxeo como una forma de arte y al guante como un objeto resuelto, no solo como una pieza de equipo. Por eso el sitio enfatiza silueta, material, presentación, custodia y aftercare en lugar de comportarse como una ficha de producto normal o una tienda pública abierta.",
      ja: "Praeliator はボクシングを芸術形式として、グローブを単なる道具ではなく解決された対象物として扱います。だからこそサイトは通常の製品一覧や公開店舗のようには振る舞わず、シルエット、素材、提示、保管、アフターケアを強く重視しています。",
      fr: "Praeliator traite la boxe comme une forme d'art et le gant comme un objet résolu, et non comme un simple équipement. C'est pourquoi le site met l'accent sur la silhouette, la matière, la présentation, la garde et l'après-achat au lieu d'agir comme une fiche produit ordinaire ou une vitrine publique ouverte.",
    },
  },
  {
    topic: "Acquisition route",
    keywords: [
      "acquisition",
      "private acquisition",
      "buy",
      "purchase",
      "begin",
      "start",
      "adquisicion",
      "取得",
      "commence",
    ],
    answers: {
      en: "Acquisition begins by direct correspondence. The first inquiry is reviewed before any private allocation or payment chamber is issued.",
      es: "La adquisición comienza por correspondencia directa. La primera consulta se revisa antes de emitir cualquier asignación privada o cámara de pago.",
      ja: "取得は直接のやり取りから始まります。最初の問い合わせが確認されるまで、私的な割当や支払い導線は発行されません。",
      fr: "L'acquisition commence par une correspondance directe. La première demande est examinée avant qu'une allocation privée ou qu'une chambre de paiement ne soit émise.",
    },
  },
  {
    topic: "Public availability",
    keywords: [
      "vis",
      "public",
      "cart",
      "checkout",
      "instant purchase",
      "compra publica",
      "カート",
      "achat public",
    ],
    answers: {
      en: "No. Praeliator VIS is not offered through a public cart. Approved clients may receive a private acquisition session prepared specifically for their line.",
      es: "No. Praeliator VIS no se ofrece mediante un carrito público. Los clientes aprobados pueden recibir una sesión privada de adquisición preparada para su propia línea.",
      ja: "いいえ。Praeliator VIS は公開カート商品ではありません。承認された顧客にのみ、専用の私的取得セッションが用意されます。",
      fr: "Non. Praeliator VIS n'est pas proposé par panier public. Les clients approuvés peuvent recevoir une session d'acquisition privée préparée pour leur propre ligne.",
    },
  },
  {
    topic: "Ownership Record",
    keywords: [
      "ownership",
      "record",
      "register",
      "registered pair",
      "registro",
      "所有",
      "registre",
    ],
    answers: {
      en: "The Ownership Record is the private client layer where registered pairs, recorded delivery age, and future service eligibility remain under one house line.",
      es: "El Registro de Propiedad es la capa privada donde los pares registrados, la edad de entrega registrada y la elegibilidad futura de servicio permanecen bajo una misma línea de casa.",
      ja: "Ownership Record は、登録されたペア、記録された到着年齢、将来のサービス適格性を同じハウスの系統下に保持する私的な記録層です。",
      fr: "L'Ownership Record est la couche privée où les paires enregistrées, l'ancienneté de livraison enregistrée et l'éligibilité future de service restent sous une même ligne de maison.",
    },
  },
  {
    topic: "Legacy Refresh",
    keywords: [
      "legacy",
      "refresh",
      "service",
      "aftercare",
      "care",
      "maturity",
      "servicio",
      "成熟",
      "apres-vente",
    ],
    answers: {
      en: "Legacy Refresh is a private post-purchase service ritual. It becomes available according to the pair's recorded maturity rather than the registration date alone.",
      es: "Legacy Refresh es un ritual privado de servicio posterior a la compra. Se abre según la madurez registrada del par y no solo por la fecha de registro.",
      ja: "Legacy Refresh は購入後の私的なサービス儀式です。登録日ではなく、記録された成熟度に応じて開きます。",
      fr: "Legacy Refresh est un rituel de service privé après achat. Il s'ouvre selon la maturité enregistrée de la paire et non selon la seule date d'enregistrement.",
    },
  },
  {
    topic: "Delivery and fulfillment",
    keywords: [
      "delivery",
      "shipping",
      "destination",
      "address",
      "fulfillment",
      "entrega",
      "配送",
      "livraison",
    ],
    answers: {
      en: "Delivery details are collected only after private access is verified and before payment is opened, so the route remains controlled from inquiry through fulfillment.",
      es: "Los datos de entrega se solicitan solo después de verificar el acceso privado y antes de abrir el pago, para que la ruta siga controlada desde la consulta hasta el cumplimiento.",
      ja: "配送情報は私的アクセスの確認後、支払い開始前にのみ収集されるため、問い合わせから履行までの導線は統制されたまま保たれます。",
      fr: "Les détails de livraison ne sont recueillis qu'après vérification de l'accès privé et avant l'ouverture du paiement, afin que la voie demeure contrôlée de la demande jusqu'à l'accomplissement.",
    },
  },
  {
    topic: "Privacy and providers",
    keywords: [
      "privacy",
      "data",
      "analytics",
      "pixel",
      "supabase",
      "stripe",
      "privacidad",
      "データ",
      "confidentialite",
    ],
    answers: {
      en: "Praeliator retains only the information needed to review correspondence, issue private acquisition access, maintain ownership records, continue service, and prepare delivery. Payments are handled through Stripe, and technical analytics may run when configured in production.",
      es: "Praeliator retiene solo la información necesaria para revisar correspondencia, emitir acceso privado de adquisición, mantener registros de propiedad, continuar servicio y preparar entrega. Los pagos se procesan mediante Stripe y la analítica técnica puede funcionar cuando está activada en producción.",
      ja: "Praeliator は、対応審査、私的取得アクセスの発行、所有記録の維持、継続サービス、配送準備に必要な情報だけを保持します。決済は Stripe が処理し、技術的な解析は本番で設定されている場合にのみ動作します。",
      fr: "Praeliator ne retient que les informations nécessaires pour examiner la correspondance, émettre l'accès privé d'acquisition, maintenir les registres de propriété, poursuivre le service et préparer la livraison. Les paiements sont traités par Stripe, et l'analytique technique peut fonctionner lorsqu'elle est activée en production.",
    },
  },
  {
    topic: "VIS price and payment total",
    keywords: [
      "price",
      "cost",
      "amount",
      "total",
      "mxn",
      "mx$",
      "6000",
      "6300",
      "payment",
      "deposit",
      "precio",
      "costo",
      "importe",
      "支払い",
      "prix",
      "montant",
    ],
    answers: {
      en: "The current published VIS acquisition total is MX$6,300: Praeliator VIS at MX$6,000 and private allocation and fulfillment at MX$300. Payment is completed inside the issued private acquisition route rather than through a public checkout.",
      es: "El total publicado actual para la adquisición de VIS es MX$6,300: Praeliator VIS en MX$6,000 y asignación privada con cumplimiento en MX$300. El pago se completa dentro de la ruta privada emitida, no mediante un checkout público.",
      ja: "現在公開されている VIS の取得総額は MX$6,300 です。内訳は Praeliator VIS が MX$6,000、私的割当と履行が MX$300 です。支払いは公開チェックアウトではなく、発行された私的取得ルート内で完了します。",
      fr: "Le total publié actuel pour l'acquisition de VIS est de MX$6,300 : Praeliator VIS à MX$6,000 et allocation privée avec accomplissement à MX$300. Le paiement s'effectue à l'intérieur de la voie privée émise, et non via un checkout public.",
    },
  },
  {
    topic: "VIS specifications",
    keywords: [
      "spec",
      "specification",
      "weight",
      "16 oz",
      "lace",
      "lace up",
      "material",
      "leather",
      "lining",
      "palm",
      "thumb",
      "wrist",
      "assembled",
      "packaging",
      "box",
      "dust bag",
      "silk",
      "specs",
      "especificacion",
      "materiales",
      "仕様",
      "cuir",
      "matiere",
    ],
    answers: {
      en: "The published VIS record describes a 16 oz lace-up training pair in top-grain cowhide leather, with 4-way stretch lining, a ventilated palm panel, integrated grip bar, attached thumb, and extended lace-up cuff. Presentation includes a rigid box, silk dust bag, silk wrapping paper, authenticity card, and care card.",
      es: "El registro publicado de VIS describe un par de entrenamiento de 16 oz con cierre de agujetas, cuero vacuno top-grain, forro elástico 4-way, palma ventilada, grip bar integrado, pulgar unido y puño extendido de agujetas. La presentación incluye caja rígida, dust bag de seda, papel de seda, tarjeta de autenticidad y tarjeta de cuidado.",
      ja: "公開されている VIS の記録では、16 oz のレースアップ式トレーニングペアで、トップグレインのカウハイド、4-way ストレッチライニング、通気パーム、統合グリップバー、アタッチドサム、延長レースアップカフが示されています。付属は剛性ボックス、シルクダストバッグ、シルクラッピング、真正性カード、ケアカードです。",
      fr: "Le registre publié de VIS décrit une paire d'entraînement 16 oz à laçage, en cuir bovin top-grain, avec doublure extensible 4-way, paume ventilée, grip bar intégré, pouce attaché et manchette allongée à laçage. La présentation comprend boîte rigide, dust bag en soie, papier de soie, carte d'authenticité et carte d'entretien.",
    },
  },
  {
    topic: "Craftsmanship and materials",
    keywords: [
      "craft",
      "craftsmanship",
      "made",
      "construction",
      "material",
      "materials",
      "cowhide",
      "lining",
      "palm",
      "thumb",
      "wrist architecture",
      "assembly",
      "hecho",
      "construccion",
      "materiales",
      "素材",
      "construction",
      "matiere",
    ],
    answers: {
      en: "The published VIS construction points to top-grain cowhide leather, balanced structure, a ventilated palm, integrated grip bar, attached thumb, 4-way stretch lining, and an extended lace-up cuff. It is positioned as a disciplined training object with material seriousness rather than flash.",
      es: "La construcción publicada de VIS apunta a cuero vacuno top-grain, estructura equilibrada, palma ventilada, grip bar integrado, pulgar unido, forro 4-way stretch y un puño extendido de agujetas. Se plantea como un objeto de entrenamiento serio en materialidad, no como algo vistoso.",
      ja: "公開されている VIS の構造には、トップグレインのカウハイド、均整の取れた構成、通気パーム、統合グリップバー、アタッチドサム、4-way ストレッチライニング、延長レースアップカフが含まれます。派手さよりも素材的な厳格さを持つ訓練用対象物として位置づけられています。",
      fr: "La construction publiée de VIS renvoie à un cuir bovin top-grain, une structure équilibrée, une paume ventilée, un grip bar intégré, un pouce attaché, une doublure extensible 4-way et une manchette allongée à laçage. L'objet est présenté comme un instrument d'entraînement discipliné, sérieux dans sa matière plutôt que démonstratif.",
    },
  },
  {
    topic: "Presentation and packaging",
    keywords: [
      "packaging",
      "presentation",
      "box",
      "dust bag",
      "authenticity",
      "care card",
      "wrapping",
      "presentacion",
      "caja",
      "包装",
      "presentation material",
      "boite",
    ],
    answers: {
      en: "The published presentation includes a rigid box, silk dust bag, silk wrapping paper, authenticity card, and care card. The packaging is part of the house presentation language, not an afterthought added around a generic product.",
      es: "La presentación publicada incluye caja rígida, dust bag de seda, papel de seda, tarjeta de autenticidad y tarjeta de cuidado. El empaque forma parte del lenguaje de presentación de la casa, no es un añadido tardío alrededor de un producto genérico.",
      ja: "公開されている提示内容には、剛性ボックス、シルクダストバッグ、シルクラッピング、真正性カード、ケアカードが含まれます。パッケージは一般的な製品の周辺要素ではなく、ハウスの提示言語そのものの一部です。",
      fr: "La présentation publiée comprend une boîte rigide, un dust bag en soie, du papier de soie, une carte d'authenticité et une carte d'entretien. L'emballage fait partie du langage de présentation de la maison, et non d'un ajout tardif autour d'un produit générique.",
    },
  },
  {
    topic: "Private acquisition access and payment flow",
    keywords: [
      "reference",
      "reference code",
      "token",
      "session",
      "payment chamber",
      "payment route",
      "stripe",
      "access code",
      "unlock",
      "codigo",
      "referencia",
      "トークン",
      "référence",
      "session privee",
    ],
    answers: {
      en: "A private acquisition session is issued with a unique URL token and a separate reference code. The client verifies the reference first, completes delivery details, and only then opens the payment chamber. After payment succeeds, the session is no longer reusable under normal flow.",
      es: "Una sesión privada de adquisición se emite con un token de URL único y un código de referencia aparte. El cliente primero verifica la referencia, completa los datos de entrega y solo entonces abre la cámara de pago. Tras un pago exitoso, la sesión deja de ser reutilizable en el flujo normal.",
      ja: "私的取得セッションは、一意の URL トークンと別個の参照コードで発行されます。顧客は最初に参照を確認し、配送情報を完了してから支払いチャンバーを開きます。支払いが成功すると、そのセッションは通常フローでは再利用できません。",
      fr: "Une session privée d'acquisition est émise avec un jeton d'URL unique et un code de référence séparé. Le client vérifie d'abord la référence, complète les détails de livraison, puis seulement ouvre la chambre de paiement. Une fois le paiement réussi, la session n'est plus réutilisable dans le flux normal.",
    },
  },
  {
    topic: "Waitlist and allocation posture",
    keywords: [
      "waitlist",
      "allocation",
      "availability",
      "limited",
      "rare",
      "collector",
      "future access",
      "lista de espera",
      "asignacion",
      "待機",
      "allocation privee",
    ],
    answers: {
      en: "The waitlist is positioned as a quieter register for future allocation, collector interest, and continued private access rather than a generic marketing list. Availability is handled more like placement under the house than open inventory noise.",
      es: "La waitlist se plantea como un registro más silencioso para futuras asignaciones, interés de coleccionistas y acceso privado continuo, no como una lista de marketing genérica. La disponibilidad se maneja más como colocación bajo la casa que como ruido de inventario abierto.",
      ja: "ウェイトリストは一般的なマーケティングリストではなく、将来の割当、コレクターの関心、継続する私的アクセスのための静かな登録として位置づけられています。可用性は公開在庫ではなく、ハウスによる配置として扱われます。",
      fr: "La waitlist est pensée comme un registre plus discret pour l'allocation future, l'intérêt de collection et l'accès privé continu, et non comme une liste marketing générique. La disponibilité est traitée davantage comme un placement sous la maison que comme un bruit d'inventaire ouvert.",
    },
  },
  {
    topic: "Inquiry and contact route",
    keywords: [
      "whatsapp",
      "contact",
      "inquiry",
      "mail",
      "email",
      "house",
      "care",
      "studio",
      "consulta",
      "correo",
      "連絡",
      "demande",
    ],
    answers: {
      en: "Praeliator uses direct correspondence rather than a public sales funnel. WhatsApp remains the fast route, while the written correspondence page keeps longer inquiries inside the site under house, care, or studio lines.",
      es: "Praeliator utiliza correspondencia directa en lugar de un embudo público de ventas. WhatsApp sigue siendo la vía rápida, mientras que la página de correspondencia escrita mantiene consultas más largas dentro del sitio bajo las líneas house, care o studio.",
      ja: "Praeliator は公開販売ファネルではなく、直接のやり取りを用います。WhatsApp が素早い導線であり、より長い書面での問い合わせはサイト内の house / care / studio ラインで扱われます。",
      fr: "Praeliator utilise une correspondance directe plutôt qu'un entonnoir public de vente. WhatsApp demeure la voie rapide, tandis que la page de correspondance écrite garde les demandes plus longues à l'intérieur du site sous les lignes house, care ou studio.",
    },
  },
  {
    topic: "Ownership continuity and aftercare",
    keywords: [
      "aftercare",
      "continuity",
      "retained",
      "ownership continuity",
      "service history",
      "retention",
      "custody",
      "after purchase",
      "continuidad",
      "custodia",
      "継続性",
      "continuite",
    ],
    answers: {
      en: "Praeliator is built so the relationship does not stop at sale and delivery. Registration, recorded age, service eligibility, and future review remain attached to the same object line, which is why ownership and aftercare are treated as part of the house rather than separate support behavior.",
      es: "Praeliator está construido para que la relación no termine en la venta y la entrega. El registro, la edad documentada, la elegibilidad de servicio y la revisión futura permanecen unidos a la misma línea de objeto, por eso propiedad y aftercare se tratan como parte de la casa y no como soporte separado.",
      ja: "Praeliator は販売と配送で関係が終わらないように構成されています。登録、記録された年齢、サービス適格性、将来の審査は同じ対象物ラインに結び付けられており、そのため所有とアフターケアは別個のサポート行為ではなくハウスの一部として扱われます。",
      fr: "Praeliator est construit pour que la relation ne s'arrête pas à la vente et à la livraison. L'enregistrement, l'ancienneté consignée, l'éligibilité de service et l'examen futur restent attachés à la même ligne d'objet, c'est pourquoi propriété et après-vente sont traités comme partie intégrante de la maison et non comme un support séparé.",
    },
  },
];

const localeNames: Record<IntakeLocale, string> = {
  en: "English",
  es: "Spanish",
  ja: "Japanese",
  fr: "French",
};

const brandDossier: Record<IntakeLocale, string> = {
  en: [
    "Praeliator is a private luxury boxing house.",
    "The public site frames boxing as an art form and the glove as a resolved object rather than ordinary equipment.",
    "The flagship published object is Praeliator VIS, a recorded training pair.",
    "Published VIS positioning includes top-grain cowhide leather, restrained construction, rigid presentation, and controlled aftercare.",
    "Private acquisition begins by direct correspondence, not by public cart or open ecommerce flow.",
    "Approved clients may receive a private acquisition session with unique access, reference verification, destination details, and on-site payment.",
    "The Ownership Record is the private client layer where registered pairs, recorded delivery age, and future service eligibility remain under one house line.",
    "Legacy Refresh is a selective post-purchase service route governed by the recorded delivery date and the pair's maturity.",
    "Praeliator keeps contact and access controlled through direct correspondence, WhatsApp, written inquiry, ownership access, and issued private routes.",
    "The tone should remain restrained, exact, calm, serious, and premium rather than loud, sporty, or mass-market.",
  ].join(" "),
  es: [
    "Praeliator es una casa privada de lujo dedicada al boxeo.",
    "El sitio público plantea el boxeo como una forma de arte y al guante como un objeto resuelto, no como equipo ordinario.",
    "El objeto insignia publicado es Praeliator VIS, un par de entrenamiento registrado.",
    "La posición publicada de VIS incluye cuero vacuno top-grain, construcción contenida, presentación rígida y aftercare controlado.",
    "La adquisición privada comienza por correspondencia directa, no por carrito público ni ecommerce abierto.",
    "Los clientes aprobados pueden recibir una sesión privada de adquisición con acceso único, verificación de referencia, datos de destino y pago dentro del sitio.",
    "El Registro de Propiedad es la capa privada donde los pares registrados, la edad de entrega documentada y la elegibilidad futura de servicio permanecen bajo una misma línea de casa.",
    "Legacy Refresh es una ruta selectiva de servicio posterior a la compra gobernada por la fecha de entrega registrada y la madurez del par.",
    "Praeliator mantiene contacto y acceso controlados mediante correspondencia directa, WhatsApp, consulta escrita, acceso de propiedad y rutas privadas emitidas.",
    "El tono debe mantenerse sobrio, exacto, calmo, serio y premium, no ruidoso, deportivo ni masivo.",
  ].join(" "),
  ja: [
    "Praeliator は私的なラグジュアリー・ボクシングハウスです。",
    "公開サイトはボクシングを芸術形式として、グローブを通常の用具ではなく解決された対象物として提示します。",
    "公開されている旗艦対象物は Praeliator VIS で、記録されたトレーニングペアです。",
    "VIS の公開ポジションには、トップグレインのカウハイド、抑制された構造、剛性のある提示、管理されたアフターケアが含まれます。",
    "私的取得は公開カートや一般的な eコマースではなく、直接のやり取りから始まります。",
    "承認された顧客には、一意のアクセス、参照確認、配送先情報、サイト内支払いを備えた私的取得セッションが発行される場合があります。",
    "Ownership Record は、登録されたペア、記録された配送年齢、将来のサービス適格性が同じハウスラインの下に保たれる私的クライアント層です。",
    "Legacy Refresh は、記録された配送日とペアの成熟度によって開かれる選択的な購入後サービスルートです。",
    "Praeliator は直接のやり取り、WhatsApp、書面での問い合わせ、所有者アクセス、発行された私的ルートによって接触とアクセスを管理します。",
    "トーンは大衆的で騒がしいものではなく、抑制され、正確で、静かで、上質であるべきです。",
  ].join(" "),
  fr: [
    "Praeliator est une maison privée de luxe consacrée à la boxe.",
    "Le site public présente la boxe comme une forme d'art et le gant comme un objet résolu plutôt que comme un équipement ordinaire.",
    "L'objet phare publié est Praeliator VIS, une paire d'entraînement enregistrée.",
    "Le positionnement publié de VIS comprend cuir bovin top-grain, construction retenue, présentation rigide et après-vente contrôlé.",
    "L'acquisition privée commence par correspondance directe, et non par panier public ni ecommerce ouvert.",
    "Les clients approuvés peuvent recevoir une session privée d'acquisition avec accès unique, vérification de référence, détails de destination et paiement sur le site.",
    "L'Ownership Record est la couche privée où les paires enregistrées, l'ancienneté de livraison consignée et l'éligibilité future de service demeurent sous une même ligne de maison.",
    "Legacy Refresh est une voie sélective de service après achat gouvernée par la date de livraison consignée et la maturité de la paire.",
    "Praeliator garde le contact et l'accès sous contrôle grâce à la correspondance directe, WhatsApp, la demande écrite, l'accès de propriété et les voies privées émises.",
    "Le ton doit rester retenu, exact, calme, sérieux et premium plutôt que bruyant, sportif ou grand public.",
  ].join(" "),
};

const unknownAnswer: Record<IntakeLocale, string> = {
  en: "I can answer the published route around acquisition, VIS specifications, payment access, ownership, Legacy Refresh, delivery, and privacy. If you ask within one of those lines, I can answer directly here.",
  es: "Puedo responder sobre la ruta publicada de adquisición, especificaciones de VIS, acceso al pago, propiedad, Legacy Refresh, entrega y privacidad. Si preguntas dentro de una de esas líneas, puedo responder aquí mismo.",
  ja: "取得ルート、VIS の仕様、支払いアクセス、所有記録、Legacy Refresh、配送、プライバシーに関する公開情報にはここで回答できます。これらの範囲で尋ねていただければ、ここで直接お答えします。",
  fr: "Je peux répondre ici sur la voie publiée d'acquisition, les spécifications de VIS, l'accès au paiement, la propriété, Legacy Refresh, la livraison et la confidentialité. Si la question reste dans l'une de ces lignes, je peux répondre directement.",
};

function normalizeLocale(value?: string): IntakeLocale {
  return value === "es" || value === "ja" || value === "fr" ? value : "en";
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function tokenize(value: string) {
  return normalizeText(value)
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function getFallbackAnswer(question: string, locale: IntakeLocale) {
  const normalizedQuestion = normalizeText(question);
  const haystack = tokenize(question);
  const scoredMatches: Array<{ entry: FaqKnowledgeEntry; score: number }> = [];

  for (const entry of faqKnowledge) {
    const score = entry.keywords.reduce((total, keyword) => {
      const normalizedKeyword = normalizeText(keyword).trim();
      if (!normalizedKeyword) return total;

      const keywordTokens = normalizedKeyword.split(/\s+/).filter(Boolean);
      const matchedTokens = keywordTokens.filter((token) => haystack.includes(token)).length;
      const phraseMatch = normalizedQuestion.includes(normalizedKeyword);

      let nextTotal = total;
      if (phraseMatch) {
        nextTotal += normalizedKeyword.includes(" ") ? 4 : 2;
      }
      if (matchedTokens > 0) {
        nextTotal += matchedTokens === keywordTokens.length ? 2 : matchedTokens * 0.75;
      }
      return nextTotal;
    }, 0);
    if (score > 0) {
      scoredMatches.push({ entry, score });
    }
  }

  if (!scoredMatches.length) {
    return unknownAnswer[locale];
  }

  const topMatches = scoredMatches
    .sort((left, right) => right.score - left.score)
    .slice(0, 2)
    .map(({ entry }) => entry.answers[locale]);

  return Array.from(new Set(topMatches)).join(" ");
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function extractOutputText(payload: any) {
  if (typeof payload?.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const output = Array.isArray(payload?.output) ? payload.output : [];
  const contentText = output
    .flatMap((item: any) => (Array.isArray(item?.content) ? item.content : []))
    .map((part: any) => part?.text)
    .find((value: unknown) => typeof value === "string" && value.trim());

  return typeof contentText === "string" ? contentText.trim() : "";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { question?: string; locale?: string };
    const question = (body.question || "").trim();
    const locale = normalizeLocale(body.locale);

    if (question.length < 6) {
      return jsonResponse(
        { success: false, error: "Please enter a fuller question." },
        400,
      );
    }

    const fallbackAnswer = getFallbackAnswer(question, locale);
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return jsonResponse({
        success: true,
        answer: fallbackAnswer,
        mode: "curated",
      });
    }

    const context = faqKnowledge
      .map((entry, index) => {
        const answer = entry.answers[locale];
        return `${index + 1}. ${entry.topic}: ${answer}`;
      })
      .join("\n");

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_FAQ_MODEL || "gpt-4.1-mini",
        store: false,
        instructions:
          `You are the Praeliator house FAQ reply. Answer in ${localeNames[locale]}. ` +
          "Keep the tone restrained, exact, calm, and premium. Keep answers under 140 words. " +
          "Answer from the provided Praeliator house guidance first. If the question is adjacent to the published guidance, answer helpfully by stating what is known from the published route and where the public record stops. " +
          "For questions about identity, quality, positioning, luxury, tone, object philosophy, craftsmanship, acquisition, ownership, service, delivery, privacy, or contact, answer directly from the dossier. " +
          "Do not invent inventory counts, hidden policies, unpublished lead times, custom promises, or legal guarantees. " +
          "Do not mention AI, training data, or internal tooling.",
        input:
          `Question: ${question}\n\n` +
          `Praeliator house dossier:\n${brandDossier[locale]}\n\n` +
          `Praeliator house guidance:\n${context}\n\n` +
          `Fallback house answer:\n${fallbackAnswer}`,
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      return jsonResponse({
        success: true,
        answer: fallbackAnswer,
        mode: "curated",
      });
    }

    const payload = await response.json();
    const answer = extractOutputText(payload) || fallbackAnswer;

    return jsonResponse({
      success: true,
      answer,
      mode: answer === fallbackAnswer ? "curated" : "ai",
    });
  } catch {
    return jsonResponse({
      success: true,
      answer: unknownAnswer.en,
      mode: "curated",
    });
  }
}
