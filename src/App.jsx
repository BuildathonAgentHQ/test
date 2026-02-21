import React, { useState } from 'react'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <h1>React Counter</h1>
      <div className="counter">
        <span className="count" aria-live="polite">{count}</span>
        <div className="buttons">
          <button onClick={() => setCount(c => c + 1)}>Increment</button>
          <button onClick={() => setCount(0)}>Reset</button>
        </div>
      </div>
    </div>
  )
}
