import { useState, useEffect } from "react";
import { Menu, Transition, Listbox } from "@headlessui/react";
import userbase from "userbase-js";
import Image from "next/image";
import { wallData } from "../public/walldata";
import uuid from "react-uuid";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import "jspdf-autotable";

function GravityCalc({ user }) {
  const [fullYear, setYear] = useState(new Date().getFullYear().toString());
  const [version] = useState("2021.03.11.a");
  const [showMenu, setShowMenu] = useState(false);
  const [savedSigs, setSavedSigs] = useState([]);
  const [editSig, setEditSig] = useState(false);
  const [editItemId, setEditItemId] = useState("");
  const [share, setShareToken] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [truckNumber, setTruckNumber] = useState("");
  const [selectedSig, setSelectedSig] = useState("");

  /////////////////////////////////////////////////////////////

  useEffect(() => {
    async function openDatabase() {
      //const toastId = toast.loading('Loading saved walls...');
      try {
        console.log("opening db...");
        console.log(user.profile.dbName);

        await userbase.openDatabase({
          databaseName: user.profile.dbName,
          changeHandler: function (items) {
            setSavedSigs(items);
          },
        });
        //toast.success('Saved walls loaded.', {duration: 2000, id: toastId})
      } catch (e) {
        console.error(e.message);
        //toast.remove(toastId)
        toast.error("Failed to open database. - " + e.message, {
          duration: 5000,
        });
      }
    }

    openDatabase();
  }, [user]);

  /////////////////////////////////////////////////////////////

  useEffect(() => {
    //calcWall();
  }, []);

  /////////////////////////////////////////////////////////////

  async function shareDatabase() {
    try {
      await userbase
        .shareDatabase({
          databaseName: user.profile.dbName,
        })
        .then(({ shareToken }) => {
          setShareToken(shareToken);
        });
    } catch (e) {
      console.error(e.message);
    }
  }

  /////////////////////////////////////////////////////////////

  async function saveSig() {
    //setShowMenu(false);
    //const toastId = toast.loading('Saving...');
    const id = uuid();

    try {
      const p = await userbase
        .insertItem({
          databaseName: user.profile.dbName,
          item: {
            orderNumber: orderNumber,
            customerName: customerName,
            truckNumber: truckNumber,
          },
          itemId: id,
        })
        .then((item) => {
          setEditSig(true);
          setEditItemId(id);
          toast.success("Signature saved to the cloud.", { duration: 4000 });
        });
    } catch (e) {
      //console.error(e.message)
      //toast.remove(toastId)
      toast.error("Failed to save signature. - " + e.message, {
        duration: 5000,
      });
    }
  }

  /////////////////////////////////////////////////////////////

  async function updateSig() {
    //setShowMenu(false);
    //const toastId = toast.loading('Updating...');
    try {
      await userbase.updateItem({
        databaseName: user.profile.dbName,
        item: {
          orderNumber: orderNumber,
          customerName: customerName,
          truckNumber: truckNumber,
        },
        itemId: editItemId,
      });
      toast.success("Changes have been saved.", { duration: 4000 });
    } catch (e) {
      //console.error(e.message)
      //toast.dismiss(toastId)
      toast.error("Failed to save changes. - " + e.message, { duration: 5000 });
    }
  }

  /////////////////////////////////////////////////////////////

  async function deleteWall() {
    setShowMenu(false);
    try {
      await userbase.deleteItem({
        databaseName: user.profile.dbName,
        itemId: editItemId,
      });
      reset();
      toast.success("Wall deleted from cloud.", { duration: 5000 });
    } catch (e) {
      console.error(e.message);
      toast.error("Failed to delete wall. - " + e.message, { duration: 5000 });
    }
  }

  /////////////////////////////////////////////////////////////

  async function handleCaseSelect(e) {
    await setSelectedCase(e);
  }

  /////////////////////////////////////////////////////////////

  async function handleHeightSelect(e) {
    await setSelectedHeight(e);
  }

  /////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////

  function loadSavedSig(index) {
    if (index == -1) {
      return;
    }

    setSelectedSig(index);
    setEditItemId(savedSigs[index].itemId);
    setOrderNumber(savedSigs[index].item.orderNumber);
    setCustomerName(savedSigs[index].item.customerName);
    setTruckNumber(savedSigs[index].item.truckNumber);
    setEditSig(true);
  }

  /////////////////////////////////////////////////////////////

  function reset() {
    //setShowMenu(false);

    setEditSig(false);
    setEditItemId("");
    setOrderNumber("");
    setCustomerName("");
    setTruckNumber("");
  }

  /////////////////////////////////////////////////////////////

  function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  /////////////////////////////////////////////////////////////

  function printQuote(o) {
    setShowMenu(false);

    let printterms =
      "© " + fullYear + " CornerStone Wall Solutions | " + version;

    //printimage = canvas.toDataURL("image/png")
    let title = "magnumstone- " + wallHeight;
    let doc = new jsPDF("p", "mm", "letter");
    doc.setProperties({
      title: title,
      subject: title,
      author: "MagnumStone",
      keywords: "magnumstone calculator",
      creator: "MagnumStone",
    });
    if (o == "print") {
      doc.autoPrint({ variant: "non-conform" });
    }
    //doc.addImage(logo, 'png', 13.5, 19)
    doc.addImage("magnumstone-logo.png", "png", 13.5, 19, 62, 12);
    doc.setFontSize(18);
    doc.text("", 50, 21);
    doc.text("Wall Calculation", 156, 25);
    doc.setFontSize(10);
    doc.text("", 50, 27);
    doc.setDrawColor("#009ade");
    doc.line(14, 32, 202, 32);
    doc.setFontSize(10);
    doc.text(wallDescription, 14, 37);
    doc.autoTable({
      startY: 39,
      html: "#order-details",
      useCss: true,
      theme: "grid",
      includeHiddenHtml: true,
    });
    let finalY = doc.previousAutoTable.finalY;

    doc.addImage("crosssection.png", "png", 13.5, finalY, 50, 45);

    doc.setDrawColor("#009ade");
    doc.line(14, finalY + 128, 202, finalY + 128);
    doc.setFontSize(7);
    doc.text(printterms, 14, finalY + 131, { align: "left" });

    let fname = "magnumstone-calculation- " + wallHeight + ".pdf";

    if (o == "print") {
      doc.output("dataurlnewwindow", { filename: fname });
    } else if (o == "save") {
      doc.save(fname);
    }
  }

  /////////////////////////////////////////////////////////////

  function handleMenu() {
    setShowMenu(!showMenu);
  }

  /////////////////////////////////////////////////////////////

  return (
    <div className="flex flex-wrap lg:flex-nowrap gap-4 m-0">
      {/* <div className="grid grid-cols-2 gap-0 m-0 md:gap-4 lg-gap-4 xl:gap-4 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 p-0 sm:p-0"></div> */}
      <div className="relative w-full lg:w-1/4 rounded-lg shadow-lg border border-gray-300 dark:border-mag-grey-700 bg-white dark:bg-mag-grey-600 px-3 lg:px-6 py-2 lg:py-5">
        <div className="w-full">
          <p className="text-lg font-medium text-gray-900 dark:text-white mb-2 border border-l-0 border-r-0 border-t-0 border-gray-200 dark:border-mag-grey-200 pb-2">
            New Signature
          </p>
          <form className="space-y-1">
            <div>
              <label
                htmlFor="order-number"
                className="block text-sm font-medium text-gray-700 dark:text-gray-100"
              >
                Order / Invoice #
              </label>
              <div className="mt-1 mb-2">
                <input
                  id="order-number"
                  name="order-number"
                  type="text"
                  value={orderNumber}
                  placeholder="Order / Invoice #"
                  className="block bg-white dark:bg-mag-grey text-gay-700 dark:text-white focus:ring-mag-blue focus:border-mag-blue w-full border-gray-300 dark:border-gray-500 rounded-md"
                  onChange={(e) => setOrderNumber(e.target.value)}
                ></input>
              </div>
            </div>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-100"
              >
                Name
              </label>
              <div className="mt-1 mb-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={customerName}
                  placeholder="Name"
                  className="block bg-white dark:bg-mag-grey text-gay-700 dark:text-white focus:ring-mag-blue focus:border-mag-blue w-full border-gray-300 dark:border-gray-500 rounded-md"
                  onChange={(e) => setCustomerName(e.target.value)}
                ></input>
              </div>
            </div>
            <div>
              <label
                htmlFor="truck"
                className="block text-sm font-medium text-gray-700 dark:text-gray-100"
              >
                Truck / Pick Up
              </label>
              <div className="mt-1 mb-2">
                <input
                  id="truck"
                  name="truck"
                  type="text"
                  value={truckNumber}
                  placeholder="Truck Numbver / Pick Up"
                  className="block bg-white dark:bg-mag-grey text-gay-700 dark:text-white focus:ring-mag-blue focus:border-mag-blue w-full border-gray-300 dark:border-gray-500 rounded-md"
                  onChange={(e) => setTruckNumber(e.target.value)}
                ></input>
              </div>
            </div>
          </form>

          <div className="mt-6">
            {/* <div className="items-end inline-flex mt-6 space-y-0 space-x-3 sm:justify-end sm:space-x sm:space-y-0 sm:space-x-3 md:space-x-3"> */}

            <div className="relative inline-block text-left">
              <Menu as="div">
                {({ open }) => (
                  <>
                    <Menu.Button className="inline-flex justify-center w-full rounded-md border border-transparent shadow-md px-4 py-2 bg-mag-blue text-base font-medium text-white hover:bg-mag-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mag-blue-500">
                      Options
                      <svg
                        className="-mr-1 ml-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Menu.Button>
                    <Transition
                      show={open}
                      /* enter="transition ease-out duration-500"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="transition ease-in duration-300"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0" */
                    >
                      <Menu.Items as="ul">
                        <div
                          className="origin-top-left z-10 absolute left-0 mt-1 w-44 rounded-md shadow-lg bg-gray-100 ring-1 ring-mag-blue ring-opacity-5"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="options-menu"
                        >
                          <div className="py-1">
                            <Menu.Item as="li">
                              <a
                                href="#"
                                className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 hover:text-mag-blue font-normal hover:font-bold"
                                role="menuitem"
                                onClick={() => reset()}
                              >
                                <svg
                                  className="mr-3 h-5 w-5 text-gray-500 group-hover:text-mag-blue"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                                New Signature
                              </a>
                            </Menu.Item>
                            <Menu.Item as="li">
                              {editSig == false ? (
                                <a
                                  href="#"
                                  className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 hover:text-mag-blue font-normal hover:font-bold"
                                  role="menuitem"
                                  onClick={() => saveSig()}
                                >
                                  <svg
                                    className="mr-3 h-5 w-5 text-gray-500 group-hover:text-mag-blue"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                                    />
                                  </svg>
                                  Save To Cloud
                                </a>
                              ) : (
                                <a
                                  href="#"
                                  className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 hover:text-mag-blue font-normal hover:font-bold"
                                  role="menuitem"
                                  onClick={() => updateSig()}
                                >
                                  <svg
                                    className="mr-3 h-5 w-5 text-gray-500 group-hover:text-mag-blue"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                    />
                                  </svg>
                                  Update
                                </a>
                              )}
                            </Menu.Item>
                            <Menu.Item as="li">
                              <a
                                href="#"
                                className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 hover:text-mag-blue font-normal hover:font-bold"
                                role="menuitem"
                                onClick={() => printQuote("print")}
                              >
                                <svg
                                  className="mr-3 h-5 w-5 text-gray-500 group-hover:text-mag-blue"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                                  />
                                </svg>
                                Print
                              </a>
                            </Menu.Item>
                            <Menu.Item as="li">
                              <a
                                href="#"
                                className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 hover:text-mag-blue font-normal hover:font-bold"
                                role="menuitem"
                                onClick={() => printQuote("save")}
                              >
                                <svg
                                  className="mr-3 h-5 w-5 text-gray-500 group-hover:text-mag-blue"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                                Download PDF
                              </a>
                            </Menu.Item>

                            <Menu.Item as="li">
                              <div className="py-1">
                                {editSig == true && (
                                  <a
                                    href="#"
                                    className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 hover:text-mag-blue font-normal hover:font-bold"
                                    role="menuitem"
                                    onClick={() => deleteWall()}
                                  >
                                    <svg
                                      className="mr-3 h-5 w-5 text-gray-500 group-hover:text-mag-blue"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      aria-hidden="true"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    Delete
                                  </a>
                                )}
                              </div>
                            </Menu.Item>
                          </div>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </>
                )}
              </Menu>
            </div>
          </div>
        </div>
      </div>

      {/* //////////// Results Section ////////////// */}

      <div className="relative rounded-lg w-full lg:w-3/4 shadow-lg border border-gray-300 dark:border-mag-grey-700 bg-white dark:bg-mag-grey-600 px-3 lg:px-6 py-2 lg:py-5 space-x-3">
        <div className="min-w-0">
          <p className="text-lg font-medium text-gray-900 dark:text-white mb-4 border border-l-0 border-r-0 border-t-0 border-gray-200 dark:border-mag-grey-200 pb-2">
            Saved Signatures
          </p>
          {/* <div className="flex flex-col"> */}
          {/*             <div className="overflow-x-auto mx-o sm:-mx-4 md:mx-0 lg:-mx-0">
              <div className="py-3 align-middle inline-block min-w-full px-0 sm:px-4 md:px-0 lg:px-0"> */}

          <div>
            {/* <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide">Pinned Projects</h2> */}
            <ul className="fadein mt-3 grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-3">
              {savedSigs.map((option, index) => (
                <li id={index} className="col-span-1 flex shadow-sm rounded-md">
                  <div className="flex-shrink-0 flex items-center justify-center w-16 bg-yellow-600 text-white text-lg font-bold rounded-l-md">
                    {option.item.truckNumber}
                  </div>
                  <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-300 dark:border-gray-500 bg-white dark:bg-mag-grey rounded-r-md truncate">
                    <div className="flex-1 px-3 py-1 text-md truncate text-gray-900 dark:text-white font-bold">
                        {option.item.orderNumber}
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {option.item.customerName}
                      </p>
                    </div>
                    <div className="flex-shrink-0 pr-2">
                      <button className="w-8 h-8 bg-white dark:bg-mag-grey inline-flex items-center justify-center text-gray-400 rounded-full bg-transparent hover:text-gray-500 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-gray-500" onClick={() => loadSavedSig(index)}>
                        <span className="sr-only">Open options</span>

                        <svg
                          className="w-5 h-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}

              {/*     <li className="col-span-1 flex shadow-sm rounded-md">
      <div className="flex-shrink-0 flex items-center justify-center w-16 bg-purple-600 text-white text-sm font-medium rounded-l-md">
        CD
      </div>
      <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
        <div className="flex-1 px-4 py-2 text-sm truncate">
          <a href="#" className="text-gray-900 font-medium hover:text-gray-600">Component Design</a>
          <p className="text-gray-500">12 Members</p>
        </div>
        <div className="flex-shrink-0 pr-2">
          <button className="w-8 h-8 bg-white inline-flex items-center justify-center text-gray-400 rounded-full bg-transparent hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <span className="sr-only">Open options</span>

            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
      </div>
    </li> */}

              {/*     <li className="col-span-1 flex shadow-sm rounded-md">
      <div className="flex-shrink-0 flex items-center justify-center w-16 bg-yellow-500 text-white text-sm font-medium rounded-l-md">
        T
      </div>
      <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
        <div className="flex-1 px-4 py-2 text-sm truncate">
          <a href="#" className="text-gray-900 font-medium hover:text-gray-600">Templates</a>
          <p className="text-gray-500">16 Members</p>
        </div>
        <div className="flex-shrink-0 pr-2">
          <button className="w-8 h-8 bg-white inline-flex items-center justify-center text-gray-400 rounded-full bg-transparent hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <span className="sr-only">Open options</span>
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
      </div>
    </li> */}

              {/*     <li className="col-span-1 flex shadow-sm rounded-md">
      <div className="flex-shrink-0 flex items-center justify-center w-16 bg-green-500 text-white text-sm font-medium rounded-l-md">
        RC
      </div>
      <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
        <div className="flex-1 px-4 py-2 text-sm truncate">
          <a href="#" className="text-gray-900 font-medium hover:text-gray-600">React Components</a>
          <p className="text-gray-500">8 Members</p>
        </div>
        <div className="flex-shrink-0 pr-2">
          <button className="w-8 h-8 bg-white inline-flex items-center justify-center text-gray-400 rounded-full bg-transparent hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <span className="sr-only">Open options</span>
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
      </div>
    </li> */}
            </ul>
          </div>

          {/* <div className="overflow-hidden border border-gray-200 rounded-md">
                  <table
                    className="min-w-full divide-y divide-gray-200"
                    id="order-details"
                  >
                    <thead className="bg-gray-100">
                      <tr>
                        <th
                          scope="col"
                          colSpan="2"
                          className="px-4 py-2 text-left text-md font-bold text-gray-900 tracking-wider"
                        >
                          Gravity Wall
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">

                      <tr className="divide-x divide-gray-200">
                        <td className="w-1/2 px-4 py-2 whitespace-wrap text-sm font-medium text-gray-900">
                          Soil Type / Load
                        </td>
                        <td className="w-1/2 px-4 py-2 whitespace-wrap text-sm text-gray-600">
                          {soilType}
                        </td>
                      </tr>
                      <tr className="divide-x divide-gray-200">
                        <td className="px-4 py-2 whitespace-wrap text-sm font-medium text-gray-900">
                          Wall Height
                        </td>
                        <td className="px-4 py-2 whitespace-wrap text-sm text-gray-600">
                          {wallHeight}
                        </td>
                      </tr>
                      <tr className="divide-x divide-gray-200">
                        <td className="px-4 py-2 whitespace-wrap text-sm font-medium text-gray-900">
                          Wall length
                        </td>
                        <td className="px-4 py-2 whitespace-wrap text-sm text-gray-600">
                          {wallLength} lin. feet
                        </td>
                      </tr>
                      <tr className="divide-x divide-gray-200">
                        <td className="px-4 py-2 whitespace-wrap text-sm font-medium text-gray-900">
                          Total Base Blocks
                        </td>
                        <td className="px-4 py-2 whitespace-wrap text-sm text-gray-600">
                          {totalBaseBlocks} pieces
                        </td>
                      </tr>
                      <tr className="divide-x divide-gray-200">
                        <td className="px-4 py-2 whitespace-wrap text-sm font-medium text-gray-900">
                          Total Standard Blocks
                        </td>
                        <td className="px-4 py-2 whitespace-wrap text-sm text-gray-600">
                          {totalBlocks} pieces
                        </td>
                      </tr>
                      <tr className="divide-x divide-gray-200">
                        <td className="px-4 py-2 whitespace-wrap text-sm font-medium text-gray-900">
                          Total 24" Extenders
                        </td>
                        <td className="px-4 py-2 whitespace-wrap text-sm text-gray-600">
                          {totalExt24} pieces
                        </td>
                      </tr>
                      <tr className="divide-x divide-gray-200">
                        <td className="px-4 py-2 whitespace-wrap text-sm font-medium text-gray-900">
                          Total 48" Extenders
                        </td>
                        <td className="px-4 py-2 whitespace-wrap text-sm text-gray-600">
                          {totalExt48} pieces
                        </td>
                      </tr>
                      <tr className="divide-x divide-gray-200">
                        <td className="px-4 py-2 whitespace-wrap text-sm font-medium text-gray-900">
                          Total Base Gravel
                        </td>
                        <td className="px-4 py-2 whitespace-wrap text-sm text-gray-600">
                          {totalBase} cu. yards
                        </td>
                      </tr>
                      <tr className="divide-x divide-gray-200">
                        <td className="px-4 py-2 whitespace-wrap text-sm font-medium text-gray-900">
                          Total Clear Crush
                        </td>
                        <td className="px-4 py-2 whitespace-wrap text-sm text-gray-600">
                          {totalCrush} cu. yards
                        </td>
                      </tr>
                      <tr style={{ display: "none" }}>
                        <td
                          className="px-4 py-2 whitespace-wrap text-sm font-medium text-gray-900"
                          colSpan="2"
                        >
                          <p className="font-bold text-mag-blue">Disclaimer:</p>
                        </td>
                      </tr>
                      <tr style={{ display: "none" }}>
                        <td
                          className="px-4 py-2 whitespace-wrap text-sm font-medium text-gray-900"
                          colSpan="2"
                        >
                          <p className="pt-0">
                            These preliminary details are intended soley to act
                            as an aid when designing a wall. These drawings
                            should not be used for final design or construction.
                            Each site-specific wall should be certified and
                            signed by a registered geotechnical engineer in the
                            State or Province where it is being built. the
                            accuarcy and use of the details in this document are
                            the sole responsibility of the user. Global
                            stability analysis has not been performed.
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div> */}
          {/*               </div>
            </div> */}
          {/* </div> */}
        </div>
      </div>

      {/*       <div className="relative rounded-lg shadow-lg border border-gray-300 dark:border-mag-grey-700 bg-white dark:bg-mag-grey-600 px-3 lg:px-6 py-2 lg:py-5 flex space-x-3">
        <div className="flex-1 min-w-0">
          <p className="text-lg font-medium text-gray-900 dark:text-white mb-3 border border-l-0 border-r-0 border-t-0 border-gray-200 dark:border-mag-grey-200 pb-2">
            Disclaimer
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-200">
            These preliminary details are intended soley to act as an aid when
            designing a wall. These drawings should not be used for final design
            or construction. Each site-specific wall should be certified and
            signed by a registered geotechnical engineer in the Sate or Province
            where it is being built. the accuarcy and use of the details in this
            document are the sole responsibility of the user. Global stability
            analysis has not been performed
          </p>
        </div>
      </div> */}

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
  );
}

export default GravityCalc;
