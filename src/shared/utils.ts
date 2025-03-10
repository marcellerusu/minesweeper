export function cx(classes: Record<string, boolean>): string {
  let str = "";
  for (let className in classes) {
    if (classes[className]) str += className + " ";
  }
  return str;
}
