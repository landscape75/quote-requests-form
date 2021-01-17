import { useState, useEffect } from 'react'
import userbase from 'userbase-js'

function Todo({ name, done, toggleComplete, deleteTodo }) {
  return (
    <li className="my-4">
      <div className="flex items-center">
        <span className={done ? 'text-gray-400' : 'text-gray=800 dark:text-white'}>{name}</span>
        <button
          type="button"
          className="mx-4 p-1 rounded bg-purple-400 text-white font-bold"
          onClick={(e) => {
            e.preventDefault()
            toggleComplete()
          }}
        >
          {done ? 'Not done' : 'Done'}
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            deleteTodo()
          }}
          className=" p-1 bg-red-500 text-white rounded font-bold"
        >
          Delete
        </button>
      </div>
    </li>
  )
}

function TodoForm() {
  const [newTodo, setNewTodo] = useState('')
  const [todos, setTodos] = useState([])
  const [disabled, setDisabled] = useState()

  useEffect(() => {
    async function openDatabase() {
      try {
        console.log('opening db...')
        await userbase.openDatabase({
          databaseName: 'next-userbase-todos',
          changeHandler: function (items) {
            setTodos(items)
          },
        })
      } catch (e) {
        console.error(e.message)
      }
    }
    openDatabase()
  }, [])

  async function addTodo(e) {
    e.preventDefault()
    setDisabled(true)
    try {
      await userbase.insertItem({
        databaseName: 'next-userbase-todos',
        item: { name: newTodo, done: false },
      })
      setNewTodo('')
      setDisabled(false)
    } catch (e) {
      console.error(e.message)
      setDisabled(false)
    }
  }

  async function toggleComplete(itemId, currentValue) {
    try {
      await userbase.updateItem({
        databaseName: 'next-userbase-todos',
        item: { ...currentValue, done: !currentValue.done },
        itemId,
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  function handleNewTodo(e) {
    e.preventDefault()
    setNewTodo(e.target.value)
  }

  async function deleteTodo(itemId) {
    setDisabled(true)
    try {
      await userbase.deleteItem({
        databaseName: 'next-userbase-todos',
        itemId,
      })
      setNewTodo('')
      setDisabled(false)
    } catch (e) {
      console.error(e.message)
      setDisabled(false)
    }
  }

  return (
    <form className="bg-white dark:bg-gray-700 shadow-lg rounded-lg p-8 mt-10" onSubmit={addTodo}>
      <ul>
        {todos.map((todo) => (
          <Todo
            key={todo.itemId}
            name={todo.item.name}
            done={todo.item.done}
            toggleComplete={() => toggleComplete(todo.itemId, todo.item)}
            deleteTodo={() => deleteTodo(todo.itemId)}
          />
        ))}
      </ul>
      <div className="flex my-4">
        <input
          type="text"
          onChange={handleNewTodo}
          value={newTodo}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <button disabled={disabled} className="bg-mag-blue mx-4 px-4 rounded text-white" type="submit">
          Add
        </button>
      </div>
    </form>
  )
}

export default TodoForm
