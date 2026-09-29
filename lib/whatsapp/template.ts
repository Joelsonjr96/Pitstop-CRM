// lib/whatsapp/template.ts

export function replaceTemplateVariables(message: string, data: {
  cliente: string;
  veiculo: string;
  placa: string;
  servico: string;
  oficina: string;
}): string {
  let replaced = message;
  replaced = replaced.replace('{{cliente}}', data.cliente);
  replaced = replaced.replace('{{veiculo}}', data.veiculo);
  replaced = replaced.replace('{{placa}}', data.placa);
  replaced = replaced.replace('{{servico}}', data.servico);
  replaced = replaced.replace('{{oficina}}', data.oficina);
  return replaced;
}
