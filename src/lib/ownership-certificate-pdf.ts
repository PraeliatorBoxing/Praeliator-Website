import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

export type OwnershipCertificatePair = {
  model: string;
  serial: string;
  claimCodeLast4: string;
  deliveryConfirmedAtLabel: string;
  registeredAtLabel: string;
  eligibleOnLabel: string;
};

type OwnershipCertificatePayload = {
  clientName: string;
  clientEmail: string | null;
  recordReference: string;
  issuedAtLabel: string;
  pair: OwnershipCertificatePair | null;
  pairAgeLabel: string;
  pairAgeDetail: string;
  serviceStateLabel: string;
  serviceStateDetail: string;
  logoPath?: string;
};

function toRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const safe = normalized.length === 3
    ? normalized
        .split("")
        .map((value) => value + value)
        .join("")
    : normalized;

  const intValue = Number.parseInt(safe, 16);
  return rgb(
    ((intValue >> 16) & 255) / 255,
    ((intValue >> 8) & 255) / 255,
    (intValue & 255) / 255,
  );
}

function drawWrappedText({
  page,
  text,
  x,
  y,
  maxWidth,
  lineHeight,
  font,
  size,
  color,
}: {
  page: PDFPage;
  text: string;
  x: number;
  y: number;
  maxWidth: number;
  lineHeight: number;
  font: PDFFont;
  size: number;
  color: ReturnType<typeof rgb>;
}) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;
    const width = font.widthOfTextAtSize(nextLine, size);
    if (width <= maxWidth) {
      currentLine = nextLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) lines.push(currentLine);

  lines.forEach((line, index) => {
    page.drawText(line, {
      x,
      y: y - index * lineHeight,
      size,
      font,
      color,
    });
  });

  return y - Math.max(lines.length - 1, 0) * lineHeight;
}

function drawLabelValueBlock({
  page,
  label,
  value,
  x,
  y,
  width,
  labelFont,
  valueFont,
}: {
  page: PDFPage;
  label: string;
  value: string;
  x: number;
  y: number;
  width: number;
  labelFont: PDFFont;
  valueFont: PDFFont;
}) {
  page.drawText(label.toUpperCase(), {
    x,
    y,
    size: 9,
    font: labelFont,
    color: toRgb("#8d755c"),
  });

  drawWrappedText({
    page,
    text: value,
    x,
    y: y - 18,
    maxWidth: width,
    lineHeight: 15,
    font: valueFont,
    size: 12,
    color: toRgb("#231b15"),
  });
}

async function maybeEmbedLogo(pdf: PDFDocument, logoPath?: string) {
  if (!logoPath) return null;

  try {
    const response = await fetch(logoPath);
    if (!response.ok) return null;
    const logoBytes = await response.arrayBuffer();
    return pdf.embedPng(logoBytes);
  } catch {
    return null;
  }
}

export async function downloadOwnershipCertificatePdf(
  payload: OwnershipCertificatePayload,
) {
  const pdf = await PDFDocument.create();
  pdf.setTitle("Praeliator Ownership Record");
  pdf.setAuthor("Praeliator");
  pdf.setSubject("Ownership certificate");
  pdf.setCreator("Praeliator");
  pdf.setProducer("Praeliator");

  const page = pdf.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();
  const margin = 44;

  const serifBold = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const serif = await pdf.embedFont(StandardFonts.TimesRoman);
  const sans = await pdf.embedFont(StandardFonts.Helvetica);
  const sansBold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const logo = await maybeEmbedLogo(pdf, payload.logoPath);

  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: toRgb("#f4ebe0"),
  });
  page.drawRectangle({
    x: 0,
    y: height - 14,
    width,
    height: 14,
    color: toRgb("#8a633e"),
  });
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height: 10,
    color: toRgb("#d8ba8a"),
  });
  page.drawRectangle({
    x: margin,
    y: margin,
    width: width - margin * 2,
    height: height - margin * 2,
    borderColor: toRgb("#d3c0a7"),
    borderWidth: 1,
    color: toRgb("#faf4ec"),
    opacity: 0.92,
  });

  if (logo) {
    page.drawImage(logo, {
      x: width - margin - 54,
      y: height - margin - 52,
      width: 32,
      height: 32,
      opacity: 0.92,
    });
    page.drawImage(logo, {
      x: width - 220,
      y: height - 360,
      width: 180,
      height: 180,
      opacity: 0.04,
    });
  }

  page.drawText("PRAELIATOR / OWNERSHIP RECORD", {
    x: margin + 12,
    y: height - margin - 6,
    size: 10,
    font: sansBold,
    color: toRgb("#8d755c"),
  });

  drawWrappedText({
    page,
    text: "A private certificate of custody, continuity, and service.",
    x: margin + 12,
    y: height - margin - 52,
    maxWidth: 320,
    lineHeight: 28,
    font: serifBold,
    size: 30,
    color: toRgb("#231b15"),
  });

  drawWrappedText({
    page,
    text: "Issued under the house record as an authored summary of current custody posture, delivery age, and service eligibility.",
    x: margin + 12,
    y: height - margin - 115,
    maxWidth: width - margin * 2 - 24,
    lineHeight: 18,
    font: serif,
    size: 13,
    color: toRgb("#55473b"),
  });

  const topGridY = height - margin - 175;
  const columnGap = 26;
  const columnWidth = (width - margin * 2 - 24 - columnGap) / 2;
  const leftX = margin + 12;
  const rightX = leftX + columnWidth + columnGap;

  page.drawLine({
    start: { x: leftX, y: topGridY + 12 },
    end: { x: width - margin - 12, y: topGridY + 12 },
    thickness: 1,
    color: toRgb("#d8c9b5"),
  });

  drawLabelValueBlock({
    page,
    label: "Client line",
    value: payload.clientName,
    x: leftX,
    y: topGridY - 12,
    width: columnWidth,
    labelFont: sansBold,
    valueFont: serifBold,
  });
  drawLabelValueBlock({
    page,
    label: "House reference",
    value: payload.recordReference,
    x: rightX,
    y: topGridY - 12,
    width: columnWidth,
    labelFont: sansBold,
    valueFont: serifBold,
  });
  drawLabelValueBlock({
    page,
    label: "Client email",
    value: payload.clientEmail || "Private line retained",
    x: leftX,
    y: topGridY - 86,
    width: columnWidth,
    labelFont: sansBold,
    valueFont: sans,
  });
  drawLabelValueBlock({
    page,
    label: "Issued",
    value: payload.issuedAtLabel,
    x: rightX,
    y: topGridY - 86,
    width: columnWidth,
    labelFont: sansBold,
    valueFont: sans,
  });

  const chamberY = height - margin - 330;
  page.drawRectangle({
    x: leftX,
    y: chamberY - 208,
    width: width - margin * 2 - 24,
    height: 208,
    borderColor: toRgb("#d8c9b5"),
    borderWidth: 1,
    color: toRgb("#f6eee4"),
  });

  page.drawText("RETAINED PAIR", {
    x: leftX + 18,
    y: chamberY - 22,
    size: 9,
    font: sansBold,
    color: toRgb("#8d755c"),
  });

  if (payload.pair) {
    page.drawText(payload.pair.serial, {
      x: leftX + 18,
      y: chamberY - 62,
      size: 28,
      font: serifBold,
      color: toRgb("#231b15"),
    });
    page.drawText(payload.pair.model, {
      x: leftX + 18,
      y: chamberY - 84,
      size: 11,
      font: sans,
      color: toRgb("#55473b"),
    });

    drawLabelValueBlock({
      page,
      label: "Registered on",
      value: payload.pair.registeredAtLabel,
      x: leftX + 18,
      y: chamberY - 118,
      width: 120,
      labelFont: sansBold,
      valueFont: sans,
    });
    drawLabelValueBlock({
      page,
      label: "Delivery retained",
      value: payload.pair.deliveryConfirmedAtLabel,
      x: leftX + 156,
      y: chamberY - 118,
      width: 132,
      labelFont: sansBold,
      valueFont: sans,
    });
    drawLabelValueBlock({
      page,
      label: "Claim code",
      value: `••••${payload.pair.claimCodeLast4}`,
      x: leftX + 306,
      y: chamberY - 118,
      width: 96,
      labelFont: sansBold,
      valueFont: sans,
    });
    drawLabelValueBlock({
      page,
      label: "Eligible on",
      value: payload.pair.eligibleOnLabel,
      x: leftX + 418,
      y: chamberY - 118,
      width: 100,
      labelFont: sansBold,
      valueFont: sans,
    });
  } else {
    drawWrappedText({
      page,
      text: "No retained pair is currently attached to this certificate. The house reference remains active and will populate once the first pair is entered into record.",
      x: leftX + 18,
      y: chamberY - 56,
      maxWidth: width - margin * 2 - 60,
      lineHeight: 18,
      font: serif,
      size: 13,
      color: toRgb("#55473b"),
    });
  }

  const statusY = chamberY - 238;
  page.drawText("MATURITY AND SERVICE", {
    x: leftX,
    y: statusY,
    size: 9,
    font: sansBold,
    color: toRgb("#8d755c"),
  });
  drawWrappedText({
    page,
    text: `${payload.pairAgeLabel}. ${payload.pairAgeDetail}`,
    x: leftX,
    y: statusY - 20,
    maxWidth: 235,
    lineHeight: 16,
    font: serif,
    size: 13,
    color: toRgb("#231b15"),
  });
  drawWrappedText({
    page,
    text: `${payload.serviceStateLabel}. ${payload.serviceStateDetail}`,
    x: rightX,
    y: statusY - 20,
    maxWidth: 235,
    lineHeight: 16,
    font: serif,
    size: 13,
    color: toRgb("#231b15"),
  });

  const footerY = 114;
  page.drawLine({
    start: { x: leftX, y: footerY + 44 },
    end: { x: width - margin - 12, y: footerY + 44 },
    thickness: 1,
    color: toRgb("#d8c9b5"),
  });
  drawWrappedText({
    page,
    text: "Praeliator treats ownership as continuity rather than a completed transaction. This certificate reflects the current house record at the moment of issue.",
    x: leftX,
    y: footerY + 18,
    maxWidth: width - margin * 2 - 24,
    lineHeight: 15,
    font: sans,
    size: 10,
    color: toRgb("#6d5b4b"),
  });
  page.drawText("PRAELIATOR / HOUSE MEMORY", {
    x: leftX,
    y: footerY - 12,
    size: 9,
    font: sansBold,
    color: toRgb("#8d755c"),
  });

  const pdfBytes = await pdf.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = payload.pair
    ? `praeliator-ownership-record-${payload.pair.serial.toLowerCase()}.pdf`
    : `praeliator-ownership-record-${payload.recordReference.toLowerCase()}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
