import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import './App.css'

type Pokemon = {
    id: number
    name: string
    base_experience: number
    height: number
    weight: number
    is_default: boolean
    order: number
    location_area_encounters: string
    abilities: Array<{
      ability: {
        name: string
        url: string
      }
      is_hidden: boolean
      slot: number
    }>
    cries: {
      latest: string
      legacy: string
    }
    forms: Array<{
      name: string
      url: string
    }>
    game_indices: Array<{
      game_index: number
      version: {
        name: string
        url: string
      }
    }>
    held_items: Array<{
      item: {
        name: string
        url: string
      }
      version_details: Array<{
        rarity: number
        version: {
          name: string
          url: string
        }
      }>
    }>
    moves: Array<{
      move: {
        name: string
        url: string
      }
      version_group_details: Array<{
        level_learned_at: number
        move_learn_method: {
          name: string
          url: string
        }
        version_group: {
          name: string
          url: string
        }
      }>
    }>
    past_abilities: Array<{
      ability: {
        name: string
        url: string
      }
      slot: number
    }>
    past_types: Array<{
      generation: {
        name: string
        url: string
      }
      types: Array<{
        slot: number
        type: {
          name: string
          url: string
        }
      }>
    }>
    species: {
      name: string
      url: string
    }
    sprites: {
      back_default: string | null
      back_female: string | null
      back_shiny: string | null
      back_shiny_female: string | null
      front_default: string | null
      front_female: string | null
      front_shiny: string | null
      front_shiny_female: string | null
      other: {
        dream_world: {
          front_default: string | null
          front_female: string | null
        }
        home: {
          front_default: string | null
          front_female: string | null
          front_shiny: string | null
          front_shiny_female: string | null
        }
        'official-artwork': {
          front_default: string | null
          front_shiny: string | null
        }
        showdown: {
          back_default: string | null
          back_female: string | null
          back_shiny: string | null
          back_shiny_female: string | null
          front_default: string | null
          front_female: string | null
          front_shiny: string | null
          front_shiny_female: string | null
        }
      }
      versions: Record<string, any>
    }
    stats: Array<{
      base_stat: number
      effort: number
      stat: {
        name: string
        url: string
      }
    }>
    types: Array<{
      slot: number
      type: {
        name: string
        url: string
      }
    }>
}

function toCapitalized(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}


async function fetchPokemon(name: string): Promise<Pokemon> {
  const request = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`)

  if (!request.ok) {
    throw new Error('This Pokemon does not exist')
  }

  return await request.json()
}

function App() {

  const [pokemonName, setPokemonName] = useState('pikachu')
  const [inputValue, setInputValue] = useState('pikachu')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPokemonName(inputValue.trim().toLowerCase())
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['pokemon', pokemonName], 
    queryFn: () => fetchPokemon(pokemonName),            
  })

  return (
    <>
      <div style={{ display: 'flex', gap: '10px', flexDirection: 'column', marginBottom: '20px' }}>
        <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder='Enter a pokemon name' />
        <button type="submit" onClick={handleSubmit}>Search</button>
      </div>
      <div>
        {isLoading && <p>loading...</p>}
        {error && <p>error: {error.message}</p>}
        {data && (
          <div>
            {data.sprites.front_default && (
              <img src={data.sprites.front_default} alt={data.name} />
            )}
            <h1>{toCapitalized(data.name)}</h1>
            <h3>id: {data.id}</h3>
            <h2>Height: {data.height} dm</h2>
            <h2>Weight: {data.weight} hg</h2>
          </div>
        )}
      </div>  
    </>
  )
}

export default App
