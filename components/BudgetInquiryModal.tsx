"use client";

import { FormEvent, useCallback, useState } from "react";
import { useEscapeKey } from "@/lib/hooks/useEscapeKey";
import { submitInquiry } from "@/lib/inquiries";
import type { Provider } from "@/lib/types";

interface BudgetInquiryModalProps {
  open: boolean;
  onClose: () => void;
  providers: Provider[];
  groupSize: number;
  budgetSummary: string;
}

export default function BudgetInquiryModal({
  open,
  onClose,
  providers,
  groupSize,
  budgetSummary,
}: BudgetInquiryModalProps) {
  const [contactName, setContactName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleClose = useCallback(() => {
    setContactName("");
    setCompanyName("");
    setEmail("");
    setPhone("");
    setPreferredDate("");
    setMessage("");
    setError(null);
    setSuccess(false);
    onClose();
  }, [onClose]);

  useEscapeKey(handleClose, open);

  if (!open) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const fullMessage = `${message ? `${message}\n\n` : ""}--- Budgetoverzicht ---\n${budgetSummary}`;

    try {
      await Promise.all(
        providers.map((provider) =>
          submitInquiry({
            providerSlug: provider.slug,
            providerName: provider.name,
            contactName,
            companyName,
            email,
            phone,
            groupSize,
            preferredDate: preferredDate || null,
            message: fullMessage,
          })
        )
      );
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Aanvraag versturen mislukt. Probeer het opnieuw."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#1D9E75] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} aria-label="Sluiten" />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        {success ? (
          <div className="py-8 text-center">
            <h2 className="text-xl font-bold text-gray-900">Budget doorgestuurd</h2>
            <p className="mt-2 text-sm text-gray-600">
              Uw aanvraag is verstuurd naar {providers.length} aanbieder
              {providers.length !== 1 ? "s" : ""}.
            </p>
            <button type="button" onClick={handleClose} className="mt-6 rounded-xl bg-[#1D9E75] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#178a66]">
              Sluiten
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-gray-900">Budget doorsturen</h2>
            <p className="mt-1 text-sm text-gray-500">
              Naar {providers.length} geselecteerde aanbieder{providers.length !== 1 ? "s" : ""}
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Naam *</label>
                <input required value={contactName} onChange={(e) => setContactName(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bedrijf</label>
                <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">E-mail *</label>
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefoon</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gewenste datum</label>
                <input type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Extra bericht</label>
                <textarea rows={2} value={message} onChange={(e) => setMessage(e.target.value)} className={inputClass} />
              </div>
              <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-600 whitespace-pre-line">{budgetSummary}</div>
              {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
              <button type="submit" disabled={loading} className="w-full rounded-xl bg-[#1D9E75] py-3 text-sm font-semibold text-white hover:bg-[#178a66] disabled:opacity-50">
                {loading ? "Versturen..." : "Verstuur naar aanbieders"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
