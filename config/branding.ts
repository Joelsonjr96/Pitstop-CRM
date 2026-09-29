export type Branding = {
  name: string;
  logo?: string;
  favicon?: string;
  primary: string;
  accent?: string;
  whatsappNumber: string;
  poweredBy: string;
};

export const brand: Branding = {
  name: "Pitstop",
  primary: "#E11D48",
  logo: "/logo.png",
  favicon: "/logo.png",
  whatsappNumber: "21999999999",
  poweredBy: "Desenvolvido com PitStop",
};
