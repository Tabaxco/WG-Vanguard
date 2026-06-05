const cats  = ["Camiseta","Calça","Vestido","Saia","Jaqueta","Moletom","Shorts","Blusa","Bermuda","Acessório"];
const cores = ["Preto","Branco","Cinza","Azul","Vermelho","Verde","Rosa","Amarelo","Bege","Marrom","Vinho","Laranja"];
const tams  = ["PP","P","M","G","GG","XG","36","38","40","42","44","46","48","Único"];

let items = [];
let idc   = 1;

function selFill(el) {
  el.className = el.value ? 'v' : '';
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
    <div class="irow" id="r${item.id}">
      <div class="ibox">
        <input type="text" placeholder="Nome ou ref. da peça" value="${item.peca}"
          oninput="upd(${item.id},'peca',this.value)" />
      </div>
      <div class="ibox">
        <select class="${item.cat ? 'v' : ''}" onchange="upd(${item.id},'cat',this.value);selFill(this)">
          <option value="">Tipo...</option>${opts(cats, item.cat)}
        </select>
      </div>
      <div class="ibox">
        <select class="${item.cor ? 'v' : ''}" onchange="upd(${item.id},'cor',this.value);selFill(this)">
          <option value="">Cor...</option>${opts(cores, item.cor)}
        </select>
      </div>
      <div class="ibox">
        <select class="${item.tam ? 'v' : ''}" onchange="upd(${item.id},'tam',this.value);selFill(this)">
          <option value="">Tam...</option>${opts(tams, item.tam)}
        </select>
      </div>
      <div class="ibox">
        <input type="number" min="1" step="1" value="${item.qtd}"
          oninput="upd(${item.id},'qtd',this.value)" />
      </div>
      <div class="ibox">
        <input type="number" min="0" step="0.01" value="${item.preco || ''}" placeholder="0,00"
          oninput="upd(${item.id},'preco',this.value)" />
      </div>
      <button class="brm" onclick="removerItem(${item.id})" aria-label="Remover item">
        <i class="ti ti-x"></i>
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

function calcTotals() {
  const sub  = items.reduce((s, i) => s + (i.qtd * i.preco), 0);
  const desc = Math.min(100, Math.max(0, parseFloat(document.getElementById('desconto').value) || 0));
  document.getElementById('subtotal').textContent   = 'R$ ' + sub.toFixed(2).replace('.', ',');
  document.getElementById('totalGeral').textContent = 'R$ ' + (sub * (1 - desc / 100)).toFixed(2).replace('.', ',');
}

function novoOrcamento() {
  items = [];
  renderItems();
  document.getElementById('idOrc').value    = 'ORC-' + (Math.floor(Math.random() * 90000) + 10000);
  document.getElementById('desconto').value = 0;
  calcTotals();
}

function deletar() {
  if (confirm('Deseja deletar este orçamento?')) novoOrcamento();
}

function salvar() {
  alert('Orçamento salvo com sucesso!');
}

function mascCPF(el) {
  let v = el.value.replace(/\D/g, '');
  v = v.replace(/(\d{3})(\d)/, '$1.$2')
       .replace(/(\d{3})(\d)/, '$1.$2')
       .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  el.value = v;
}

function mascTel(el) {
  let v = el.value.replace(/\D/g, '');
  v = v.replace(/^(\d{2})(\d)/, '($1) $2')
       .replace(/(\d{5})(\d)/, '$1-$2');
  el.value = v;
}

/* Init */
document.getElementById('dataOrc').value = new Date().toISOString().split('T')[0];
document.getElementById('idOrc').value   = 'ORC-' + (Math.floor(Math.random() * 90000) + 10000);
adicionarItem();
