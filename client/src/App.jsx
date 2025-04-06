import { useState } from 'react'
import TaskMangement from './pages/TaskPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div >
      <TaskMangement />
    </div>
  )
}

export default App
