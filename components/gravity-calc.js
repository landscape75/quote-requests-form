import { useState, useEffect, useRef } from "react";
import { Menu, Transition, Listbox } from "@headlessui/react";
import Link from "next/link";
//import userbase from "userbase-js";
import Image from "next/image";
import uuid from "react-uuid";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useCollection } from "react-firebase-hooks/firestore";
import { firestore, serverTimestamp } from "../lib/firebase";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import SigItems from "../components/sig-items";
import ImageUploader from "../components/ImageUploader";
//import swal from "@sweetalert/with-react";
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
  const [address, setAddress] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [truckNumber, setTruckNumber] = useState("");
  const [selectedSig, setSelectedSig] = useState("");
  const [signaturePad, setSignaturePad] = useState();
  const [notes, setNotes] = useState("");
  const [company, setCompany] = useState("");
  const [sigDate, setSigDate] = useState("");
  const [imgW, setImgW] = useState(250);
  const [imgH, setImgH] = useState(150);
  //const [loadingSig, setLoadingSig] = useState(false);
  //const [selectedFile, setSelectedFile] = useState(undefined);
  //const [isPhoto, setIsPhoto] = useState(false);
  //const [noSig, setNoSig] = useState(true);
  const [uploadUrl, setUploadUrl] = useState("");

  const [sigUrl, setSigUrl] = useState("");
  const [sigLocked, setSigLocked] = useState(false);
  const [photoLocked, setPhotoLocked] = useState(false);

  /////////////////////////////////////////////////////////////

  useEffect(() => {}, []);

  /////////////////////////////////////////////////////////////

  /*   useEffect(() => {
    let temp = null;
    function resizeCanvas() {
      if (signaturePad) {
        temp = signaturePad.toData();
        var ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d").scale(ratio, ratio);
        signaturePad.clear();
        signaturePad.fromData(temp);
        temp = null;
      }
    }

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []); */

  /////////////////////////////////////////////////////////////

  useEffect(() => {}, []);
  /////////////////////////////////////////////////////////////

  async function saveSig() {
    const id = uuid();

    let notSigned = true;
    if (uploadUrl == "") {
      notSigned = true;
    } else {
      notSigned = false;
    }

    if (uploadUrl == "") {
      setPhotoLocked(false);
    } else {
      setPhotoLocked(true);
    }

    /*     if (signaturePad.isEmpty()) {
      setSigLocked(false);
      signaturePad.on()
    } else {
      setSigLocked(true);
      signaturePad.off()
    } */

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
          userName: username || "anon",
          userPhotoUrl: user.photoURL || "",
          photoUrl: uploadUrl,
          sigImageUrl: "", //await getSig(),
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
    let notSigned = true;
    if (uploadUrl == "") {
      notSigned = true;
    } else {
      notSigned = false;
    }

    if (uploadUrl == "") {
      setPhotoLocked(false);
    } else {
      setPhotoLocked(true);
    }

    /*     if (signaturePad.isEmpty()) {
      setSigLocked(false);
      signaturePad.on()
    } else {
      setSigLocked(true);
      signaturePad.off()
    }
 */
    try {
      await firestore
        .collection("sigs")
        .doc(selectedSig)
        .update({
          orderNumber: orderNumber,
          customerName: customerName,
          truckNumber: truckNumber,
          sigDate: sigDate,
          company: company,
          noSig: notSigned,
          notes: notes,
          updatedAt: serverTimestamp(),
          userId: user.uid,
          userName: username,
          userPhotoUrl: user.photoURL,
          photoUrl: uploadUrl,
          sigImageUrl: "", //await getSig(),
          imgW: imgW,
          imgH: imgH,
        })
        .then(() => {
          //setEditSig(true);
          //setEditItemId(id);
          toast.success("Signature saved to the cloud.", { duration: 4000 });
        });
    } catch (e) {
      toast.error("Failed to save signature. - " + e, {
        duration: 10000,
      });
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

  async function loadSavedSig(id) {
    setUploadUrl("");
    var docRef = firestore.collection("sigs").doc(id);

    await docRef
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
          setImgW(doc.data().imgW || 250);
          setImgH(doc.data().imgH || 150);
          //if (sigCanvas.current) clearSig()
          //if (sigCanvas.current) sigCanvas.current.fromDataURL(doc.data().sigImageUrl || []);
          /* if (signaturePad) signaturePad.clear();
          if (signaturePad)
            signaturePad.fromDataURL(doc.data().sigImageUrl || "");
            setSigUrl(doc.data().sigImageUrl || "")
            setImgW(doc.data().imgW || 250); */
          setEditSig(true);
          //console.log(id)
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
    //signaturePad.clear();
    //signaturePad.on();
    //clearSig()
    setSigUrl("");
    setEditSig(false);
    setEditItemId("");
    setOrderNumber("");
    setCustomerName("");
    setTruckNumber("");
    setNotes("");
    setCompany("");
    setSigDate("");
    //setSelectedFileId("");
    //setSigLabel("Signature");
    //setNewSigLabel("New Signature");
    setImgW(250);
    setImgH(150);
    //setLoadingSig(false);
    //setSelectedFileId(undefined);
    setUploadUrl("");
    setSigUrl("");
    setSigLocked(false);
    setPhotoLocked(false);
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
  function clearImage(e) {
    e.preventDefault();
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
    <div className="">
      {/* <div className="grid grid-cols-2 gap-0 m-0 md:gap-4 lg-gap-4 xl:gap-4 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 p-0 sm:p-0"></div> */}
{/*       <Image
        className="border rounded-md border-gray-200 dark:border-mag-grey-200 bg-white dark:bg-mag-grey"
        src={"/logo-med.jpeg"}
        alt="photo"
        width={300 * 0.75}
        height={124 * 0.75}
        layout="intrinsic"
      /> */}
      <div className="relative w-full rounded-lg shadow-lg border border-gray-300 dark:border-mag-grey-700 bg-white dark:bg-mag-grey-600 px-3 lg:px-6 py-2 lg:py-5 ">
        <div className="w-full space-y-4">
          <div>
            <h2 className="text-2xl leading-6 font-medium text-gray-900">
              Contractor Cash Account Application
            </h2>
            <p className="mt-1 text-md text-gray-500">
              If you have any questions, please call 604-540-0333
            </p>
            <div className="items-center pt-2 pb-0" aria-hidden="true">
              <div className="w-full border-t border-gray-400" />
            </div>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            A Contractor Cash account enables you to purchase product at a
            discounted rate. Note, we protect our contractors so the discount is
            given only to you as the contractor and does not apply if your
            customer is paying. Please contact us if you have any questions.
            Thank you and we look forward to working with you.
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Fields marked with * must be filled in.
          </p>
          <div className="items-center pt-1 pb-1" aria-hidden="true">
            <div className="w-full border-t border-gray-200" />
          </div>
          <form className="space-y-2 pt-0">
            <div>
              <h3 className="text-xl leading-6 font-medium text-gray-900">
                Company Information
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                If you have any questions, please call 604-540-0333
              </p>
              <div className="items-center pt-2 pb-2" aria-hidden="true">
                <div className="w-full border-t border-gray-200" />
              </div>
            </div>
            <div>
              <label
                htmlFor="company-name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-100"
              >
                Company Name *
              </label>
              <div className="mt-1 mb-2">
                <input
                  id="company-name"
                  name="company-name"
                  type="text"
                  value={companyName}
                  placeholder="Company Name"
                  className="block bg-white dark:bg-mag-grey text-gay-700 dark:text-white focus:ring-lc-yellow focus:border-lc-yellow w-full border-gray-300 dark:border-gray-500 rounded-md required"
                  onChange={(e) => setCompanyName(e.target.value)}
                ></input>
              </div>
            </div>
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 dark:text-gray-100"
              >
                Street Address *
              </label>
              <div className="mt-1 mb-2">
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={address}
                  placeholder="Street Address"
                  className="block bg-white dark:bg-mag-grey text-gay-700 dark:text-white focus:ring-lc-yellow focus:border-lc-yellow w-full border-gray-300 dark:border-gray-500 rounded-md"
                  onChange={(e) => setAddress(e.target.value)}
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

          <div>
            <label
              htmlFor="signature-pad"
              className="block text-sm font-medium text-gray-700 dark:text-gray-100 mt-2"
            >
              Photo
            </label>
            <div className="mt-1 mb-0 border rounded-md border-gray-200 dark:border-mag-grey-200 bg-white dark:bg-mag-grey">
              <div className="flex-1 flex items-top justify-between">
                {uploadUrl !== "" && (
                  <Image
                    className="border rounded-md border-gray-200 dark:border-mag-grey-200 bg-white dark:bg-mag-grey"
                    src={uploadUrl}
                    alt="photo"
                    width={imgW}
                    height={imgH}
                    layout="intrinsic"
                  />
                )}
                {uploadUrl == "" && (
                  <Image
                    className="border rounded-md border-gray-200 dark:border-mag-grey-200 bg-white dark:bg-mag-grey"
                    src={"/no-photo.png"}
                    alt="photo"
                    width={250}
                    height={150}
                    layout="intrinsic"
                  />
                )}

                <div className="flex-shrink-0 pr-0">
                  <button
                    className="w-8 h-8 inline-flex items-center justify-center text-gray-400 rounded-full bg-transparent hover:text-mag-blue focus:outline-none"
                    onClick={(e) => clearImage(e)}
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
            </div>
          </div>

          <ImageUploader passUploadUrl={setUploadUrl} setW={setImgW} />

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
                                  Save
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

      {/*       <div className="relative rounded-lg w-full lg:w-3/4 shadow-lg border border-gray-300 dark:border-mag-grey-700 bg-white dark:bg-mag-grey-600 px-3 lg:px-6 py-2 lg:py-5 space-x-3">
        <div className="min-w-0">
          <p className="text-lg font-medium text-gray-900 dark:text-white mb-4 border border-l-0 border-r-0 border-t-0 border-gray-200 dark:border-mag-grey-200 pb-2">
            Saved Signatures
          </p>
          <div>
            <SigItems loadSavedSig={loadSavedSig} deleteSig={deleteSig} />
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default GravityCalc;
