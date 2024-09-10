class RecintosZoo {
  constructor() {
    this.animais = {
      LEAO: { tamanho: 3, bioma: ['savana'], carnivoro: true },
      LEOPARDO: { tamanho: 2, bioma: ['savana'], carnivoro: true },
      CROCODILO: { tamanho: 3, bioma: ['rio'], carnivoro: true },
      MACACO: { tamanho: 1, bioma: ['savana', 'floresta'], carnivoro: false },
      GAZELA: { tamanho: 2, bioma: ['savana'], carnivoro: false },
      HIPOPOTAMO: { tamanho: 4, bioma: ['savana', 'rio'], carnivoro: false }
    };

    this.recintos = [
      { numero: 1, bioma: ['savana'], tamanho: 10, animais: [{ especie: 'MACACO', quantidade: 3 }] },
      { numero: 2, bioma: ['floresta'], tamanho: 5, animais: [] },
      { numero: 3, bioma: ['savana', 'rio'], tamanho: 7, animais: [{ especie: 'GAZELA', quantidade: 1 }] },
      { numero: 4, bioma: ['rio'], tamanho: 8, animais: [] },
      { numero: 5, bioma: ['savana'], tamanho: 9, animais: [{ especie: 'LEAO', quantidade: 1 }] }
    ];
  }

  isAnimalValido(animal) {
    return !!this.animais[animal];
  }

  isQuantidadeValida(quantidade) {
    return quantidade > 0;
  }

  analisaRecintos(animal, quantidade) {
    // Verifica se o animal é válido
    if (!this.isAnimalValido(animal)) {
        return { erro: "Animal inválido" };
    }

    // Verifica se a quantidade é válida
    if (!this.isQuantidadeValida(quantidade)) {
        return { erro: "Quantidade inválida" };
    }

    const { tamanho, bioma, carnivoro } = this.animais[animal];
    const espacoNecessario = tamanho * quantidade;
    let recintosViaveis = [];

    for (let recinto of this.recintos) {
        let espacoOcupado = recinto.animais.reduce((sum, a) => sum + (this.animais[a.especie.toUpperCase()].tamanho * a.quantidade), 0);
        let espacoDisponivel = recinto.tamanho - espacoOcupado;

        // Verifica se o bioma do recinto é adequado para hipopótamo
        if (animal === "HIPOPOTAMO") {
            if (!(recinto.bioma.includes("rio") || (recinto.bioma.includes("savana") && !recinto.bioma.includes("rio")))) {
                continue;
            }
        } else {
            if (!bioma.some(b => recinto.bioma.includes(b))) {
                continue;
            }
        }

        // Verifica se há espaço suficiente no recinto
        if (espacoDisponivel < espacoNecessario) {
            continue;
        }

        // Verifica se o animal é carnívoro e se pode coabitar com outras espécies
        if (carnivoro && recinto.animais.length > 0 && recinto.animais.some(a => a.especie.toUpperCase() !== animal)) {
            continue;
        }

        // Regras específicas para macacos
        if (animal === "MACACO") {
            if (recinto.animais.length === 0 && espacoNecessario < 2) {
                continue;
            }
            // Macacos não podem estar com carnívoros
            if (recinto.animais.some(a => this.animais[a.especie.toUpperCase()].carnivoro)) {
                continue;
            }
        }

        // Regra do espaço extra para recintos com mais de uma espécie
        if (recinto.animais.length > 0 && recinto.animais.some(a => a.especie.toUpperCase() !== animal)) {
            espacoDisponivel -= 1; // Um espaço extra ocupado
            if (espacoDisponivel < espacoNecessario) {
                continue;
            }
        }

        // Adiciona o recinto viável à lista
        recintosViaveis.push({
            numero: recinto.numero,
            descricao: `Recinto ${recinto.numero} (espaço livre: ${espacoDisponivel - espacoNecessario} total: ${recinto.tamanho})`
        });
    }

    // Ordena os recintos viáveis pelo número do recinto
    recintosViaveis.sort((a, b) => a.numero - b.numero);

    // Retorna os recintos viáveis ou um erro caso não haja
    return recintosViaveis.length > 0
        ? { recintosViaveis: recintosViaveis.map(r => r.descricao) }
        : { erro: "Não há recinto viável" };
}

}

export { RecintosZoo as RecintosZoo};
