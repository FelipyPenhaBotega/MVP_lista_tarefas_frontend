/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = "http://127.0.0.1:5000/tarefas";
  fetch(url, {
    method: "get",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("data", data);
      data.tarefas.forEach((item) =>
        insertList(item.nome, item.descricao, item.data_atividade)
      );
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList();

/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputNome, inputDescricao, inputData) => {
  const formData = new FormData();
  formData.append("nome", inputNome);
  formData.append("descricao", inputDescricao);
  formData.append("data_atividade", inputData);

  let url = "http://127.0.0.1:5000/tarefa";
  fetch(url, {
    method: "post",
    body: formData,
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
    });
};

/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
};

/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  let i;
  console.log("close", close);
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const dataItem = div.getElementsByTagName("td")[2].innerHTML;
      if (confirm("Você tem certeza?")) {
        div.remove();
        deleteItem(dataItem);
        console.log("dataItem", dataItem);
        alert("Removido!");
      }
    };
  }
};

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item);
  let url = "http://127.0.0.1:5000/tarefa?data_atividade=" + item;
  fetch(url, {
    method: "delete",
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
    });
};

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com nome, descrição e data 
  --------------------------------------------------------------------------------------
*/
const newItem = () => {
  let inputNome = document.getElementById("id_nome").value;
  let inputDescricao = document.getElementById("id_descricao").value;
  let inputData = document.getElementById("id_data").value;

  if (inputNome === "") {
    alert("Escreva o nome para a tarefa!");
  } else if (inputDescricao === "") {
    alert("Escreva uma descrição para a tarefa!");
  } else if (inputData === "") {
    alert("Escreva uma data para a tarefa!");
  } else if (!validarFormatoDataHora(inputData)) {
    alert("A data não está no formato correto.");
  } else if (!validarDataMaiorQueAtual(inputData)) {
    alert("A data deve ser maior que a data atual.");
  } else if (validaDataInserida(inputData)) {
    alert("Já existe uma tarefa para a data informada");
  } else {
    insertList(inputNome, inputDescricao, inputData);
    postItem(inputNome, inputDescricao, inputData);
    alert("Item adicionado!");
  }
};

/*
  --------------------------------------------------------------------------------------
  Função para validar o formato da data.
  --------------------------------------------------------------------------------------
*/
function validarFormatoDataHora(dataHoraString) {
  var padrao = /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/;
  return padrao.test(dataHoraString);
}

/*
  --------------------------------------------------------------------------------------
  Função para validar se a data inserida é maior que a atual.
  --------------------------------------------------------------------------------------
*/
function validarDataMaiorQueAtual(dataHoraString) {
  var padrao = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/;
  var match = dataHoraString.match(padrao);
  if (!match) {
    return false;
  }
  var dia = parseInt(match[1], 10);
  var mes = parseInt(match[2] - 1, 10);
  var ano = parseInt(match[3], 10);
  var hora = parseInt(match[4], 10);
  var minuto = parseInt(match[5], 10);
  var dataDaString = new Date(ano, mes, dia, hora, minuto);
  var dataAtual = new Date();
  return dataDaString > dataAtual;
}

/*
  --------------------------------------------------------------------------------------
  Função para validar se a data inserida já existe na lista.
  --------------------------------------------------------------------------------------
*/
function validaDataInserida(data_atividade) {
  var table = document.getElementById("myTable");
  var rows = Array.from(table.getElementsByTagName("tr")).slice(1);
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var dataAtual = row.cells[2].textContent;

    if (dataAtual === data_atividade) {
      return true;
    }
  }
  return false;
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------

const insertList = (nome, descricao, data_atividade) => {
  var item = [nome, descricao, data_atividade];
  var table = document.getElementById("myTable");
  var row = table.insertRow();
  console.log("table", table);
  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  insertButton(row.insertCell(-1));
  document.getElementById("id_nome").value = "";
  document.getElementById("id_descricao").value = "";
  document.getElementById("id_data").value = "";

  removeElement();
};
*/

const insertList = (nome, descricao, data_atividade) => {
  var item = [nome, descricao, data_atividade];
  var table = document.getElementById("myTable");
  var row = table.insertRow();
  console.log("table", table);
  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  insertButton(row.insertCell(-1));
  document.getElementById("id_nome").value = "";
  document.getElementById("id_descricao").value = "";
  document.getElementById("id_data").value = "";

  ordenarPorData(); // Chama a função para ordenar a tabela por data
  removeElement();
};

function ordenarPorData() {
  var table = document.getElementById("myTable");
  var rows = Array.from(table.getElementsByTagName("tr")).slice(1); // Obtém todas as linhas, exceto a linha de cabeçalho

  rows.sort(function (a, b) {
    var dataA = new Date(a.cells[2].textContent); // Assume que a terceira célula contém a data
    var dataB = new Date(b.cells[2].textContent);

    return dataA - dataB;
  });

  // Limpa a tabela
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

  // Reinsere as linhas na ordem classificada
  rows.forEach(function (row) {
    table.appendChild(row);
  });
}
