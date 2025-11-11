import { useEffect, useReducer } from 'react'
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

type FetchState = {
  loading: boolean
  error: Error | null
  data: Pokemon | null
  success: boolean
}

type FetchAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS', payload: Pokemon }
  | { type: 'FETCH_ERROR', payload: Error }

function fetchReducer(state: FetchState, action: FetchAction) {
  switch (action.type){
    case 'FETCH_START':
      return {
        ...state,
        loading: true,
        error: null,
        data: null,
        success: false,
      }

    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        error: null,
        data: action.payload,
        success: true,
      }
      
    case 'FETCH_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
        data: null,
        success: false,
      }

    default:
      return state
  }
}

const initialState: FetchState = {
  loading: false,
  error: null as Error | null,
  data: null as Pokemon | null,
  success: false,
}

function App() {

  const FETCH_START = 'FETCH_START'
  const FETCH_SUCCESS = 'FETCH_SUCCESS'
  const FETCH_ERROR = 'FETCH_ERROR'

  const [state, dispatch] = useReducer(fetchReducer, initialState)

  const fetchPikachu = async () => {
    dispatch({ type: FETCH_START })
    try {
      const request = await fetch('https://pokeapi.co/api/v2/pokemon/pikachu')

      if (!request.ok) {
        dispatch({ type: FETCH_ERROR, payload: new Error('Failed to fetch data') })
        return
      }
      const data: Pokemon = await request.json()
      dispatch({ type: FETCH_SUCCESS, payload: data })

      return data
    } catch (error) {
        dispatch({ type: FETCH_ERROR, payload: error instanceof Error ? error : new Error(String(error)) })
    }
  }

  useEffect(() => {
    fetchPikachu().then(data => console.log(data))
  }, [])

  return (
    <>
      <div>
        {state.loading && <p>loading...</p>}
        {state.error && <p>error: {state.error.message}</p>}
        {state.data && (
          <div>
            {state.data.sprites.front_default && (
              <img src={state.data.sprites.front_default} alt={state.data.name} />
            )}
            <h1>{toCapitalized(state.data.name)}</h1>
            <h3>id: {state.data.id}</h3>
            <h2>Height: {state.data.height}</h2>
            <h2>Weight: {state.data.weight}</h2>
          </div>
        )}
      </div>
    </>
  )
}

export default App
