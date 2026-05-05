type IntakeLocale = "en" | "es" | "ja" | "fr";

type FaqKnowledgeEntry = {
  keywords: string[];
  answers: Record<IntakeLocale, string>;
};

const faqKnowledge: FaqKnowledgeEntry[] = [
  {
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
];

const localeNames: Record<IntakeLocale, string> = {
  en: "English",
  es: "Spanish",
  ja: "Japanese",
  fr: "French",
};

const unknownAnswer: Record<IntakeLocale, string> = {
  en: "That detail is not published publicly in the current house record. For anything beyond the published route, begin a private inquiry and the house can continue directly.",
  es: "Ese detalle no está publicado públicamente en el registro actual de la casa. Para cualquier punto fuera de la ruta publicada, inicia una consulta privada y la casa puede continuar directamente.",
  ja: "その詳細は現在の公開ハウス記録には含まれていません。公開されている範囲を超える事項については、私的な問い合わせから続行してください。",
  fr: "Ce détail n'est pas publié publiquement dans le registre actuel de la maison. Pour tout point au-delà de la voie publiée, commencez une demande privée et la maison pourra poursuivre directement.",
};

function normalizeLocale(value?: string): IntakeLocale {
  return value === "es" || value === "ja" || value === "fr" ? value : "en";
}

function tokenize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function getFallbackAnswer(question: string, locale: IntakeLocale) {
  const haystack = tokenize(question);
  let bestMatch: FaqKnowledgeEntry | null = null;
  let bestScore = 0;

  for (const entry of faqKnowledge) {
    const score = entry.keywords.reduce(
      (total, keyword) => total + (haystack.includes(keyword.toLowerCase()) ? 1 : 0),
      0,
    );
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  return bestMatch && bestScore > 0
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
        return `${index + 1}. ${answer}`;
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
          `You are the Praeliator FAQ answer layer. Answer in ${localeNames[locale]}. ` +
          "Use only the provided Praeliator house guidance. Keep the tone restrained, exact, and private. " +
          "Keep answers under 120 words. If the answer is not supported by the provided context, say that the detail is not published publicly and direct the user to private inquiry. Do not invent availability, shipping promises, lead times, or policies.",
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
