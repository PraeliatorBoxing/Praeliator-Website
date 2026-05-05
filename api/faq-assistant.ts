type IntakeLocale = "en" | "es" | "ja" | "fr";

type FaqKnowledgeEntry = {
  topic: string;
  keywords: string[];
  answers: Record<IntakeLocale, string>;
};

const faqKnowledge: FaqKnowledgeEntry[] = [
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
];

const localeNames: Record<IntakeLocale, string> = {
  en: "English",
  es: "Spanish",
  ja: "Japanese",
  fr: "French",
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
  let bestMatch: FaqKnowledgeEntry | null = null;
  let bestScore = 0;

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

    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  return bestMatch && bestScore >= 2
    ? bestMatch.answers[locale]
    : unknownAnswer[locale];
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
        const answer = entry.answers.en;
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
          "Do not invent inventory counts, hidden policies, unpublished lead times, custom promises, or legal guarantees. " +
          "Do not mention AI, training data, or internal tooling.",
        input:
          `Question: ${question}\n\n` +
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
