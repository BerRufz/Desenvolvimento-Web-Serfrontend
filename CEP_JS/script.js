const cepInput = document.getElementById("cep");
const logradouroInput = document.getElementById("logradouro");
const bairroInput = document.getElementById("bairro");
const localidadeInput = document.getElementById("localidade");
const ufInput = document.getElementById("uf");
const dialog = document.getElementById("erro-dialog");
const fecharDialogBtn = document.getElementById("fechar-dialog");

/* ***
No vídeo eu errei o id "fechar-dialog", mas depois corrigi. Nesse arquivo a const fecharDialogBtn já está correta

*/

// Escuta o evento input em cepImput
cepInput.addEventListener("input", function () {
  let cep = this.value;
  cep = cep.replace("-", "").trim();

  if (cep.length === 8) {
    obterEndereco(cep)
      .then((dado) => {
        if (dado.erro) {
          throw new Error("CEP inválido");
        }
        mostrarDados(dado);
      })
      .catch((err) => {
        limparDados();
        mostrarErro(err);
      });
  }
});

function mostrarDados(dado) {
  logradouroInput.value = dado.logradouro || "";
  bairroInput.value = dado.bairro || "";
  localidadeInput.value = dado.localidade || "";
  ufInput.value = dado.uf || "";
}

function limparDados() {
  logradouroInput.value = "";
  bairroInput.value = "";
  localidadeInput.value = "";
  ufInput.value = "";
}

function mostrarErro(erro) {
  dialog.showModal();
  document.getElementById("erro-msg").textContent = erro.message;
}

fecharDialogBtn.addEventListener("click", function () {
  dialog.close();
});

function obterEndereco(cep) {
  return fetch("https://viacep.com.br/ws/" + cep + "/json/").then((res) => {
    if (!res.ok) {
      throw new Error(`Erro ao buscar o cep ${cep}`);
    }
    return res.json();
  });
}
