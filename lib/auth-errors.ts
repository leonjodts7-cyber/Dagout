export function translateAuthError(message: string): string {
  const map: Record<string, string> = {
    "Invalid login credentials":
      "Onjuist e-mailadres of wachtwoord. Probeer het opnieuw.",
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
  };

  for (const [key, value] of Object.entries(map)) {
    if (message.includes(key)) return value;
  }

  if (message.toLowerCase().includes("network")) {
    return "Netwerkfout. Controleer je internetverbinding.";
  }

  return message || "Er is een onbekende fout opgetreden. Probeer het later opnieuw.";
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
