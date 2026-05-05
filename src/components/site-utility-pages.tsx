import React from "react";
import { Button } from "./ui/button";
import type { SiteLocale } from "../lib/site-locale";

const utilityPageCopy: Record<
  SiteLocale,
  {
    faq: {
      eyebrow: string;
      title: string;
      intro: string;
      items: Array<{ question: string; answer: string }>;
    };
    privacy: {
      eyebrow: string;
      title: string;
      intro: string;
      sections: Array<{ heading: string; body: string }>;
    };
    returnLabel: string;
    inquiryLabel: string;
  }
> = {
  en: {
    faq: {
      eyebrow: "Practical guidance",
      title: "Questions answered without disturbing the main experience.",
      intro:
        "This page gathers the practical side of acquisition, ownership, and aftercare so the main site can remain restrained.",
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
      ],
    },
    privacy: {
      eyebrow: "Privacy notice",
      title: "Data handling kept narrow, direct, and tied to real purpose.",
      intro:
        "Praeliator collects only the information necessary to review correspondence, manage private acquisition, maintain ownership records, and continue service.",
      sections: [
        {
          heading: "Information collected",
          body:
            "Praeliator may collect name, email, phone, destination details, inquiry details, ownership registration data, and service history when you use forms or private acquisition routes.",
        },
        {
          heading: "Why it is used",
          body:
            "The information is used to review inquiries, prepare issued acquisition sessions, manage delivery and payment continuity, maintain ownership records, and support aftercare under the house.",
        },
        {
          heading: "Analytics and tracking",
          body:
            "The site may use Google Analytics and Meta Pixel when configured in production. These tools are used to understand site performance and private inquiry behavior at a technical level.",
        },
        {
          heading: "Third parties",
          body:
            "Praeliator uses service providers such as Supabase for authentication and database infrastructure, Stripe for payment processing, and WhatsApp for direct correspondence when chosen by the client.",
        },
        {
          heading: "Contact",
          body:
            "Questions related to privacy or data handling may be directed through the house contact routes already published on the site.",
        },
      ],
    },
    returnLabel: "Return",
    inquiryLabel: "Private Inquiry",
  },
  es: {
    faq: {
      eyebrow: "Guia practica",
      title: "Preguntas resueltas sin interrumpir la experiencia principal.",
      intro:
        "Esta pagina reune la parte practica de la adquisicion, la propiedad y el cuidado para que el sitio principal pueda mantenerse sobrio.",
      items: [
        {
          question: "Como comienza la adquisicion?",
          answer:
            "La adquisicion comienza por correspondencia directa. La primera consulta se revisa antes de emitir cualquier asignacion o camara privada de pago.",
        },
        {
          question: "Praeliator VIS esta disponible para compra publica inmediata?",
          answer:
            "No. VIS no se ofrece mediante un carrito publico. Los clientes aprobados pueden recibir una sesion privada de adquisicion preparada para su linea.",
        },
        {
          question: "Que es el Registro de Propiedad?",
          answer:
            "El Registro de Propiedad es la capa privada donde los pares registrados, la fecha de entrega y la elegibilidad futura de servicio permanecen bajo una misma linea de casa.",
        },
        {
          question: "Que es Legacy Refresh?",
          answer:
            "Legacy Refresh es un ritual privado de servicio posterior a la compra. Se abre segun la maduracion registrada del par y no solo por la fecha de registro.",
        },
        {
          question: "Como se manejan los datos de entrega?",
          answer:
            "Los datos de entrega se solicitan solo despues de verificar el acceso privado y antes de abrir el pago, para que la ruta siga controlada de principio a fin.",
        },
      ],
    },
    privacy: {
      eyebrow: "Aviso de privacidad",
      title: "El manejo de datos se mantiene preciso, directo y ligado a una finalidad real.",
      intro:
        "Praeliator recopila solo la informacion necesaria para revisar correspondencia, gestionar adquisicion privada, mantener registros de propiedad y continuar el servicio.",
      sections: [
        {
          heading: "Informacion recopilada",
          body:
            "Praeliator puede recopilar nombre, correo, telefono, datos de destino, detalles de consulta, registro de propiedad e historial de servicio cuando se usan formularios o rutas privadas.",
        },
        {
          heading: "Finalidad de uso",
          body:
            "La informacion se utiliza para revisar consultas, preparar sesiones privadas de adquisicion, gestionar entrega y pago, mantener registros de propiedad y sostener el aftercare de la casa.",
        },
        {
          heading: "Analitica y seguimiento",
          body:
            "El sitio puede utilizar Google Analytics y Meta Pixel cuando esten configurados en produccion. Se usan para entender rendimiento del sitio y comportamiento tecnico de consulta privada.",
        },
        {
          heading: "Terceros",
          body:
            "Praeliator utiliza proveedores como Supabase para autenticacion e infraestructura de base de datos, Stripe para pagos y WhatsApp para correspondencia directa cuando el cliente lo elige.",
        },
        {
          heading: "Contacto",
          body:
            "Las preguntas relacionadas con privacidad o manejo de datos pueden dirigirse por las rutas de contacto de la casa ya publicadas en el sitio.",
        },
      ],
    },
    returnLabel: "Volver",
    inquiryLabel: "Consulta privada",
  },
  ja: {
    faq: {
      eyebrow: "Practical guidance",
      title: "Main experienceを乱さずに要点だけをまとめた案内。",
      intro:
        "このページでは取得、所有、アフターケアの実務情報だけをまとめ、メインサイトの静けさを保ちます。",
      items: [
        {
          question: "取得はどのように始まりますか。",
          answer:
            "取得は直接の対応から始まります。最初の問い合わせが確認された後にのみ、私的な割当や支払い導線が発行されます。",
        },
        {
          question: "Praeliator VISを公開購入できますか。",
          answer:
            "できません。VISは公開カート商品ではありません。承認された顧客にのみ、専用の私的取得セッションが用意されます。",
        },
        {
          question: "Ownership Recordとは何ですか。",
          answer:
            "Ownership Recordは、登録されたペア、記録された到着日、将来のサービス適格性を同じ家系統の下に保持する私的領域です。",
        },
        {
          question: "Legacy Refreshとは何ですか。",
          answer:
            "Legacy Refreshは購入後の私的サービス儀式です。登録日ではなく、記録された成熟度に応じて開きます。",
        },
        {
          question: "配送情報はどのように扱われますか。",
          answer:
            "配送情報は私的アクセス確認後、支払い開始前にのみ収集され、取得から発送までの統制を保ちます。",
        },
      ],
    },
    privacy: {
      eyebrow: "Privacy notice",
      title: "データの扱いは必要最小限で、目的に結びついたまま保たれます。",
      intro:
        "Praeliatorは、問い合わせ審査、私的取得、所有記録、継続サービスに必要な範囲でのみ情報を扱います。",
      sections: [
        {
          heading: "収集される情報",
          body:
            "フォームや私的取得ルートの利用時に、氏名、メール、電話、配送先、問い合わせ内容、所有登録情報、サービス履歴を収集する場合があります。",
        },
        {
          heading: "利用目的",
          body:
            "情報は問い合わせ審査、私的取得セッションの準備、配送と支払いの継続管理、所有記録の維持、アフターケアの提供のために使用されます。",
        },
        {
          heading: "解析と計測",
          body:
            "本番環境で設定されている場合、Google AnalyticsとMeta Pixelを利用することがあります。これはサイト性能と私的問い合わせ導線を技術的に把握するためです。",
        },
        {
          heading: "第三者サービス",
          body:
            "Praeliatorは、認証とデータベースにSupabase、決済にStripe、直接連絡にWhatsAppを使用する場合があります。",
        },
        {
          heading: "連絡",
          body:
            "プライバシーやデータ取扱いに関する質問は、サイト上の連絡ルートから送ることができます。",
        },
      ],
    },
    returnLabel: "Return",
    inquiryLabel: "Private Inquiry",
  },
  fr: {
    faq: {
      eyebrow: "Guide pratique",
      title: "Les questions utiles, sans troubler l'experience principale.",
      intro:
        "Cette page rassemble la partie pratique de l'acquisition, de la propriete et de l'apres-vente afin que le site principal demeure retenu.",
      items: [
        {
          question: "Comment l'acquisition commence-t-elle ?",
          answer:
            "L'acquisition commence par une correspondance directe. La premiere demande est examinee avant qu'une allocation ou qu'une chambre de paiement privee ne soit emise.",
        },
        {
          question: "Praeliator VIS est-il disponible en achat public immediat ?",
          answer:
            "Non. VIS n'est pas propose comme produit de panier public. Les clients approuves peuvent recevoir une session d'acquisition privee preparee pour leur ligne.",
        },
        {
          question: "Qu'est-ce que le Registre de propriete ?",
          answer:
            "Le Registre de propriete est la couche privee dans laquelle les paires enregistrees, la date de livraison et l'eligibilite future de service restent attachees a la meme ligne.",
        },
        {
          question: "Qu'est-ce que Legacy Refresh ?",
          answer:
            "Legacy Refresh est un rituel de service prive apres achat. Il s'ouvre selon la maturite enregistree de la paire, et non selon la seule date d'enregistrement.",
        },
        {
          question: "Comment les details de livraison sont-ils traites ?",
          answer:
            "Les details de livraison ne sont recueillis qu'apres verification de l'acces prive et avant l'ouverture du paiement, afin que la voie demeure controlee jusqu'a l'accomplissement.",
        },
      ],
    },
    privacy: {
      eyebrow: "Notice de confidentialite",
      title: "Le traitement des donnees reste limite, direct et lie a une finalite reelle.",
      intro:
        "Praeliator ne recueille que les informations necessaires pour examiner les demandes, gerer l'acquisition privee, maintenir les registres de propriete et poursuivre le service.",
      sections: [
        {
          heading: "Informations recueillies",
          body:
            "Praeliator peut recueillir nom, email, telephone, destination, details de demande, enregistrements de propriete et historique de service lors de l'usage des formulaires ou des voies privees.",
        },
        {
          heading: "Pourquoi elles sont utilisees",
          body:
            "Ces informations servent a examiner les demandes, preparer les sessions privees d'acquisition, gerer la livraison et le paiement, maintenir les registres de propriete et soutenir l'apres-vente.",
        },
        {
          heading: "Mesure et suivi",
          body:
            "Le site peut utiliser Google Analytics et Meta Pixel lorsqu'ils sont configures en production. Ils servent a comprendre la performance du site et le comportement technique des demandes privees.",
        },
        {
          heading: "Prestataires tiers",
          body:
            "Praeliator peut utiliser Supabase pour l'authentification et la base de donnees, Stripe pour les paiements et WhatsApp pour la correspondance directe lorsque le client le choisit.",
        },
        {
          heading: "Contact",
          body:
            "Les questions relatives a la confidentialite ou au traitement des donnees peuvent etre adressees par les voies de contact deja publiees sur le site.",
        },
      ],
    },
    returnLabel: "Retour",
    inquiryLabel: "Demande privee",
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
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#090909_0%,#050505_100%)] pb-20 pt-28 sm:pb-24 sm:pt-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(198,157,118,0.1),transparent_28%)]" />
      <div className="mx-auto w-full max-w-[110rem] px-5 sm:px-7 lg:px-10">
        <div className="rounded-[2.5rem] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(14,13,11,0.96),rgba(8,8,7,0.98))] shadow-[0_42px_140px_rgba(0,0,0,0.4)]">
          <div className="flex flex-col gap-4 border-b border-white/[0.08] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
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
          <div className="grid gap-10 px-5 py-8 sm:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:px-10 lg:py-10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#c7a97e]">
                {eyebrow}
              </p>
              <h1 className="mt-5 max-w-[10ch] text-[clamp(2.9rem,6vw,5.6rem)] font-semibold leading-[0.84] tracking-[-0.06em] text-[#f3e8d8]">
                {title}
              </h1>
              <p className="mt-6 max-w-[34rem] text-sm leading-8 text-white/64 sm:text-base">
                {intro}
              </p>
            </div>
            <div className="grid gap-4">{children}</div>
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
      {copy.faq.items.map((item) => (
        <article
          key={item.question}
          className="rounded-[1.7rem] border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6"
        >
          <h2 className="text-[1.1rem] leading-7 text-[#f3e8d8] sm:text-[1.18rem]">
            {item.question}
          </h2>
          <p className="mt-4 text-sm leading-8 text-white/66 sm:text-[0.98rem]">
            {item.answer}
          </p>
        </article>
      ))}
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
      {copy.privacy.sections.map((section) => (
        <article
          key={section.heading}
          className="rounded-[1.7rem] border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6"
        >
          <h2 className="text-[1.05rem] uppercase tracking-[0.2em] text-[#c7a97e]">
            {section.heading}
          </h2>
          <p className="mt-4 text-sm leading-8 text-white/66 sm:text-[0.98rem]">
            {section.body}
          </p>
        </article>
      ))}
    </UtilityPageFrame>
  );
}
