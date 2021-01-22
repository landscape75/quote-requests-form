import { useState, useEffect } from 'react'
import userbase from 'userbase-js'
import Image from 'next/image'

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

function GravityCalc() {
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-2 p-3">
        <div className="relative rounded-lg shadow-lg border border-gray-300 dark:border-gray-900 bg-white dark:bg-gray-900 px-6 py-5 flex space-x-3">
          <div className="flex-1 min-w-0">
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Wall Details
              </p>
              <form className="space-y-4 md:space-y-2 lg:space-y-2 divide-gray-200 dark:divide-gray-700">
                <div className="sm:grid sm:grid-cols-2 sm:gap-4 sm:items-start sm:pt-5">
                  <label for="height" className="block text-sm font-medium text-gray-700 dark:text-gray-100 sm:mt-px sm:pt-2">
                    Soil Type
                  </label>
                  <div className="mt-1 sm:mt-0 md:col-span-1 sm:col-span-2">
                    <select id="height" name="country" autocomplete="height" className="max-w-lg block bg-white dark:bg-gray-300 focus:ring-indigo-500 focus:border-mag-blue w-full shadow-md sm:max-w-xs sm:text-sm border-gray-300 dark:border-gray-500 rounded-md">
                      <option>United States</option>
                      <option>Canada</option>
                      <option>Mexico</option>
                    </select>
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-2 sm:gap-4 sm:items-start sm:pt-5">
                  <label for="height" className="block text-sm font-medium text-gray-700 dark:text-gray-100 sm:mt-px sm:pt-2">
                    Wall Height
                  </label>
                  <div className="mt-1 sm:mt-0 md:col-span-1 sm:col-span-2">
                    <select id="height" name="country" autocomplete="height" className="max-w-lg block bg-white dark:bg-gray-300 focus:ring-indigo-500 focus:border-mag-blue w-full shadow-md sm:max-w-xs sm:text-sm border-gray-300 dark:border-gray-500 rounded-md">
                      <option>United States</option>
                      <option>Canada</option>
                      <option>Mexico</option>
                    </select>
                  </div>
                </div>
              </form>
          </div>
        </div>

        <div className="relative rounded-lg shadow-lg border border-gray-300 dark:border-gray-900 bg-white dark:bg-gray-900 px-6 py-5 flex space-x-3">
          <div className="flex-1 min-w-0">
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Results
              </p>
              <div className="flex flex-col">
                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="overflow-hidden border border-gray-200 rounded-md">
                      <table className="min-w-full divide-y divide-gray-200">
{/*                         <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Title
                            </th>
                          </tr>
                        </thead> */}
                        <tbody className="bg-white dark:bg-gray-300 divide-y divide-gray-200 dark:divide-gray-400">
                          <tr>
                            <td className="px-4 py-2 whitespace-wrap text-sm font-medium text-gray-900">
                              Wall height
                            </td>
                            <td className="px-4 py-2 whitespace-wrap text-sm text-gray-600">
                              8 ft.
                            </td>
                          </tr>                          
                          <tr>
                            <td className="px-4 py-2 whitespace-wrap text-sm font-medium text-gray-900">
                              Soil Type
                            </td>
                            <td className="px-4 py-2 whitespace-wrap text-sm text-gray-600">
                              28
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 whitespace-wrap text-sm font-medium text-gray-900">
                              Total Sq.Ft.
                            </td>
                            <td className="px-4 py-2 whitespace-wrap text-sm text-gray-600">
                              550
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

          </div>
        </div>

        <div className="relative rounded-lg shadow-lg border border-gray-300 dark:border-gray-900 bg-white dark:bg-gray-900 px-6 py-5 flex space-x-3 hover:border-gray-400">
          <div className="flex-1 min-w-0">
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Cross-section
              </p>
              <Image src="/test.png" alt="" width="451" height="541"/>
          </div>
        </div>

        <div className="relative rounded-lg shadow-lg border border-gray-300 dark:border-gray-900 bg-white dark:bg-gray-900 px-6 py-5 flex space-x-3">
          <div className="flex-1 min-w-0">
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Disclaimer
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-200">
              These preliminary details are intended soley to act as an aid when designing a wall. These drawings should not be used for final design or construction. 
              Each site-specific wall should be certified and signed by a registered geotechnical engineer in the Sate or Province where it is being built. the accuarcy 
              and use of the details in this document are the sole responsibility of the user. Global stability analysis has not been performed
              </p>
          </div>
        </div>
      </div>
  )
}

export default GravityCalc
