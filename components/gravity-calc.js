import { useState, useEffect, useRef } from "react";
import { Menu, Transition, Listbox } from "@headlessui/react";
//import userbase from "userbase-js";
import Image from "next/image";
import uuid from "react-uuid";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import "jspdf-autotable";
import SignaturePad from "signature_pad";
import { useCollection } from "react-firebase-hooks/firestore";
import { firestore, serverTimestamp } from "../lib/firebase";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import SigItems from "../components/sig-items";
import ImageUploader from "../components/ImageUploader";
import swal from "@sweetalert/with-react";
//import SignaturePad from "react-signature-canvas";


/////////////////////////////////////////////////////////////

export async function getStaticProps({ params }) {
  const [value, loading, error] = useCollection(firestore.collection("sigs"), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  return {
    props: { value },
  };
}

/////////////////////////////////////////////////////////////

function GravityCalc() {
  const { user, username } = useContext(UserContext);
  const [fullYear, setYear] = useState(new Date().getFullYear().toString());
  const [version] = useState("2021.03.15.a");
  const [editSig, setEditSig] = useState(false);
  const [editItemId, setEditItemId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [truckNumber, setTruckNumber] = useState("");
  const [selectedSig, setSelectedSig] = useState("");
  const [selectedFileId, setSelectedFileId] = useState("");
  //const [sigsOpen, setSigsOpen] = useState(false);
  //const [cache, setCache] = useState({});
  const [canvas, setCanvas] = useState();
  const [signaturePad, setSignaturePad] = useState();
  const [notes, setNotes] = useState("");
  const [company, setCompany] = useState("");
  const [sigDate, setSigDate] = useState("");
  const [sigLabel, setSigLabel] = useState("Signature");
  const [newSigLabel, setNewSigLabel] = useState("New Signature");
  const [imgW, setImgW] = useState(250);
  const [imgH, setImgH] = useState(150);
  //const [loadingSig, setLoadingSig] = useState(false);
  const [selectedFile, setSelectedFile] = useState(undefined);
  const [isPhoto, setIsPhoto] = useState(false);
  const [noSig, setNoSig] = useState(true);
  const [uploadUrl, setUploadUrl] = useState("");

  const [imageUrl, setImageUrl] = useState("");

  //const sigCanvas = useRef({});

  function clearSig() {
    if (signaturePad) {
      signaturePad.clear()
      //setImageUrl("")
    }
  };

  async function getSig() {
    if (signaturePad) {
      //return sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
      return signaturePad.toDataURL("image/png");
      //console.log({ data: [sigCanvas.current.toData()] })
      //return { data: [sigCanvas.current.toData()] };
    }
    else {
      return ""
    }
    
  }

  /////////////////////////////////////////////////////////////

  useEffect(() => {
    setCanvas(document.getElementById("signature-pad"));
    if (canvas) {
      setSignaturePad(
        new SignaturePad(canvas, {
          backgroundColor: 'rgb(255, 255, 255)' // necessary for saving image as JPEG; can be removed is only saving as PNG or SVG
        })
      );
    }
    //resizeCanvas();
    //console.log(user.photoURL)
    //getSig()
  }, [user]);

  /////////////////////////////////////////////////////////////

  useEffect(() => {
    let temp;
    function resizeCanvas() {
      if (signaturePad) {
        temp = signaturePad.toData();
        var ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d").scale(ratio, ratio);
        signaturePad.clear();
        signaturePad.fromData(temp);
      }
    }

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [signaturePad]);

  /////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////

  async function saveSig() {
    const id = uuid();

    let notSigned = true
    if (uploadUrl == "" && signaturePad.isEmpty()) {
      notSigned = true
    } else {
      notSigned = false
    }

    try {
      await firestore
        .collection("sigs")
        .doc(id)
        .set({
          orderNumber: orderNumber,
          customerName: customerName,
          truckNumber: truckNumber,
          sigDate: serverTimestamp(),
          company: company,
          noSig: notSigned,
          notes: notes,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          userId: user.uid,
          userName: username,
          userPhotoUrl: user.photoURL,
          photoUrl: uploadUrl,
          sigImageUrl: await getSig(),
          imgW: imgW,
          imgH: imgH,
        })
        .then(() => {
          setEditSig(true);
          setEditItemId(id);
          toast.success("Signature saved to the cloud.", { duration: 4000 });
        });
    } catch (e) {
      toast.error("Failed to save signature. - " + e, {
        duration: 10000,
      });
    }
    //}
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

  async function deleteSig(id) {
    swal({
      title: "Are you sure?",
      text: "Deleted signatures cannot bve recovered",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
      /*       content: (
        <div className="inline-flex w-full space-x-2">
          <div className="w-1/2">
            <button
              className="flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-mag-blue text-base font-medium text-white hover:bg-mag-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mag-blue-500 sm:text-sm"

              onClick={(e) => handleSignUp(e)}
            >
              Cancel
            </button>
          </div>
        <div className="w-1/2">
            <button
              className="flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
              onClick={(e) => handleCancel(e)}
            >
              Delete
            </button>
        </div>
        </div>
      ) */
    }).then(async (willDelete) => {
      if (willDelete) {
        var docRef = firestore.collection("sigs").doc(id);

        await docRef
          .delete()
          .then(() => {
            reset();
            toast.success("Signature deleted.", { duration: 3000 });
          })
          .catch((e) => {
            toast.error("Failed to delete signature. - " + e, {
              duration: 5000,
            });
          });
      }
    });
  }
  /////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////

  function loadSavedSig(id) {
    setUploadUrl('')
    var docRef = firestore.collection("sigs").doc(id);

    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          //console.log("Document data:", doc.data());
          setSelectedSig(id);
          setEditItemId(doc.id);
          setOrderNumber(doc.data().orderNumber);
          setCustomerName(doc.data().customerName);
          setTruckNumber(doc.data().truckNumber);
          setUploadUrl(doc.data().photoUrl || "");
          if (sigCanvas.current) clearSig()
          if (sigCanvas.current) sigCanvas.current.fromDataURL(doc.data().sigImageUrl || []);
          setImgW(doc.data().imgW || 250);
          setEditSig(true);
        } else {
          toast.error("Failed to load signature.", {
            duration: 5000,
          });
        }
      })
      .catch((e) => {
        toast.error("Failed to load signature. - " + e, {
          duration: 5000,
        });
      });
  }

  /////////////////////////////////////////////////////////////

  function reset() {
    signaturePad.clear();
    signaturePad.on();
    //clearSig()
    setImageUrl("")
    setEditSig(false);
    setEditItemId("");
    setOrderNumber("");
    setCustomerName("");
    setTruckNumber("");
    setNotes("");
    setCompany("");
    setSigDate("");
    setSelectedFileId("");
    setSigLabel("Signature");
    setNewSigLabel("New Signature");
    setImgW(250);
    setImgH(150);
    //setLoadingSig(false);
    setSelectedFileId(undefined);
    setUploadUrl("");
  }

  /////////////////////////////////////////////////////////////

/*   function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  } */

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

  /////////////////////////////////////////////////////////////////
  function clearImage() {
    setUploadUrl("");
  }

/*   function clearSig() {
    signaturePad.clear();
    signaturePad.on();
  } */

  /////////////////////////////////////////////////////////////

  // On mobile devices it might make more sense to listen to orientation change,
  // rather than window resize events.

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
                htmlFor="signature-pad"
                className="block text-sm font-medium text-gray-700 dark:text-gray-100"
              >
                Signature / Photo
              </label>
              <div className="mt-1 mb-0 border rounded-md border-gray-200 dark:border-mag-grey-200 bg-white dark:bg-mag-grey">
                {uploadUrl == "" && (
                  <div className="flex-1 flex items-top justify-between">
                    <div>
{/*                       <SignaturePad
                        ref={sigCanvas}
                        canvasProps={{ className: "w-full" }}
                      /> */}
                    
                    <canvas
                      id="signature-pad"
                      style={{
                        width: "100%",
                        height: "150px",
                      }}
                    ></canvas>
                    </div>
                    <div className="flex-shrink-0 pr-0">
                      <button
                        className="w-8 h-8 inline-flex items-center justify-center text-gray-400 rounded-full bg-transparent hover:text-mag-blue focus:outline-none"
                        onClick={() => clearSig()}
                      >
                        <span className="sr-only"></span>
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
                {uploadUrl !== "" && (
                  <>
                    <div className="flex-1 flex items-top justify-between">
                      <Image
                        className="border rounded-md border-gray-200 dark:border-mag-grey-200 bg-white dark:bg-mag-grey"
                        src={uploadUrl}
                        alt="photo"
                        width={imgW}
                        height={imgH}
                        layout="intrinsic"
                      />
                      <div className="flex-shrink-0 pr-0">
                        <button
                          className="w-8 h-8 inline-flex items-center justify-center text-gray-400 rounded-full bg-transparent hover:text-mag-blue focus:outline-none"
                          onClick={() => clearImage()}
                        >
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <ImageUploader passUploadUrl={setUploadUrl} setW={setImgW} />
            </div>

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
                          className="origin-top-left z-10 absolute left-0 mt-1 w-44 rounded-md shadow-lg bg-gray-100 dark:bg-mag-grey-400 ring-1 ring-mag-blue ring-opacity-5"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="options-menu"
                        >
                          <div className="py-1">
                            <Menu.Item as="li">
                              <a
                                href="#"
                                className="group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-300 hover:text-mag-blue dark:hover:text-mag-blue font-normal hover:font-bold"
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
                                  className="group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-300 hover:text-mag-blue dark:hover:text-mag-blue font-normal hover:font-bold"
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
                                  className="group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-300 hover:text-mag-blue dark:hover:text-mag-blue font-normal hover:font-bold"
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
                                className="group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-300 hover:text-mag-blue dark:hover:text-mag-blue font-normal hover:font-bold"
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
                                className="group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-300 hover:text-mag-blue dark:hover:text-mag-blue font-normal hover:font-bold"
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
                                    className="group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-300 hover:text-mag-blue dark:hover:text-mag-blue font-normal hover:font-bold"
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
            <SigItems loadSavedSig={loadSavedSig} deleteSig={deleteSig} />
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
        {imageUrl}
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
