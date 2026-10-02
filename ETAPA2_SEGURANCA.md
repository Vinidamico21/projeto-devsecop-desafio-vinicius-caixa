# 🔐 ETAPA 2: Implementar Security Scanning

## Status: ✅ PIPELINE INICIADA

A pipeline foi disparada com sucesso após o push para `main`. A pipeline irá executar com as seguintes ferramentas de segurança:

---

## 📊 Ferramentas Sendo Testadas

### 1. 🔑 Gitleaks - Secrets Scanning
**O que faz:** Detecta credenciais, tokens, API keys e outras informações sensíveis hardcoded no código.

**Configuração:**
```yaml
uses: gitleaks/gitleaks-action@v2
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**O que procura:**
- API Keys
- AWS Credentials
- GitHub Tokens
- Senhas
- Private Keys
- Database Credentials

**Status esperado:** ✅ PASS (não há secrets no código)

---

### 2. 🔍 Semgrep - SAST (Static Application Security Testing)
**O que faz:** Análise estática de código para detectar vulnerabilidades como XSS, Code Injection, eval(), etc.

**Configuração:**
```bash
pip install semgrep
semgrep scan --config auto --config p/xss --error src/
```

**Flags:**
- `--config auto` - Usa as regras automáticas do Semgrep
- `--config p/xss` - Adiciona regras específicas para XSS
- `--error src/` - Analisa apenas a pasta `src/` e falha se encontrar erros

**Tipos de vulnerabilidades:**
- XSS (Cross-Site Scripting)
- SQL Injection
- Code Injection
- unsafe eval()
- Path Traversal
- Command Injection

**Status esperado:** ⚠️ PODE FALHAR (script.js tem uso de `appendChild` dinâmico)

---

### 3. 📦 Grype - SCA (Software Composition Analysis)
**O que faz:** Verifica as dependências do projeto em busca de vulnerabilidades conhecidas (CVEs).

**Configuração:**
```bash
curl -sSfL https://raw.githubusercontent.com/anchore/grype/main/install.sh | sh -s -- -b /usr/local/bin
grype dir:. --fail-on medium
```

**Flags:**
- `dir:.` - Escaneia o diretório atual
- `--fail-on medium` - Falha se encontrar vulnerabilidades de severidade MÉDIA ou superior

**Dependências do projeto:**
```json
{
  "lodash": "4.18.0",  // ⚠️ VERSÃO DESATUALIZADA - TEM CVEs
  "express": "4.21.2"  // ⚠️ VERSÃO ANTIGA - PODE TER CVEs
}
```

**Status esperado:** ❌ FAIL (lodash 4.18.0 tem vulnerabilidades conhecidas)

---

### 4. ✍️ Cosign - Artifact Signing
**O que faz:** Assina digitalmente os artefatos da build para garantir integridade e autenticidade.

**Configuração:**
```bash
uses: sigstore/cosign-installer@v3
```

**Status esperado:** ✅ PASS (assinatura MOCK funciona)

---

## 🎯 Cenários Esperados

### ✅ Steps que devem PASSAR

1. ✅ Checkout do código
2. ✅ Setup Node.js
3. ✅ Instalar dependências (`npm ci`)
4. ✅ Build real (`npm run build`)
5. ✅ Gitleaks (Secrets Scanning) - SEM SECRETS NO CÓDIGO
6. ✅ Cosign (Artifact Signing)

### ⚠️ Steps que podem ter problemas

7. **🔍 Semgrep (SAST)**
   - Pode falhar se detectar código inseguro em `script.js`
   - Principalmente pelo uso de `appendChild` com dados do usuário

8. **📦 Grype (SCA)**
   - ❌ **VAI FALHAR!** Porque:
     - `lodash@4.18.0` tem múltiplas vulnerabilidades conhecidas
     - `express@4.21.2` pode ter vulnerabilidades

---

## 🔍 Vulnerabilidades Esperadas

### Na Dependência: `lodash@4.18.0`

A versão 4.18.0 do lodash foi lançada em Junho de 2018 e tem múltiplas CVEs conhecidas:

- **CVE-2019-10744** - Prototype Pollution
- **CVE-2018-16487** - Zip Bomb vulnerability
- Outras vulnerabilidades de segurança

**Versão segura:** `4.17.21` ou superior

### Na Dependência: `express@4.21.2`

A versão 4.21.2 é relativamente recente (Nov 2024), mas pode ter vulnerabilidades em transitive dependencies.

---

## 📋 Fluxo Esperado de Execução

```
[DISPARADA] → npm install
           → npm build
           → [Gitleaks] - PASS ✅
           → [Semgrep] - PODE VARIAR ⚠️
           → [Grype] - ❌ FALHA (lodash CVE)
           → [Pipeline INTERROMPE AQUI]
```

---

## 🚀 Próximo Passo

Após a pipeline executar e falhar (ou passar), você verá na página de Actions do GitHub:

1. **Logs detalhados** de cada ferramenta
2. **Quais vulnerabilidades foram encontradas**
3. **Recomendações de correção**

Depois passaremos para:
- **ETAPA 3:** Corrigir as vulnerabilidades (atualizar dependências)
- **ETAPA 4:** Validar que a pipeline passa
- **ETAPA 5:** Deploy bem-sucedido
- **ETAPA 6:** Documentação final

---

## 📍 Como Monitorar

1. Vá para: **GitHub → Actions**
2. Clique em "🔐 Pipeline DevSecOps"
3. Veja o workflow executando em tempo real
4. Analise os logs de cada step

---

## ⏱️ Tempo Estimado

- Gitleaks: ~30 segundos
- Semgrep: ~1-2 minutos
- Grype: ~2-3 minutos
- **Total esperado:** ~5-7 minutos

---

**Status:** 🟡 AGUARDANDO EXECUÇÃO NO GITHUB  
**Timestamp:** 2024-10-02  
**Próxima ação:** Monitorar pipeline e analisar resultados

