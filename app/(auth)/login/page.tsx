'use client'

import { useActionState } from 'react'
import { login, LoginState } from '@/app/actions/auth'
import { SubmitButton } from '@/app/components/SubmitButton'

export default function LoginPage() {
  const [state, action] = useActionState<LoginState, FormData>(login, { error: null })

  return (
    <main className="relative min-h-screen w-full bg-zinc-950 flex items-center justify-center p-4 overflow-hidden">
      {/* MARCA D'ÁGUA EM SEGUNDO PLANO */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
        <img
          src="/logo.png"
          alt=""
          className="w-[650px] h-[650px] object-contain opacity-15 blur-sm scale-125 pointer-events-none"
        />
      </div>

      {/* CARD CENTRAL DE LOGIN */}
      <div className="relative z-10 w-full max-w-md p-8 bg-zinc-900/90 border border-zinc-800 rounded-2xl shadow-2xl backdrop-blur-md">
        <div className="flex flex-col items-center mb-6">
          <div className="rounded-xl overflow-hidden border border-zinc-700/50 p-1 bg-black">
            <img
              src="/logo.png"
              alt="Pitstop Oil e Lube"
              className="h-24 w-auto object-contain drop-shadow-md"
            />
          </div>
          <h1 className="text-xl font-bold text-white mt-4">Acesse sua conta</h1>
          <p className="text-sm text-zinc-400 text-center">
            Entre com suas credenciais para gerenciar a oficina
          </p>
        </div>

        <form action={action} className="space-y-4">
          {state?.error && (
            <p className="text-rose-400 text-sm bg-rose-500/10 p-3 rounded-md border border-rose-500/20 text-center">
              {state.error}
            </p>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="seu@email.com"
              className="w-full h-11 px-3 rounded-lg bg-zinc-800/90 border border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-rose-500 focus:outline-none transition-colors [&:-webkit-autofill]:[-webkit-text-fill-color:#f4f4f5] [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_1000px_#27272a_inset]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Senha
            </label>
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full h-11 px-3 rounded-lg bg-zinc-800/90 border border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-rose-500 focus:outline-none transition-colors [&:-webkit-autofill]:[-webkit-text-fill-color:#f4f4f5] [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_1000px_#27272a_inset]"
            />
          </div>

          <SubmitButton pendingText="Entrando...">
            Entrar
          </SubmitButton>
        </form>
      </div>
    </main>
  );
}
