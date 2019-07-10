import {
  nova,
  registrar,
  desbloquear,
  transferir,
  listar_contas
} from "./conta";

import store from "@/store"

export function validar(param) {
  const data = {
    cpf_cnpj: param.cpf_cnpj,
    credito: param.credito,
    indicacao: '',
    utilizado: '',
    address: ""
  };
  return new Promise((resolve, reject) => {
    listar_contas()
      .then(response => {
        if (response.status == 200) {
          const result = response.data.result;
          Object.entries(result).forEach(([key, value]) => {
            if (data["cpf_cnpj"].trim() === value.name.trim()) {
              data["address"] = key;
            } // end iF;
          });

          if (data["address"].length > 0) {
            const desbloquear_data = {
              cpf: data["cpf_cnpj"],
              senha: data["cpf_cnpj"],
              address: data["address"],
            };

            desbloquear(desbloquear_data)

            store.dispatch("listar_contribuinte", data)
              .then(response => {
                // calcula o novo credito para o contribuinte
                data['utilizado'] = parseFloat(response.utilizado).toFixed(2).toString()
                data['indicacao'] = response.indicacao
                data['credito'] = (parseFloat(response.credito) + parseFloat(data['credito'])).toFixed(2).toString()
                store.dispatch('atualizar_contribuinte', data).then(() => {
                  resolve(data);
                }).catch(error => {
                  reject(error);
                })
              })
              .catch(error => {
                reject(error);
              });
          } else {
            // se não encontrar o endereço, faça o processo de criar uma conta e registrar
            const novaConta = {
              cpf: data["cpf_cnpj"],
              senha: data["cpf_cnpj"],
              address: null
            };

            nova(novaConta)
              .then(response => {
                if (response.status == 200) {
                  // adiciona o endereco criado no objeto data
                  novaConta["address"] = response.data.result;
                  // registra o endereço no parity
                  registrar(novaConta)
                    .then(response => {
                      if (response.status == 200) {
                        desbloquear(novaConta)
                          .then(response => {
                            if (response) {
                              transferir(novaConta)
                                .then(response => {
                                  if (response) {
                                    data["address"] = novaConta["address"];
                                    // cria o novo contribuinte.
                                    store.dispatch("criar_contribuinte", data)
                                      .then(() => {
                                        resolve(data);
                                      })
                                      .catch(error => {
                                        reject(error);
                                      });
                                  } // end iF;
                                })
                                .catch(error => {
                                  reject(error);
                                });
                            } // end iF;
                          })
                          .catch(error => {
                            reject(error);
                          });
                      } // end iF.
                    })
                    .catch(error => {
                      reject(error);
                    });
                } // end iF.
              })
              .catch(error => {
                reject(error);
              });
          } // end iF;
        } // end iF;
      })
      .catch(error => {
        reject(error);
      });
  });
}
