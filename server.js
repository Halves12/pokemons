const express = require('express');
const app = express();
const port = 3000;


// Middleware para permitir que o servidor entenda JSON
app.use(express.json());

// Array para armazenar a lista de tarefas
let pokemons = [
{id: 1, nome: 'Bulbasaur', elemento: 'Planta', evolucao: 'Ivysaur' },
{id: 2, nome: 'Charmander', elemento: 'Fogo', evolucao: 'Charmeleon'},
{id: 3, nome: 'Squirtle', elemento: 'Água', evolucao: 'Wartortle'},
{id: 4, nome: 'Pikachu', elemento: 'Eletrico', evolucao: 'Raichu'}
];

// função para buscar pokémon pelo ID
const buscarPokemonPorId = (id) => {
    return pokemons.find(pokemon => pokemon.id === id);
};


//  Rota para buscar um Pokémon por ID:
app.get('/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const pokemon = buscarPokemonPorId(id);

    if (!pokemon) {
        return res.status(404).send('Pokemon não encontrado'); 
    }

    res.json(pokemon);
});

//  ROTA POST - Adicionar um novo Pokémon (sem ID automático):

app.post('/pokemons', (req, res) => {
    const novoPokemon = req.body;

// verificar se ID já existe na lista
if (pokemons.some(pokemon => pokemon.id === novoPokemon.id)) {
    return res.status(400).send('ID já existe. por favor, forneça um novo ID único!')
}

// Adiciona o novo pokémon à lista
pokemons.push(novoPokemon);
res.status(201).json(novoPokemon);
}); 

// ROTA DELETE - Remover Pokemon pelo ID
app.delete('/pokemons/:id', (req, res) => {
    const { id } = req.params;     
    const index = pokemons.findIndex(registro => registro.id == id);

    if (index !== -1) {
        const registroDeletado = pokemons.splice(index, 1);
        res.json({ message: 'Registro de pokemon deletado com sucesso', registro: registroDeletado }); 
    } else {
        res.status(404).json({ message: 'Registro de lista não encontrado '});
    }
});

// ROTA PUT - Atualizar um registro do pokemon por ID
app.put('/pokemons/:id', (req, res) => {
    const  id  =  parseInt(req.params.id); // Converte o id da URL para número
    const index = pokemons.findIndex(pokemon => pokemon.id === id); // Procura o Pokémon no array


    // Se o Pokémon não for encontrado, retorna erro
if (index === -1) {
    return res.status(404).send('Pokémon não encontrado');
  }

// Desestruturar os campos do corpo da requisição
const { nome, elemento, evolucao} = req.body

// verificar se os parâmetros estão presentes
if (!nome || !elemento || !evolucao) {
    return res.status(400).json({ message: 'nome, elemento e evolução são obrigatórios!'});
}

// Atualiza o Pokémon com os novos dados vindos do corpo da requisição
    pokemons[index] = { id, ...req.body }; // Mantém o ID e atualiza os outros campos

    // Retorna o Pokémon atualizado
    res.json(pokemons[index]);



    
})













// Rota principal - Página inicial
app.get('/', (req, res) => {
    res.send('API está funcionando! Bora Codar!');
  });



app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});
 