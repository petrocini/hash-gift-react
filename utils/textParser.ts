export const parseTextList = (
  text: string,
  defaultDDD: string
): { name: string; phone?: string }[] => {
  const lines = text.split(/\n/);
  const parsedList: { name: string; phone?: string }[] = [];

  const cleanDefaultDDD = defaultDDD.replace(/\D/g, "");

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    const match = trimmed.match(/^(.*?)\s+([\d\s:.-]+)$/);

    if (match) {
      const rawName = match[1].trim();
      let rawPhone = match[2].replace(/\D/g, "");

      if ((rawPhone.length === 8 || rawPhone.length === 9) && cleanDefaultDDD) {
        rawPhone = cleanDefaultDDD + rawPhone;
      }

      let formattedPhone = rawPhone;
      if (rawPhone.length === 11) {
        formattedPhone = rawPhone.replace(
          /^(\d{2})(\d{5})(\d{4})$/,
          "($1) $2-$3"
        );
      } else if (rawPhone.length === 10) {
        formattedPhone = rawPhone.replace(
          /^(\d{2})(\d{4})(\d{4})$/,
          "($1) $2-$3"
        );
      } else if (rawPhone.length === 9) {
        formattedPhone = rawPhone.replace(/^(\d{5})(\d{4})$/, "$1-$2");
      }

      parsedList.push({ name: rawName, phone: formattedPhone });
    } else {
      parsedList.push({ name: trimmed, phone: undefined });
    }
  });

  return parsedList;
};
