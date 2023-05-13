export const truncate = (text: string, length = 15) => {
  if (text.length <= length) {
    return text;
  }

  return `${text.slice(0, length).trimEnd()}...`;
};
