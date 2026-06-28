export function translateAuthError(message: string): string {
  const normalized = message.trim();

  const map: Record<string, string> = {
    "Failed to fetch": "Verbindingsprobleem. Probeer opnieuw.",
    "Invalid login credentials":
      "Incorrect e-mailadres of wachtwoord.",
    "Email not confirmed":
      "Bevestig eerst je e-mailadres via de link in je inbox.",
    "User already registered":
      "Dit e-mailadres is al geregistreerd. Log in of gebruik een ander adres.",
    "Password should be at least 6 characters":
      "Je wachtwoord moet minimaal 6 tekens bevatten.",
    "Unable to validate email address: invalid format":
      "Voer een geldig e-mailadres in.",
    "Signup requires a valid password":
      "Voer een geldig wachtwoord in.",
    SUPABASE_NOT_CONFIGURED:
      "Verbindingsprobleem. Probeer opnieuw.",
    SUPABASE_INVALID_URL:
      "Verbindingsprobleem. Probeer opnieuw.",
  };

  for (const [key, value] of Object.entries(map)) {
    if (normalized.includes(key)) return value;
  }

  const lower = normalized.toLowerCase();
  if (
    lower.includes("failed to fetch") ||
    lower.includes("network") ||
    lower.includes("fetch")
  ) {
    return "Verbindingsprobleem. Probeer opnieuw.";
  }

  return normalized || "Er is een onbekende fout opgetreden. Probeer het later opnieuw.";
}

export function translateFormError(message: string): string {
  if (message.includes("duplicate")) {
    return "Deze gegevens bestaan al in het systeem.";
  }
  if (message.includes("permission") || message.includes("policy")) {
    return "Je hebt geen rechten voor deze actie. Log opnieuw in.";
  }
  return translateAuthError(message);
}

function authErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) {
    return translateAuthError(err.message);
  }
  if (typeof err === "object" && err !== null && "message" in err) {
    return translateAuthError(String((err as { message: unknown }).message));
  }
  return translateAuthError(fallback);
}

export { authErrorMessage };
