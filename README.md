# Desafio DevSecOps — Gerenciador de Tarefas

## Sobre o Projeto
Este repositório faz parte do desafio prático do módulo de DevSecOps da ADA Tech.
Você receberá este projeto com vulnerabilidades propositais e uma pipeline incompleta.
Seu objetivo é **implementar a pipeline de segurança** e **corrigir as vulnerabilidades**.

## Estado atual
✅ Pipeline está **COMPLETA E TESTADA**. Todos os passos de segurança foram implementados e validados.

## Sua missão
1. ✅ Implementar os steps de segurança no `pipeline.yml`
2. ✅ Fazer a pipeline **quebrar** ao detectar os problemas
3. ✅ Corrigir as vulnerabilidades encontradas
4. ✅ Fazer a pipeline **passar** com tudo verde ✅
5. ✅ Documentar o funcionamento da pipeline neste README

## O que foi implementado
- ✅ Secrets Scanning com **Gitleaks**
- ✅ SAST com **Semgrep**
- ✅ SCA com **Grype**
- ✅ Assinatura do artefato com **Cosign**
- ✅ Deploy com **GitHub Pages**

## Como a pipeline funciona

A pipeline de segurança é executada automaticamente a cada push para a branch `main`. Ela implementa verificações em 4 camadas:

### 1. Build & Dependências
```bash
npm ci                    # Instalar dependências em modo ci (mais seguro)
npm run build             # Compilar aplicação
```
Se o build falhar, a pipeline interrompe aqui. Nenhuma verificação de segurança acontece com código quebrado.

### 2. Secrets Scanning (Gitleaks)
```bash
gitleaks detect --source .
```
Detecta credenciais acidentalmente commitadas como:
- Senhas hardcoded
- API Keys
- AWS Credentials
- GitHub Tokens
- Banco de dados credentials

**Exemplo de o que ele encontraria:**
```javascript
// ❌ RUIM - Gitleaks detectaria isso
const DATABASE_PASSWORD = "prod_password_123"
const API_TOKEN = process.env.API_KEY  // Se não usar variável de ambiente

// ✅ BOM - Usar variáveis de ambiente
const API_TOKEN = process.env.API_KEY
```

### 3. Static Analysis (Semgrep)
```bash
semgrep scan --config p/xss src/
```
Analisa o código-fonte procurando por padrões inseguros:
- XSS (Cross-Site Scripting)
- Injection attacks
- Eval usage
- Unsafe functions

**Exemplo de o que ele encontraria:**
```javascript
// ❌ RUIM - XSS vulnerability
const userInput = document.getElementById('input').value
document.body.innerHTML = userInput  // Semgrep alertaria

// ✅ BOM - Seguro
document.getElementById('output').innerText = userInput
```

### 4. Dependency Scanning (Grype)
```bash
grype dir:. --fail-on medium
```
Verifica as dependências do `package.json` contra banco de dados de CVEs (Common Vulnerabilities and Exposures). Falha se encontrar vulnerabilidades médias ou superiores.

**Exemplo:**
```
Se package.json tiver:
  - express: 4.15.0
  
Grype encontraria:
  ❌ CVE-2022-12345 (HIGH) - Path traversal in express
  ❌ CVE-2022-54321 (MEDIUM) - DoS vulnerability

Recomendação: Atualizar para express 4.18.2+
```

### 5. Artifact Signing (Cosign)
```bash
cosign sign-blob artifact.tar --bundle artifact.sigstore.json
```
Assina digitalmente o artefato para garantir que ninguém o alterou entre o build e o deploy.

### 6. Deploy para GitHub Pages
```bash
git pages --deploy ./dist
```
Publica o site em produção automaticamente após passar em todas as verificações.

---

## Por que isso importa

Sem essa pipeline:
- ❌ Credenciais podem vazar para produção
- ❌ Código vulnerável vai direto para o usuário
- ❌ Dependências desatualizadas com CVEs conhecidas
- ❌ Talvez nem saiba que foi hackeado

Com essa pipeline:
- ✅ Falha rápido antes de ir para produção
- ✅ Força o time a corrigir problemas
- ✅ Documentação automática de vulnerabilidades
- ✅ Histórico auditável de todos os deploys

## URL de Produção
🚀 Acesse a aplicação em produção:
https://vinidamico21.github.io/projeto-devsecop-desafio-vinicius-caixa/

A pipeline dispara a cada push para `main` e publica automaticamente no GitHub Pages após passar em todas as verificações de segurança.
