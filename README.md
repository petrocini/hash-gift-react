# 🎁 HashGift - Amigo Secreto

Um app direto ao ponto para realizar sorteios de Amigo Secreto: rápido, sem cadastro e sem banco de dados.

🔗 **Acesse aqui:** [https://hash-gift-react-fmys.vercel.app](https://hash-gift-react-fmys.vercel.app)

## 💡 A Ideia (Serverless & Stateless)

Criei esse projeto para resolver a burocracia dos apps tradicionais de amigo secreto. Eu queria algo que seguisse o princípio **KISS (Keep It Simple, Stupid)**: sem login, sem e-mail e sem custos de infra.

A mágica aqui é que **não existe backend**. Usamos o conceito de "State in URL":

1. O sorteio roda 100% no seu navegador (Client-Side).
2. O resultado de cada pessoa é criptografado (AES) e embutido num link único.
3. O "banco de dados" é o próprio link que você envia no WhatsApp.

## 🛠️ Stack

- **Core:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Visual:** [Tailwind CSS](https://tailwindcss.com/)
- **Ícones:** Lucide React
- **Criptografia:** Crypto-JS
- **Deploy:** Vercel

## 🚀 Como funciona

1. **Cadastro:** Você coloca o nome da galera.
2. **Sorteio:** Um algoritmo garante que ninguém tire a si mesmo (Shuffle Circular).
3. **Envio:** O app gera um link criptografado pra cada um (ex: `app.com/revelar?q=HASH_MALUCO`).
4. **Revelação:** A pessoa clica, o app decodifica o hash da URL e mostra o resultado.

## ⚠️ Sobre a Segurança

Como o foco é privacidade e zero custo, a criptografia acontece no **Client-Side**.

**O que isso significa?** A chave de criptografia está no código do front. Para um amigo secreto entre amigos, é perfeito (evita o spoiler visual de ler o nome na URL). Mas, obviamente, não use essa mesma arquitetura para trafegar senhas ou dados bancários, beleza? 😉

## 📦 Rodando na sua máquina

Se quiser fuçar no código ou rodar local:

```bash
# Clone o repositório
git clone [https://github.com/petrocini/hash-gift-react.git](https://github.com/petrocini/hash-gift-react.git)

# Instale as dependências
npm install --legacy-peer-deps

# Rode o servidor
npm run dev
```
