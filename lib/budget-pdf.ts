import { jsPDF } from "jspdf";
import type { Provider } from "@/lib/types";
import { BUDGET_EXTRAS } from "@/lib/tools-constants";

export interface BudgetPdfData {
  groupSize: number;
  activities: Provider[];
  extras: string[];
  activityTotal: number;
  extrasTotal: number;
  grandTotal: number;
}

export function generateBudgetPdf(data: BudgetPdfData) {
  const doc = new jsPDF();
  const margin = 20;
  let y = margin;

  doc.setFillColor(10, 42, 31);
  doc.rect(0, 0, 210, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text("Dagout.be", margin, 22);
  doc.setFontSize(12);
  doc.text("Budgetoverzicht teambuilding", margin, 32);

  doc.setTextColor(30, 30, 30);
  y = 55;
  doc.setFontSize(11);
  doc.text(`Groepsgrootte: ${data.groupSize} personen`, margin, y);
  y += 10;
  doc.text(`Datum: ${new Date().toLocaleDateString("nl-BE")}`, margin, y);
  y += 16;

  doc.setFontSize(14);
  doc.setTextColor(29, 158, 117);
  doc.text("Activiteiten", margin, y);
  y += 8;
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);

  data.activities.forEach((activity) => {
    const lineTotal = activity.price_from * data.groupSize;
    doc.text(
      `${activity.name} — €${activity.price_from}/pers × ${data.groupSize} = €${lineTotal.toFixed(2)}`,
      margin,
      y
    );
    y += 7;
  });

  y += 6;
  doc.setFontSize(11);
  doc.text(`Subtotaal activiteiten: €${data.activityTotal.toFixed(2)}`, margin, y);
  y += 14;

  if (data.extras.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(29, 158, 117);
    doc.text("Extra's", margin, y);
    y += 8;
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);

    data.extras.forEach((extraId) => {
      const extra = BUDGET_EXTRAS.find((e) => e.id === extraId);
      if (!extra) return;
      const lineTotal = extra.pricePerPerson * data.groupSize;
      doc.text(
        `${extra.label} — €${extra.pricePerPerson}/pers × ${data.groupSize} = €${lineTotal.toFixed(2)}`,
        margin,
        y
      );
      y += 7;
    });

    y += 6;
    doc.setFontSize(11);
    doc.text(`Subtotaal extra's: €${data.extrasTotal.toFixed(2)}`, margin, y);
    y += 14;
  }

  doc.setDrawColor(29, 158, 117);
  doc.setLineWidth(0.5);
  doc.line(margin, y, 190, y);
  y += 12;

  doc.setFontSize(16);
  doc.setTextColor(29, 158, 117);
  doc.text(`Totaalbedrag: €${data.grandTotal.toFixed(2)}`, margin, y);
  y += 10;
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text("Indicatief budget — prijzen kunnen variëren per aanbieder.", margin, y);
  doc.text("Meer info: www.dagout.be | info@dagout.be", margin, y + 6);

  doc.save(`dagout-budget-${data.groupSize}p-${Date.now()}.pdf`);
}
