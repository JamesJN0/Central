# 🛠️ Guia de Personalização

Este guia mostra como personalizar o sistema para suas necessidades específicas.

## 🎨 Mudanças Visuais Rápidas

### Alterar Cores Principais
No arquivo `style.css`, procure por:
```css
.header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

Troque por suas cores preferidas:
```css
.header {
    background: linear-gradient(135deg, #ff6b35 0%, #ff8b94 100%);
}
```

### Alterar Nome da Empresa
No arquivo `index.html`, linha 9:
```html
<title>Sistema de Controle - Micro Empresa</title>
```

E na linha 14:
```html
<h1><i class="fas fa-chart-line"></i> Controle Empresarial</h1>
```

## 📝 Adicionar Novas Categorias

### 1. Adicionar no HTML
No arquivo `index.html`, procure pelos selects de categoria e adicione:
```html
<option value="marketing">Marketing</option>
<option value="viagem">Viagens</option>
<option value="equipamentos">Equipamentos</option>
```

### 2. Adicionar Tradução
No arquivo `script.js`, na função `traduzirCategoria()`:
```javascript
function traduzirCategoria(categoria) {
    const traducoes = {
        'salarios': 'Salários',
        'aluguel': 'Aluguel',
        // Adicione aqui:
        'marketing': 'Marketing e Publicidade',
        'viagem': 'Viagens e Hospedagem',
        'equipamentos': 'Equipamentos'
    };
    return traducoes[categoria] || categoria;
}
```

## 📊 Personalizar Dashboard

### Adicionar Novo Card
No arquivo `index.html`, dentro da div `cards-grid`:
```html
<div class="card summary-card">
    <div class="card-icon purple">
        <i class="fas fa-chart-pie"></i>
    </div>
    <div class="card-content">
        <h3>Meta do Mês</h3>
        <p class="value" id="metaMes">R$ 10.000,00</p>
    </div>
</div>
```

E no CSS, adicione a cor:
```css
.card-icon.purple { 
    background: linear-gradient(135deg, #a8b8ff 0%, #667eea 100%); 
}
```

## 🏪 Campos Específicos do Negócio

### Adicionar Fornecedor ao Estoque
1. **No HTML** (modal estoque):
```html
<div class="form-group">
    <label for="fornecedorProduto">Fornecedor:</label>
    <input type="text" id="fornecedorProduto">
</div>
```

2. **No JavaScript** (função salvarItemEstoque):
```javascript
const item = {
    nome: document.getElementById('nomeProduto').value,
    fornecedor: document.getElementById('fornecedorProduto').value, // Novo campo
    quantidade: parseInt(document.getElementById('quantidadeProduto').value),
    // ... resto dos campos
};
```

3. **Na Tabela** (carregarTabelaEstoque):
```html
<th>Fornecedor</th> <!-- Adicionar no cabeçalho -->
<td>${item.fornecedor || 'N/A'}</td> <!-- Adicionar na linha -->
```

## 📱 Adaptações Mobile

### Ocultar Colunas no Mobile
No arquivo `style.css`:
```css
@media (max-width: 480px) {
    .coluna-opcional {
        display: none;
    }
}
```

E marque as colunas que podem ser ocultadas:
```html
<th class="coluna-opcional">Data Atualização</th>
```

## 🔢 Campos Numéricos Personalizados

### Adicionar Desconto nos Produtos
```javascript
// No formulário:
<div class="form-group">
    <label for="descontoProduto">Desconto (%):</label>
    <input type="number" id="descontoProduto" min="0" max="100" step="0.1">
</div>

// No cálculo (script.js):
const valorComDesconto = item.valorUnitario * (1 - item.desconto/100);
```

## 📈 Relatórios Personalizados

### Adicionar Relatório por Fornecedor
No arquivo `script.js`:
```javascript
function gerarRelatorioFornecedores() {
    const fornecedores = {};
    
    dados.estoque.forEach(item => {
        if (!fornecedores[item.fornecedor]) {
            fornecedores[item.fornecedor] = {
                produtos: 0,
                valorTotal: 0
            };
        }
        fornecedores[item.fornecedor].produtos++;
        fornecedores[item.fornecedor].valorTotal += item.quantidade * item.valorUnitario;
    });
    
    // Gerar HTML do relatório...
}
```

## 🎯 Metas e Objetivos

### Sistema de Metas Mensais
```javascript
// Adicionar aos dados:
dados.metas = {
    vendas: 10000,
    gastos: 8000,
    lucro: 2000
};

// Calcular percentual atingido:
function calcularPercentualMeta(valorAtual, meta) {
    return ((valorAtual / meta) * 100).toFixed(1);
}
```

## 🔔 Alertas Personalizados

### Alerta de Aniversário de Funcionários
```javascript
function verificarAniversarios() {
    const hoje = new Date();
    const funcionariosAniversariantes = dados.funcionarios.filter(func => {
        const dataAdmissao = new Date(func.dataAdmissao);
        return dataAdmissao.getMonth() === hoje.getMonth() &&
               dataAdmissao.getDate() === hoje.getDate();
    });
    
    if (funcionariosAniversariantes.length > 0) {
        alert(`Hoje é aniversário de contratação de: ${funcionariosAniversariantes.map(f => f.nome).join(', ')}`);
    }
}
```

## 💾 Backup Automático

### Backup Semanal
```javascript
function criarBackupAutomatico() {
    const ultimoBackup = localStorage.getItem('ultimoBackup');
    const agora = new Date().getTime();
    
    if (!ultimoBackup || (agora - ultimoBackup) > (7 * 24 * 60 * 60 * 1000)) {
        const backup = localStorage.getItem('sistemaControle');
        localStorage.setItem('backup_' + new Date().toISOString().split('T')[0], backup);
        localStorage.setItem('ultimoBackup', agora);
    }
}
```

## 🔒 Proteção por Senha

### Adicionar Login Simples
```javascript
function verificarSenha() {
    const senha = prompt('Digite a senha para acessar o sistema:');
    if (senha !== 'suasenha123') {
        alert('Senha incorreta!');
        return false;
    }
    return true;
}

// Chamar no início:
if (!verificarSenha()) {
    document.body.innerHTML = '<h1>Acesso Negado</h1>';
}
```

---

**Dica**: Sempre faça backup dos seus dados antes de fazer modificações importantes no código!
