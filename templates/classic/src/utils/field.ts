import { FIELD_ID } from './const';

export const getFieldText = (field: string) =>
  document.getElementById(FIELD_ID(field))?.innerText?.trim() || undefined;

export const isFieldEmpty = (id: string) => {
  const node = document.getElementById(id);
  if (!node) {
    return true;
  }
  if (node.innerText?.trim()?.length) {
    return false;
  }
  return !/<(img|video)/.test(node.innerHTML);
};
