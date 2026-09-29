import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-background font-sans">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-card sm:items-start rounded-xl border border-border">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-foreground">
            Bem-vindo ao Oficina CRM
          </h1>
          <p className="max-w-md text-lg leading-8 text-muted-foreground">
            Gerenciamento eficiente para o pós-venda da sua oficina.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-primary-foreground transition-colors hover:bg-primary/90 md:w-[158px]"
            href="/dashboard"
          >
            Acessar Sistema
          </a>
        </div>
      </main>
    </div>
  );
}
