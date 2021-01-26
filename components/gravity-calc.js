import { useState, useEffect } from 'react'
import userbase from 'userbase-js'
import Image from 'next/image'
import {wallData} from '../public/walldata'
import uuid from 'react-uuid'
import toast from 'react-hot-toast';

function GravityCalc(user) {

  const [savedWalls, setSavedWalls] = useState([]) 
  const [editWall, setEditWall] = useState(false) 
  const [editItemId, setEditItemId] = useState('') 
  const [share, setShareToken] = useState('')
  const [heights, setHeights] = useState([])
  const [selectedCase, setSelectedCase] = useState(-1)
  const [selectedHeight, setSelectedHeight] = useState(-1)
  const [wallDescription, setWallDescription] = useState('New wall')

  const [wallLength, setWallLength] = useState(12)
  const [baseWidth, setBaseWidth] = useState(0)
  const [totalBase, setTotalBase] = useState(0)
  const [totalCrush, setTotalCrush] = useState(0)
  const [soilType, setSoilType] = useState('')
  const [wallHeight, setWallHeight] = useState('')
  const [totalBlocks, setTotalBlocks] = useState(0)
  const [totalExt24, setTotalExt24] = useState(0)
  const [totalExt48, setTotalExt48] = useState(0)
  const [blockCrush, setBlockCrush] = useState(9)
  const [ext24Crush, setExt24Crush] = useState(16)
  const [ext48Crush, setExt48Crush] = useState(32)

  useEffect(() => {
    async function openDatabase() {
      try {
        console.log('opening db...')
        console.log(user.user.profile.name)
        await userbase.openDatabase({
          databaseName: user.user.profile.dbName,
          changeHandler: function (items) {
            setSavedWalls(items)
          },
        })
      } catch (e) {
        console.error(e.message)
      }
    }
    openDatabase()
    //console.log(savedWalls)
  }, [])

  useEffect(() => {
    calcWall()
  }, [selectedCase, 
      selectedHeight, 
      heights, 
      wallLength,
      totalBlocks,
      totalExt24,
      totalExt48,
      baseWidth
     ]
    );
  

  async function shareDatabase() {
    try {
      await userbase.shareDatabase({
        databaseName: user.user.profile.dbName,
      }).then(({ shareToken }) => {
        setShareToken(shareToken)
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  async function saveWall() {
    //setDisabled(true)
    const id = uuid()

    try {
      const p = await userbase.insertItem({
        databaseName: user.user.profile.dbName,
        item: { description: wallDescription, case: selectedCase, height: selectedHeight, length: wallLength },
        itemId: id
      }).then((item) => {
        setEditWall(true)
        setEditItemId(id)
        toast.success('Wall saved to the cloud.', {duration: 5000})
      })
      //setDisabled(false)
    } catch (e) {
      console.error(e.message)
      toast.error('Failed to save wall. - ' + e.message, {duration: 5000})
      //setDisabled(false)
    }


  }

  async function updateWall() {

    try {
      await userbase.updateItem({
        databaseName: user.user.profile.dbName,
        item: { description: wallDescription, case: selectedCase, height: selectedHeight, length: wallLength },
        itemId: editItemId,
      })
      toast.success('Changes have been saved.', {duration: 5000})
    } catch (e) {
      console.error(e.message)
      toast.error('Failed to save changes. - ' + e.message, {duration: 5000})
    }

  }

  async function deleteWall() {
    //setDisabled(true)
    try {
      await userbase.deleteItem({
        databaseName: user.user.profile.dbName,
        itemId: editItemId,
      })
      reset()
      toast.success('Wall deleted from cloud.', {duration: 5000})
      //setDisabled(false)
    } catch (e) {
      console.error(e.message)
      toast.error('Failed to delete wall. - ' + e.message, {duration: 5000})
      //setDisabled(false)
    }
  }

  async function handleCaseSelect(e) {

    await setSelectedCase(e)
  
  }

  async function handleHeightSelect(e) {

    await setSelectedHeight(e)

  }

  async function calcWall() {

    if (selectedCase === -1) {
      return
    }

    if (wallData.cases[selectedCase - 1]) {
      await setHeights(wallData.cases[selectedCase - 1].heights)
    }

    if (selectedHeight === -1) {
      return
    }

    if (!heights[selectedHeight - 1]) {
      return
    }

    await setWallHeight(heights[selectedHeight - 1].description)
    await setBaseWidth(heights[selectedHeight - 1].baseWidth)
    await setSoilType(wallData.cases[selectedCase - 1].description)
    await setTotalBlocks(Math.ceil(heights[selectedHeight - 1].blocks * (Math.ceil(wallLength / 4))))
    await setTotalExt24(Math.ceil(heights[selectedHeight - 1].ext24 * (Math.ceil(wallLength / 4))))
    await setTotalExt48(Math.ceil(heights[selectedHeight - 1].ext48 * (Math.ceil(wallLength / 4))))

    const bCrush = totalBlocks * blockCrush
    const e24Crush = totalExt24 * ext24Crush
    const e48Crush = totalExt48 * ext48Crush

    await setTotalCrush(round(((bCrush + e24Crush + e48Crush) / 27) * 1.05, 1))
    await setTotalBase(round(((baseWidth * (wallLength * 0.5)) / 27) * 1.05, 1))

  }

  function loadSavedWall(index) {

    if (index == -1) {
      return
    }

    setEditItemId(savedWalls[index].itemId)
    setSelectedCase(savedWalls[index].item.case)
    setSelectedHeight(savedWalls[index].item.height)
    setWallLength(savedWalls[index].item.length)
    setWallDescription(savedWalls[index].item.description)
    setEditWall(true)

  }

  function reset() {

    setEditWall(false)
    setEditItemId('')
    setSelectedCase('o')
    setSelectedHeight('0')
    setWallLength(12)
    setWallDescription('New wall')
    setWallHeight('')
    setSoilType('')
    setTotalCrush(0)
    setTotalExt24(0)
    setTotalBlocks(0)
    setTotalExt48(0)
    setTotalBase(0)

  }

  function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-2 p-3">
        <div className="relative rounded-lg shadow-lg border border-gray-300 dark:border-mag-grey-700 bg-white dark:bg-mag-grey-600 px-6 py-5 flex space-x-3">
          <div className="flex-1 min-w-0">
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Wall Details
              </p>
              <form className="space-y-4 md:space-y-2 lg:space-y-2 divide-gray-200 dark:divide-gray-700">
                <div className="sm:grid sm:grid-cols-2 sm:gap-4 sm:items-start sm:pt-5">
                  <label htmlFor="case" className="block text-sm font-medium text-gray-700 dark:text-gray-100 sm:mt-px sm:pt-2">
                    Soil Type / Load
                  </label>
                  <div className="mt-1 sm:mt-0 md:col-span-1 sm:col-span-2">
                    <select 
                      id="case" 
                      name="case" 
                      autoComplete="case" 
                      value={selectedCase}
                      onChange={(e) => handleCaseSelect(e.target.value)}
                      className="max-w-lg block bg-white focus:ring-mag-blue focus:border-mag-blue w-full shadow-md sm:max-w-xs sm:text-sm border-gray-300 dark:border-gray-500 rounded-md"
                    >
                      <option value="-1">- Select Soil Type / Load -</option>
                      {wallData.cases.map((option, index) => (
                        <option key={index} value={option.id}>{option.description}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-2 sm:gap-4 sm:items-start sm:pt-5">
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-100 sm:mt-px sm:pt-2">
                    Wall Height
                  </label>
                  <div className="mt-1 sm:mt-0 md:col-span-1 sm:col-span-2">
                    <select 
                      id="height" 
                      name="height" 
                      autoComplete="height" 
                      value={selectedHeight}
                      className="max-w-lg block bg-white focus:ring-mag-blue focus:border-mag-blue w-full shadow-md sm:max-w-xs sm:text-sm border-gray-300 dark:border-gray-500 rounded-md"
                      onChange={(e) => handleHeightSelect(e.target.value)}
                    >
                      <option value="-1">- Select Height -</option>
                      {heights.map((option, index) => (
                        <option key={index} value={option.id}>{option.description}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-2 sm:gap-4 sm:items-start sm:pt-5">
                  <label htmlFor="wall-len" className="block text-sm font-medium text-gray-700 dark:text-gray-100 sm:mt-px sm:pt-2">
                    Wall Length
                  </label>
                  <div className="mt-1 sm:mt-0 md:col-span-1 sm:col-span-2">
                    <input 
                      id="wall-len" 
                      name="wall-len" 
                      type="number"
                      value={wallLength}
                      min="4"
                      step="4"
                      className="max-w-lg block bg-white focus:ring-mag-blue focus:border-mag-blue w-full shadow-md sm:max-w-xs sm:text-sm border-gray-300 dark:border-gray-500 rounded-md"
                      onChange={(e) => setWallLength(e.target.value)}
                    >
                    </input>
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-2 sm:gap-4 sm:items-start sm:pt-5">
                  <label htmlFor="wall-descr" className="block text-sm font-medium text-gray-700 dark:text-gray-100 sm:mt-px sm:pt-2">
                    Wall Description
                  </label>
                  <div className="mt-1 sm:mt-0 md:col-span-1 sm:col-span-2">
                    <input 
                      id="wall-descr" 
                      name="wall-descr" 
                      type="text"
                      value={wallDescription}
                      placeholder="Wall description"
                      className="max-w-lg block bg-white focus:ring-mag-blue focus:border-mag-blue w-full shadow-md sm:max-w-xs sm:text-sm border-gray-300 dark:border-gray-500 rounded-md"
                      onChange={(e) => setWallDescription(e.target.value)}
                    >
                    </input>
                  </div>
                </div>
              </form>  
                <div className="items-end inline-flex mt-6 space-y-2 space-x-3 sm:justify-end sm:space-x sm:space-y-2 sm:space-x-3 md:space-x-3">

                  <button type="button" className="truncate inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-md text-white bg-mag-blue hover:bg-mag-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-mag-blue" onClick={() => reset()}>
                    New
                  </button>
                  {editWall == false ? (
                      <button type="button" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-md text-white bg-mag-blue hover:bg-mag-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-mag-blue" onClick={() => saveWall()}>
                        Save
                      </button>
                    ) : (
                      <button type="button" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-md text-white bg-mag-blue hover:bg-mag-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-mag-blue" onClick={() => updateWall()}>
                        Update
                      </button>
                    )
                  
                  }
                  
                  <button type="button" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-md text-white bg-mag-blue hover:bg-mag-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-mag-blue" onClick={() => openModal('signUp')}>
                    Print
                  </button>
                  {editWall == true &&
                    <button type="button" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-md text-white bg-mag-blue hover:bg-mag-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-mag-blue" onClick={() => deleteWall()}>
                      Delete
                    </button>
                  }
                  
                </div>
              
          </div>
        </div>

        <div className="relative rounded-lg shadow-lg border border-gray-300 dark:border-mag-grey-700 bg-white dark:bg-mag-grey-600 px-6 py-5 flex space-x-3">
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
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr className="divide-x divide-gray-200">
                            <td className="w-1/2 px-4 py-2 whitespace-wrap text-sm font-medium text-gray-900">
                              Wall Height
                            </td>
                            <td className="w-1/2 px-4 py-2 whitespace-wrap text-sm text-gray-600">
                              { wallHeight }
                            </td>
                          </tr>                          
                          <tr className="divide-x divide-gray-200">
                            <td className="px-4 py-2 whitespace-wrap text-sm font-medium text-gray-900">
                              Soil Type / Load
                            </td>
                            <td className="px-4 py-2 whitespace-wrap text-sm text-gray-600">
                              { soilType }
                            </td>
                          </tr>
                          <tr className="divide-x divide-gray-200">
                            <td className="px-4 py-2 whitespace-wrap text-sm font-medium text-gray-900">
                              Wall length
                            </td>
                            <td className="px-4 py-2 whitespace-wrap text-sm text-gray-600">
                              { wallLength } lin. feet
                            </td>
                          </tr>
                          <tr className="divide-x divide-gray-200">
                            <td className="px-4 py-2 whitespace-wrap text-sm font-medium text-gray-900">
                              Total Blocks
                            </td>
                            <td className="px-4 py-2 whitespace-wrap text-sm text-gray-600">
                              { totalBlocks } pieces
                            </td>
                          </tr>
                          <tr className="divide-x divide-gray-200">
                            <td className="px-4 py-2 whitespace-wrap text-sm font-medium text-gray-900">
                              Total 24" Extenders
                            </td>
                            <td className="px-4 py-2 whitespace-wrap text-sm text-gray-600">
                              { totalExt24 } pieces
                            </td>
                          </tr>
                          <tr className="divide-x divide-gray-200">
                            <td className="px-4 py-2 whitespace-wrap text-sm font-medium text-gray-900">
                              Total 48" Extenders
                            </td>
                            <td className="px-4 py-2 whitespace-wrap text-sm text-gray-600">
                              { totalExt48 } pieces
                            </td>
                          </tr>
                          <tr className="divide-x divide-gray-200">
                            <td className="px-4 py-2 whitespace-wrap text-sm font-medium text-gray-900">
                              Total Base Gravel
                            </td>
                            <td className="px-4 py-2 whitespace-wrap text-sm text-gray-600">
                              { totalBase } cu. yards
                            </td>
                          </tr>
                          <tr className="divide-x divide-gray-200">
                            <td className="px-4 py-2 whitespace-wrap text-sm font-medium text-gray-900">
                              Total Clear Crush
                            </td>
                            <td className="px-4 py-2 whitespace-wrap text-sm text-gray-600">
                              { totalCrush } cu. yards
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-2 sm:gap-4 sm:items-start sm:pt-5">
                  <label htmlFor="saved" className="block text-sm font-medium text-gray-700 dark:text-gray-100 sm:mt-px sm:pt-2">
                    Saved Walls
                  </label>
                  <div className="mt-1 sm:mt-0 md:col-span-1 sm:col-span-2">
                    <select 
                      id="saved" 
                      name="saved" 
                      autoComplete="saved" 
                      className="max-w-lg block bg-white focus:ring-mag-blue focus:border-mag-blue w-full shadow-md sm:max-w-xs sm:text-sm border-gray-300 dark:border-gray-500 rounded-md"
                      onChange={(e) => loadSavedWall(e.target.value)}

                    >
                      <option value="-1">- Select saved wall to open -</option>
                      {savedWalls.map((option, index) => (
                        <option key={index} value={index}>{option.item.description}</option>
                      ))}
                    </select>
                  </div>
                </div>

          </div>
        </div>

        <div className="relative rounded-lg shadow-lg border border-gray-300 dark:border-mag-grey-700 bg-white dark:bg-mag-grey-600 px-6 py-5 flex space-x-3 hover:border-gray-400">
          <div className="flex-1 min-w-0">
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Cross-section
              </p>
              {/* <Image src="/test.png" alt="" width="451" height="541"/> */}
          </div>
        </div>

        <div className="relative rounded-lg shadow-lg border border-gray-300 dark:border-mag-grey-700 bg-white dark:bg-mag-grey-600 px-6 py-5 flex space-x-3">
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
{/*         <div>
          <button className="truncate inline-flex items-center justify-center px-4 py-2 sm:px-2 lg:px-4 md:px-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-mag-blue hover:bg-mag-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-mag-blue" onClick={shareDatabase}>
            Share Database
          </button>
          <div className="mt-3 text-gray-700 dark:text-gray-100">
            {share}
          </div>
        </div> */}


      </div>
      
  )
}

export default GravityCalc
