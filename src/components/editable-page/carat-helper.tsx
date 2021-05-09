export const setCaretToEnd = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.focus();
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(element);
    range.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(range);
  }
};
