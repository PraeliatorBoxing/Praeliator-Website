import React, { useMemo, useState } from "react";
import { Button } from "./ui/button";
import type { SiteLocale } from "../lib/site-locale";

type FaqItem = {
  question: string;
  answer: string;
};

const utilityPageCopy: Record<
  SiteLocale,
  {
    faq: {
      eyebrow: string;
      title: string;
      intro: string;
      curatedLabel: string;
      indexLabel: string;
      aiEyebrow: string;
      aiTitle: string;
      aiIntro: string;
      suggestionsLabel: string;
      suggestionPrompts: string[];
      questionPlaceholder: string;
      askLabel: string;
      askingLabel: string;
      aiModeLabel: string;
      fallbackModeLabel: string;
      emptyAnswer: string;
      unavailable: string;
      items: FaqItem[];
    };
    privacy: {
      eyebrow: string;
      title: string;
      intro: string;
      plainLead: string;
      sections: Array<{ heading: string; paragraphs: string[] }>;
    };
    returnLabel: string;
    inquiryLabel: string;
  }
> = {
  en: {
    faq: {
      eyebrow: "Practical record",
      title: "The practical record.",
      intro:
        "Acquisition, ownership, service, and private process are held here so the main site may remain spare.",
      curatedLabel: "House answer",
      indexLabel: "Question index",
      aiEyebrow: "Question line",
      aiTitle: "Ask the house directly.",
      aiIntro:
        "Use the question field for anything practical. Answers remain short, restrained, and tied to the published Praeliator record.",
      suggestionsLabel: "Suggested prompts",
      suggestionPrompts: [
        "How does private acquisition begin?",
        "Can I buy VIS through a public checkout?",
        "When does Legacy Refresh become available?",
        "What is Personal Monogram?",
        "What is Private Commission?",
      ],
      questionPlaceholder: "Ask a practical question about acquisition, ownership, or service.",
      askLabel: "Ask the house",
      askingLabel: "Preparing answer...",
      aiModeLabel: "House reply",
      fallbackModeLabel: "Filed answer",
      emptyAnswer:
        "The answer layer is ready. Ask a question about acquisition, ownership, or service.",
      unavailable:
        "The answer layer could not complete the response. The curated answers remain available below.",
      items: [
        {
          question: "How does acquisition begin?",
          answer:
            "Acquisition begins by direct correspondence. The first inquiry is reviewed before any private allocation or payment chamber is issued.",
        },
        {
          question: "Is Praeliator VIS publicly available for instant purchase?",
          answer:
            "No. VIS is not offered through a public cart. Approved clients may receive a private acquisition session prepared specifically for their line.",
        },
        {
          question: "What is the Ownership Record?",
          answer:
            "The Ownership Record is the private client layer where registered pairs, recorded delivery age, and future service eligibility remain under one house line.",
        },
        {
          question: "What is Legacy Refresh?",
          answer:
            "Legacy Refresh is a private post-purchase service ritual. It becomes available according to the pair's recorded maturity rather than the registration date alone.",
        },
        {
          question: "How are delivery details handled?",
          answer:
            "Delivery details are collected only after private access is verified and before payment is opened, so the route remains controlled from inquiry through fulfillment.",
        },
        {
          question: "What is Personal Monogram?",
          answer:
            "Personal Monogram is a controlled initials service: small, tonal, debossed, and limited to approved placements. It marks the set for the owner without turning the glove into open customization.",
        },
        {
          question: "What is Private Commission?",
          answer:
            "Private Commission is the higher private tier for approved special work. It is quoted individually, reviewed by the house, and kept inside Praeliator's design language rather than opened as an unlimited customization menu.",
        },
      ],
    },
    privacy: {
      eyebrow: "Privacy notice",
      title: "Data handling, plainly stated.",
      intro:
        "Only the information required for inquiry, acquisition, ownership, and aftercare is retained.",
      plainLead:
        "In plain terms: if you enter your name, email, phone, destination, inquiry details, ownership details, or service notes, that information is retained only because Praeliator needs it to review correspondence, prepare delivery, preserve the ownership line, or continue service.",
      sections: [
        {
          heading: "Information retained",
          paragraphs: [
            "Praeliator may retain name, email, phone, destination details, inquiry content, ownership registration data, and service history when forms, account access, pair registration, or private acquisition routes are used.",
            "Payment card information is not stored directly by Praeliator. Payment is handled through Stripe.",
          ],
        },
        {
          heading: "Purpose of use",
          paragraphs: [
            "The information is used to review inquiries, issue or deny private acquisition access, prepare delivery, maintain ownership continuity, confirm eligibility, and continue aftercare.",
            "The information is not collected for public ecommerce, newsletter volume, or generic mass marketing behavior.",
          ],
        },
        {
          heading: "Service providers",
          paragraphs: [
            "Praeliator uses Supabase for authentication and database infrastructure, Stripe for payment processing, WhatsApp when direct correspondence is chosen, and analytics tools when they are configured in production.",
          ],
        },
        {
          heading: "Analytics and tracking",
          paragraphs: [
            "When production tracking is enabled, the site may use Google Analytics and Meta Pixel to understand technical performance and inquiry behavior. This is used to measure site quality and route performance, not to turn the site into an advertising funnel.",
          ],
        },
        {
          heading: "Questions and requests",
          paragraphs: [
            "Questions about privacy or data handling can be sent through the published contact route on the site. If a correction or deletion request is appropriate, the house can review it through that same route.",
          ],
        },
      ],
    },
    returnLabel: "Return",
    inquiryLabel: "Private Inquiry",
  },
  es: {
    faq: {
      eyebrow: "Registro práctico",
      title: "Las preguntas deben resolverse con el mismo control que el objeto.",
      intro:
        "Esta página reúne la parte práctica de la adquisición, la propiedad, el servicio y el proceso privado para que el sitio principal permanezca sobrio.",
      curatedLabel: "Respuesta de la casa",
      indexLabel: "Índice de preguntas",
      aiEyebrow: "Línea de preguntas",
      aiTitle: "Pregunta directo a la casa.",
      aiIntro:
        "Usa el campo para cualquier duda práctica. La respuesta se mantiene breve, sobria y unida al registro publicado de Praeliator.",
      suggestionsLabel: "Preguntas sugeridas",
      suggestionPrompts: [
        "¿Cómo comienza la adquisición privada?",
        "¿Se puede comprar VIS desde un checkout público?",
        "¿Cuándo se abre Legacy Refresh?",
      ],
      questionPlaceholder: "Haz una pregunta práctica sobre adquisición, propiedad o servicio.",
      askLabel: "Preguntar a la casa",
      askingLabel: "Preparando respuesta...",
      aiModeLabel: "Respuesta de la casa",
      fallbackModeLabel: "Respuesta archivada",
      emptyAnswer:
        "La capa de respuesta está lista. Haz una pregunta sobre adquisición, propiedad o servicio.",
      unavailable:
        "La capa de respuesta no pudo completar la respuesta. Las respuestas curadas siguen disponibles abajo.",
      items: [
        {
          question: "¿Cómo comienza la adquisición?",
          answer:
            "La adquisición comienza por correspondencia directa. La primera consulta se revisa antes de emitir cualquier asignación privada o cámara de pago.",
        },
        {
          question: "¿Praeliator VIS está disponible para compra pública inmediata?",
          answer:
            "No. VIS no se ofrece mediante un carrito público. Los clientes aprobados pueden recibir una sesión privada de adquisición preparada para su propia línea.",
        },
        {
          question: "¿Qué es el Registro de Propiedad?",
          answer:
            "El Registro de Propiedad es la capa privada donde los pares registrados, la edad de entrega registrada y la elegibilidad futura de servicio permanecen bajo una misma línea de casa.",
        },
        {
          question: "¿Qué es Legacy Refresh?",
          answer:
            "Legacy Refresh es un ritual privado de servicio posterior a la compra. Se abre según la madurez registrada del par y no solo por la fecha de registro.",
        },
        {
          question: "¿Cómo se manejan los datos de entrega?",
          answer:
            "Los datos de entrega se solicitan solo después de verificar el acceso privado y antes de abrir el pago, para que la ruta siga controlada desde la consulta hasta el cumplimiento.",
        },
      ],
    },
    privacy: {
      eyebrow: "Aviso de privacidad",
      title: "El manejo de datos debe leerse con claridad y sin ambigüedad.",
      intro:
        "El sitio recopila solo la información necesaria para revisar consultas, emitir acceso privado de adquisición, mantener registros de propiedad y continuar el aftercare.",
      plainLead:
        "En términos simples: si dejas tu nombre, correo, teléfono, destino, detalles de consulta, datos de propiedad o notas de servicio, esa información se retiene únicamente porque Praeliator la necesita para revisar correspondencia, preparar entrega, preservar la línea de propiedad o continuar servicio.",
      sections: [
        {
          heading: "Información retenida",
          paragraphs: [
            "Praeliator puede retener nombre, correo, teléfono, datos de destino, contenido de consulta, registro de propiedad e historial de servicio cuando se utilizan formularios, acceso de cuenta, registro de par o rutas privadas de adquisición.",
            "La información de tarjeta no se almacena directamente por Praeliator. El pago se procesa mediante Stripe.",
          ],
        },
        {
          heading: "Finalidad de uso",
          paragraphs: [
            "La información se utiliza para revisar consultas, otorgar o negar acceso privado de adquisición, preparar entrega, mantener continuidad de propiedad, confirmar elegibilidad y continuar aftercare.",
            "No se recopila para ecommerce público, volumen de newsletter ni comportamiento de marketing masivo genérico.",
          ],
        },
        {
          heading: "Proveedores de servicio",
          paragraphs: [
            "Praeliator utiliza Supabase para autenticación e infraestructura de base de datos, Stripe para pagos, WhatsApp cuando se elige correspondencia directa y herramientas analíticas cuando están activadas en producción.",
          ],
        },
        {
          heading: "Analítica y seguimiento",
          paragraphs: [
            "Cuando el tracking de producción está activo, el sitio puede usar Google Analytics y Meta Pixel para entender desempeño técnico y comportamiento de consulta. Se usa para medir calidad del sitio y rendimiento de la ruta, no para volver el sitio un embudo publicitario.",
          ],
        },
        {
          heading: "Preguntas y solicitudes",
          paragraphs: [
            "Las preguntas sobre privacidad o manejo de datos pueden enviarse mediante la ruta de contacto publicada en el sitio. Si corresponde una solicitud de corrección o eliminación, la casa puede revisarla por esa misma vía.",
          ],
        },
      ],
    },
    returnLabel: "Volver",
    inquiryLabel: "Consulta privada",
  },
  ja: {
    faq: {
      eyebrow: "実務記録",
      title: "質問も、対象物と同じ統制の下で扱われるべきです。",
      intro:
        "このページでは、取得、所有、サービス、私的な手続きに関する実務情報だけをまとめ、メインサイトの静けさを保ちます。",
      curatedLabel: "ハウス回答",
      indexLabel: "質問一覧",
      aiEyebrow: "質問の導線",
      aiTitle: "直接、ハウスへ尋ねてください。",
      aiIntro:
        "実務上の質問をここに入力してください。回答は短く、抑制され、Praeliator が公開している記録に基づいて返されます。",
      suggestionsLabel: "提案された質問",
      suggestionPrompts: [
        "プライベート取得はどのように始まりますか。",
        "VIS は公開チェックアウトで購入できますか。",
        "Legacy Refresh はいつ開きますか。",
      ],
      questionPlaceholder: "取得、所有、サービスに関する実務的な質問を入力してください。",
      askLabel: "ハウスへ尋ねる",
      askingLabel: "回答を準備しています...",
      aiModeLabel: "ハウス回答",
      fallbackModeLabel: "既定記録",
      emptyAnswer:
        "回答レイヤーの準備ができています。取得、所有、またはサービスについて質問してください。",
      unavailable:
        "回答レイヤーは応答を完了できませんでした。下の既定回答は引き続き利用できます。",
      items: [
        {
          question: "取得はどのように始まりますか。",
          answer:
            "取得は直接のやり取りから始まります。最初の問い合わせが確認されるまで、私的な割当や支払い導線は発行されません。",
        },
        {
          question: "Praeliator VIS は公開購入できますか。",
          answer:
            "できません。VIS は公開カート商品ではありません。承認された顧客にのみ、専用の私的取得セッションが用意されます。",
        },
        {
          question: "Ownership Record とは何ですか。",
          answer:
            "Ownership Record は、登録されたペア、記録された到着年齢、将来のサービス適格性を同じハウスの系統下に保持する私的な記録層です。",
        },
        {
          question: "Legacy Refresh とは何ですか。",
          answer:
            "Legacy Refresh は購入後の私的なサービス儀式です。登録日ではなく、記録された成熟度に応じて開きます。",
        },
        {
          question: "配送情報はどのように扱われますか。",
          answer:
            "配送情報は私的アクセスの確認後、支払い開始前にのみ収集されるため、問い合わせから履行までの導線は統制されたまま保たれます。",
        },
      ],
    },
    privacy: {
      eyebrow: "プライバシー通知",
      title: "データの扱いは、曖昧さなく平明に読めるべきです。",
      intro:
        "このサイトは、問い合わせ確認、私的取得アクセスの発行、所有記録の維持、アフターケア継続に必要な情報だけを扱います。",
      plainLead:
        "平明に言えば、氏名、メール、電話、配送先、問い合わせ内容、所有情報、サービスメモを入力した場合、その情報は対応審査、配送準備、所有ライン維持、または継続サービスのためにだけ保持されます。",
      sections: [
        {
          heading: "保持される情報",
          paragraphs: [
            "フォーム、アカウントアクセス、ペア登録、私的取得ルートの利用時に、氏名、メール、電話、配送先、問い合わせ内容、所有登録情報、サービス履歴が保持されることがあります。",
            "カード情報は Praeliator が直接保存しません。決済は Stripe が処理します。",
          ],
        },
        {
          heading: "利用目的",
          paragraphs: [
            "情報は、問い合わせ審査、私的取得アクセスの発行または拒否、配送準備、所有継続性の維持、適格性確認、アフターケア継続のために使われます。",
            "公開 EC、ニュースレター大量配信、一般的な大量マーケティングのために集められるものではありません。",
          ],
        },
        {
          heading: "利用される外部サービス",
          paragraphs: [
            "Praeliator は認証とデータベース基盤に Supabase、決済に Stripe、直接連絡に WhatsApp、本番で設定されている場合は分析ツールを使用します。",
          ],
        },
        {
          heading: "解析と計測",
          paragraphs: [
            "本番追跡が有効な場合、Google Analytics と Meta Pixel がサイト性能と問い合わせ導線の技術的な把握のために利用されることがあります。これは広告ファネル化のためではありません。",
          ],
        },
        {
          heading: "質問と依頼",
          paragraphs: [
            "プライバシーやデータ取扱いに関する質問は、サイト上の公開された連絡ルートから送ることができます。訂正や削除依頼が妥当な場合も、同じルートで審査されます。",
          ],
        },
      ],
    },
    returnLabel: "戻る",
    inquiryLabel: "Private Inquiry",
  },
  fr: {
    faq: {
      eyebrow: "Registre pratique",
      title: "Les questions doivent être traitées avec le même contrôle que l'objet.",
      intro:
        "Cette page rassemble la partie pratique de l'acquisition, de la propriété, du service et du processus privé afin que le site principal demeure retenu.",
      curatedLabel: "Réponse de la maison",
      indexLabel: "Index des questions",
      aiEyebrow: "Ligne de questions",
      aiTitle: "Posez la question directement à la maison.",
      aiIntro:
        "Utilisez ce champ pour toute question pratique. La réponse demeure brève, retenue et liée au registre publié de Praeliator.",
      suggestionsLabel: "Prompts suggérés",
      suggestionPrompts: [
        "Comment l'acquisition privée commence-t-elle ?",
        "VIS peut-il être acheté via un checkout public ?",
        "Quand Legacy Refresh devient-il disponible ?",
      ],
      questionPlaceholder: "Posez une question pratique sur l'acquisition, la propriété ou le service.",
      askLabel: "Interroger la maison",
      askingLabel: "Préparation de la réponse...",
      aiModeLabel: "Réponse de la maison",
      fallbackModeLabel: "Réponse archivée",
      emptyAnswer:
        "La couche de réponse est prête. Posez une question sur l'acquisition, la propriété ou le service.",
      unavailable:
        "La couche de réponse n'a pas pu compléter la réponse. Les réponses éditées restent disponibles ci-dessous.",
      items: [
        {
          question: "Comment l'acquisition commence-t-elle ?",
          answer:
            "L'acquisition commence par une correspondance directe. La première demande est examinée avant qu'une allocation privée ou qu'une chambre de paiement ne soit émise.",
        },
        {
          question: "Praeliator VIS est-il disponible en achat public immédiat ?",
          answer:
            "Non. VIS n'est pas proposé par panier public. Les clients approuvés peuvent recevoir une session d'acquisition privée préparée pour leur propre ligne.",
        },
        {
          question: "Qu'est-ce que l'Ownership Record ?",
          answer:
            "L'Ownership Record est la couche privée où les paires enregistrées, l'ancienneté de livraison enregistrée et l'éligibilité future de service restent sous une même ligne de maison.",
        },
        {
          question: "Qu'est-ce que Legacy Refresh ?",
          answer:
            "Legacy Refresh est un rituel de service privé après achat. Il s'ouvre selon la maturité enregistrée de la paire et non selon la seule date d'enregistrement.",
        },
        {
          question: "Comment les détails de livraison sont-ils traités ?",
          answer:
            "Les détails de livraison ne sont recueillis qu'après vérification de l'accès privé et avant l'ouverture du paiement, afin que la voie demeure contrôlée de la demande jusqu'à l'accomplissement.",
        },
      ],
    },
    privacy: {
      eyebrow: "Notice de confidentialité",
      title: "Le traitement des données doit se lire clairement, sans ambiguïté.",
      intro:
        "Le site ne recueille que les informations nécessaires pour examiner les demandes, émettre l'accès privé d'acquisition, maintenir les registres de propriété et poursuivre l'après-vente.",
      plainLead:
        "En termes simples : si vous laissez votre nom, email, téléphone, destination, détails de demande, données de propriété ou notes de service, ces informations ne sont retenues que parce que Praeliator en a besoin pour examiner la correspondance, préparer la livraison, préserver la ligne de propriété ou poursuivre le service.",
      sections: [
        {
          heading: "Informations retenues",
          paragraphs: [
            "Praeliator peut retenir nom, email, téléphone, destination, contenu de demande, données d'enregistrement de propriété et historique de service lors de l'utilisation des formulaires, de l'accès au compte, de l'enregistrement d'une paire ou des voies privées d'acquisition.",
            "Les informations de carte ne sont pas stockées directement par Praeliator. Le paiement est traité par Stripe.",
          ],
        },
        {
          heading: "Finalité d'usage",
          paragraphs: [
            "Les informations servent à examiner les demandes, accorder ou refuser l'accès privé d'acquisition, préparer la livraison, maintenir la continuité de propriété, confirmer l'éligibilité et poursuivre l'après-vente.",
            "Elles ne sont pas recueillies pour de l'ecommerce public, du volume de newsletter ou un comportement générique de marketing de masse.",
          ],
        },
        {
          heading: "Prestataires utilisés",
          paragraphs: [
            "Praeliator utilise Supabase pour l'authentification et la base de données, Stripe pour le paiement, WhatsApp pour la correspondance directe lorsqu'elle est choisie, et des outils analytiques lorsqu'ils sont activés en production.",
          ],
        },
        {
          heading: "Mesure et suivi",
          paragraphs: [
            "Lorsque le suivi de production est actif, le site peut utiliser Google Analytics et Meta Pixel afin de comprendre la performance technique et le comportement des demandes. Cela sert à mesurer la qualité du site et la performance de la voie, non à transformer le site en entonnoir publicitaire.",
          ],
        },
        {
          heading: "Questions et demandes",
          paragraphs: [
            "Les questions relatives à la confidentialité ou au traitement des données peuvent être envoyées par la voie de contact publiée sur le site. Une demande de correction ou de suppression, lorsqu'elle est appropriée, peut être examinée par cette même voie.",
          ],
        },
      ],
    },
    returnLabel: "Retour",
    inquiryLabel: "Demande privée",
  },
};

const faqDirectLineCopy: Record<
  SiteLocale,
  {
    eyebrow: string;
    title: string;
    intro: string;
    suggestionsLabel: string;
    suggestionPrompts: string[];
    questionPlaceholder: string;
    askLabel: string;
    askingLabel: string;
    emptyAnswer: string;
    unavailable: string;
  }
> = {
  en: {
    eyebrow: "Direct question",
    title: "Continue here.",
    intro:
      "For anything practical within the published record, continue here. Replies remain brief, exact, and tied to the house record.",
    suggestionsLabel: "Published lines",
    suggestionPrompts: [
      "How does private acquisition begin?",
      "Can I buy VIS through a public checkout?",
      "When does Legacy Refresh become available?",
      "What is Personal Monogram?",
      "What is Private Commission?",
    ],
    questionPlaceholder:
      "Write a practical question about acquisition, ownership, or service.",
    askLabel: "Send question",
    askingLabel: "Reviewing line...",
    emptyAnswer:
      "Write a practical question about acquisition, ownership, or service.",
    unavailable:
      "A direct reply could not be returned just now. The published record remains available above.",
  },
  es: {
    eyebrow: "Pregunta directa",
    title: "Continúa la pregunta aquí.",
    intro:
      "Para cualquier punto práctico dentro del registro publicado, continúa aquí. La respuesta se mantiene breve, exacta y unida al registro de la casa.",
    suggestionsLabel: "Rutas publicadas",
    suggestionPrompts: [
      "¿Cómo comienza la adquisición privada?",
      "¿Se puede comprar VIS desde un checkout público?",
      "¿Cuándo se abre Legacy Refresh?",
    ],
    questionPlaceholder:
      "Escribe una pregunta práctica sobre adquisición, propiedad o servicio.",
    askLabel: "Solicitar respuesta",
    askingLabel: "Revisando pregunta...",
    emptyAnswer:
      "Escribe una pregunta práctica sobre adquisición, propiedad o servicio.",
    unavailable:
      "No fue posible devolver una respuesta directa en este momento. El registro publicado sigue disponible arriba.",
  },
  ja: {
    eyebrow: "直接の質問",
    title: "この場で続けてください。",
    intro:
      "公開されている記録の範囲にある実務上の質問であれば、ここで続けられます。返答は短く、正確で、ハウス記録に沿ったものに保たれます。",
    suggestionsLabel: "公開済みの主題",
    suggestionPrompts: [
      "私的取得はどのように始まりますか。",
      "VIS は公開チェックアウトで購入できますか。",
      "Legacy Refresh はいつ開きますか。",
    ],
    questionPlaceholder:
      "取得、所有、またはサービスに関する実務上の質問を書いてください。",
    askLabel: "返答を求める",
    askingLabel: "質問を確認しています...",
    emptyAnswer:
      "取得、所有、またはサービスに関する実務上の質問を書いてください。",
    unavailable:
      "ただいま直接の返答を返せませんでした。公開されている記録は上で引き続き確認できます。",
  },
  fr: {
    eyebrow: "Question directe",
    title: "Poursuivez la question ici.",
    intro:
      "Pour toute question pratique qui relève du registre publié, poursuivez ici. La réponse demeure brève, exacte et tenue à la ligne de la maison.",
    suggestionsLabel: "Lignes publiées",
    suggestionPrompts: [
      "Comment l'acquisition privée commence-t-elle ?",
      "VIS peut-il être acheté via un checkout public ?",
      "Quand Legacy Refresh devient-il disponible ?",
    ],
    questionPlaceholder:
      "Écrivez une question pratique sur l'acquisition, la propriété ou le service.",
    askLabel: "Demander une réponse",
    askingLabel: "Examen de la question...",
    emptyAnswer:
      "Écrivez une question pratique sur l'acquisition, la propriété ou le service.",
    unavailable:
      "Une réponse directe ne peut pas être retournée pour l'instant. Le registre publié demeure disponible plus haut.",
  },
};

function UtilityPageFrame({
  eyebrow,
  title,
  intro,
  children,
  onReturnHome,
  inquiryHref,
  returnLabel,
  inquiryLabel,
}: React.PropsWithChildren<{
  eyebrow: string;
  title: string;
  intro: string;
  onReturnHome: () => void;
  inquiryHref: string;
  returnLabel: string;
  inquiryLabel: string;
}>) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#080808_0%,#040404_100%)] pb-20 pt-28 sm:pb-24 sm:pt-32">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(198,157,118,0.05),transparent_28%)]"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto w-full max-w-[112rem] px-5 sm:px-7 lg:px-10">
        <div className="border-t border-white/[0.08] pt-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onReturnHome}
              className="self-start rounded-full border-white/14 bg-transparent px-5 py-3 text-[11px] uppercase tracking-[0.24em] text-white/78 transition duration-500 hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
            >
              {returnLabel}
            </Button>
            <a
              href={inquiryHref}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] uppercase tracking-[0.28em] text-white/58 transition duration-500 hover:text-white"
            >
              {inquiryLabel}
            </a>
          </div>

          <div className="mt-8 grid gap-14 border-t border-white/[0.08] pt-10 lg:grid-cols-[0.58fr_1.42fr] lg:gap-12 lg:pt-12">
            <div className="lg:pr-8">
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#c7a97e]">
                {eyebrow}
              </p>
              <h1 className="mt-5 max-w-[9ch] text-[clamp(2.8rem,5vw,5.1rem)] font-semibold leading-[0.86] tracking-[-0.06em] text-[#f3e8d8]">
                {title}
              </h1>
              <p className="mt-6 max-w-[32rem] text-sm leading-8 text-white/56 sm:text-base">
                {intro}
              </p>
            </div>
            <div className="grid gap-8 lg:border-l lg:border-white/[0.08] lg:pl-10">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FaqPage({
  locale,
  onReturnHome,
  inquiryHref,
}: {
  locale: SiteLocale;
  onReturnHome: () => void;
  inquiryHref: string;
}) {
  const copy = utilityPageCopy[locale];
  const directQuestionCopy = faqDirectLineCopy[locale];
  const [activeIndex, setActiveIndex] = useState(0);
  const [question, setQuestion] = useState("");
  const [replyState, setReplyState] = useState<{
    loading: boolean;
    error: string;
    answer: string;
    mode: "direct" | "curated" | null;
  }>({
    loading: false,
    error: "",
    answer: "",
    mode: null,
  });

  const activeItem = copy.faq.items[activeIndex] ?? copy.faq.items[0];
  const curatedItems = useMemo(() => copy.faq.items, [copy.faq.items]);

  const handleAsk = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;

    setReplyState({
      loading: true,
      error: "",
      answer: "",
      mode: null,
    });

    try {
      const response = await fetch("/api/faq-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          locale,
          question: trimmedQuestion,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result?.success || !result?.answer) {
        throw new Error(result?.error || directQuestionCopy.unavailable);
      }
      setReplyState({
        loading: false,
        error: "",
        answer: result.answer,
        mode: result.mode === "curated" ? "curated" : "direct",
      });
    } catch (error) {
      setReplyState({
        loading: false,
        error:
          error instanceof Error ? error.message : directQuestionCopy.unavailable,
        answer: "",
        mode: null,
      });
    }
  };

  return (
    <UtilityPageFrame
      eyebrow={copy.faq.eyebrow}
      title={copy.faq.title}
      intro={copy.faq.intro}
      onReturnHome={onReturnHome}
      inquiryHref={inquiryHref}
      returnLabel={copy.returnLabel}
      inquiryLabel={copy.inquiryLabel}
    >
      <section className="border-t border-white/[0.08] pt-6 sm:pt-7">
        <div className="grid gap-6 xl:grid-cols-[0.76fr_1.24fr] xl:gap-7">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#b9a18d]">
              {copy.faq.indexLabel}
            </p>
            <div className="mt-4 divide-y divide-white/[0.08] border-y border-white/[0.08]">
              {curatedItems.map((item, index) => (
                <button
                  key={item.question}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`block w-full py-4 text-left transition duration-300 ${
                    index === activeIndex ? "text-[#f3e8d8]" : "text-white/54 hover:text-white/82"
                  }`}
                >
                  <span className="block text-[10px] uppercase tracking-[0.22em] text-[#b9a18d]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-2 block text-[1.05rem] leading-7">
                    {item.question}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <article className="xl:pl-7">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#b9a18d]">
              {copy.faq.curatedLabel}
            </p>
            <h2 className="mt-4 max-w-[14ch] text-[clamp(2rem,4vw,3.6rem)] font-semibold leading-[0.88] tracking-[-0.05em] text-[#f3e8d8]">
              {activeItem.question}
            </h2>
            <p className="mt-6 max-w-3xl text-[1rem] leading-8 text-white/68 sm:text-[1.06rem]">
              {activeItem.answer}
            </p>
          </article>
        </div>
      </section>

      <section className="border-t border-white/[0.08] pt-8 sm:pt-10">
        <div className="grid gap-8 xl:grid-cols-[0.42fr_1.58fr] xl:gap-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#b9a18d]">
              {directQuestionCopy.eyebrow}
            </p>
            <h2 className="mt-4 max-w-[11ch] text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-[#f3e8d8]">
              {directQuestionCopy.title}
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-8 text-white/60 sm:text-base">
              {directQuestionCopy.intro}
            </p>
          </div>

          <div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d]">
                {directQuestionCopy.suggestionsLabel}
              </p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-3">
                {directQuestionCopy.suggestionPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => setQuestion(prompt)}
                    className="border-b border-white/[0.14] pb-1 text-[11px] uppercase tracking-[0.2em] text-white/54 transition duration-300 hover:border-white/28 hover:text-white"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <form className="mt-8 grid gap-5 border-t border-white/[0.08] pt-7" onSubmit={handleAsk}>
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                rows={5}
                data-native-cursor="true"
                className="min-h-[10rem] w-full resize-none border-b border-white/[0.12] bg-transparent px-0 py-2 text-[15px] leading-8 text-[#f3e8d8] outline-none transition duration-300 placeholder:text-white/28 focus:border-[#7d6855]"
                placeholder={directQuestionCopy.questionPlaceholder}
              />
              <div className="flex flex-col gap-4">
                <Button
                  type="submit"
                  disabled={replyState.loading || question.trim().length === 0}
                  className="self-start rounded-full border border-[#d3c0a6] bg-[#efe4d4] px-6 py-6 text-sm text-[#17120e] transition duration-500 hover:bg-[#f5ece0] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {replyState.loading
                    ? directQuestionCopy.askingLabel
                    : directQuestionCopy.askLabel}
                </Button>

                <div className="max-w-3xl border-l border-white/[0.08] pl-5">
                  {replyState.loading ? (
                    <p className="text-[1rem] leading-8 text-white/46">
                      {directQuestionCopy.askingLabel}
                    </p>
                  ) : replyState.error ? (
                    <p className="text-sm leading-8 text-[#d99b8d]">{replyState.error}</p>
                  ) : replyState.answer ? (
                    <p className="text-[1rem] leading-8 text-white/72 sm:text-[1.06rem]">
                      {replyState.answer}
                    </p>
                  ) : (
                    <p className="text-[1rem] leading-8 text-white/44">
                      {directQuestionCopy.emptyAnswer}
                    </p>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </UtilityPageFrame>
  );
}

export function PrivacyNoticePage({
  locale,
  onReturnHome,
  inquiryHref,
}: {
  locale: SiteLocale;
  onReturnHome: () => void;
  inquiryHref: string;
}) {
  const copy = utilityPageCopy[locale];

  return (
    <UtilityPageFrame
      eyebrow={copy.privacy.eyebrow}
      title={copy.privacy.title}
      intro={copy.privacy.intro}
      onReturnHome={onReturnHome}
      inquiryHref={inquiryHref}
      returnLabel={copy.returnLabel}
      inquiryLabel={copy.inquiryLabel}
    >
      <article className="border-t border-white/[0.08] pt-5">
        <p className="max-w-4xl text-[1rem] leading-8 text-white/72 sm:text-[1.08rem]">
          {copy.privacy.plainLead}
        </p>

        <div className="mt-8 divide-y divide-white/[0.08] border-y border-white/[0.08]">
          {copy.privacy.sections.map((section) => (
            <section key={section.heading} className="py-6">
              <h2 className="text-[11px] uppercase tracking-[0.24em] text-[#c7a97e]">
                {section.heading}
              </h2>
              <div className="mt-4 grid gap-4">
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="max-w-4xl text-[1rem] leading-8 text-white/68 sm:text-[1.04rem]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
    </UtilityPageFrame>
  );
}
