import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import BudgetCalculator from "@/components/BudgetCalculator";

export const metadata = {
  title: "Budgetcalculator — Dagout.be",
  description: "Bereken het budget voor jullie teambuilding activiteit.",
};

export default function CalculatorPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <PageHeader
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Budgetcalculator" },
          ]}
        />
        <BudgetCalculator />
      </main>
      <Footer />
    </>
  );
}
