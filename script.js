// Sistema de Controle Empresarial
// Dados do sistema (armazenados no localStorage)
let dados = {
    estoque: [],
    funcionarios: [],
    despesas: [],
    pontos: [],
    configuracoes: {
        nomeEmpresa: 'Minha Empresa',
        moeda: 'R$'
    }
};

// Carregamento inicial
document.addEventListener('DOMContentLoaded', function() {
    carregarDados();
    configurarEventos();
    atualizarDashboard();
    carregarTabelas();
    inicializarCalendario();
    
    // Configurar data atual nos campos de data
    const hoje = new Date().toISOString().split('T')[0];
    const mesAtual = new Date().toISOString().slice(0, 7);
    
    document.getElementById('dataDespesa').value = hoje;
    document.getElementById('dataAdmissao').value = hoje;
    document.getElementById('filtroMes').value = mesAtual;
    document.getElementById('periodoRelatorio').value = mesAtual;
    document.getElementById('filtroPontoData').value = hoje;
    document.getElementById('filtroPontoMes').value = mesAtual;
});

// Configuração de eventos
function configurarEventos() {
    // Navegação por abas
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            trocarAba(tabId);
        });
    });
    
    // Fechar modais clicando fora
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            fecharModal(event.target.id);
        }
    });
}

// Gerenciamento de dados (localStorage)
function salvarDados() {
    localStorage.setItem('sistemaControle', JSON.stringify(dados));
}

function carregarDados() {
    const dadosSalvos = localStorage.getItem('sistemaControle');
    if (dadosSalvos) {
        dados = JSON.parse(dadosSalvos);
    }
    
    // Dados de exemplo se não houver dados salvos
    if (dados.estoque.length === 0 && dados.funcionarios.length === 0 && dados.despesas.length === 0 && dados.pontos.length === 0) {
        criarDadosExemplo();
    }
}

function criarDadosExemplo() {
    // Itens de estoque de exemplo
    dados.estoque = [
        {
            id: 1,
            nome: 'Produto A',
            quantidade: 50,
            valorUnitario: 25.00,
            estoqueMinimo: 10,
            dataUltimaAtualizacao: new Date().toISOString()
        },
        {
            id: 2,
            nome: 'Produto B',
            quantidade: 5,
            valorUnitario: 45.00,
            estoqueMinimo: 15,
            dataUltimaAtualizacao: new Date().toISOString()
        }
    ];
    
    // Funcionários de exemplo
    dados.funcionarios = [
        {
            id: 1,
            nome: 'João Silva',
            cargo: 'Vendedor',
            salario: 2500.00,
            dataAdmissao: '2024-01-15',
            horarioEntrada: '08:00',
            horarioSaida: '18:00',
            status: 'ativo'
        }
    ];
    
    // Despesas de exemplo
    dados.despesas = [
        {
            id: 1,
            descricao: 'Energia Elétrica',
            categoria: 'energia',
            valor: 380.50,
            data: '2024-12-01',
            tipo: 'despesa'
        },
        {
            id: 2,
            descricao: 'Venda de Produtos',
            categoria: 'receita',
            valor: 1250.00,
            data: '2024-12-10',
            tipo: 'receita'
        }
    ];
    
    // Registros de ponto de exemplo
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(hoje.getDate() - 1);
    
    dados.pontos = [
        {
            id: 1,
            funcionarioId: 1,
            data: ontem.toISOString().split('T')[0],
            entrada: '08:15',
            saida: '18:30',
            observacoes: ''
        },
        {
            id: 2,
            funcionarioId: 1,
            data: hoje.toISOString().split('T')[0],
            entrada: '08:00',
            saida: null,
            observacoes: 'Funcionário ainda no trabalho'
        }
    ];
    
    salvarDados();
}

// Navegação
function trocarAba(tabId) {
    // Remover classe active de todas as abas
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Adicionar classe active na aba selecionada
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(tabId).classList.add('active');
    
    // Atualizar conteúdo específico da aba
    if (tabId === 'dashboard') {
        atualizarDashboard();
    } else if (tabId === 'relatorios') {
        gerarRelatorio();
    } else if (tabId === 'calendario') {
        carregarCalendario();
    }
}

// Dashboard
function atualizarDashboard() {
    const mesAtual = new Date().getMonth();
    const anoAtual = new Date().getFullYear();
    
    // Calcular valores do mês atual
    const despesasMes = dados.despesas.filter(d => {
        const dataDespesa = new Date(d.data);
        return dataDespesa.getMonth() === mesAtual && 
               dataDespesa.getFullYear() === anoAtual &&
               d.tipo === 'despesa';
    }).reduce((total, d) => total + d.valor, 0);
    
    const receitasMes = dados.despesas.filter(d => {
        const dataDespesa = new Date(d.data);
        return dataDespesa.getMonth() === mesAtual && 
               dataDespesa.getFullYear() === anoAtual &&
               d.tipo === 'receita';
    }).reduce((total, d) => total + d.valor, 0);
    
    const lucroMes = receitasMes - despesasMes;
    
    // Atualizar cards do dashboard
    document.getElementById('lucroMes').textContent = formatarMoeda(lucroMes);
    document.getElementById('gastosMes').textContent = formatarMoeda(despesasMes);
    document.getElementById('itensEstoque').textContent = dados.estoque.length;
    document.getElementById('totalFuncionarios').textContent = dados.funcionarios.filter(f => f.status === 'ativo').length;
    
    // Atualizar atividades recentes
    atualizarAtividadesRecentes();
}

function atualizarAtividadesRecentes() {
    const container = document.getElementById('atividadesRecentes');
    const atividades = [];
    
    // Adicionar últimas despesas
    dados.despesas.slice(-5).forEach(despesa => {
        atividades.push({
            tipo: despesa.tipo,
            titulo: despesa.descricao,
            valor: despesa.valor,
            data: despesa.data,
            icon: despesa.tipo === 'receita' ? 'fa-plus' : 'fa-minus',
            color: despesa.tipo === 'receita' ? '#28a745' : '#dc3545'
        });
    });
    
    // Ordenar por data (mais recente primeiro)
    atividades.sort((a, b) => new Date(b.data) - new Date(a.data));
    
    container.innerHTML = atividades.map(ativ => `
        <div class="activity-item">
            <div class="activity-icon" style="background: ${ativ.color}">
                <i class="fas ${ativ.icon}"></i>
            </div>
            <div class="activity-content">
                <div class="title">${ativ.titulo}</div>
                <div class="time">${formatarData(ativ.data)} - ${formatarMoeda(ativ.valor)}</div>
            </div>
        </div>
    `).join('');
}

// Estoque
function carregarTabelaEstoque() {
    const tbody = document.getElementById('tabelaEstoque');
    
    tbody.innerHTML = dados.estoque.map(item => {
        const total = item.quantidade * item.valorUnitario;
        const status = item.quantidade <= item.estoqueMinimo ? 'baixo' : 'ok';
        const statusTexto = item.quantidade <= item.estoqueMinimo ? 'Estoque Baixo' : 'Normal';
        
        return `
            <tr>
                <td>${item.nome}</td>
                <td>${item.quantidade}</td>
                <td>${formatarMoeda(item.valorUnitario)}</td>
                <td>${formatarMoeda(total)}</td>
                <td><span class="status-badge status-${status}">${statusTexto}</span></td>
                <td>
                    <button class="btn btn-warning" onclick="editarItemEstoque(${item.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="excluirItemEstoque(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function abrirModalEstoque(id = null) {
    const modal = document.getElementById('modalEstoque');
    const titulo = document.getElementById('tituloModalEstoque');
    const form = document.getElementById('formEstoque');
    
    if (id) {
        const item = dados.estoque.find(i => i.id === id);
        titulo.textContent = 'Editar Item do Estoque';
        document.getElementById('nomeProduto').value = item.nome;
        document.getElementById('quantidadeProduto').value = item.quantidade;
        document.getElementById('valorUnitario').value = item.valorUnitario;
        document.getElementById('estoqueMinimo').value = item.estoqueMinimo;
        form.dataset.editId = id;
    } else {
        titulo.textContent = 'Adicionar Item ao Estoque';
        form.reset();
        delete form.dataset.editId;
    }
    
    modal.style.display = 'block';
}

function salvarItemEstoque(event) {
    event.preventDefault();
    
    const form = event.target;
    const editId = form.dataset.editId;
    
    const item = {
        nome: document.getElementById('nomeProduto').value,
        quantidade: parseInt(document.getElementById('quantidadeProduto').value),
        valorUnitario: parseFloat(document.getElementById('valorUnitario').value),
        estoqueMinimo: parseInt(document.getElementById('estoqueMinimo').value),
        dataUltimaAtualizacao: new Date().toISOString()
    };
    
    if (editId) {
        const index = dados.estoque.findIndex(i => i.id === parseInt(editId));
        dados.estoque[index] = { ...dados.estoque[index], ...item };
    } else {
        item.id = Date.now();
        dados.estoque.push(item);
    }
    
    salvarDados();
    carregarTabelaEstoque();
    fecharModal('modalEstoque');
    atualizarDashboard();
}

function editarItemEstoque(id) {
    abrirModalEstoque(id);
}

function excluirItemEstoque(id) {
    if (confirm('Tem certeza que deseja excluir este item?')) {
        dados.estoque = dados.estoque.filter(i => i.id !== id);
        salvarDados();
        carregarTabelaEstoque();
        atualizarDashboard();
    }
}

// Funcionários
function carregarTabelaFuncionarios() {
    const tbody = document.getElementById('tabelaFuncionarios');
    
    tbody.innerHTML = dados.funcionarios.map(func => {
        const horario = `${func.horarioEntrada || '08:00'} - ${func.horarioSaida || '18:00'}`;
        return `
            <tr>
                <td>${func.nome}</td>
                <td>${func.cargo}</td>
                <td>${formatarMoeda(func.salario)}</td>
                <td>${horario}</td>
                <td>${formatarData(func.dataAdmissao)}</td>
                <td><span class="status-badge status-${func.status}">${func.status.toUpperCase()}</span></td>
                <td>
                    <button class="btn btn-warning" onclick="editarFuncionario(${func.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="excluirFuncionario(${func.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function abrirModalFuncionario(id = null) {
    const modal = document.getElementById('modalFuncionario');
    const titulo = document.getElementById('tituloModalFuncionario');
    const form = document.getElementById('formFuncionario');
    
    if (id) {
        const func = dados.funcionarios.find(f => f.id === id);
        titulo.textContent = 'Editar Funcionário';
        document.getElementById('nomeFuncionario').value = func.nome;
        document.getElementById('cargoFuncionario').value = func.cargo;
        document.getElementById('salarioFuncionario').value = func.salario;
        document.getElementById('dataAdmissao').value = func.dataAdmissao;
        document.getElementById('horarioEntrada').value = func.horarioEntrada || '08:00';
        document.getElementById('horarioSaida').value = func.horarioSaida || '18:00';
        form.dataset.editId = id;
    } else {
        titulo.textContent = 'Adicionar Funcionário';
        form.reset();
        document.getElementById('dataAdmissao').value = new Date().toISOString().split('T')[0];
        document.getElementById('horarioEntrada').value = '08:00';
        document.getElementById('horarioSaida').value = '18:00';
        delete form.dataset.editId;
    }
    
    modal.style.display = 'block';
}

function salvarFuncionario(event) {
    event.preventDefault();
    
    const form = event.target;
    const editId = form.dataset.editId;
    
    const funcionario = {
        nome: document.getElementById('nomeFuncionario').value,
        cargo: document.getElementById('cargoFuncionario').value,
        salario: parseFloat(document.getElementById('salarioFuncionario').value),
        dataAdmissao: document.getElementById('dataAdmissao').value,
        horarioEntrada: document.getElementById('horarioEntrada').value,
        horarioSaida: document.getElementById('horarioSaida').value,
        status: 'ativo'
    };
    
    if (editId) {
        const index = dados.funcionarios.findIndex(f => f.id === parseInt(editId));
        dados.funcionarios[index] = { ...dados.funcionarios[index], ...funcionario };
    } else {
        funcionario.id = Date.now();
        dados.funcionarios.push(funcionario);
    }
    
    salvarDados();
    carregarTabelaFuncionarios();
    carregarSelectsFuncionarios();
    fecharModal('modalFuncionario');
    atualizarDashboard();
}

function editarFuncionario(id) {
    abrirModalFuncionario(id);
}

function excluirFuncionario(id) {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
        dados.funcionarios = dados.funcionarios.filter(f => f.id !== id);
        salvarDados();
        carregarTabelaFuncionarios();
        carregarSelectsFuncionarios();
        atualizarDashboard();
    }
}

// Despesas
function carregarTabelaDespesas() {
    let despesasFiltradas = [...dados.despesas];
    
    // Aplicar filtros
    const filtroCategoria = document.getElementById('filtroCategoria').value;
    const filtroMes = document.getElementById('filtroMes').value;
    
    if (filtroCategoria) {
        despesasFiltradas = despesasFiltradas.filter(d => d.categoria === filtroCategoria);
    }
    
    if (filtroMes) {
        despesasFiltradas = despesasFiltradas.filter(d => {
            return d.data.startsWith(filtroMes);
        });
    }
    
    const tbody = document.getElementById('tabelaDespesas');
    
    tbody.innerHTML = despesasFiltradas.map(despesa => {
        const tipoClass = despesa.tipo === 'receita' ? 'text-success' : 
                         despesa.tipo === 'perda' ? 'text-warning' : 'text-danger';
        
        return `
            <tr>
                <td>${despesa.descricao}</td>
                <td>${traduzirCategoria(despesa.categoria)}</td>
                <td class="${tipoClass}">${formatarMoeda(despesa.valor)}</td>
                <td>${formatarData(despesa.data)}</td>
                <td><span class="status-badge status-${despesa.tipo}">${despesa.tipo.toUpperCase()}</span></td>
                <td>
                    <button class="btn btn-warning" onclick="editarDespesa(${despesa.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="excluirDespesa(${despesa.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function abrirModalDespesa(id = null) {
    const modal = document.getElementById('modalDespesa');
    const titulo = document.getElementById('tituloModalDespesa');
    const form = document.getElementById('formDespesa');
    
    if (id) {
        const despesa = dados.despesas.find(d => d.id === id);
        titulo.textContent = 'Editar Despesa';
        document.getElementById('descricaoDespesa').value = despesa.descricao;
        document.getElementById('categoriaDespesa').value = despesa.categoria;
        document.getElementById('valorDespesa').value = despesa.valor;
        document.getElementById('dataDespesa').value = despesa.data;
        document.getElementById('tipoDespesa').value = despesa.tipo;
        form.dataset.editId = id;
    } else {
        titulo.textContent = 'Adicionar Despesa';
        form.reset();
        document.getElementById('dataDespesa').value = new Date().toISOString().split('T')[0];
        delete form.dataset.editId;
    }
    
    modal.style.display = 'block';
}

function salvarDespesa(event) {
    event.preventDefault();
    
    const form = event.target;
    const editId = form.dataset.editId;
    
    const despesa = {
        descricao: document.getElementById('descricaoDespesa').value,
        categoria: document.getElementById('categoriaDespesa').value,
        valor: parseFloat(document.getElementById('valorDespesa').value),
        data: document.getElementById('dataDespesa').value,
        tipo: document.getElementById('tipoDespesa').value
    };
    
    if (editId) {
        const index = dados.despesas.findIndex(d => d.id === parseInt(editId));
        dados.despesas[index] = { ...dados.despesas[index], ...despesa };
    } else {
        despesa.id = Date.now();
        dados.despesas.push(despesa);
    }
    
    salvarDados();
    carregarTabelaDespesas();
    fecharModal('modalDespesa');
    atualizarDashboard();
}

function editarDespesa(id) {
    abrirModalDespesa(id);
}

function excluirDespesa(id) {
    if (confirm('Tem certeza que deseja excluir esta despesa?')) {
        dados.despesas = dados.despesas.filter(d => d.id !== id);
        salvarDados();
        carregarTabelaDespesas();
        atualizarDashboard();
    }
}

function filtrarDespesas() {
    carregarTabelaDespesas();
}

// Controle de Ponto
function carregarTabelaPonto() {
    let pontosFiltrados = [...dados.pontos];
    
    // Aplicar filtros
    const filtroFuncionario = document.getElementById('filtroPontoFuncionario').value;
    const filtroData = document.getElementById('filtroPontoData').value;
    const filtroMes = document.getElementById('filtroPontoMes').value;
    
    if (filtroFuncionario) {
        pontosFiltrados = pontosFiltrados.filter(p => p.funcionarioId === parseInt(filtroFuncionario));
    }
    
    if (filtroData) {
        pontosFiltrados = pontosFiltrados.filter(p => p.data === filtroData);
    }
    
    if (filtroMes) {
        pontosFiltrados = pontosFiltrados.filter(p => p.data.startsWith(filtroMes));
    }
    
    const tbody = document.getElementById('tabelaPonto');
    
    tbody.innerHTML = pontosFiltrados.map(ponto => {
        const funcionario = dados.funcionarios.find(f => f.id === ponto.funcionarioId);
        const funcionarioNome = funcionario ? funcionario.nome : 'Funcionário não encontrado';
        
        let horasTrabalhadas = 'N/A';
        let status = 'ausente';
        
        if (ponto.entrada && ponto.saida) {
            const entrada = new Date(`2000-01-01T${ponto.entrada}`);
            const saida = new Date(`2000-01-01T${ponto.saida}`);
            const diffMs = saida - entrada;
            const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
            const diffMinutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            horasTrabalhadas = `${diffHoras}h ${diffMinutos}m`;
            status = 'presente';
        } else if (ponto.entrada && !ponto.saida) {
            horasTrabalhadas = 'Em andamento';
            status = 'parcial';
        }
        
        return `
            <tr>
                <td>${funcionarioNome}</td>
                <td>${formatarData(ponto.data)}</td>
                <td>${ponto.entrada || 'N/A'}</td>
                <td>${ponto.saida || 'N/A'}</td>
                <td>${horasTrabalhadas}</td>
                <td><span class="status-badge status-${status}">${status.toUpperCase()}</span></td>
                <td>
                    <button class="btn btn-warning" onclick="editarPonto(${ponto.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="excluirPonto(${ponto.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function carregarSelectsFuncionarios() {
    const funcionariosAtivos = dados.funcionarios.filter(f => f.status === 'ativo');
    
    // Atualizar select do registro rápido
    const selectRapido = document.getElementById('funcionarioRapido');
    selectRapido.innerHTML = '<option value="">Selecione um funcionário</option>' +
        funcionariosAtivos.map(f => `<option value="${f.id}">${f.nome}</option>`).join('');
    
    // Atualizar select do modal de ponto
    const selectModal = document.getElementById('funcionarioPonto');
    selectModal.innerHTML = '<option value="">Selecione um funcionário</option>' +
        funcionariosAtivos.map(f => `<option value="${f.id}">${f.nome}</option>`).join('');
    
    // Atualizar filtro de funcionários
    const filtroFuncionario = document.getElementById('filtroPontoFuncionario');
    filtroFuncionario.innerHTML = '<option value="">Todos os Funcionários</option>' +
        funcionariosAtivos.map(f => `<option value="${f.id}">${f.nome}</option>`).join('');
}

function registrarEntrada() {
    const funcionarioId = document.getElementById('funcionarioRapido').value;
    if (!funcionarioId) {
        alert('Selecione um funcionário');
        return;
    }
    
    const hoje = new Date().toISOString().split('T')[0];
    const agora = new Date().toTimeString().slice(0, 5);
    
    // Verificar se já existe registro para hoje
    const registroExistente = dados.pontos.find(p => 
        p.funcionarioId === parseInt(funcionarioId) && p.data === hoje
    );
    
    if (registroExistente) {
        if (registroExistente.entrada) {
            alert('Entrada já registrada para hoje');
            return;
        }
        registroExistente.entrada = agora;
    } else {
        const novoPonto = {
            id: Date.now(),
            funcionarioId: parseInt(funcionarioId),
            data: hoje,
            entrada: agora,
            saida: null,
            observacoes: 'Registro automático de entrada'
        };
        dados.pontos.push(novoPonto);
    }
    
    salvarDados();
    carregarTabelaPonto();
    alert('Entrada registrada com sucesso!');
}

function registrarSaida() {
    const funcionarioId = document.getElementById('funcionarioRapido').value;
    if (!funcionarioId) {
        alert('Selecione um funcionário');
        return;
    }
    
    const hoje = new Date().toISOString().split('T')[0];
    const agora = new Date().toTimeString().slice(0, 5);
    
    // Procurar registro de hoje
    const registroHoje = dados.pontos.find(p => 
        p.funcionarioId === parseInt(funcionarioId) && p.data === hoje
    );
    
    if (!registroHoje) {
        alert('Nenhum registro de entrada encontrado para hoje');
        return;
    }
    
    if (registroHoje.saida) {
        alert('Saída já registrada para hoje');
        return;
    }
    
    registroHoje.saida = agora;
    
    salvarDados();
    carregarTabelaPonto();
    alert('Saída registrada com sucesso!');
}

function abrirModalPonto(id = null) {
    const modal = document.getElementById('modalPonto');
    const titulo = document.getElementById('tituloModalPonto');
    const form = document.getElementById('formPonto');
    
    if (id) {
        const ponto = dados.pontos.find(p => p.id === id);
        titulo.textContent = 'Editar Registro de Ponto';
        document.getElementById('funcionarioPonto').value = ponto.funcionarioId;
        document.getElementById('dataPonto').value = ponto.data;
        document.getElementById('horaEntradaPonto').value = ponto.entrada || '';
        document.getElementById('horaSaidaPonto').value = ponto.saida || '';
        document.getElementById('observacoesPonto').value = ponto.observacoes || '';
        form.dataset.editId = id;
    } else {
        titulo.textContent = 'Registrar Ponto';
        form.reset();
        document.getElementById('dataPonto').value = new Date().toISOString().split('T')[0];
        delete form.dataset.editId;
    }
    
    modal.style.display = 'block';
}

function salvarPonto(event) {
    event.preventDefault();
    
    const form = event.target;
    const editId = form.dataset.editId;
    
    const ponto = {
        funcionarioId: parseInt(document.getElementById('funcionarioPonto').value),
        data: document.getElementById('dataPonto').value,
        entrada: document.getElementById('horaEntradaPonto').value || null,
        saida: document.getElementById('horaSaidaPonto').value || null,
        observacoes: document.getElementById('observacoesPonto').value || ''
    };
    
    if (editId) {
        const index = dados.pontos.findIndex(p => p.id === parseInt(editId));
        dados.pontos[index] = { ...dados.pontos[index], ...ponto };
    } else {
        ponto.id = Date.now();
        dados.pontos.push(ponto);
    }
    
    salvarDados();
    carregarTabelaPonto();
    fecharModal('modalPonto');
}

function editarPonto(id) {
    abrirModalPonto(id);
}

function excluirPonto(id) {
    if (confirm('Tem certeza que deseja excluir este registro de ponto?')) {
        dados.pontos = dados.pontos.filter(p => p.id !== id);
        salvarDados();
        carregarTabelaPonto();
    }
}

function filtrarPonto() {
    carregarTabelaPonto();
}

// Calendário
function inicializarCalendario() {
    const hoje = new Date();
    document.getElementById('mesCalendario').value = hoje.getMonth();
    document.getElementById('anoCalendario').value = hoje.getFullYear();
    carregarCalendario();
}

function carregarCalendario() {
    const mes = parseInt(document.getElementById('mesCalendario').value);
    const ano = parseInt(document.getElementById('anoCalendario').value);
    
    const grid = document.getElementById('calendarioGrid');
    grid.innerHTML = '';
    
    // Cabeçalhos dos dias da semana
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    diasSemana.forEach(dia => {
        const header = document.createElement('div');
        header.className = 'calendario-header';
        header.textContent = dia;
        grid.appendChild(header);
    });
    
    // Primeiro dia do mês e último dia do mês anterior
    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);
    const primeiroDiaSemana = primeiroDia.getDay();
    
    // Dias do mês anterior
    const ultimoDiaMesAnterior = new Date(ano, mes, 0).getDate();
    for (let i = primeiroDiaSemana - 1; i >= 0; i--) {
        const dia = ultimoDiaMesAnterior - i;
        const elemento = criarElementoDia(dia, mes - 1, ano, true);
        grid.appendChild(elemento);
    }
    
    // Dias do mês atual
    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
        const elemento = criarElementoDia(dia, mes, ano, false);
        grid.appendChild(elemento);
    }
    
    // Dias do próximo mês para completar a grade
    const diasRestantes = 42 - (primeiroDiaSemana + ultimoDia.getDate());
    for (let dia = 1; dia <= diasRestantes; dia++) {
        const elemento = criarElementoDia(dia, mes + 1, ano, true);
        grid.appendChild(elemento);
    }
}

function criarElementoDia(dia, mes, ano, outroMes) {
    const elemento = document.createElement('div');
    elemento.className = 'calendario-dia';
    
    if (outroMes) {
        elemento.classList.add('outro-mes');
    }
    
    // Verificar se é hoje
    const hoje = new Date();
    if (!outroMes && dia === hoje.getDate() && mes === hoje.getMonth() && ano === hoje.getFullYear()) {
        elemento.classList.add('hoje');
    }
    
    const dataStr = `${ano}-${(mes + 1).toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
    
    // Calcular gastos do dia
    const gastosDialogados = calcularGastosDia(dataStr);
    
    elemento.innerHTML = `
        <div class="dia-numero">${dia}</div>
        <div class="dia-gastos">
            ${gastosDialogados.receitas > 0 ? `<div class="dia-receitas">+${formatarMoedaSimples(gastosDialogados.receitas)}</div>` : ''}
            ${gastosDialogados.despesas > 0 ? `<div class="dia-despesas">-${formatarMoedaSimples(gastosDialogados.despesas)}</div>` : ''}
            ${(gastosDialogados.receitas > 0 || gastosDialogados.despesas > 0) ? 
                `<div class="dia-saldo ${gastosDialogados.saldo >= 0 ? 'positivo' : 'negativo'}">${formatarMoedaSimples(gastosDialogados.saldo)}</div>` : ''}
        </div>
    `;
    
    elemento.addEventListener('click', () => mostrarDetalhesDia(dataStr));
    
    return elemento;
}

function calcularGastosDia(data) {
    const gastosOperacao = dados.despesas.filter(d => d.data === data);
    
    const receitas = gastosOperacao.filter(d => d.tipo === 'receita').reduce((sum, d) => sum + d.valor, 0);
    const despesas = gastosOperação.filter(d => d.tipo === 'despesa').reduce((sum, d) => sum + d.valor, 0);
    const perdas = gastosOperação.filter(d => d.tipo === 'perda').reduce((sum, d) => sum + d.valor, 0);
    
    return {
        receitas,
        despesas: despesas + perdas,
        saldo: receitas - despesas - perdas,
        transacoes: gastosOperação
    };
}

function mostrarDetalhesDia(data) {
    // Remover seleção anterior
    document.querySelectorAll('.calendario-dia.selected').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Adicionar seleção ao dia clicado
    event.target.closest('.calendario-dia').classList.add('selected');
    
    const detalhes = calcularGastosDia(data);
    const dataFormatada = formatarData(data);
    
    document.getElementById('diaDetalhesTitulo').textContent = `Gastos de ${dataFormatada}`;
    document.getElementById('receitasDia').textContent = formatarMoeda(detalhes.receitas);
    document.getElementById('despesasDia').textContent = formatarMoeda(detalhes.despesas);
    document.getElementById('saldoDia').textContent = formatarMoeda(detalhes.saldo);
    
    // Atualizar cores do saldo
    const saldoElement = document.getElementById('saldoDia');
    saldoElement.style.color = detalhes.saldo >= 0 ? '#28a745' : '#dc3545';
    
    // Mostrar transações
    const transacoesContainer = document.getElementById('diaTransacoes');
    if (detalhes.transacoes.length === 0) {
        transacoesContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Nenhuma transação neste dia</p>';
    } else {
        transacoesContainer.innerHTML = detalhes.transacoes.map(transacao => `
            <div class="transacao-item">
                <div class="transacao-info">
                    <div class="transacao-descricao">${transacao.descricao}</div>
                    <div class="transacao-categoria">${traduzirCategoria(transacao.categoria)}</div>
                </div>
                <div class="transacao-valor ${transacao.tipo}">
                    ${transacao.tipo === 'receita' ? '+' : '-'}${formatarMoeda(transacao.valor)}
                </div>
            </div>
        `).join('');
    }
    
    // Mostrar seção de detalhes
    document.getElementById('diaDetalhes').style.display = 'block';
    
    // Rolar para a seção de detalhes
    document.getElementById('diaDetalhes').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Relatórios
function gerarRelatorio() {
    const tipoRelatorio = document.getElementById('tipoRelatorio').value;
    const periodo = document.getElementById('periodoRelatorio').value;
    const container = document.getElementById('relatorioContent');
    
    let conteudo = '';
    
    switch (tipoRelatorio) {
        case 'mensal':
            conteudo = gerarRelatorioMensal(periodo);
            break;
        case 'anual':
            conteudo = gerarRelatorioAnual(periodo);
            break;
        case 'estoque':
            conteudo = gerarRelatorioEstoque();
            break;
        case 'funcionarios':
            conteudo = gerarRelatorioFuncionarios();
            break;
        case 'ponto':
            conteudo = gerarRelatorioPonto(periodo);
            break;
    }
    
    container.innerHTML = conteudo;
}

function gerarRelatorioMensal(periodo) {
    const [ano, mes] = periodo.split('-');
    const mesInt = parseInt(mes) - 1;
    
    const despesasMes = dados.despesas.filter(d => {
        const dataDespesa = new Date(d.data);
        return dataDespesa.getMonth() === mesInt && dataDespesa.getFullYear() === parseInt(ano);
    });
    
    const receitas = despesasMes.filter(d => d.tipo === 'receita').reduce((sum, d) => sum + d.valor, 0);
    const despesas = despesasMes.filter(d => d.tipo === 'despesa').reduce((sum, d) => sum + d.valor, 0);
    const perdas = despesasMes.filter(d => d.tipo === 'perda').reduce((sum, d) => sum + d.valor, 0);
    const lucro = receitas - despesas - perdas;
    
    return `
        <h3>Relatório Mensal - ${formatarMesPT(mes)}/${ano}</h3>
        
        <div class="cards-grid mb-3">
            <div class="card">
                <h4>Receitas</h4>
                <p class="value" style="color: #28a745">${formatarMoeda(receitas)}</p>
            </div>
            <div class="card">
                <h4>Despesas</h4>
                <p class="value" style="color: #dc3545">${formatarMoeda(despesas)}</p>
            </div>
            <div class="card">
                <h4>Perdas</h4>
                <p class="value" style="color: #ffc107">${formatarMoeda(perdas)}</p>
            </div>
            <div class="card">
                <h4>Lucro Líquido</h4>
                <p class="value" style="color: ${lucro >= 0 ? '#28a745' : '#dc3545'}">${formatarMoeda(lucro)}</p>
            </div>
        </div>
        
        <h4>Detalhamento por Categoria</h4>
        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Categoria</th>
                        <th>Quantidade</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${gerarDetalhamentoCategorias(despesasMes)}
                </tbody>
            </table>
        </div>
    `;
}

function gerarRelatorioAnual(periodo) {
    const ano = periodo.split('-')[0];
    
    const despesasAno = dados.despesas.filter(d => {
        return new Date(d.data).getFullYear() === parseInt(ano);
    });
    
    const receitas = despesasAno.filter(d => d.tipo === 'receita').reduce((sum, d) => sum + d.valor, 0);
    const despesas = despesasAno.filter(d => d.tipo === 'despesa').reduce((sum, d) => sum + d.valor, 0);
    const perdas = despesasAno.filter(d => d.tipo === 'perda').reduce((sum, d) => sum + d.valor, 0);
    const lucro = receitas - despesas - perdas;
    
    return `
        <h3>Relatório Anual - ${ano}</h3>
        
        <div class="cards-grid mb-3">
            <div class="card">
                <h4>Receitas Totais</h4>
                <p class="value" style="color: #28a745">${formatarMoeda(receitas)}</p>
            </div>
            <div class="card">
                <h4>Despesas Totais</h4>
                <p class="value" style="color: #dc3545">${formatarMoeda(despesas)}</p>
            </div>
            <div class="card">
                <h4>Perdas Totais</h4>
                <p class="value" style="color: #ffc107">${formatarMoeda(perdas)}</p>
            </div>
            <div class="card">
                <h4>Lucro Líquido</h4>
                <p class="value" style="color: ${lucro >= 0 ? '#28a745' : '#dc3545'}">${formatarMoeda(lucro)}</p>
            </div>
        </div>
        
        <h4>Distribuição Mensal</h4>
        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Mês</th>
                        <th>Receitas</th>
                        <th>Despesas</th>
                        <th>Lucro</th>
                    </tr>
                </thead>
                <tbody>
                    ${gerarDistribuicaoMensal(despesasAno, ano)}
                </tbody>
            </table>
        </div>
    `;
}

function gerarRelatorioEstoque() {
    const valorTotalEstoque = dados.estoque.reduce((sum, item) => sum + (item.quantidade * item.valorUnitario), 0);
    const itensEstoqueBaixo = dados.estoque.filter(item => item.quantidade <= item.estoqueMinimo);
    
    return `
        <h3>Relatório de Estoque</h3>
        
        <div class="cards-grid mb-3">
            <div class="card">
                <h4>Valor Total do Estoque</h4>
                <p class="value">${formatarMoeda(valorTotalEstoque)}</p>
            </div>
            <div class="card">
                <h4>Itens em Estoque</h4>
                <p class="value">${dados.estoque.length}</p>
            </div>
            <div class="card">
                <h4>Itens com Estoque Baixo</h4>
                <p class="value" style="color: #ffc107">${itensEstoqueBaixo.length}</p>
            </div>
        </div>
        
        <h4>Situação do Estoque</h4>
        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Produto</th>
                        <th>Quantidade Atual</th>
                        <th>Estoque Mínimo</th>
                        <th>Valor Unitário</th>
                        <th>Valor Total</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${dados.estoque.map(item => {
                        const status = item.quantidade <= item.estoqueMinimo ? 'Baixo' : 'Normal';
                        const statusClass = item.quantidade <= item.estoqueMinimo ? 'text-warning' : 'text-success';
                        return `
                            <tr>
                                <td>${item.nome}</td>
                                <td>${item.quantidade}</td>
                                <td>${item.estoqueMinimo}</td>
                                <td>${formatarMoeda(item.valorUnitario)}</td>
                                <td>${formatarMoeda(item.quantidade * item.valorUnitario)}</td>
                                <td class="${statusClass}">${status}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function gerarRelatorioFuncionarios() {
    const funcionariosAtivos = dados.funcionarios.filter(f => f.status === 'ativo');
    const custoTotalFolha = funcionariosAtivos.reduce((sum, f) => sum + f.salario, 0);
    const mediaSalarial = custoTotalFolha / funcionariosAtivos.length || 0;
    
    return `
        <h3>Relatório de Funcionários</h3>
        
        <div class="cards-grid mb-3">
            <div class="card">
                <h4>Funcionários Ativos</h4>
                <p class="value">${funcionariosAtivos.length}</p>
            </div>
            <div class="card">
                <h4>Custo Total da Folha</h4>
                <p class="value">${formatarMoeda(custoTotalFolha)}</p>
            </div>
            <div class="card">
                <h4>Média Salarial</h4>
                <p class="value">${formatarMoeda(mediaSalarial)}</p>
            </div>
        </div>
        
        <h4>Lista de Funcionários</h4>
        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Cargo</th>
                        <th>Salário</th>
                        <th>Data de Admissão</th>
                        <th>Tempo na Empresa</th>
                    </tr>
                </thead>
                <tbody>
                    ${funcionariosAtivos.map(func => {
                        const tempoEmpresa = calcularTempoEmpresa(func.dataAdmissao);
                        return `
                            <tr>
                                <td>${func.nome}</td>
                                <td>${func.cargo}</td>
                                <td>${formatarMoeda(func.salario)}</td>
                                <td>${formatarData(func.dataAdmissao)}</td>
                                <td>${tempoEmpresa}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function gerarRelatorioPonto(periodo) {
    const [ano, mes] = periodo.split('-');
    const mesInt = parseInt(mes) - 1;
    
    const pontosMes = dados.pontos.filter(p => {
        const dataPonto = new Date(p.data);
        return dataPonto.getMonth() === mesInt && dataPonto.getFullYear() === parseInt(ano);
    });
    
    // Calcular estatísticas
    const totalRegistros = pontosMes.length;
    const registrosCompletos = pontosMes.filter(p => p.entrada && p.saida).length;
    const registrosIncompletos = pontosMes.filter(p => p.entrada && !p.saida).length;
    
    let totalHorasTrabalhadas = 0;
    pontosMes.forEach(ponto => {
        if (ponto.entrada && ponto.saida) {
            const entrada = new Date(`2000-01-01T${ponto.entrada}`);
            const saida = new Date(`2000-01-01T${ponto.saida}`);
            const diffMs = saida - entrada;
            totalHorasTrabalhadas += diffMs / (1000 * 60 * 60);
        }
    });
    
    const mediaHorasDiarias = totalHorasTrabalhadas / registrosCompletos || 0;
    
    return `
        <h3>Relatório de Ponto - ${formatarMesPT(mes)}/${ano}</h3>
        
        <div class="cards-grid mb-3">
            <div class="card">
                <h4>Total de Registros</h4>
                <p class="value">${totalRegistros}</p>
            </div>
            <div class="card">
                <h4>Registros Completos</h4>
                <p class="value" style="color: #28a745">${registrosCompletos}</p>
            </div>
            <div class="card">
                <h4>Registros Incompletos</h4>
                <p class="value" style="color: #ffc107">${registrosIncompletos}</p>
            </div>
            <div class="card">
                <h4>Média Horas/Dia</h4>
                <p class="value">${mediaHorasDiarias.toFixed(1)}h</p>
            </div>
        </div>
        
        <h4>Detalhamento por Funcionário</h4>
        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Funcionário</th>
                        <th>Dias Trabalhados</th>
                        <th>Total de Horas</th>
                        <th>Média Diária</th>
                        <th>Pontualidade</th>
                    </tr>
                </thead>
                <tbody>
                    ${gerarEstatisticasPorFuncionario(pontosMes)}
                </tbody>
            </table>
        </div>
        
        <h4>Registros Detalhados</h4>
        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Funcionário</th>
                        <th>Entrada</th>
                        <th>Saída</th>
                        <th>Horas Trabalhadas</th>
                        <th>Observações</th>
                    </tr>
                </thead>
                <tbody>
                    ${pontosMes.map(ponto => {
                        const funcionario = dados.funcionarios.find(f => f.id === ponto.funcionarioId);
                        const funcionarioNome = funcionario ? funcionario.nome : 'N/A';
                        
                        let horasTrabalhadas = 'N/A';
                        if (ponto.entrada && ponto.saida) {
                            const entrada = new Date(`2000-01-01T${ponto.entrada}`);
                            const saida = new Date(`2000-01-01T${ponto.saida}`);
                            const diffMs = saida - entrada;
                            const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
                            const diffMinutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                            horasTrabalhadas = `${diffHoras}h ${diffMinutos}m`;
                        } else if (ponto.entrada && !ponto.saida) {
                            horasTrabalhadas = 'Em andamento';
                        }
                        
                        return `
                            <tr>
                                <td>${formatarData(ponto.data)}</td>
                                <td>${funcionarioNome}</td>
                                <td>${ponto.entrada || 'N/A'}</td>
                                <td>${ponto.saida || 'N/A'}</td>
                                <td>${horasTrabalhadas}</td>
                                <td>${ponto.observacoes || '-'}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Funções auxiliares para relatórios
function gerarEstatisticasPorFuncionario(pontos) {
    const estatisticas = {};
    
    // Agrupar por funcionário
    pontos.forEach(ponto => {
        if (!estatisticas[ponto.funcionarioId]) {
            const funcionario = dados.funcionarios.find(f => f.id === ponto.funcionarioId);
            estatisticas[ponto.funcionarioId] = {
                nome: funcionario ? funcionario.nome : 'N/A',
                horarioEntrada: funcionario ? funcionario.horarioEntrada : '08:00',
                diasTrabalhados: 0,
                totalHoras: 0,
                registrosPontuais: 0,
                totalRegistros: 0
            };
        }
        
        const est = estatisticas[ponto.funcionarioId];
        est.totalRegistros++;
        
        if (ponto.entrada && ponto.saida) {
            est.diasTrabalhados++;
            const entrada = new Date(`2000-01-01T${ponto.entrada}`);
            const saida = new Date(`2000-01-01T${ponto.saida}`);
            const diffMs = saida - entrada;
            est.totalHoras += diffMs / (1000 * 60 * 60);
            
            // Verificar pontualidade (tolerância de 15 minutos)
            const horarioEsperado = new Date(`2000-01-01T${est.horarioEntrada}`);
            const tolerancia = 15 * 60 * 1000; // 15 minutos em ms
            if (Math.abs(entrada - horarioEsperado) <= tolerancia) {
                est.registrosPontuais++;
            }
        }
    });
    
    return Object.values(estatisticas).map(est => {
        const mediaDiaria = est.diasTrabalhados > 0 ? (est.totalHoras / est.diasTrabalhados).toFixed(1) : '0.0';
        const pontualidade = est.totalRegistros > 0 ? ((est.registrosPontuais / est.totalRegistros) * 100).toFixed(0) : '0';
        
        return `
            <tr>
                <td>${est.nome}</td>
                <td>${est.diasTrabalhados}</td>
                <td>${est.totalHoras.toFixed(1)}h</td>
                <td>${mediaDiaria}h</td>
                <td>${pontualidade}%</td>
            </tr>
        `;
    }).join('');
}

function gerarDetalhamentoCategorias(despesas) {
    const categorias = {};
    
    despesas.forEach(d => {
        if (!categorias[d.categoria]) {
            categorias[d.categoria] = { quantidade: 0, total: 0 };
        }
        categorias[d.categoria].quantidade++;
        categorias[d.categoria].total += d.valor;
    });
    
    return Object.entries(categorias).map(([categoria, dados]) => `
        <tr>
            <td>${traduzirCategoria(categoria)}</td>
            <td>${dados.quantidade}</td>
            <td>${formatarMoeda(dados.total)}</td>
        </tr>
    `).join('');
}

function gerarDistribuicaoMensal(despesas, ano) {
    const meses = Array.from({length: 12}, (_, i) => {
        const despesasMes = despesas.filter(d => {
            const data = new Date(d.data);
            return data.getMonth() === i;
        });
        
        const receitas = despesasMes.filter(d => d.tipo === 'receita').reduce((sum, d) => sum + d.valor, 0);
        const gastos = despesasMes.filter(d => d.tipo === 'despesa').reduce((sum, d) => sum + d.valor, 0);
        const lucro = receitas - gastos;
        
        return {
            mes: i + 1,
            receitas,
            gastos,
            lucro
        };
    });
    
    return meses.map(m => `
        <tr>
            <td>${formatarMesPT(m.mes.toString().padStart(2, '0'))}</td>
            <td style="color: #28a745">${formatarMoeda(m.receitas)}</td>
            <td style="color: #dc3545">${formatarMoeda(m.gastos)}</td>
            <td style="color: ${m.lucro >= 0 ? '#28a745' : '#dc3545'}">${formatarMoeda(m.lucro)}</td>
        </tr>
    `).join('');
}

function exportarRelatorio() {
    const conteudo = document.getElementById('relatorioContent').innerHTML;
    const tipoRelatorio = document.getElementById('tipoRelatorio').value;
    
    // Criar um novo documento HTML com o conteúdo do relatório
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Relatório - ${tipoRelatorio}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px; }
                .card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
                .value { font-size: 18px; font-weight: bold; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
            </style>
        </head>
        <body>
            ${conteudo}
        </body>
        </html>
    `;
    
    // Criar e baixar o arquivo
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-${tipoRelatorio}-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Modais
function fecharModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Funções utilitárias
function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function formatarMoedaSimples(valor) {
    if (valor >= 1000) {
        return `R$ ${(valor / 1000).toFixed(1)}k`;
    }
    return `R$ ${valor.toFixed(0)}`;
}

function formatarData(dataString) {
    const data = new Date(dataString + 'T00:00:00');
    return data.toLocaleDateString('pt-BR');
}

function formatarMesPT(mes) {
    const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return meses[parseInt(mes) - 1];
}

function traduzirCategoria(categoria) {
    const traducoes = {
        'salarios': 'Salários',
        'aluguel': 'Aluguel',
        'energia': 'Energia Elétrica',
        'agua': 'Água',
        'telefone': 'Telefone/Internet',
        'material': 'Material de Escritório',
        'manutencao': 'Manutenção',
        'outros': 'Outros',
        'receita': 'Receita'
    };
    return traducoes[categoria] || categoria;
}

function calcularTempoEmpresa(dataAdmissao) {
    const hoje = new Date();
    const admissao = new Date(dataAdmissao);
    const diffTime = Math.abs(hoje - admissao);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
        return `${diffDays} dias`;
    } else if (diffDays < 365) {
        const meses = Math.floor(diffDays / 30);
        return `${meses} mês${meses > 1 ? 'es' : ''}`;
    } else {
        const anos = Math.floor(diffDays / 365);
        const mesesRestantes = Math.floor((diffDays % 365) / 30);
        return `${anos} ano${anos > 1 ? 's' : ''} e ${mesesRestantes} mês${mesesRestantes > 1 ? 'es' : ''}`;
    }
}

function carregarTabelas() {
    carregarTabelaEstoque();
    carregarTabelaFuncionarios();
    carregarTabelaDespesas();
    carregarTabelaPonto();
    carregarSelectsFuncionarios();
}
