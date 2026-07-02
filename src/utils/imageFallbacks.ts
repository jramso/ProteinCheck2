export function getLocalFallbackUrl(term: string): string {
  const t = term.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // remove acentos
  
  if (t.includes("ovo") || t.includes("egg") || t.includes("omelete") || t.includes("clara")) {
    return "https://images.pexels.com/photos/162712/egg-yellow-food-one-162712.jpeg?auto=compress&cs=tinysrgb&h=350";
  }
  if (t.includes("carne") || t.includes("frango") || t.includes("bife") || t.includes("meat") || t.includes("chicken") || t.includes("porco") || t.includes("peixe") || t.includes("fish")) {
    return "https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg?auto=compress&cs=tinysrgb&h=350";
  }
  if (t.includes("whey") || t.includes("shake") || t.includes("leite") || t.includes("suco") || t.includes("vitamina") || t.includes("juice") || t.includes("milk") || t.includes("bebida")) {
    return "https://images.pexels.com/photos/103566/pexels-photo-103566.jpeg?auto=compress&cs=tinysrgb&h=350";
  }
  if (t.includes("salada") || t.includes("alface") || t.includes("tomate") || t.includes("vegetal") || t.includes("legume") || t.includes("salad") || t.includes("folha")) {
    return "https://images.pexels.com/photos/406152/pexels-photo-406152.jpeg?auto=compress&cs=tinysrgb&h=350";
  }
  
  // Imagem padrão gastronômica geral
  return "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&h=350";
}
