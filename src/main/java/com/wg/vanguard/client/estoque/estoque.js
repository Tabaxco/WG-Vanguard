const API_PRODUTOS = 'http://localhost:8080/produtos';
const API_ESTOQUE  = 'http://localhost:8080/estoque';


function mostrarToast(mensagem, tipo) {
    const toast = document.getElementById('toast');
    toast.textContent = mensagem;
    toast.className = 'toast ' + tipo;
    setTimeout(() => { toast.className = 'toast hidden'; }, 3500);
}


function preencherFormProduto(p) {
    document.getElementById('produtoId').value  = p.id         ?? '';
    document.getElementById('nome').value        = p.nome       ?? '';
    document.getElementById('preco').value       = p.preco      ?? '';
    document.getElementById('categoria').value   = p.categoria  ?? '';
    document.getElementById('tamanho').value     = p.tamanho    ?? '';
    document.getElementById('fornecedor').value  = p.fornecedor ?? '';
}

function limparFormProduto() {
    ['produtoId', 'nome', 'preco', 'fornecedor'].forEach(id => {
        document.getElementById(id).value = '';
    });
    document.getElementById('categoria').value = '';
    document.getElementById('tamanho').value   = '';
}

function coletarDadosProduto() {
    return {
        nome:       document.getElementById('nome').value.trim(),
        preco:      parseFloat(document.getElementById('preco').value),
        categoria:  document.getElementById('categoria').value,
        tamanho:    document.getElementById('tamanho').value,
        fornecedor: document.getElementById('fornecedor').value.trim()
    };
}

function validarProduto(dados) {
    if (!dados.nome || !dados.fornecedor || !dados.categoria) {
        mostrarToast('Preencha todos os campos obrigatórios do produto.', 'error');
        return false;
    }
    if (isNaN(dados.preco) || dados.preco < 0) {
        mostrarToast('Informe um preço válido.', 'error');
        return false;
    }
    return true;
}


async function pesquisarProduto() {
    const q = document.getElementById('searchProdutoInput').value.trim();
    if (!q || isNaN(Number(q))) {
        mostrarToast('Digite um ID numérico válido para pesquisar.', 'error');
        return;
    }
    try {
        const res = await fetch(`${API_PRODUTOS}/${q}`);
        if (res.status === 404) {
            mostrarToast('Produto não encontrado.', 'error');
            limparFormProduto();
            return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        preencherFormProduto(data);
        mostrarToast('Produto encontrado.', 'success');
    } catch (err) {
        console.error('pesquisarProduto:', err);
        mostrarToast('Erro ao buscar produto. Verifique a conexão com a API.', 'error');
        limparFormProduto();
    }
}

async function adicionarProduto() {
    const dados = coletarDadosProduto();
    if (!validarProduto(dados)) return;
    try {
        const res = await fetch(API_PRODUTOS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const criado = await res.json();
        preencherFormProduto(criado);
        mostrarToast('Produto adicionado com sucesso!', 'success');
    } catch (err) {
        console.error('adicionarProduto:', err);
        mostrarToast('Erro ao adicionar produto.', 'error');
    }
}

async function salvarEdicaoProduto() {
    const id = document.getElementById('produtoId').value;
    if (!id) {
        mostrarToast('Pesquise um produto antes de editar.', 'error');
        return;
    }
    const dados = coletarDadosProduto();
    if (!validarProduto(dados)) return;
    try {
        const res = await fetch(`${API_PRODUTOS}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        if (res.status === 404) {
            mostrarToast('Produto não encontrado para atualização.', 'error');
            return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const atualizado = await res.json();
        preencherFormProduto(atualizado);
        mostrarToast('Produto atualizado com sucesso!', 'success');
    } catch (err) {
        console.error('salvarEdicaoProduto:', err);
        mostrarToast('Erro ao atualizar produto.', 'error');
    }
}

async function deletarProduto() {
    const id = document.getElementById('produtoId').value;
    if (!id) {
        mostrarToast('Pesquise um produto antes de deletar.', 'error');
        return;
    }
    if (!confirm(`Tem certeza que deseja deletar o produto #${id}?`)) return;
    try {
        const res = await fetch(`${API_PRODUTOS}/${id}`, { method: 'DELETE' });
        if (res.status === 404) {
            mostrarToast('Produto não encontrado.', 'error');
            return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        limparFormProduto();
        document.getElementById('searchProdutoInput').value = '';
        mostrarToast('Produto deletado com sucesso.', 'success');
    } catch (err) {
        console.error('deletarProduto:', err);
        mostrarToast('Erro ao deletar produto.', 'error');
    }
}


function preencherFormEstoque(e) {
    document.getElementById('estoqueProdutoId').value = e.produtoId  ?? '';
    document.getElementById('quantidade').value       = e.quantidade ?? '';
}

function limparFormEstoque() {
    ['estoqueProdutoId', 'quantidade'].forEach(id => {
        document.getElementById(id).value = '';
    });
}

function coletarDadosEstoque() {
    return {
        produtoId:  parseInt(document.getElementById('estoqueProdutoId').value),
        quantidade: parseFloat(document.getElementById('quantidade').value)
    };
}

function validarEstoque(dados) {
    if (!dados.produtoId || isNaN(dados.produtoId)) {
        mostrarToast('Informe o ID do produto para o estoque.', 'error');
        return false;
    }
    if (isNaN(dados.quantidade) || dados.quantidade < 0) {
        mostrarToast('Informe uma quantidade válida.', 'error');
        return false;
    }
    return true;
}


async function pesquisarEstoque() {
    const q = document.getElementById('searchEstoqueInput').value.trim();
    if (!q || isNaN(Number(q))) {
        mostrarToast('Digite um ID numérico válido para pesquisar.', 'error');
        return;
    }
    try {
        const res = await fetch(`${API_ESTOQUE}/${q}`);
        if (res.status === 404) {
            mostrarToast('Registro de estoque não encontrado.', 'error');
            limparFormEstoque();
            return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        preencherFormEstoque(data);
        mostrarToast('Estoque encontrado.', 'success');
    } catch (err) {
        console.error('pesquisarEstoque:', err);
        mostrarToast('Erro ao buscar estoque. Verifique a conexão com a API.', 'error');
        limparFormEstoque();
    }
}

async function adicionarEstoque() {
    const dados = coletarDadosEstoque();
    if (!validarEstoque(dados)) return;
    try {
        const res = await fetch(API_ESTOQUE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const criado = await res.json();
        preencherFormEstoque(criado);
        mostrarToast('Estoque adicionado com sucesso!', 'success');
    } catch (err) {
        console.error('adicionarEstoque:', err);
        mostrarToast('Erro ao adicionar estoque.', 'error');
    }
}

async function salvarEdicaoEstoque() {
    const id = document.getElementById('estoqueProdutoId').value;
    if (!id) {
        mostrarToast('Pesquise um registro de estoque antes de editar.', 'error');
        return;
    }
    const dados = coletarDadosEstoque();
    if (!validarEstoque(dados)) return;
    try {
        const res = await fetch(`${API_ESTOQUE}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        if (res.status === 404) {
            mostrarToast('Registro não encontrado para atualização.', 'error');
            return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const atualizado = await res.json();
        preencherFormEstoque(atualizado);
        mostrarToast('Estoque atualizado com sucesso!', 'success');
    } catch (err) {
        console.error('salvarEdicaoEstoque:', err);
        mostrarToast('Erro ao atualizar estoque.', 'error');
    }
}

async function deletarEstoque() {
    const id = document.getElementById('estoqueProdutoId').value;
    if (!id) {
        mostrarToast('Pesquise um registro de estoque antes de deletar.', 'error');
        return;
    }
    if (!confirm(`Tem certeza que deseja deletar o estoque do produto #${id}?`)) return;
    try {
        const res = await fetch(`${API_ESTOQUE}/${id}`, { method: 'DELETE' });
        if (res.status === 404) {
            mostrarToast('Registro de estoque não encontrado.', 'error');
            return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        limparFormEstoque();
        document.getElementById('searchEstoqueInput').value = '';
        mostrarToast('Estoque deletado com sucesso.', 'success');
    } catch (err) {
        console.error('deletarEstoque:', err);
        mostrarToast('Erro ao deletar estoque.', 'error');
    }
}


document.getElementById('searchProdutoInput')
    .addEventListener('keydown', e => { if (e.key === 'Enter') pesquisarProduto(); });

document.getElementById('searchEstoqueInput')
    .addEventListener('keydown', e => { if (e.key === 'Enter') pesquisarEstoque(); });