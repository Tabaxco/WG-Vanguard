if (!sessionStorage.getItem('usuario')) {
    window.location.href = '../login/login.html';
}

const API_PRODUTOS = 'http://localhost:8080/produtos';

function mostrarToast(mensagem, tipo) {
    const toast = document.getElementById('toast');
    toast.textContent = mensagem;
    toast.className = 'toast ' + tipo;
    setTimeout(() => { toast.className = 'toast hidden'; }, 3500);
}

function preencherForm(p) {
    document.getElementById('id_produto').value  = p.id         ?? '';
    document.getElementById('nome').value        = p.nome       ?? '';
    document.getElementById('preco').value       = p.preco      ?? '';
    document.getElementById('categoria').value   = p.categoria  ?? '';
    document.getElementById('tamanho').value     = p.tamanho    ?? '';
    document.getElementById('cor').value         = p.cor        ?? '';
    document.getElementById('fornecedor').value  = p.fornecedor ?? '';
    document.getElementById('quantidade').value  = p.quantidade ?? '';
}

function limparForm() {
    ['id_produto','nome','preco','fornecedor','quantidade'].forEach(id => {
        document.getElementById(id).value = '';
    });
    document.getElementById('categoria').value = '';
    document.getElementById('tamanho').value   = '';
    document.getElementById('cor').value       = '';
}

function coletarDados() {
    return {
        nome:       document.getElementById('nome').value.trim(),
        preco:      parseFloat(document.getElementById('preco').value),
        categoria:  document.getElementById('categoria').value,
        tamanho:    document.getElementById('tamanho').value,
        cor:        document.getElementById('cor').value,
        fornecedor: document.getElementById('fornecedor').value.trim(),
        quantidade: parseFloat(document.getElementById('quantidade').value)
    };
}

function validar(dados) {
    if (!dados.nome || !dados.fornecedor || !dados.categoria) {
        mostrarToast('Preencha todos os campos obrigatórios.', 'error');
        return false;
    }
    if (isNaN(dados.preco) || dados.preco < 0) {
        mostrarToast('Informe um preço válido utilizando apenas números.', 'error');
        return false;
    }
    if (isNaN(dados.quantidade) || dados.quantidade < 0) {
        mostrarToast('Informe a quantidade utilizando apenas números.', 'error');
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
            limparForm();
            return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        preencherForm(await res.json());
        mostrarToast('Produto encontrado.', 'success');
    } catch (err) {
        mostrarToast('Erro ao buscar produto. Verifique a conexão com a API.', 'error');
        limparForm();
    }
}

async function adicionarProduto() {
    const dados = coletarDados();
    if (!validar(dados)) return;
    try {
        const res = await fetch(API_PRODUTOS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        preencherForm(await res.json());
        mostrarToast('Produto adicionado com sucesso!', 'success');
    } catch (err) {
        mostrarToast('Erro ao adicionar produto.', 'error');
    }
}

async function salvarEdicao() {
    const id = document.getElementById('id_produto').value;
    if (!id) {
        mostrarToast('Pesquise um produto antes de editar.', 'error');
        return;
    }
    const dados = coletarDados();
    if (!validar(dados)) return;
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
        preencherForm(await res.json());
        mostrarToast('Produto atualizado com sucesso!', 'success');
    } catch (err) {
        mostrarToast('Erro ao atualizar produto.', 'error');
    }
}

async function deletarProduto() {
    const id = document.getElementById('id_produto').value;
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
        limparForm();
        document.getElementById('searchProdutoInput').value = '';
        mostrarToast('Produto deletado com sucesso.', 'success');
    } catch (err) {
        mostrarToast('Erro ao deletar produto.', 'error');
    }
}

document.getElementById('searchProdutoInput')
    .addEventListener('keydown', e => { if (e.key === 'Enter') pesquisarProduto(); });