import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import BudgetCalculator from "@/components/BudgetCalculator";
import { getActiveProviders } from "@/lib/providers-unified";

export const metadata = {
  title: "Budgetcalculator — Dagout.be",
  description: "Bereken het budget voor jullie teambuilding activiteit.",
};

export default async function CalculatorPage() {
  const activities = await getActiveProviders();

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
        <BudgetCalculator activities={activities} />
      </main>
      <Footer />
    </>
  );
}
