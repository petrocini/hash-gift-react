# 🎁 HashGift - Amigo Secreto Serverless

Aplicação web para realizar sorteios de Amigo Secreto de forma rápida, gratuita e sem necessidade de banco de dados.

🔗 **Demo:** [Insira sua URL da Vercel aqui]

## 💡 A Ideia (Architecture Decision)

O objetivo deste projeto foi criar uma ferramenta que seguisse o princípio **KISS (Keep It Simple, Stupid)** e **Privacy-First**, eliminando custos de infraestrutura e complexidade de backend.

Diferente de apps tradicionais que salvam quem tirou quem em um banco de dados, o HashGift usa **State in URL**:

1. O sorteio é realizado localmente no navegador (Circular Shuffle).
2. O resultado é criptografado (AES) e embutido na URL.
3. O estado da aplicação "vive" apenas no link compartilhado.

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Criptografia:** [Crypto-JS](https://www.npmjs.com/package/crypto-js)
- **Deploy:** Vercel (Zero Config)

## 🚀 Como Funciona

1. **Cadastro:** O organizador insere os nomes dos participantes.
2. **Sorteio:** Um algoritmo de lista encadeada circular garante que ninguém tire a si mesmo.
3. **Distribuição:** A aplicação gera um link único para cada participante (ex: `app.com/revelar?q=HASH_ENCRIPTADO`).
4. **Revelação:** Ao abrir o link, a aplicação descriptografa o parâmetro da URL e revela o amigo secreto.

## ⚠️ Disclaimer (Uso Pessoal)

Este projeto utiliza criptografia simétrica no **Client-Side** para garantir a experiência do usuário (evitar spoilers visuais na URL).

**Não utilize para dados sensíveis.** Como a chave de criptografia reside no bundle do frontend, um usuário com conhecimentos técnicos avançados poderia, em teoria, descriptografar os links de outros participantes. Para o propósito de um jogo entre amigos (evitar ler o nome sem querer), a segurança é suficiente.

## 📦 Como rodar localmente

```bash
# Clone o repositório
git clone [https://github.com/seu-usuario/hash-gift.git](https://github.com/seu-usuario/hash-gift.git)

# Instale as dependências
npm install --legacy-peer-deps

# Rode o servidor de desenvolvimento
npm run dev
```
