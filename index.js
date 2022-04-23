import { useState } from 'react'
export default function App() {
  const [count, setState] = useState(0)

  return (
    <>
      <button
        onClick={() => {
          setState(count + 1)
          setState(count + 2)
          setState(count + 3)
        }}
      >
        state改变 count={count}
      </button>
    </>
  )
}
