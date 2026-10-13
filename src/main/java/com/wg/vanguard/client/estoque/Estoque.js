if (!sessionStorage.getItem('usuario')) {
    window.location.href = '../login/login.html';
}

const API_PRODUTOS     = 'http://localhost:8080/produtos';
const API_VARIACOES    = 'http://localhost:8080/produtosvariacao';
const API_FORNECEDORES = 'http://localhost:8080/fornecedores';

let atual = null;

const el = id => document.getElementById(id);

function mostrarToast(mensagem, tipo) {
    const toast = el('toast');
    toast.textContent = mensagem;
    toast.className = 'toast ' + tipo;
    setTimeout(() => { toast.className = 'toast hidden'; }, 3500);
}

class ErroApi extends Error {
    constructor(status, mensagem) {
        super(mensagem || `HTTP ${status}`);
        this.status = status;
    }
}

async function chamar(url, metodo = 'GET', corpo) {
    const opcoes = { method: metodo };
    if (corpo !== undefined) {
        opcoes.headers = { 'Content-Type': 'application/json' };
        opcoes.body = JSON.stringify(corpo);
    }
    const res = await fetch(url, opcoes);
    const texto = await res.text();
    if (!res.ok) throw new ErroApi(res.status, texto.trim());
    return texto ? JSON.parse(texto) : null;
}

function corpoProduto(d) {
    return { nome: d.nome, tipo: d.tipo, idFornecedor: d.idFornecedor };
}

function corpoVariacao(produtoId, d) {
    return {
        idProduto:  produtoId,
        cor:        d.cor,
        tamanho:    d.tamanho,
        valorTotal: d.valorTotal,
        estoque:    d.estoque
    };
}

function soDigitos(valor) {
    return String(valor ?? '').replace(/\D/g, '');
}

function formatarCNPJ(valor) {
    const v = soDigitos(valor).slice(0, 14);
    if (v.length > 12) return `${v.slice(0, 2)}.${v.slice(2, 5)}.${v.slice(5, 8)}/${v.slice(8, 12)}-${v.slice(12)}`;
    if (v.length > 8)  return `${v.slice(0, 2)}.${v.slice(2, 5)}.${v.slice(5, 8)}/${v.slice(8)}`;
    if (v.length > 5)  return `${v.slice(0, 2)}.${v.slice(2, 5)}.${v.slice(5)}`;
    if (v.length > 2)  return `${v.slice(0, 2)}.${v.slice(2)}`;
    return v;
}

async function resolverFornecedor(cnpj) {
    if (atual && atual.produto.cnpj === cnpj && atual.produto.idFornecedor) {
        return atual.produto.idFornecedor;
    }
    try {
        const f = await chamar(`${API_FORNECEDORES}/cnpj/${cnpj}`);
        return f.id;
    } catch (err) {
        if (err.status === 404) {
            mostrarToast('Fornecedor não encontrado para esse CNPJ.', 'error');
        } else {
            console.error('resolverFornecedor:', err);
            mostrarToast('Erro ao buscar fornecedor. Verifique a conexão com a API.', 'error');
        }
        return null;
    }
}

function lerNumero(id) {
    const v = el(id).value.trim();
    return v === '' ? NaN : Number(v);
}

function coletarDados() {
    return {
        nome:       el('nome').value.trim(),
        tipo:       el('categoria').value,
        cnpj:       soDigitos(el('fornecedor').value),
        cor:        el('cor').value,
        tamanho:    el('tamanho').value,
        valorTotal: lerNumero('preco'),
        estoque:    lerNumero('quantidade')
    };
}

function validar(d) {
    if (!d.nome || !d.tipo || !d.cnpj) {
        mostrarToast('Preencha todos os campos obrigatórios.', 'error');
        return false;
    }
    if (d.cnpj.length !== 14) {
        mostrarToast('Informe o CNPJ do fornecedor com 14 dígitos.', 'error');
        return false;
    }
    if (isNaN(d.valorTotal) || d.valorTotal < 0) {
        mostrarToast('Informe um preço válido utilizando apenas números.', 'error');
        return false;
    }
    if (!Number.isInteger(d.estoque) || d.estoque < 0) {
        mostrarToast('Informe a quantidade com um número inteiro.', 'error');
        return false;
    }
    return true;
}

function definirAtual(variacaoId, produtoId, produto) {
    atual = {
        variacaoId,
        produtoId,
        produto: {
            nome:         produto.nome,
            tipo:         produto.tipo,
            cnpj:         produto.cnpj,
            idFornecedor: produto.idFornecedor
        }
    };
    el('id_produto').value = variacaoId;
}

function preencherForm(v) {
    const p = v.produto ?? {};
    const cnpj = soDigitos(p.fornecedor?.cnpj);

    el('nome').value       = p.nome         ?? '';
    el('categoria').value  = p.tipo         ?? '';
    el('fornecedor').value = formatarCNPJ(cnpj);
    el('preco').value      = v.valorTotal   ?? '';
    el('tamanho').value    = v.tamanho      ?? '';
    el('cor').value        = v.cor          ?? '';
    el('quantidade').value = v.estoque      ?? '';

    definirAtual(v.id, p.id, {
        nome: p.nome ?? '',
        tipo: p.tipo ?? '',
        cnpj,
        idFornecedor: p.fornecedor?.id ?? null
    });
}

function limparForm() {
    ['id_produto', 'nome', 'preco', 'fornecedor', 'quantidade', 'categoria', 'tamanho', 'cor']
        .forEach(id => { el(id).value = ''; });
    atual = null;
}

function produtoMudou(d) {
    const o = atual.produto;
    return d.nome !== o.nome || d.tipo !== o.tipo || d.cnpj !== o.cnpj;
}

async function pesquisarProduto() {
    const q = el('searchProdutoInput').value.trim();
    if (!/^\d+$/.test(q)) {
        mostrarToast('Digite um ID numérico válido para pesquisar.', 'error');
        return;
    }
    try {
        const v = await chamar(`${API_VARIACOES}/${q}`);
        if (!v.produto || v.produto.id == null) {
            console.error('pesquisarProduto: resposta sem o produto aninhado', v);
            mostrarToast('A API não retornou os dados do produto desta variação.', 'error');
            limparForm();
            return;
        }
        preencherForm(v);
        mostrarToast('Produto encontrado.', 'success');
    } catch (err) {
        if (err.status === 404) {
            mostrarToast('Produto não encontrado.', 'error');
        } else {
            console.error('pesquisarProduto:', err);
            mostrarToast('Erro ao buscar produto. Verifique a conexão com a API.', 'error');
        }
        limparForm();
    }
}

async function adicionarProduto() {
    const d = coletarDados();
    if (!validar(d)) return;

    d.idFornecedor = await resolverFornecedor(d.cnpj);
    if (!d.idFornecedor) return;

    try {
        let produtoId;
        let produtoNovo = false;

        if (atual && !produtoMudou(d)) {
            produtoId = atual.produtoId;
        } else {
            const produto = await chamar(API_PRODUTOS, 'POST', corpoProduto(d));
            produtoId = produto.id;
            produtoNovo = true;
        }

        let variacao;
        try {
            variacao = await chamar(API_VARIACOES, 'POST', corpoVariacao(produtoId, d));
        } catch (err) {
            if (produtoNovo) {
                await chamar(`${API_PRODUTOS}/${produtoId}`, 'DELETE').catch(() => {});
            }
            throw err;
        }

        let estoqueGravado = true;
        if (variacao.estoque !== d.estoque) {
            try {
                await chamar(`${API_VARIACOES}/${variacao.id}`, 'PUT', corpoVariacao(produtoId, d));
            } catch (err) {
                console.error('adicionarProduto (estoque inicial):', err);
                estoqueGravado = false;
            }
        }

        definirAtual(variacao.id, produtoId, d);

        if (estoqueGravado) {
            mostrarToast('Produto adicionado com sucesso!', 'success');
        } else {
            mostrarToast('Produto criado, mas a quantidade não foi gravada. Use Salvar Edição.', 'error');
        }
    } catch (err) {
        console.error('adicionarProduto:', err);
        if (err.status === 409) {
            mostrarToast(err.message || 'Produto já cadastrado.', 'error');
        } else {
            mostrarToast('Erro ao adicionar produto.', 'error');
        }
    }
}

async function salvarEdicao() {
    if (!atual) {
        mostrarToast('Pesquise um produto antes de editar.', 'error');
        return;
    }
    const d = coletarDados();
    if (!validar(d)) return;

    d.idFornecedor = await resolverFornecedor(d.cnpj);
    if (!d.idFornecedor) return;

    try {
        if (produtoMudou(d)) {
            await chamar(`${API_PRODUTOS}/${atual.produtoId}`, 'PUT', corpoProduto(d));
            definirAtual(atual.variacaoId, atual.produtoId, d);
        }
        await chamar(`${API_VARIACOES}/${atual.variacaoId}`, 'PUT', corpoVariacao(atual.produtoId, d));
        mostrarToast('Produto atualizado com sucesso!', 'success');
    } catch (err) {
        console.error('salvarEdicao:', err);
        if (err.status === 404) {
            mostrarToast('Produto não encontrado para atualização.', 'error');
        } else {
            mostrarToast('Erro ao atualizar produto.', 'error');
        }
    }
}

async function deletarProduto() {
    if (!atual) {
        mostrarToast('Pesquise um produto antes de deletar.', 'error');
        return;
    }
    const nome = el('nome').value.trim();
    if (!confirm(`Deletar a variação #${atual.variacaoId} (${nome})? O produto em si não será removido.`)) return;

    try {
        await chamar(`${API_VARIACOES}/${atual.variacaoId}`, 'DELETE');
        limparForm();
        el('searchProdutoInput').value = '';
        mostrarToast('Produto deletado com sucesso.', 'success');
    } catch (err) {
        console.error('deletarProduto:', err);
        if (err.status === 404) {
            mostrarToast('Produto não encontrado.', 'error');
        } else {
            mostrarToast('Erro ao deletar produto.', 'error');
        }
    }
}

el('searchProdutoInput')
    .addEventListener('keydown', e => { if (e.key === 'Enter') pesquisarProduto(); });

el('fornecedor')
    .addEventListener('input', e => { e.target.value = formatarCNPJ(e.target.value); });