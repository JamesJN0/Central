# 🌊 Sistema de Controle Empresarial - Balneário Central

## 🚀 **INSTALAÇÃO AUTOMÁTICA - NOVO!**

### **💻 Para PC/Notebook:**
1. **Clique duas vezes** no arquivo `INSTALAR.bat`
2. O sistema será instalado automaticamente
3. Um atalho aparecerá na área de trabalho
4. O sistema abrirá no navegador

### **📱 Para Celular/Tablet:**
1. Abra o arquivo `instalador-mobile.html` no celular
2. Clique em **"INSTALAR COMO APP"**
3. Confirme a instalação
4. O app aparecerá na tela inicial

---

Um sistema simples e completo para controle de estoque, gastos, funcionários e relatórios para micro empresas.

## 📱 Características

- **Responsivo**: Funciona perfeitamente em celular e computador
- **PWA**: Pode ser instalado como app no celular
- **Simples**: Interface intuitiva e fácil de usar
- **Completo**: Controla estoque, funcionários, despesas e gera relatórios
- **Calendário Visual**: Visualize gastos diretamente no calendário
- **Controle de Ponto**: Registre entrada e saída dos funcionários
- **Personalizável**: Fácil de modificar e adaptar às necessidades
- **Offline**: Funciona sem internet, dados salvos no navegador
- **🎨 Tema Água**: Design exclusivo do Balneário Central

## 🚀 Como Usar

### **MÉTODO FÁCIL (Recomendado):**
- **PC**: Execute `INSTALAR.bat`
- **Mobile**: Abra `instalador-mobile.html`

### **MÉTODO MANUAL:**
1. **Abrir o Sistema**
   - Abra o arquivo `index.html` em qualquer navegador
   - O sistema funcionará tanto no computador quanto no celular

2. **Instalar como App (PWA)**
   - **Android**: Chrome > Menu (⋮) > "Adicionar à tela inicial"
   - **iPhone**: Safari > Botão compartilhar > "Adicionar à Tela de Início"
   - **Desktop**: Chrome mostrará automaticamente o ícone de instalação

3. **Navegação**
   - Use as abas no topo para navegar entre as seções:
     - 🏠 **Dashboard**: Visão geral dos dados
     - 📦 **Estoque**: Controle de produtos
     - 👥 **Funcionários**: Gestão de pessoal
     - 🕒 **Controle de Ponto**: Registro de entrada/saída
     - 🧾 **Despesas**: Controle financeiro
     - 📅 **Calendário**: Visualização de gastos por dia
     - 📊 **Relatórios**: Análises e exportações

## 📋 Funcionalidades

### Dashboard
- Resumo do lucro do mês
- Total de gastos mensais
- Quantidade de itens em estoque
- Número de funcionários ativos
- Atividades recentes

### Controle de Estoque
- ➕ Adicionar novos produtos
- ✏️ Editar informações dos produtos
- 🗑️ Remover produtos
- ⚠️ Alertas de estoque baixo
- 💰 Cálculo automático do valor total

### Gestão de Funcionários
- ➕ Cadastrar funcionários
- ✏️ Editar dados dos funcionários
- 📊 Controle de salários
- 📅 Acompanhar tempo de empresa
- 💼 Gerenciar cargos

### Controle de Despesas
- ➕ Registrar despesas, receitas e perdas
- 🏷️ Categorizar gastos (aluguel, energia, salários, etc.)
- 📅 Filtrar por mês e categoria
- 💸 Acompanhar fluxo de caixa

### Calendário Visual de Gastos
- 📅 **Visualização mensal** com gastos por dia
- 🎯 **Clique no dia** para ver detalhes completos
- 💰 **Resumo diário** de receitas, despesas e saldo
- 📊 **Cores visuais** para identificar rapidamente dias com movimento
- 📱 **Totalmente responsivo** para uso no celular

### Controle de Ponto
- ⏰ **Registro rápido** de entrada e saída
- 👥 **Horários padrão** configuráveis por funcionário
- 📊 **Cálculo automático** de horas trabalhadas
- 📈 **Relatórios de pontualidade** e presença
- 🔍 **Filtros avançados** por funcionário e período

### Relatórios
- 📊 Relatório mensal detalhado
- 📈 Relatório anual
- 📦 Relatório de estoque
- 👥 Relatório de funcionários
- 💾 Exportar relatórios em HTML

## 🛠️ Personalização

### Adicionar Novas Categorias de Despesas
No arquivo `script.js`, localize a função `traduzirCategoria()` e adicione novas categorias:

```javascript
function traduzirCategoria(categoria) {
    const traducoes = {
        'salarios': 'Salários',
        'aluguel': 'Aluguel',
        'energia': 'Energia Elétrica',
        // Adicione suas categorias aqui
        'nova_categoria': 'Nome da Nova Categoria'
    };
    return traducoes[categoria] || categoria;
}
```

E no HTML, adicione as opções nos selects:
```html
<option value="nova_categoria">Nome da Nova Categoria</option>
```

### Alterar Cores e Estilo
Edite o arquivo `style.css` para personalizar:
- Cores do sistema
- Tamanhos de fonte
- Espaçamentos
- Efeitos visuais

### Adicionar Novos Campos
Para adicionar novos campos aos formulários:
1. Adicione o campo no HTML (nos modais)
2. Capture o valor no JavaScript (funções `salvar*`)
3. Exiba o valor nas tabelas

## 💾 Backup dos Dados

O sistema salva todos os dados no navegador (localStorage). Para fazer backup:

1. Abra o console do navegador (F12)
2. Digite: `console.log(localStorage.getItem('sistemaControle'))`
3. Copie e salve o resultado em um arquivo de texto

Para restaurar:
1. Abra o console do navegador
2. Digite: `localStorage.setItem('sistemaControle', 'COLE_AQUI_O_BACKUP')`
3. Recarregue a página

## 📱 Instalação no Celular

Para usar como um app no celular:

## 📱 Instalação como App (PWA)

O sistema é um Progressive Web App (PWA) e pode ser instalado como um aplicativo nativo:

### Benefícios da Instalação:
- 🚀 **Acesso mais rápido** - ícone na tela inicial
- 📱 **Interface de app nativo** - sem barra do navegador
- 🔄 **Funciona offline** - acesso mesmo sem internet
- 🔔 **Atualizações automáticas** - sempre a versão mais recente

### Como Instalar:

#### **Android (Chrome)**
1. Abra o sistema no Chrome
2. Toque no menu (⋮) no canto superior direito
3. Selecione "Adicionar à tela inicial"
4. Confirme a instalação

#### **iPhone (Safari)**
1. Abra o sistema no Safari
2. Toque no botão de compartilhar (□↗)
3. Role para baixo e selecione "Adicionar à Tela de Início"
4. Toque em "Adicionar"

#### **Desktop (Chrome/Edge)**
1. O navegador mostrará automaticamente um ícone de instalação
2. Clique no ícone ou vá em Menu > "Instalar aplicativo"
3. Confirme a instalação

### Android (Chrome)
1. Abra o sistema no Chrome
2. Toque no menu (⋮)
3. Selecione "Adicionar à tela inicial"

### iPhone (Safari)
1. Abra o sistema no Safari
2. Toque no botão de compartilhar
3. Selecione "Adicionar à Tela de Início"

## 🔧 Resolução de Problemas

### Dados não aparecem
- Verifique se o JavaScript está habilitado no navegador
- Limpe o cache do navegador
- Recarregue a página

### Sistema lento
- O sistema armazena dados localmente, performance depende do dispositivo
- Para muitos dados, considere fazer limpeza periódica

### Compatibilidade
- Funciona em todos os navegadores modernos
- Requer JavaScript habilitado
- Não funciona no Internet Explorer

## 📞 Suporte

Este é um sistema simples e autocontido. Para modificações específicas:
1. Consulte os comentários no código
2. Use as ferramentas de desenvolvedor do navegador (F12)
3. Teste sempre as modificações antes de usar

## 🔒 Segurança

- Dados são armazenados apenas no seu dispositivo
- Nenhuma informação é enviada para a internet
- Faça backups regulares dos seus dados
- Use o sistema em dispositivos seguros

---

**Sistema criado para ser simples, eficiente e personalizável para micro empresas.**
