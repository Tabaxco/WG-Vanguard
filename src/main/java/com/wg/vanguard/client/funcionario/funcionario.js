const API = 'http://localhost:8080/funcionarios';


function mostrarToast(mensagem, tipo) {
    const toast = document.getElementById('toast');
    toast.textContent = mensagem;
    toast.className = 'toast ' + tipo;
    setTimeout(() => { toast.className = 'toast hidden'; }, 3500);
}


function preencherForm(f) {
    document.getElementById('funcionarioId').value    = f.id            ?? '';
    document.getElementById('nome').value             = f.nome          ?? '';
    document.getElementById('email').value            = f.email         ?? '';
    document.getElementById('telefone').value         = f.telefone      ?? '';
    document.getElementById('dataContratacao').value  = f.dataContratacao ?? '';
}

function limparForm() {
    ['funcionarioId', 'nome', 'email', 'telefone', 'dataContratacao']
        .forEach(id => { document.getElementById(id).value = ''; });
}

function coletarDados() {
    return {
        nome:             document.getElementById('nome').value.trim(),
        email:            document.getElementById('email').value.trim(),
        telefone:         document.getElementById('telefone').value.trim(),
        dataContratacao:  document.getElementById('dataContratacao').value
    };
}

function validar(dados) {
    if (!dados.nome || !dados.email || !dados.telefone || !dados.dataContratacao) {
        mostrarToast('Preencha todos os campos obrigatórios.', 'error');
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(dados.email)) {
        mostrarToast('Informe um e-mail válido.', 'error');
        return false;
    }
    return true;
}

function mascararTelefone(input) {
    let v = input.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6) {
        v = '(' + v.slice(0, 2) + ') ' + v.slice(2, 7) + '-' + v.slice(7);
    } else if (v.length > 2) {
        v = '(' + v.slice(0, 2) + ') ' + v.slice(2);
    } else if (v.length > 0) {
        v = '(' + v;
    }
    input.value = v;
}


async function pesquisar() {
    const q = document.getElementById('searchInput').value.trim();
    if (!q || isNaN(Number(q))) {
        mostrarToast('Digite um ID numérico válido para pesquisar.', 'error');
        return;
    }
    try {
        const res = await fetch(`${API}/${q}`);
        if (res.status === 404) {
            mostrarToast('Funcionário não encontrado.', 'error');
            limparForm();
            return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        preencherForm(data);
        mostrarToast('Funcionário encontrado.', 'success');
    } catch (err) {
        console.error('pesquisar:', err);
        mostrarToast('Erro ao buscar funcionário. Verifique a conexão com a API.', 'error');
        limparForm();
    }
}

async function adicionar() {
    const dados = coletarDados();
    if (!validar(dados)) return;
    try {
        const res = await fetch(API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const criado = await res.json();
        preencherForm(criado);
        mostrarToast('Funcionário adicionado com sucesso!', 'success');
    } catch (err) {
        console.error('adicionar:', err);
        mostrarToast('Erro ao adicionar funcionário.', 'error');
    }
}


async function salvarEdicao() {
    const id = document.getElementById('funcionarioId').value;
    if (!id) {
        mostrarToast('Pesquise um funcionário antes de editar.', 'error');
        return;
    }
    const dados = coletarDados();
    if (!validar(dados)) return;
    try {
        const res = await fetch(`${API}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        if (res.status === 404) {
            mostrarToast('Funcionário não encontrado para atualização.', 'error');
            return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const atualizado = await res.json();
        preencherForm(atualizado);
        mostrarToast('Funcionário atualizado com sucesso!', 'success');
    } catch (err) {
        console.error('salvarEdicao:', err);
        mostrarToast('Erro ao atualizar funcionário.', 'error');
    }
}

async function deletar() {
    const id = document.getElementById('funcionarioId').value;
    if (!id) {
        mostrarToast('Pesquise um funcionário antes de deletar.', 'error');
        return;
    }
    if (!confirm(`Tem certeza que deseja deletar o funcionário #${id}?`)) return;
    try {
        const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
        if (res.status === 404) {
            mostrarToast('Funcionário não encontrado.', 'error');
            return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        limparForm();
        document.getElementById('searchInput').value = '';
        mostrarToast('Funcionário deletado com sucesso.', 'success');
    } catch (err) {
        console.error('deletar:', err);
        mostrarToast('Erro ao deletar funcionário.', 'error');
    }
}

document.getElementById('searchInput')
    .addEventListener('keydown', e => { if (e.key === 'Enter') pesquisar(); });