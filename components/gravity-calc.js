import { useState, useEffect } from 'react'
import userbase from 'userbase-js'
import Image from 'next/image'
import {wallData} from '../public/walldata'
import uuid from 'react-uuid'
import toast from 'react-hot-toast';
import jsPDF from 'jspdf'
import 'jspdf-autotable'

function GravityCalc({ user }) {
  const [fullYear, setYear] = useState(new Date().getFullYear().toString())
  const [version] = useState('2021.02.16.a')
  const [showMenu, setShowMenu] = useState(false)

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
  const [totalBaseBlocks, setTotalBaseBlocks] = useState(0)
  const [totalBlocks, setTotalBlocks] = useState(0)
  const [totalExt24, setTotalExt24] = useState(0)
  const [totalExt48, setTotalExt48] = useState(0)
  const [blockCrush] = useState(6.35)
  const [ext24Crush] = useState(16)
  const [ext48Crush] = useState(32)

  /////////////////////////////////////////////////////////////

  useEffect(() => {

    async function openDatabase() {
      const toastId = toast.loading('Loading saved walls...');
      try {
        console.log('opening db...')
        console.log(user.profile.name)
        
        await userbase.openDatabase({
          databaseName: user.profile.dbName,
          changeHandler: function (items) {
            setSavedWalls(items)
          },
          
        })
        toast.success('Saved walls loaded.', {duration: 2000, id: toastId})
      } catch (e) {
        console.error(e.message)
        toast.remove(toastId)
        //toast.error('Failed to open database. - ' + e.message, {duration: 5000})
      }
      
    }

    openDatabase()

  }, [user])

  /////////////////////////////////////////////////////////////

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
  
  /////////////////////////////////////////////////////////////

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

  /////////////////////////////////////////////////////////////

  async function saveWall() {

    setShowMenu(false)
    const toastId = toast.loading('Saving...');
    const id = uuid()

    try {
      const p = await userbase.insertItem({
        databaseName: user.user.profile.dbName,
        item: { description: wallDescription, case: selectedCase, height: selectedHeight, length: wallLength },
        itemId: id
      }).then((item) => {
        setEditWall(true)
        setEditItemId(id)
        toast.success('Wall saved to the cloud.', {duration: 4000, id: toastId})
      })
    } catch (e) {
      console.error(e.message)
      toast.remove(toastId)
      toast.error('Failed to save wall. - ' + e.message, {duration: 5000})
    }

  }

  /////////////////////////////////////////////////////////////

  async function updateWall() {
    
    setShowMenu(false)
    const toastId = toast.loading('Updating...');
    try {
      await userbase.updateItem({
        databaseName: user.user.profile.dbName,
        item: { description: wallDescription, case: selectedCase, height: selectedHeight, length: wallLength },
        itemId: editItemId,
      })
      toast.success('Changes have been saved.', {duration: 4000, id: toastId})
/*       toast.success(
        (t) => (
          <span>
            Custom and <b>bold! </b>
            <button onClick={() => toast.dismiss(t.id)}> Dismiss</button>
          </span>
        ),
      ); */
    } catch (e) {
      console.error(e.message)
      toast.dismiss(toastId)
      toast.error('Failed to save changes. - ' + e.message, {duration: 5000})

    }

  }

  /////////////////////////////////////////////////////////////

  async function deleteWall() {

    setShowMenu(false)
    try {
      await userbase.deleteItem({
        databaseName: user.user.profile.dbName,
        itemId: editItemId,
      })
      reset()
      toast.success('Wall deleted from cloud.', {duration: 5000})
    } catch (e) {
      console.error(e.message)
      toast.error('Failed to delete wall. - ' + e.message, {duration: 5000})
    }

  }

  /////////////////////////////////////////////////////////////

  async function handleCaseSelect(e) {

    await setSelectedCase(e)
  
  }

  /////////////////////////////////////////////////////////////

  async function handleHeightSelect(e) {

    await setSelectedHeight(e)

  }

  /////////////////////////////////////////////////////////////

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
    await setTotalBaseBlocks(Math.ceil(wallLength / 4))
    await setTotalBlocks((Math.ceil(heights[selectedHeight - 1].blocks * (Math.ceil(wallLength / 4)))) - totalBaseBlocks)
    await setTotalExt24(Math.ceil(heights[selectedHeight - 1].ext24 * (Math.ceil(wallLength / 4))))
    await setTotalExt48(Math.ceil(heights[selectedHeight - 1].ext48 * (Math.ceil(wallLength / 4))))

    const bCrush = totalBlocks * blockCrush
    const e24Crush = totalExt24 * ext24Crush
    const e48Crush = totalExt48 * ext48Crush

    await setTotalCrush(round(((bCrush + e24Crush + e48Crush) / 27) * 1.05, 1))
    await setTotalBase(round(((baseWidth * (wallLength * 0.5)) / 27) * 1.05, 1))

  }

  /////////////////////////////////////////////////////////////

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

  /////////////////////////////////////////////////////////////

  function reset() {

    setShowMenu(false)

    setEditWall(false)
    setEditItemId('')
    setSelectedCase(-1)
    setSelectedHeight(-1)
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

  /////////////////////////////////////////////////////////////

  function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  /////////////////////////////////////////////////////////////

  function printQuote(o) {

    setShowMenu(false)

    let printterms = '© ' + fullYear + ' CornerStone Wall Solutions | ' + version
  
    //printimage = canvas.toDataURL("image/png")
    let title = 'magnumstone- ' + wallHeight
    let doc = new jsPDF('p', 'mm', 'letter');
    doc.setProperties({
        title: title,
        subject: title,
        author: 'MagnumStone',
        keywords: 'magnumstone calculator',
        creator: 'MagnumStone'
    });
    if (o == 'print') {
      doc.autoPrint({variant: 'non-conform'});
    }
    //doc.addImage(logo, 'png', 13.5, 19)
    doc.addImage("magnumstone-logo.png", 'png', 13.5, 19, 62, 12)
    doc.setFontSize(18) 
    doc.text('', 50, 21)
    doc.text('Wall Calculation', 156, 25)
    doc.setFontSize(10) 
    doc.text('', 50, 27)
    doc.setDrawColor('#009ade')
    doc.line(14, 32, 202, 32)
    doc.setFontSize(10) 
    doc.text(wallDescription, 14, 37)
    doc.autoTable({startY: 39, html: "#order-details", useCss: true, theme: 'grid', includeHiddenHtml: true});
    let finalY = doc.previousAutoTable.finalY;
    
    doc.addImage('crosssection.png', 'png', 13.5, finalY, 50, 45)

    doc.setDrawColor('#009ade')
    doc.line(14, finalY + 128, 202, finalY + 128)
    doc.setFontSize(7)
    doc.text(printterms, 14, finalY + 131, {align: 'left'})
    
    let fname = 'magnumstone-calculation- ' + wallHeight + '.pdf'

    if (o == 'print') {
      doc.output('dataurlnewwindow', {filename: fname}); 
    }
    else if (o == 'save') {
      doc.save(fname)
    } 
    
  }

  /////////////////////////////////////////////////////////////

  function handleMenu() {
    setShowMenu(!showMenu)
  }

  /////////////////////////////////////////////////////////////

  return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-2 p-3">
        <div className="relative rounded-lg shadow-lg border border-gray-300 dark:border-mag-grey-700 bg-white dark:bg-mag-grey-600 px-6 py-5 flex space-x-3">
          <div className="flex-1 min-w-0">
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2 border border-l-0 border-r-0 border-t-0 border-gray-200 dark:border-mag-grey-200 pb-2">
                Wall Details
              </p>
              <form className="space-y-4 md:space-y-2 lg:space-y-2 divide-gray-200 dark:divide-gray-700">
                <div className="sm:grid sm:grid-cols-2 sm:gap-4 sm:items-start sm:pt-5">
                  <label htmlFor="case" className="block text-md font-medium text-gray-700 dark:text-gray-100 sm:mt-px sm:pt-2">
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
                  <label htmlFor="height" className="block text-md font-medium text-gray-700 dark:text-gray-100 sm:mt-px sm:pt-2">
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
                  <label htmlFor="wall-len" className="block text-mdfont-medium text-gray-700 dark:text-gray-100 sm:mt-px sm:pt-2">
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
                  <label htmlFor="wall-descr" className="block text-md font-medium text-gray-700 dark:text-gray-100 sm:mt-px sm:pt-2">
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

{/*                   <button type="button" className="truncate inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-md text-white bg-mag-blue hover:bg-mag-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-mag-blue" onClick={() => reset()}>
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
                  
                  <button type="button" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-md text-white bg-mag-blue hover:bg-mag-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-mag-blue" onClick={() => printQuote('print')}>
                    Print
                  </button>
                  <button type="button" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-md text-white bg-mag-blue hover:bg-mag-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-mag-blue" onClick={() => printQuote('save')}>
                    PDF
                  </button>
                  {editWall == true &&
                    <button type="button" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-md text-white bg-mag-blue hover:bg-mag-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-mag-blue" onClick={() => deleteWall()}>
                      Delete
                    </button>
                  } */}

                  <div className="relative inline-block text-left">
                    <div>
                      <button type="button" className="inline-flex justify-center w-full rounded-md border shadow-sm px-4 py-2 border-transparent text-sm font-medium text-white bg-mag-blue hover:bg-mag-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-mag-bluee" id="options-menu" aria-haspopup="true" aria-expanded="true" onClick={() => handleMenu()}>
                        Options

                        <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>


                    {showMenu &&
                    <div className="origin-top-left z-40 absolute left-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      <div className="py-1">
                        <a href="#" className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" onClick={() => reset()}>
                          
                          <svg className="mr-3 h-5 w-5 text-gray-400 group-hover:text-mag-blue" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                          </svg>
                          New
                        </a>

                        {editWall == false ? (
                          <a href="#" className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" onClick={() => saveWall()}>
                            <svg className="mr-3 h-5 w-5 text-gray-400 group-hover:text-mag-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Save
                          </a>
                        ) : (
                          <a href="#" className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" onClick={() => updateWall()}>
                            <svg className="mr-3 h-5 w-5 text-gray-400 group-hover:text-mag-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Update
                          </a>
                        )
                        }
                        <a href="#" className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" onClick={() => printQuote('print')}>
                          <svg className="mr-3 h-5 w-5 text-gray-400 group-hover:text-mag-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                          </svg>
                          Print
                        </a>
                        <a href="#" className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" onClick={() => printQuote('save')}>
                          <svg className="mr-3 h-5 w-5 text-gray-400 group-hover:text-mag-blue"  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          PDF
                        </a>
                        {editWall == true &&
                          <div className="py-1">
                            <a href="#" className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" onClick={() => deleteWall()}>
                              
                              <svg className="mr-3 h-5 w-5 text-gray-400 group-hover:text-mag-blue" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              Delete
                            </a>
                          </div>
                        }
                      </div>

                    </div>
}
                  </div>

                </div>


                <div className="sm:grid sm:grid-cols-2 sm:gap-4 sm:items-start sm:pt-5 border border-gray-200 dark:border-mag-grey-200 border-b-0 border-l-0 border-r-0 mt-5">
                  <label htmlFor="saved" className="block text-smd font-medium text-gray-700 dark:text-gray-100 sm:mt-px sm:pt-2">
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

        {/* //////////// Results Section ////////////// */}

        <div className="relative rounded-lg shadow-lg border border-gray-300 dark:border-mag-grey-700 bg-white dark:bg-mag-grey-600 px-6 py-5 flex space-x-3">
          <div className="flex-1 min-w-0">
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-4 border border-l-0 border-r-0 border-t-0 border-gray-200 dark:border-mag-grey-200 pb-2">
                Results
              </p>
              <div className="flex flex-col">
                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="py-3 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="overflow-hidden border border-gray-200 rounded-md">
                      <table className="min-w-full divide-y divide-gray-200" id="order-details">
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
                              Total Base Blocks
                            </td>
                            <td className="px-4 py-2 whitespace-wrap text-sm text-gray-600">
                              { totalBaseBlocks } pieces
                            </td>
                          </tr>
                          <tr className="divide-x divide-gray-200">
                            <td className="px-4 py-2 whitespace-wrap text-sm font-medium text-gray-900">
                              Total Standard Blocks
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
                          <tr style={{display: 'none'}}>
                            <td className="px-4 py-2 whitespace-wrap text-sm font-medium text-gray-900" colSpan="2">
                              <p className="font-bold text-mag-blue">Disclaimer:</p> 
                            </td>
                          </tr>
                          <tr style={{display: 'none'}}>
                            <td className="px-4 py-2 whitespace-wrap text-sm font-medium text-gray-900" colSpan="2">
                              <p className="pt-0">
                                These preliminary details are intended soley to act as an aid when designing a wall. These drawings should not be used for final design or construction. 
                                Each site-specific wall should be certified and signed by a registered geotechnical engineer in the State or Province where it is being built. the accuarcy 
                                and use of the details in this document are the sole responsibility of the user. Global stability analysis has not been performed.
                              </p>
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

        <div className="relative rounded-lg shadow-lg border border-gray-300 dark:border-mag-grey-700 bg-white dark:bg-mag-grey-600 px-6 py-5 flex space-x-3 hover:border-gray-400"  onClick={() => setShowMenu(false)}>
          <div className="flex-1 min-w-0">
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-3 border border-l-0 border-r-0 border-t-0 border-gray-200 dark:border-mag-grey-200 pb-2">
                Cross-section
              </p>
              <div className="p-3 rounded-md bg-white">
                <Image src="/crosssection.png" alt="" width="287" height="224"/>
              </div>
          </div>
        </div>

        <div className="relative rounded-lg shadow-lg border border-gray-300 dark:border-mag-grey-700 bg-white dark:bg-mag-grey-600 px-6 py-5 flex space-x-3">
          <div className="flex-1 min-w-0">
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-3 border border-l-0 border-r-0 border-t-0 border-gray-200 dark:border-mag-grey-200 pb-2">
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
{/* 
      {isClient && (
        <div>
          <PDFDownloadLink document={<MyDoc />} fileName="somename.pdf">
            {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download now!')}
          </PDFDownloadLink>
        </div>
      )} */}

    </div>


      
  )
}

export default GravityCalc
