import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState(null)

  const fetchPikachu = async () => {
    setData(null)
    setError(null)
    setLoading(true)
    try {
      const request = await fetch('https://pokeapi.co/api/v2/pokemon/pikachu')

      if (!request.ok) {
        setError(new Error('Failed to fetch data'))
        return
      }
      const data = await request.json()
      setData(data)

      return data
    } catch (error) {
        setError(error instanceof Error ? error : new Error(String(error)))
    } finally {
        setLoading(false)
    }
  }

  useEffect(() => {
    fetchPikachu().then(data => console.log(data))
  }, [])

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
