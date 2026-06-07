"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useEscapeKey } from "@/lib/hooks/useEscapeKey";
import { useFormPersistence } from "@/lib/hooks/useFormPersistence";
import { submitInquiry } from "@/lib/inquiries";

interface InquiryModalProps {
  open: boolean;
  onClose: () => void;
  providerName: string;
  listingId?: string | null;
  providerSlug?: string;
  defaultGroupSize?: string;
  defaultPreferredDate?: string;
}

export default function InquiryModal({
  open,
  onClose,
  providerName,
  listingId,
  providerSlug,
  defaultGroupSize = "",
  defaultPreferredDate = "",
}: InquiryModalProps) {
  const [contactName, setContactName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [groupSize, setGroupSize] = useState(defaultGroupSize);
  const [preferredDate, setPreferredDate] = useState(defaultPreferredDate);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetForm = useCallback(() => {
    setContactName("");
    setCompanyName("");
    setEmail("");
    setPhone("");
    setGroupSize("");
    setPreferredDate("");
    setMessage("");
    setError(null);
    setSuccess(false);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  useEscapeKey(handleClose, open);

  useFormPersistence(
    `dagout-inquiry-${providerSlug ?? "general"}`,
    { contactName, companyName, email, phone, message },
    (saved) => {
      setContactName(saved.contactName);
      setCompanyName(saved.companyName);
      setEmail(saved.email);
      setPhone(saved.phone);
      setMessage(saved.message);
    },
    open
  );

  useEffect(() => {
    if (open) {
      setGroupSize(defaultGroupSize);
      setPreferredDate(defaultPreferredDate);
    }
  }, [open, defaultGroupSize, defaultPreferredDate]);

  if (!open) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await submitInquiry({
        listingId: listingId ?? null,
        providerSlug,
        providerName,
        contactName,
        companyName,
        email,
        phone,
        groupSize: groupSize ? Number(groupSize) : null,
        preferredDate: preferredDate || null,
        message,
      });
      setSuccess(true);
      localStorage.removeItem(`dagout-inquiry-${providerSlug ?? "general"}`);
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
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inquiry-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
        aria-label="Sluiten"
      />

      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          aria-label="Sluiten"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {success ? (
          <div className="py-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#1D9E75]/10">
              <svg className="h-7 w-7 text-[#1D9E75]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-900">Aanvraag verzonden</h2>
            <p className="mt-2 text-sm text-gray-600">
              {providerName} neemt zo snel mogelijk contact met je op.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-6 rounded-xl bg-[#1D9E75] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#178a66]"
            >
              Sluiten
            </button>
          </div>
        ) : (
          <>
            <h2 id="inquiry-modal-title" className="text-xl font-bold text-gray-900">
              Stuur aanvraag
            </h2>
            <p className="mt-1 text-sm text-gray-500">{providerName}</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Naam *</label>
                <input
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className={inputClass}
                  placeholder="Je volledige naam"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bedrijf</label>
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className={inputClass}
                  placeholder="Bedrijfsnaam"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">E-mail *</label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefoon</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Groepsgrootte</label>
                  <input
                    type="number"
                    min={1}
                    value={groupSize}
                    onChange={(e) => setGroupSize(e.target.value)}
                    className={inputClass}
                    placeholder="bv. 20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gewenste datum</label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bericht</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={inputClass}
                  placeholder="Vertel kort wat je zoekt..."
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#1D9E75] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#178a66] disabled:opacity-50"
              >
                {loading ? "Versturen..." : "Verstuur aanvraag"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
