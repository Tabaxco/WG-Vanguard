if (!sessionStorage.getItem('usuario')) {
  window.location.href = '../login/login.html';
}

const API = 'http://localhost:8080';

const cats  = ["Camiseta","Calça","Vestido","Saia","Jaqueta","Moletom","Shorts","Blusa","Bermuda","Acessório"];
const cores = ["Preto","Branco","Cinza","Azul","Vermelho","Verde","Rosa","Amarelo","Bege","Marrom","Vinho","Laranja"];
const tams  = ["PP","P","M","G","GG","XG","36","38","40","42","44","46","48","Único"];

let items       = [];
let idc         = 1;
let orcamentoId = null;


function mostrarToast(mensagem, tipo = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = mensagem;
  toast.className = 'toast ' + tipo;
  setTimeout(() => { toast.className = 'toast hidden'; }, 3500);
}

function setLoading(on) {
  document.querySelectorAll('.btn, .btn-search').forEach(b => b.disabled = on);
}

function esc(str) {
  return String(str || '').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function fmtBRL(val) {
  return 'R$ ' + val.toFixed(2).replace('.', ',');
}

function opts(arr, val) {
  return arr.map(x => `<option${val === x ? ' selected' : ''}>${x}</option>`).join('');
}


function adicionarItem() {
  items.push({ id: idc++, peca: '', cat: '', cor: '', tam: '', qtd: 1, preco: 0 });
  renderItems();
}

function removerItem(id) {
  items = items.filter(i => i.id !== id);
  renderItems();
}

function renderItems() {
  const el = document.getElementById('itemsList');
  if (!items.length) { el.innerHTML = ''; calcTotals(); return; }

  el.innerHTML = items.map(item => `
    <div class="item-row" id="r${item.id}">
      <input type="text" placeholder="Nome ou ref. da peça" value="${esc(item.peca)}"
        oninput="upd(${item.id},'peca',this.value)" />
      <select onchange="upd(${item.id},'cat',this.value)">
        <option value="">Tipo...</option>${opts(cats, item.cat)}
      </select>
      <select onchange="upd(${item.id},'cor',this.value)">
        <option value="">Cor...</option>${opts(cores, item.cor)}
      </select>
      <select onchange="upd(${item.id},'tam',this.value)">
        <option value="">Tam...</option>${opts(tams, item.tam)}
      </select>
      <input type="number" min="1" step="1" value="${item.qtd}"
        oninput="upd(${item.id},'qtd',this.value)" />
      <input type="number" min="0" step="0.01" value="${item.preco || ''}" placeholder="0,00"
        oninput="upd(${item.id},'preco',this.value)" />
      <button class="btn-del-row" onclick="removerItem(${item.id})" aria-label="Remover item">
        <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  `).join('');

  calcTotals();
}

function upd(id, field, value) {
  const item = items.find(i => i.id === id);
  if (!item) return;
  item[field] = (field === 'qtd' || field === 'preco') ? (parseFloat(value) || 0) : value;
  calcTotals();
}

/* ── Totais ── */

function calcTotals() {
  const sub  = items.reduce((s, i) => s + (i.qtd * i.preco), 0);
  const desc = Math.min(100, Math.max(0, parseFloat(document.getElementById('desconto').value) || 0));
  document.getElementById('subtotal').textContent   = fmtBRL(sub);
  document.getElementById('totalGeral').textContent = fmtBRL(sub * (1 - desc / 100));
}

/* ── Formulário ── */

function lerFormulario() {
  const sub  = items.reduce((s, i) => s + (i.qtd * i.preco), 0);
  const desc = Math.min(100, Math.max(0, parseFloat(document.getElementById('desconto').value) || 0));

  return {
    cpf:           document.getElementById('cpf').value.replace(/\D/g, ''),
    nomeCliente:   document.getElementById('nomeCliente').value.trim(),
    telefone:      document.getElementById('tel').value.replace(/\D/g, ''),
    status:        document.getElementById('statusOrc').value,
    observacoes:   document.getElementById('obs').value.trim(),
    dataOrcamento: document.getElementById('dataOrc').value || null,
    subtotal:      sub,
    desconto:      desc,
    itens: items.map(i => ({
      peca:          i.peca,
      categoria:     i.cat,
      cor:           i.cor,
      tamanho:       i.tam,
      quantidade:    i.qtd,
      precoUnitario: i.preco
    }))
  };
}

function preencherFormulario(orc) {
  orcamentoId = orc.id;

  document.getElementById('idOrc').value        = 'ORC-' + String(orc.id).padStart(5, '0');
  document.getElementById('nomeCliente').value  = orc.cliente?.nome       || '';
  document.getElementById('cpf').value          = fmtCPF(orc.cliente?.cpf || '');
  document.getElementById('tel').value          = fmtTel(orc.cliente?.telefone || '');
  document.getElementById('statusOrc').value    = orc.status              || '';
  document.getElementById('obs').value          = orc.observacoes         || '';
  document.getElementById('dataOrc').value      = orc.dataOrcamento       || '';
  document.getElementById('desconto').value     = orc.desconto            || 0;

  let itensBackend = [];
  try { itensBackend = JSON.parse(orc.itens || '[]'); } catch (_) {}

  items = itensBackend.map(i => ({
    id:    idc++,
    peca:  i.peca          || '',
    cat:   i.categoria     || '',
    cor:   i.cor           || '',
    tam:   i.tamanho       || '',
    qtd:   i.quantidade    || 1,
    preco: i.precoUnitario || 0
  }));

  renderItems();
}

/* ── CRUD ── */

async function pesquisar() {
  const q = document.getElementById('searchInput').value.trim();
  if (!q) { mostrarToast('Digite um ID ou CPF para pesquisar.', 'warn'); return; }

  setLoading(true);
  try {
    let orc = null;
    const cpfLimpo = q.replace(/\D/g, '');

    if (/^\d+$/.test(q) && q.length < 10) {
      const r = await fetch(`${API}/orcamentos/${q}`);
      if (r.ok) orc = await r.json();
    }

    if (!orc && cpfLimpo.length === 11) {
      const r = await fetch(`${API}/orcamentos/cliente/${cpfLimpo}`);
      if (r.ok) {
        const lista = await r.json();
        if (lista.length) orc = lista[lista.length - 1];
      }
    }

    if (orc) {
      preencherFormulario(orc);
      mostrarToast('Orçamento carregado com sucesso.');
    } else {
      mostrarToast('Nenhum orçamento encontrado.', 'error');
    }
  } catch (e) {
    mostrarToast('Erro ao pesquisar: ' + e.message, 'error');
  } finally {
    setLoading(false);
  }
}

async function salvar() {
  const dados = lerFormulario();

  if (!dados.nomeCliente) {
    mostrarToast('Informe o nome do cliente.', 'error');
    return;
  }
  if (!dados.cpf || dados.cpf.length !== 11) {
    mostrarToast('CPF inválido. Verifique o campo.', 'error');
    return;
  }

  setLoading(true);
  try {
    let r;
    if (orcamentoId) {
      r = await fetch(`${API}/orcamentos/${orcamentoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
    } else {
      r = await fetch(`${API}/orcamentos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
    }

    if (!r.ok) throw new Error((await r.text()) || r.statusText);
    const orc = await r.json();
    preencherFormulario(orc);
    mostrarToast(orcamentoId ? 'Orçamento atualizado com sucesso!' : 'Orçamento salvo com sucesso!');
  } catch (e) {
    mostrarToast('Erro ao salvar: ' + e.message, 'error');
  } finally {
    setLoading(false);
  }
}

async function deletar() {
  if (!orcamentoId) {
    mostrarToast('Nenhum orçamento carregado para deletar.', 'error');
    return;
  }
  if (!confirm(`Deseja deletar o orçamento ORC-${String(orcamentoId).padStart(5, '0')}?`)) return;

  setLoading(true);
  try {
    const r = await fetch(`${API}/orcamentos/${orcamentoId}`, { method: 'DELETE' });
    if (!r.ok) throw new Error(r.statusText);
    mostrarToast('Orçamento deletado com sucesso.');
    novoOrcamento();
  } catch (e) {
    mostrarToast('Erro ao deletar: ' + e.message, 'error');
  } finally {
    setLoading(false);
  }
}

function novoOrcamento() {
  orcamentoId = null;
  items = [];
  renderItems();

  document.getElementById('idOrc').value       = 'ORC-NOVO';
  document.getElementById('nomeCliente').value = '';
  document.getElementById('cpf').value         = '';
  document.getElementById('tel').value         = '';
  document.getElementById('statusOrc').value   = '';
  document.getElementById('obs').value         = '';
  document.getElementById('dataOrc').value     = new Date().toISOString().split('T')[0];
  document.getElementById('desconto').value    = 0;

  calcTotals();
  adicionarItem();
}


function mascCPF(el) {
  let v = el.value.replace(/\D/g, '').slice(0, 11);
  v = v.replace(/(\d{3})(\d)/, '$1.$2')
       .replace(/(\d{3})(\d)/, '$1.$2')
       .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  el.value = v;
}

function mascTel(el) {
  let v = el.value.replace(/\D/g, '').slice(0, 11);
  v = v.replace(/^(\d{2})(\d)/, '($1) $2')
       .replace(/(\d{5})(\d)/, '$1-$2');
  el.value = v;
}

function fmtCPF(cpf) {
  const v = cpf.replace(/\D/g, '');
  return v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function fmtTel(tel) {
  const v = tel.replace(/\D/g, '');
  if (v.length === 11) return v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  if (v.length === 10) return v.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  return tel;
}


document.getElementById('searchInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') pesquisar();
});

novoOrcamento();
