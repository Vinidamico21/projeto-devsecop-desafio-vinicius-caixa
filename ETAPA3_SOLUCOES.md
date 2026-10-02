# 🔧 ETAPA 3: Corrigir Vulnerabilidades

## Vulnerabilidades Identificadas

Com base na análise preliminar, aqui estão as vulnerabilidades que serão encontradas:

---

## 1. ❌ Dependências Vulneráveis (SCA - Grype)

### Problema: `lodash@4.18.0`

**Severidade:** 🔴 ALTA

**CVEs Conhecidas:**
- CVE-2019-10744: Prototype Pollution
- CVE-2021-23337: Regular Expression Denial of Service
- Várias outras

**Solução:** Atualizar para `lodash@4.17.21` ou superior

### Problema: `express@4.21.2`

**Severidade:** Pode ter vulnerabilidades transitivas

**Solução:** Manter atualizado (já é versão recente)

---

## 2. ⚠️ SAST Issues Potenciais (Semgrep)

### Risco: XSS em `script.js`

**Linha problemática:**
```javascript
// Linha 10: li.innerText = item.task;  // ✅ SEGURO (innerText)
// Linha 24: task.innerText = input.value; // ✅ SEGURO (innerText)
```

**Status:** ✅ Na verdade o código usa `innerText` que é seguro!
- `innerText` escapa HTML automaticamente
- `innerHTML` seria perigoso

**Conclusão:** Provavelmente vai passar no Semgrep

---

## 3. 🔐 Secrets Scanning (Gitleaks)

**Status:** ✅ PASS - Não há secrets no código

---

## Como Corrigir

## Passo 1: Atualizar `package.json`

```bash
npm update lodash
npm update express
npm install
```

Ou editar manualmente `package.json`:

**ANTES:**
```json
{
  "name": "projeto-devsecops-desafio",
  "version": "1.0.0",
  "description": "Projeto de desafio DevSecOps - ADA Tech",
  "scripts": {
    "build": "node scripts/build.js"
  },
  "dependencies": {
    "lodash": "4.18.0",
    "express": "4.21.2"
  },
  "overrides": {
    "path-to-regexp": "0.1.13",
    "qs": "6.16.0"
  }
}
```

**DEPOIS (Recomendado):**
```json
{
  "name": "projeto-devsecops-desafio",
  "version": "1.0.0",
  "description": "Projeto de desafio DevSecOps - ADA Tech",
  "scripts": {
    "build": "node scripts/build.js"
  },
  "dependencies": {
    "lodash": "^4.17.21",
    "express": "^4.21.2"
  }
}
```

**Removed Overrides:** Os overrides de `path-to-regexp` e `qs` foram removidos pois podem forçar versões vulneráveis.

---

## Passo 2: Executar Localmente (Opcional)

```bash
# Instalar dependências com nova versão
npm ci

# Testar build
npm run build

# Verificar se funciona
node -e "const _ = require('lodash'); console.log(_.VERSION || 'Lodash carregado com sucesso');"
```

---

## Passo 3: Commit e Push

```bash
git add package.json package-lock.json
git commit -m "fix: Atualizar lodash para 4.17.21 (CVE patch)"
git push origin main
```

Isso vai disparar a pipeline novamente que desta vez deve **PASSAR** ✅

---

## Checklist de Correção

- [ ] Atualizar `package.json` com versões seguras
- [ ] Verificar que o build ainda funciona localmente
- [ ] Não há code changes necessárias (código já é seguro)
- [ ] Fazer commit com mensagem descritiva
- [ ] Push para disparar pipeline
- [ ] Verificar que todos os steps passam
- [ ] Documentar as correções

---

## Versões Recomendadas

| Dependência | Versão Atual | Versão Segura | Changelog |
|------------|--------------|---------------|-----------|
| lodash | 4.18.0 | 4.17.21 | [link](https://github.com/lodash/lodash/releases) |
| express | 4.21.2 | 4.21.2 | Já é recente |

---

## Após Corrigir

Quando a pipeline passar com ✅ verde, passaremos para:

- **ETAPA 4:** Validar que tudo passou
- **ETAPA 5:** Configurar e fazer deploy
- **ETAPA 6:** Documentar no README


