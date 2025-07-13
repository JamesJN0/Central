// Dados de exemplo para demonstração do sistema
// Para usar estes dados, copie o conteúdo e cole no console do navegador:
// localStorage.setItem('sistemaControle', JSON.stringify(DADOS_EXEMPLO))

const DADOS_EXEMPLO = {
    "estoque": [
        {
            "id": 1,
            "nome": "Camiseta Básica",
            "quantidade": 45,
            "valorUnitario": 29.90,
            "estoqueMinimo": 10,
            "dataUltimaAtualizacao": "2024-12-15T10:30:00.000Z"
        },
        {
            "id": 2,
            "nome": "Calça Jeans",
            "quantidade": 8,
            "valorUnitario": 89.90,
            "estoqueMinimo": 15,
            "dataUltimaAtualizacao": "2024-12-15T10:30:00.000Z"
        },
        {
            "id": 3,
            "nome": "Tênis Esportivo",
            "quantidade": 25,
            "valorUnitario": 159.90,
            "estoqueMinimo": 8,
            "dataUltimaAtualizacao": "2024-12-15T10:30:00.000Z"
        },
        {
            "id": 4,
            "nome": "Bolsa Feminina",
            "quantidade": 3,
            "valorUnitario": 79.90,
            "estoqueMinimo": 5,
            "dataUltimaAtualizacao": "2024-12-15T10:30:00.000Z"
        }
    ],
    "funcionarios": [
        {
            "id": 1,
            "nome": "Maria Silva",
            "cargo": "Vendedora",
            "salario": 2200.00,
            "dataAdmissao": "2024-03-15",
            "status": "ativo"
        },
        {
            "id": 2,
            "nome": "João Santos",
            "cargo": "Gerente",
            "salario": 3500.00,
            "dataAdmissao": "2024-01-10",
            "status": "ativo"
        },
        {
            "id": 3,
            "nome": "Ana Costa",
            "cargo": "Caixa",
            "salario": 1800.00,
            "dataAdmissao": "2024-06-20",
            "status": "ativo"
        }
    ],
    "despesas": [
        // Dezembro 2024
        {
            "id": 1,
            "descricao": "Aluguel da Loja",
            "categoria": "aluguel",
            "valor": 2500.00,
            "data": "2024-12-01",
            "tipo": "despesa"
        },
        {
            "id": 2,
            "descricao": "Energia Elétrica",
            "categoria": "energia",
            "valor": 450.80,
            "data": "2024-12-05",
            "tipo": "despesa"
        },
        {
            "id": 3,
            "descricao": "Venda de Roupas",
            "categoria": "receita",
            "valor": 3200.00,
            "data": "2024-12-08",
            "tipo": "receita"
        },
        {
            "id": 4,
            "descricao": "Salários Funcionários",
            "categoria": "salarios",
            "valor": 7500.00,
            "data": "2024-12-10",
            "tipo": "despesa"
        },
        {
            "id": 5,
            "descricao": "Internet e Telefone",
            "categoria": "telefone",
            "valor": 180.00,
            "data": "2024-12-12",
            "tipo": "despesa"
        },
        {
            "id": 6,
            "descricao": "Venda de Calçados",
            "categoria": "receita",
            "valor": 1850.00,
            "data": "2024-12-14",
            "tipo": "receita"
        },
        {
            "id": 7,
            "descricao": "Material de Limpeza",
            "categoria": "material",
            "valor": 120.50,
            "data": "2024-12-15",
            "tipo": "despesa"
        },
        {
            "id": 8,
            "descricao": "Perda por Roubo",
            "categoria": "outros",
            "valor": 300.00,
            "data": "2024-12-16",
            "tipo": "perda"
        },
        
        // Novembro 2024
        {
            "id": 9,
            "descricao": "Aluguel da Loja",
            "categoria": "aluguel",
            "valor": 2500.00,
            "data": "2024-11-01",
            "tipo": "despesa"
        },
        {
            "id": 10,
            "descricao": "Venda Black Friday",
            "categoria": "receita",
            "valor": 8500.00,
            "data": "2024-11-29",
            "tipo": "receita"
        },
        {
            "id": 11,
            "descricao": "Energia Elétrica",
            "categoria": "energia",
            "valor": 380.20,
            "data": "2024-11-05",
            "tipo": "despesa"
        },
        {
            "id": 12,
            "descricao": "Salários Funcionários",
            "categoria": "salarios",
            "valor": 7500.00,
            "data": "2024-11-10",
            "tipo": "despesa"
        },
        
        // Outubro 2024
        {
            "id": 13,
            "descricao": "Aluguel da Loja",
            "categoria": "aluguel",
            "valor": 2500.00,
            "data": "2024-10-01",
            "tipo": "despesa"
        },
        {
            "id": 14,
            "descricao": "Vendas Outubro",
            "categoria": "receita",
            "valor": 4200.00,
            "data": "2024-10-15",
            "tipo": "receita"
        },
        {
            "id": 15,
            "descricao": "Manutenção Ar Condicionado",
            "categoria": "manutencao",
            "valor": 250.00,
            "data": "2024-10-20",
            "tipo": "despesa"
        }
    ],
    "configuracoes": {
        "nomeEmpresa": "Loja da Maria",
        "moeda": "R$"
    }
};

// Instruções de uso:
// 1. Abra o console do navegador (F12)
// 2. Cole este comando: localStorage.setItem('sistemaControle', JSON.stringify(DADOS_EXEMPLO))
// 3. Recarregue a página do sistema
