document.addEventListener("DOMContentLoaded", function() {
    const LOCAL_STORAGE_KEY = 'geradorAmeacasState_T20';

    // === ELEMENTOS DO DOM ===
    const elements = {
        form: document.getElementById('gerador-form'),
        nd: document.getElementById("nd"),
        nd2: document.getElementById("nd2"),
        bandoMod: document.getElementById("bando-mod"),
        iniciativa: document.getElementById("iniciativa"),
        percepcao: document.getElementById("percepcao"),
        ataque: document.getElementById("ataque"),
        dano: document.getElementById("dano"),
        sugestaoDano: document.getElementById("sugestao-dano"),
        pv: document.getElementById("pv"),
        defesa: document.getElementById("defesa"),
        forte: document.getElementById("forte"),
        media: document.getElementById("media"),
        fraca: document.getElementById("fraca"),
        cd: document.getElementById("classe_dificuldade"),
        pm: document.getElementById("pm"),
        resultado: document.getElementById("resultado"),
        locomocaoTipo: document.getElementById("locomocao-tipo"),
        locomocaoVelocidade: document.getElementById("locomocao-velocidade"),
        tamanho: document.getElementById("tamanho"),
        atributos: { for: document.getElementById("for"), des: document.getElementById("des"), con: document.getElementById("con"), int: document.getElementById("int"), sab: document.getElementById("sab"), car: document.getElementById("car") },
        // Modal
        imageUrl: document.getElementById("image-url"),
        loadImageBtn: document.getElementById("load-image"),
        downloadFichaBtn: document.getElementById('download-ficha'),
        clearStateBtn: document.getElementById('clear-state'),
        fichaFinalContainer: document.getElementById('ficha-final-container'),
        imageContainer: document.getElementById("image-container"),
        // Gerador Rápido
        quickND: document.getElementById('quick-nd'),
        quickPapel: document.getElementById('quick-papel'),
        generateRandomBtn: document.getElementById('generate-random'),
    };

    const formInputs = Array.from(elements.form.querySelectorAll('input, select, textarea'));

    // === BASE DE DADOS DE ARQUÉTIPOS ===
    const archetypes = [
        {
            nome: "Brutamontes Orc",
            descricao: "Um orc massivo e pouco inteligente que esmaga tudo em seu caminho com sua clava gigante. Age por instinto e fúria.",
            tipo: "Humanoide", subtipo: "Orc", tamanho: "Grande",
            locomocao: "Bípede", velocidade: "Normal",
            atributos: { for: 8, des: -1, con: 5, int: -3, sab: -1, car: -3 },
            ataques: "Clava Gigante (impacto)", defensivo: "Casca Grossa, Vitalidade",
            habilidades: "Fúria Bárbara: Uma vez por combate, pode fazer um ataque adicional, mas fica fatigado depois.",
            pericias: "Intimidação, Atletismo", tesouro: "Dobro"
        },
        {
            nome: "Espreitador das Sombras",
            descricao: "Uma criatura furtiva e malevolente que se esconde na escuridão para apunhalar suas vítimas. Usa venenos para debilitar seus alvos.",
            tipo: "Morto-Vivo", subtipo: "Sombra", tamanho: "Médio",
            locomocao: "Bípede", velocidade: "Rápido",
            atributos: { for: 1, des: 8, con: 1, int: 1, sab: 5, car: 3 },
            ataques: "Adaga Envenenada (perfuração, veneno)", defensivo: "Incorpóreo, Esquiva Sobrenatural",
            habilidades: "Ataque Furtivo: Se atacar um alvo desprevenido, causa dano extra (metade do dano médio).",
            pericias: "Furtividade, Ladinagem", tesouro: "Padrão"
        },
        {
            nome: "Golem de Ferro",
            descricao: "Um construto implacável, imune a quase tudo que não seja magia poderosa ou adamante. Não pensa, apenas obedece ordens.",
            tipo: "Construto", subtipo: "", tamanho: "Grande",
            locomocao: "Bípede", velocidade: "Lento",
            atributos: { for: 8, des: -5, con: 8, int: -5, sab: -5, car: -5 },
            ataques: "2 Pancadas (impacto)", defensivo: "Imunidade a dano (exceto mágico), Redução de Dano 10",
            habilidades: "Protocolo de Extermínio: Pode gastar 5 PM para fazer um ataque adicional contra um alvo.",
            pericias: "Percepção", tesouro: "Nenhum"
        },
        {
            nome: "Elemental da Tempestade",
            descricao: "Um espírito rodopiante de vento e relâmpagos. Voa pelo campo de batalha, eletrocutando inimigos.",
            tipo: "Espírito", subtipo: "Ar, Elétrico", tamanho: "Grande",
            locomocao: "Voador", velocidade: "Rápido",
            atributos: { for: -5, des: 7, con: 3, int: 1, sab: 3, car: 5 },
            ataques: "Toque Chocante (eletricidade)", defensivo: "Imunidade a eletricidade, Forma Gasosa",
            habilidades: "Rajada de Vento: Empurra todos os inimigos adjacentes 6m (Fortitude CD evita).",
            pericias: "Acrobacia", tesouro: "Essência Elemental"
        },
        {
            nome: "Fera das Profundezas",
            descricao: "Um monstro aquático com múltiplos tentáculos e uma carapaça quitinosa. Puxa suas vítimas para a água para afogá-las.",
            tipo: "Monstro", subtipo: "Aquático", tamanho: "Grande",
            locomocao: "Nadador", velocidade: "Rápido",
            atributos: { for: 7, des: 3, con: 5, int: -3, sab: 1, car: -1 },
            ataques: "Mordida (perfuração), 4 Tentáculos (impacto)", defensivo: "Carapaça, Visão na Penumbra",
            habilidades: "Agarrar Aprimorado: Se acertar com um tentáculo, pode fazer a manobra agarrar como ação livre.",
            pericias: "Atletismo, Percepção", tesouro: "Padrão"
        },
        {
            nome: "Cão de Caça Infernal",
            descricao: "Uma matilha de bestas vindas de um plano infernal. Exalam fogo e caçam em grupo de forma implacável.",
            tipo: "Monstro", subtipo: "Extraplanar, Fogo", tamanho: "Médio",
            locomocao: "Quadrúpede", velocidade: "Rápido",
            atributos: { for: 5, des: 5, con: 3, int: -1, sab: 3, car: -1 },
            ataques: "Mordida Flamejante (perfuração, fogo)", defensivo: "Resistência a fogo, Faro",
            habilidades: "Sopro de Fogo: Uma vez por cena, pode cuspir um cone de fogo de 6m.",
            pericias: "Percepção, Sobrevivência", tesouro: "Nenhum"
        },
        {
            nome: "Aranha Gigante Peçonhenta",
            descricao: "Uma aranha colossal que tece teias enormes e imobiliza suas presas com uma picada paralisante.",
            tipo: "Animal", subtipo: "", tamanho: "Grande",
            locomocao: "Escalador", velocidade: "Normal",
            atributos: { for: 5, des: 5, con: 3, int: -5, sab: 3, car: -5 },
            ataques: "Picada (perfuração, veneno)", defensivo: "Visão na Penumbra",
            habilidades: "Teia: Pode gastar 2 PM para lançar uma rede de teia que funciona como a magia 'Amarras Etéreas'.",
            pericias: "Furtividade", tesouro: "Metade"
        },
        {
            nome: "Lich Mago",
            descricao: "Um mestre da necromancia que enganou a morte, tornando-se um morto-vivo de poder imenso. Comanda legiões de esqueletos.",
            tipo: "Morto-Vivo", subtipo: "Mago", tamanho: "Médio",
            locomocao: "Bípede", velocidade: "Normal",
            atributos: { for: -1, des: 1, con: 3, int: 8, sab: 7, car: 5 },
            ataques: "Toque da Morte (necrose)", defensivo: "Imunidade a frio e veneno, Resistência a magia",
            habilidades: "Magias (Raio do Enfraquecimento, Bola de Fogo, Muralha de Ossos), Levantar Mortos.",
            pericias: "Misticismo, Vontade", tesouro: "Dobro"
        },
        {
            nome: "Cavaleiro Caído",
            descricao: "O espírito vingativo de um cavaleiro que falhou em sua missão. Assombra o campo de batalha onde morreu, atacando qualquer um que se aproxime.",
            tipo: "Espírito", subtipo: "", tamanho: "Médio",
            locomocao: "Bípede", velocidade: "Normal",
            atributos: { for: 5, des: 3, con: -5, int: -1, sab: 1, car: 5 },
            ataques: "Espada Espectral (corte, espírito)", defensivo: "Incorpóreo, Vontade de Ferro",
            habilidades: "Aura de Medo: Inimigos a até 9m devem passar num teste de Vontade ou ficam apavorados.",
            pericias: "Luta, Intimidação", tesouro: "Padrão"
        },
        {
            nome: "Troll da Montanha",
            descricao: "Uma criatura estúpida, mas extremamente difícil de matar devido à sua capacidade de regenerar ferimentos rapidamente.",
            tipo: "Humanoide", subtipo: "Gigante", tamanho: "Grande",
            locomocao: "Bípede", velocidade: "Normal",
            atributos: { for: 7, des: -1, con: 8, int: -3, sab: -1, car: -3 },
            ataques: "2 Garras (corte)", defensivo: "Regeneração 10 (desliga por fogo ou ácido)",
            habilidades: "Vulnerabilidade a Fogo: Recebe 50% a mais de dano de fogo.",
            pericias: "Atletismo", tesouro: "Padrão"
        }
    ];
    
    // === DADOS E TABELAS (O resto permanece igual) ===
    const statsTable = {
        "1":  { "Solo": { ataque: 9, dano: 15, defesa: 16, forte: 5, media: 0, fraca: 0, pv: 35, cd: 14 }, "Lacaio": { ataque: 9, dano: 11, defesa: 15, forte: 5, media: 1, fraca: 1, pv: 9, cd: 14 }, "Especial": { ataque: 7, dano: 15, defesa: 14, forte: 5, media: 0, fraca: 0, pv: 25, cd: 16 } },
        "2":  { "Solo": { ataque: 12, dano: 18, defesa: 19, forte: 7, media: 2, fraca: 2, pv: 70, cd: 16 }, "Lacaio": { ataque: 14, dano: 21, defesa: 18, forte: 7, media: 3, fraca: 3, pv: 14, cd: 16 }, "Especial": { ataque: 10, dano: 18, defesa: 17, forte: 7, media: 2, fraca: 2, pv: 49, cd: 18 } },
        "3":  { "Solo": { ataque: 14, dano: 21, defesa: 21, forte: 9, media: 3, fraca: 3, pv: 105, cd: 17 }, "Lacaio": { ataque: 16, dano: 24, defesa: 20, forte: 9, media: 4, fraca: 4, pv: 21, cd: 17 }, "Especial": { ataque: 12, dano: 21, defesa: 19, forte: 9, media: 3, fraca: 3, pv: 74, cd: 19 } },
        "4":  { "Solo": { ataque: 16, dano: 24, defesa: 23, forte: 10, media: 4, fraca: 4, pv: 140, cd: 18 }, "Lacaio": { ataque: 17, dano: 32, defesa: 22, forte: 10, media: 5, fraca: 5, pv: 28, cd: 18 }, "Especial": { ataque: 14, dano: 24, defesa: 21, forte: 10, media: 4, fraca: 4, pv: 98, cd: 20 } },
        "5":  { "Solo": { ataque: 17, dano: 40, defesa: 24, forte: 11, media: 5, fraca: 5, pv: 200, cd: 20 }, "Lacaio": { ataque: 20, dano: 56, defesa: 23, forte: 11, media: 6, fraca: 6, pv: 40, cd: 20 }, "Especial": { ataque: 15, dano: 40, defesa: 22, forte: 11, media: 5, fraca: 5, pv: 140, cd: 22 } },
        "6":  { "Solo": { ataque: 20, dano: 56, defesa: 27, forte: 12, media: 6, fraca: 6, pv: 240, cd: 22 }, "Lacaio": { ataque: 24, dano: 62, defesa: 26, forte: 12, media: 7, fraca: 7, pv: 48, cd: 22 }, "Especial": { ataque: 18, dano: 56, defesa: 25, forte: 12, media: 6, fraca: 6, pv: 168, cd: 24 } },
        "7":  { "Solo": { ataque: 24, dano: 62, defesa: 31, forte: 14, media: 7, fraca: 7, pv: 280, cd: 24 }, "Lacaio": { ataque: 26, dano: 68, defesa: 30, forte: 14, media: 8, fraca: 8, pv: 56, cd: 24 }, "Especial": { ataque: 22, dano: 62, defesa: 29, forte: 14, media: 7, fraca: 7, pv: 196, cd: 26 } },
        "8":  { "Solo": { ataque: 26, dano: 68, defesa: 33, forte: 15, media: 8, fraca: 8, pv: 320, cd: 26 }, "Lacaio": { ataque: 27, dano: 74, defesa: 32, forte: 15, media: 9, fraca: 9, pv: 64, cd: 26 }, "Especial": { ataque: 24, dano: 68, defesa: 31, forte: 15, media: 8, fraca: 8, pv: 224, cd: 28 } },
        "9":  { "Solo": { ataque: 27, dano: 74, defesa: 34, forte: 15, media: 9, fraca: 9, pv: 360, cd: 28 }, "Lacaio": { ataque: 29, dano: 80, defesa: 33, forte: 15, media: 10, fraca: 10, pv: 72, cd: 28 }, "Especial": { ataque: 25, dano: 74, defesa: 32, forte: 15, media: 9, fraca: 9, pv: 252, cd: 30 } },
        "10": { "Solo": { ataque: 29, dano: 80, defesa: 36, forte: 16, media: 10, fraca: 10, pv: 400, cd: 30 }, "Lacaio": { ataque: 34, dano: 105, defesa: 35, forte: 16, media: 11, fraca: 11, pv: 80, cd: 30 }, "Especial": { ataque: 27, dano: 80, defesa: 34, forte: 16, media: 10, fraca: 10, pv: 280, cd: 32 } },
        "11": { "Solo": { ataque: 34, dano: 130, defesa: 41, forte: 18, media: 11, fraca: 11, pv: 550, cd: 31 }, "Lacaio": { ataque: 36, dano: 144, defesa: 40, forte: 18, media: 12, fraca: 12, pv: 110, cd: 31 }, "Especial": { ataque: 32, dano: 130, defesa: 39, forte: 18, media: 11, fraca: 11, pv: 385, cd: 33 } },
        "12": { "Solo": { ataque: 36, dano: 144, defesa: 43, forte: 20, media: 12, fraca: 12, pv: 600, cd: 33 }, "Lacaio": { ataque: 37, dano: 158, defesa: 42, forte: 20, media: 13, fraca: 13, pv: 120, cd: 33 }, "Especial": { ataque: 34, dano: 144, defesa: 41, forte: 20, media: 12, fraca: 12, pv: 420, cd: 35 } },
        "13": { "Solo": { ataque: 37, dano: 158, defesa: 44, forte: 20, media: 13, fraca: 13, pv: 650, cd: 35 }, "Lacaio": { ataque: 39, dano: 172, defesa: 43, forte: 20, media: 14, fraca: 14, pv: 130, cd: 35 }, "Especial": { ataque: 35, dano: 158, defesa: 42, forte: 20, media: 13, fraca: 13, pv: 455, cd: 37 } },
        "14": { "Solo": { ataque: 39, dano: 172, defesa: 46, forte: 22, media: 14, fraca: 14, pv: 700, cd: 38 }, "Lacaio": { ataque: 43, dano: 186, defesa: 45, forte: 22, media: 15, fraca: 15, pv: 140, cd: 38 }, "Especial": { ataque: 37, dano: 172, defesa: 44, forte: 22, media: 14, fraca: 14, pv: 490, cd: 40 } },
        "15": { "Solo": { ataque: 43, dano: 186, defesa: 50, forte: 22, media: 15, fraca: 15, pv: 750, cd: 40 }, "Lacaio": { ataque: 46, dano: 200, defesa: 49, forte: 22, media: 16, fraca: 16, pv: 150, cd: 40 }, "Especial": { ataque: 41, dano: 186, defesa: 48, forte: 22, media: 15, fraca: 15, pv: 525, cd: 42 } },
        "16": { "Solo": { ataque: 46, dano: 200, defesa: 53, forte: 24, media: 16, fraca: 16, pv: 800, cd: 42 }, "Lacaio": { ataque: 47, dano: 235, defesa: 52, forte: 24, media: 17, fraca: 17, pv: 160, cd: 42 }, "Especial": { ataque: 44, dano: 200, defesa: 51, forte: 24, media: 16, fraca: 16, pv: 560, cd: 44 } },
        "17": { "Solo": { ataque: 47, dano: 270, defesa: 54, forte: 24, media: 17, fraca: 17, pv: 1020, cd: 44 }, "Lacaio": { ataque: 49, dano: 288, defesa: 53, forte: 24, media: 18, fraca: 18, pv: 204, cd: 44 }, "Especial": { ataque: 45, dano: 270, defesa: 52, forte: 24, media: 17, fraca: 17, pv: 714, cd: 46 } },
        "18": { "Solo": { ataque: 49, dano: 288, defesa: 56, forte: 26, media: 18, fraca: 18, pv: 1080, cd: 47 }, "Lacaio": { ataque: 52, dano: 306, defesa: 55, forte: 26, media: 19, fraca: 19, pv: 216, cd: 47 }, "Especial": { ataque: 47, dano: 288, defesa: 54, forte: 26, media: 18, fraca: 18, pv: 756, cd: 49 } },
        "19": { "Solo": { ataque: 52, dano: 306, defesa: 59, forte: 26, media: 19, fraca: 19, pv: 1140, cd: 47 }, "Lacaio": { ataque: 54, dano: 324, defesa: 58, forte: 26, media: 20, fraca: 20, pv: 228, cd: 47 }, "Especial": { ataque: 50, dano: 306, defesa: 57, forte: 26, media: 19, fraca: 19, pv: 798, cd: 49 } },
        "20": { "Solo": { ataque: 54, dano: 324, defesa: 61, forte: 28, media: 20, fraca: 20, pv: 1200, cd: 49 }, "Lacaio": { ataque: 56, dano: 344, defesa: 60, forte: 28, media: 21, fraca: 21, pv: 240, cd: 49 }, "Especial": { ataque: 52, dano: 324, defesa: 59, forte: 28, media: 20, fraca: 20, pv: 840, cd: 51 } },
    };
    const deslocamentoTable = { "Bípede": { "Pequeno": { "Lento": "4,5m", "Normal": "6m", "Rápido": "9m" }, "Médio": { "Lento": "6m", "Normal": "9m", "Rápido": "12m" }, "Grande": { "Lento": "9m", "Normal": "12m", "Rápido": "18m" } }, "Quadrúpede": { "Pequeno": { "Lento": "6m", "Normal": "9m", "Rápido": "12m" }, "Médio": { "Lento": "9m", "Normal": "12m", "Rápido": "15m" }, "Grande": { "Lento": "12m", "Normal": "15m", "Rápido": "18m" } }, "Voador": { "Pequeno": { "Lento": "12m", "Normal": "15m", "Rápido": "18m" }, "Médio": { "Lento": "15m", "Normal": "18m", "Rápido": "24m" }, "Grande": { "Lento": "18m", "Normal": "24m", "Rápido": "36m" } }, "Escalador": { "Pequeno": { "Lento": "4,5m", "Normal": "9m", "Rápido": "12m" }, "Médio": { "Lento": "4,5m", "Normal": "9m", "Rápido": "12m" }, "Grande": { "Lento": "4,5m", "Normal": "9m", "Rápido": "12m" } }, "Nadador": { "Pequeno": { "Lento": "4,5m", "Normal": "6m", "Rápido": "9m" }, "Médio": { "Lento": "4,5m", "Normal": "6m", "Rápido": "9m" }, "Grande": { "Lento": "9m", "Normal": "15m", "Rápido": "24m" } } };
    const atributosTable = { "Incapaz (-5)": -5, "Incompetente (-4/-3)": -3, "Ineficaz (-2/-1)": -1, "Mediano (0/1)": 1, "Notável (2/3)": 3, "Excelente (4/5)": 5, "Extraordinário (6/7)": 7, "Excepcional (8+)": 8 };

    // === NOVA FUNÇÃO: GERADOR RÁPIDO ===
    function gerarAmeacaAleatoria() {
        if (!confirm("Isso irá sobrescrever os campos atuais com uma nova criatura. Deseja continuar?")) {
            return;
        }

        const archetype = archetypes[Math.floor(Math.random() * archetypes.length)];
        const nd = elements.quickND.value;
        const papel = elements.quickPapel.value;

        // Preenche os campos do formulário principal
        document.getElementById('nome').value = archetype.nome;
        document.getElementById('textopersonagem').value = archetype.descricao;
        document.getElementById('criaturatipo').value = archetype.tipo;
        document.getElementById('subtipo').value = archetype.subtipo;
        document.getElementById('tamanho').value = archetype.tamanho;
        document.getElementById('locomocao-tipo').value = archetype.locomocao;
        document.getElementById('locomocao-velocidade').value = archetype.velocidade;
        document.getElementById('habilidades-ataque').value = archetype.ataques;
        document.getElementById('defensivo').value = archetype.defensivo;
        document.getElementById('habilidades').value = archetype.habilidades;
        document.getElementById('pericias').value = archetype.pericias;
        document.getElementById('tesouro').value = archetype.tesouro;

        // Preenche os atributos
        for (const attr in archetype.atributos) {
            elements.atributos[attr].value = archetype.atributos[attr];
        }

        // Configura o ND e o Papel
        elements.nd.value = nd;
        elements.nd2.value = papel;
        elements.bandoMod.value = "0"; // Reseta o modificador de bando

        // Atualiza todos os cálculos e salva o novo estado
        updateStats();
        saveState();
    }

    // === FUNÇÕES DE LÓGICA (O resto permanece igual) ===
    function updateStats() { const ndValue = elements.nd.value, papel = elements.nd2.value; if (ndValue && papel) { applyAndDisplayStats(); } else { clearStats(); } }
    function applyAndDisplayStats() {
        const ndOriginal = parseInt(elements.nd.value), papel = elements.nd2.value, bandoMod = parseInt(elements.bandoMod.value), isBando = bandoMod > 0, finalND = Math.min(20, ndOriginal + bandoMod), statsBase = statsTable[ndOriginal.toString()]?.[papel], statsFinalND = statsTable[finalND.toString()]?.[papel];
        if (!statsBase || !statsFinalND) { clearStats(); return; }
        let currentStats = { ...statsFinalND };
        if (isBando && papel !== "Especial") {
            const patamar = getPatamar(finalND); let danoMultiplier = 1;
            if (patamar === 'Veterano') danoMultiplier = 2; if (patamar === 'Campeão') danoMultiplier = 4; if (patamar === 'Lenda') danoMultiplier = 6;
            currentStats.dano = statsBase.dano * danoMultiplier;
            currentStats.ataque -= 1; currentStats.forte -= 1; currentStats.media -= 1; currentStats.fraca -= 1; currentStats.defesa -= 1; currentStats.cd -= 1;
        } else { currentStats.dano = statsFinalND.dano; }
        currentStats.iniciativa = finalND + 5; currentStats.percepcao = finalND + 5; currentStats.pm = finalND * 3;
        elements.iniciativa.textContent = currentStats.iniciativa; elements.percepcao.textContent = currentStats.percepcao; elements.ataque.textContent = currentStats.ataque; elements.dano.textContent = currentStats.dano; elements.sugestaoDano.textContent = `(Sugestão: ${sugerirRolagemDeDano(currentStats.dano)})`; elements.pv.textContent = currentStats.pv; elements.defesa.textContent = currentStats.defesa; elements.forte.textContent = currentStats.forte; elements.media.textContent = currentStats.media; elements.fraca.textContent = currentStats.fraca; elements.cd.textContent = currentStats.cd; elements.pm.textContent = currentStats.pm;
        updateNDResult(); updateDeslocamento();
    }
    function updateNDResult() { const ndOriginal = parseInt(elements.nd.value) || 0, bandoMod = parseInt(elements.bandoMod.value), finalND = Math.min(20, ndOriginal + bandoMod), patamar = getPatamar(finalND); elements.resultado.innerHTML = `ND Final: <span class="badge badge-success p-2">${finalND} (${patamar})</span>`; }
    function getPatamar(nd) { if (nd <= 5) return 'Iniciante'; if (nd <= 10) return 'Veterano'; if (nd <= 16) return 'Campeão'; return 'Lenda'; }
    function updateDeslocamento() { const tipo = elements.locomocaoTipo.value, tamanho = elements.tamanho.value, velocidade = elements.locomocaoVelocidade.value; if (deslocamentoTable[tipo]?.[tamanho]?.[velocidade]) { elements.deslocamento.value = deslocamentoTable[tipo][tamanho][velocidade]; } else { elements.deslocamento.value = "N/A"; } }
    function populateAtributos() { for (const attr in elements.atributos) { const select = elements.atributos[attr]; select.innerHTML = ""; for (const cat in atributosTable) { const option = document.createElement('option'); option.value = atributosTable[cat]; option.textContent = cat; select.appendChild(option); } select.value = 1; } }
    function getRoll(targetDamage) { const dados = [ {d:12, avg:6.5}, {d:10, avg:5.5}, {d:8, avg:4.5}, {d:6, avg:3.5}, {d:4, avg:2.5} ]; let bestRoll = { roll: "N/A", diff: Infinity }; for (let numDados = 1; numDados <= 12; numDados++) { for (const dado of dados) { const avgRoll = numDados * dado.avg; const bonus = Math.round(targetDamage - avgRoll); if (bonus >= 0) { const currentDiff = Math.abs(targetDamage - (avgRoll + bonus)); if (currentDiff < bestRoll.diff) { bestRoll = { roll: `${numDados}d${dado.d}+${bonus}`, diff: currentDiff }; } } } } return bestRoll.roll; }
    function sugerirRolagemDeDano(danoMedio) { if (!danoMedio) return "N/A"; let singleAttackRoll = getRoll(danoMedio); if (singleAttackRoll !== "N/A" && parseInt(singleAttackRoll.split('d')[0]) <= 8) { return singleAttackRoll; } let doubleAttackDamage = Math.floor(danoMedio / 2); let doubleAttackRoll = getRoll(doubleAttackDamage); if (doubleAttackRoll !== "N/A") { return `2 ataques de ${doubleAttackRoll} (dano total ~${doubleAttackDamage * 2})`; } let tripleAttackDamage = Math.floor(danoMedio / 3); let tripleAttackRoll = getRoll(tripleAttackDamage); if (tripleAttackRoll !== "N/A") { return `3 ataques de ${tripleAttackRoll} (dano total ~${tripleAttackDamage * 3})`; } return singleAttackRoll; }
    function clearStats() { const spans = [elements.iniciativa, elements.percepcao, elements.ataque, elements.dano, elements.pv, elements.defesa, elements.forte, elements.media, elements.fraca, elements.cd, elements.pm]; spans.forEach(span => span.textContent = "0"); elements.resultado.innerHTML = ""; elements.sugestaoDano.textContent = ""; }
    function gerarFichaFinal() {
        const getVal = (id) => document.getElementById(id)?.value || '';
        const getSpan = (id) => document.getElementById(id)?.textContent || '';
        const getAttr = (id) => { const select = document.getElementById(id); return select ? select.options[select.selectedIndex]?.text : ''; };
        const fichaData = { nome: getVal('nome'), ndFinal: getSpan('resultado').replace('ND Final: ', ''), papel: getVal('nd2'), imageUrl: getVal('image-url'), descricao: getVal('textopersonagem').replace(/\n/g, '<br>'), tipo: getVal('criaturatipo'), subtipo: getVal('subtipo'), tamanho: getVal('tamanho'), iniciativa: getSpan('iniciativa'), percepcao: getSpan('percepcao'), habilidadesVisuais: getVal('visual'), defesa: getSpan('defesa'), resForte: getSpan('forte'), resMedia: getSpan('media'), resFraca: getSpan('fraca'), habDefensivas: getVal('defensivo'), pv: getSpan('pv'), deslocamento: getVal('deslocamento'), ataque: getSpan('ataque'), danoMedio: getSpan('dano'), sugestaoDano: getSpan('sugestao-dano'), desc_ataques: getVal('habilidades-ataque').replace(/\n/g, '<br>'), cd: getSpan('classe_dificuldade'), pm: getSpan('pm'), habilidades: getVal('habilidades').replace(/\n/g, '<br>'), for: getAttr('for'), des: getAttr('des'), con: getAttr('con'), int: getAttr('int'), sab: getAttr('sab'), car: getAttr('car'), pericias: getVal('pericias').replace(/\n/g, '<br>'), tesouro: getVal('tesouro'), };
        const fichaHtml = `<div id="ficha-para-download" style="padding: 15px; background-color: white;"> <h3 style="font-family: 'Tormenta'; color: #9d1e1e;">${fichaData.nome || 'Ameaça sem Nome'} <span style="font-size: 0.8em; color: #333;">${fichaData.ndFinal} (${fichaData.papel})</span></h3> ${fichaData.imageUrl ? `<img src="${fichaData.imageUrl}" class="img-fluid rounded mb-3" alt="Imagem da Ameaça" crossOrigin="anonymous">` : ''} <p><i>${fichaData.descricao || '<i>Nenhuma descrição fornecida.</i>'}</i></p> <p><b>${fichaData.tipo} ${fichaData.subtipo} (${fichaData.tamanho})</b></p> <hr style="border-top: 1px solid #9d1e1e;"> <p><b>Iniciativa</b> +${fichaData.iniciativa}, <b>Percepção</b> +${fichaData.percepcao} ${fichaData.habilidadesVisuais ? ', ' + fichaData.habilidadesVisuais : ''}</p> <p><b>Defesa</b> ${fichaData.defesa} &nbsp;&nbsp; <b>Fort</b> +${fichaData.resForte}, <b>Ref</b> +${fichaData.resMedia}, <b>Von</b> +${fichaData.resFraca} ${fichaData.habDefensivas ? '<br><i>' + fichaData.habDefensivas + '</i>' : ''}</p> <p><b>Pontos de Vida</b> ${fichaData.pv}</p> <p><b>Deslocamento</b> ${fichaData.deslocamento}</p> <hr style="border-top: 1px solid #9d1e1e;"> <p><b>Ataques:</b><br>${fichaData.desc_ataques || '<i>Nenhum ataque descrito.</i>'}</p> <p><b>Bônus de Ataque:</b> +${fichaData.ataque} &nbsp;&nbsp; <b>Dano Médio Total:</b> ${fichaData.danoMedio} ${fichaData.sugestaoDano}</p> <hr style="border-top: 1px solid #9d1e1e;"> <p><b>Habilidades (CD ${fichaData.cd}, ${fichaData.pm} PM)</b><br>${fichaData.habilidades || '<i>Nenhuma habilidade descrita.</i>'}</p> <hr style="border-top: 1px solid #9d1e1e;"> <p><b>Atributos:</b> For (${fichaData.for}), Des (${fichaData.des}), Con (${fichaData.con}), Int (${fichaData.int}), Sab (${fichaData.sab}), Car (${fichaData.car})</p> <p><b>Perícias:</b> ${fichaData.pericias || '<i>Nenhuma outra perícia.</i>'}</p> <p><b>Tesouro:</b> ${fichaData.tesouro || '<i>Nenhum.</i>'}</p> </div>`;
        elements.imageContainer.innerHTML = fichaHtml;
    }
    function downloadFicha() {
        gerarFichaFinal();
        const fichaElement = document.getElementById('ficha-para-download');
        if (fichaElement) {
            html2canvas(fichaElement, { useCORS: true, backgroundColor: "#ffffff", onclone: (clonedDoc) => { const style = clonedDoc.createElement('style'); style.innerHTML = `@font-face { font-family: 'Tormenta'; src: url('Tormenta.ttf') format('truetype'); } body { font-family: 'Tormenta', sans-serif; }`; clonedDoc.head.appendChild(style); } }).then(canvas => { const link = document.createElement('a'); const nomeAmeaca = document.getElementById('nome').value || 'ameaca-sem-nome'; link.download = `${nomeAmeaca.replace(/\s+/g, '_').toLowerCase()}.png`; link.href = canvas.toDataURL("image/png"); link.click(); });
        } else { alert("Por favor, gere uma ficha primeiro antes de tentar baixar."); }
    }
    function saveState() { const state = {}; formInputs.forEach(input => { state[input.id] = input.value; }); localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state)); }
    function loadState() { const savedState = localStorage.getItem(LOCAL_STORAGE_KEY); if (savedState) { const state = JSON.parse(savedState); formInputs.forEach(input => { if (state[input.id]) { input.value = state[input.id]; } }); updateStats(); } else { elements.nd.value = "1"; updateStats(); } }
    function clearState() { if (confirm("Tem certeza de que deseja limpar todos os campos? O progresso salvo será perdido.")) { localStorage.removeItem(LOCAL_STORAGE_KEY); elements.form.reset(); populateAtributos(); updateStats(); } }

    // === EVENT LISTENERS ===
    formInputs.forEach(input => { const eventType = (input.tagName === 'TEXTAREA' || input.type === 'text') ? 'keyup' : 'change'; input.addEventListener(eventType, saveState); });
    [elements.nd, elements.nd2, elements.bandoMod, ...Object.values(elements.atributos)].forEach(el => el.addEventListener('change', updateStats));
    [elements.locomocaoTipo, elements.locomocaoVelocidade, elements.tamanho].forEach(el => el.addEventListener('change', updateDeslocamento));
    elements.loadImageBtn.addEventListener('click', gerarFichaFinal);
    elements.clearStateBtn.addEventListener('click', clearState);
    elements.downloadFichaBtn.addEventListener('click', downloadFicha);
    elements.generateRandomBtn.addEventListener('click', gerarAmeacaAleatoria); // Novo listener para o gerador rápido

    // === INICIALIZAÇÃO ===
    populateAtributos();
    loadState();
});
