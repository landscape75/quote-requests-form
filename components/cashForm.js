import { useState } from "react";
import { Menu, Transition, Listbox } from "@headlessui/react";
//import Link from "next/link";
import Image from "next/image";
import uuid from "react-uuid";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import "jspdf-autotable";
//import { useCollection } from "react-firebase-hooks/firestore";
import { firestore, serverTimestamp } from "../lib/firebase";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import ImageUploader from "./ImageUploader";
import { useForm } from "react-hook-form";
import {
  ExclamationCircleIcon,
  UserCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/solid";
//import { ClipboardListIcon, ShoppingCartIcon } from "@heroicons/react/outline";

/////////////////////////////////////////////////////////////

function cashForm() {
  const { user, username } = useContext(UserContext);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  //const [fullYear] = useState(new Date().getFullYear().toString());
  //const [version] = useState("2021.03.15.a");
  const [imgW1, setImgW1] = useState(250);
  const [imgH1, setImgH1] = useState(150);
  const [imgW2, setImgW2] = useState(250);
  const [imgH2, setImgH2] = useState(150);
  const [uploadUrl, setUploadUrl] = useState("");
  const [uploadUrl2, setUploadUrl2] = useState("");
  const [uploadUrl3, setUploadUrl3] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [failed, setFailed] = useState(false);

  /////////////////////////////////////////////////////////////

  let cn = ""
  if (!failed) {
    cn = watch("companyName", "").replace(/\s/g, "");
  }
  

  const onSubmit = (data) => saveData(data);
  //console.log(cn)
  async function saveData(d) {
    const id = uuid();
    try {
      await firestore
        .collection("cashAccounts")
        .doc(id)
        .set({
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          userId: user.uid,
          businessLicenseUrl: uploadUrl,
          voidChequeUrl: uploadUrl2,
          otherUrl: uploadUrl3,
          imgW1: imgW1,
          imgH1: imgH1,
          imgW2: imgW2,
          imgH2: imgH2,
          formData: d,
        })
        .then( async () => {
          await sendMail(d)
          setSubmitted(true);
          setFailed(false)
          toast.success("Cash account application submitted.", {
            duration: 4000,
          });
        });
    } catch (e) {
      setFailed(true)
      toast.error("Failed to submit cash account application. - " + e, {
        duration: 10000,
      });
    }
  }

  /////////////////////////////////////////////////////////////

  async function sendMail(d) {
    console.log('emailing')
    let response = await fetch(`https://cash-account-form.vercel.app/api/email` , {
      method: 'POST',
      body: JSON.stringify({
        name: d.companyName,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': 'https://cash-account-form.vercel.app'
      }
    })
    let data = await response.json();
    
    console.log(data);
    return data
  }

  /////////////////////////////////////////////////////////////

  function reset() {
    setUploadUrl("");
    setUploadUrl2("");
    setUploadUrl3("");
    setSubmitted(false);
    setImgW1(250);
    setImgH1(150);
    setImgW2(250);
    setImgH2(150);
  }

  /////////////////////////////////////////////////////////////

  /*   function printQuote(o) {
    setShowMenu(false);
    let printterms =
      "© " + fullYear + " CornerStone Wall Solutions | " + version;
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
  } */

  /////////////////////////////////////////////////////////////////

  function clearImage(e) {
    e.preventDefault();
    setUploadUrl("");
  }

  function clearImage2(e) {
    e.preventDefault();
    setUploadUrl2("");
  }

  /////////////////////////////////////////////////////////////

  //console.log(watch("companyName"));
  if (submitted) {
    return (
      <div className="relative mt-4 w-full z--10 rounded-lg shadow-lg border border-gray-300 bg-white opcity-50 p-3 sm:p-6 flex flex-col justify-items-center">
        <div className="mx-auto mb-4">
        <CheckCircleIcon
          className="h-10 sm:h-16 w-10 sm:w-16 text-lc-green ml-0"
          aria-hidden="true"
        />
        </div>
        <h1 className="sm:text-2xl text-md font-bold text-gray-900 text-center">
          Thank you. Your Landscape Centre Inc. Cash Account application has
          been submitted. 
        </h1>
        <p className="sm:text-sm text-xs font-medium text-gray-500 text-center mt-4 mb-2">
          If you have any questions, please call 604-540-0333. We will contact you when your account is ready to use or if we need more information.
        </p>
      </div>
    );
  }

  if (failed) {
    return (
      <div className="relative mt-4 w-full z--10 rounded-lg shadow-lg border border-gray-300 bg-white opcity-50 p-3 sm:p-6 flex flex-col justify-items-center">
        <div className="mx-auto mb-4">
        <ExclamationCircleIcon
          className="h-10 sm:h-16 w-10 sm:w-16 text-red-600 ml-0"
          aria-hidden="true"
        />
        </div>
        <h1 className="sm:text-2xl text-md font-bold text-gray-900 text-center">
          Your Landscape Centre Inc. Cash Account application was not submitted. 
        </h1>
        <p className="sm:text-sm text-xs font-medium text-gray-500 text-center mt-4 mb-2">
          Please refresh the page and try again or call 604-540-0333.
        </p>
      </div>
    );
  }

  return (
    <div className="">
      <div className="relative mt-4 w-full z--10 rounded-lg shadow-lg border border-gray-300 bg-white opcity-50 p-3 sm:p-6">
        <div className="w-full space-y-4">
          <div className="flex items-center space-x-5">
            <div className="flex-shrink-0">
              <div className="relative">
                <UserCircleIcon
                  className="h-10 sm:h-16 w-10 sm:w-16 text-lc-green ml-0"
                  aria-hidden="true"
                />
                <span
                  className="absolute inset-0 shadow-inner rounded-full"
                  aria-hidden="true"
                />
              </div>
            </div>
            <div>
              <h1 className="sm:text-2xl text-md font-bold text-gray-900 truncate">
                Contractor Cash Account Application
              </h1>
              <p className="sm:text-sm text-xs font-medium text-gray-500">
                If you have any questions, please call 604-540-0333 { user.uid }
              </p>
            </div>
          </div>
          <div className="items-center pt-2 pb-0" aria-hidden="true">
            <div className="w-full border-t border-gray-400" />
          </div>

          <p className="pt-2 text-sm text-gray-500">
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
          <form className="space-y-2 pt-0" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <h3 className="text-xl leading-6 font-medium text-gray-900">
                Company Information
              </h3>
              <p className="mt-1 pb-2 text-sm text-gray-500">
                Please provide company name, address and contact info
              </p>
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
                  //value={companyName}
                  placeholder="Company Name"
                  className="block bg-white dark:bg-mag-grey text-gay-700 dark:text-white focus:ring-lc-yellow focus:border-lc-yellow w-full border-gray-300 dark:border-gray-500 rounded-md required"
                  //onChange={(e) => setCompanyName(e.target.value)}
                  {...register("companyName", { required: true })}
                ></input>
                {errors.companyName && (
                  <div className="flex items-center pt-1">
                    <ExclamationCircleIcon
                      className="h-5 w-5 text-red-600 ml-0"
                      aria-hidden="true"
                    />
                    <span className="text-sm text-red-600 font-medium pl-1">
                      Company Name is required
                    </span>
                  </div>
                )}
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
                  //value={address}
                  placeholder="Street Address"
                  className="block bg-white dark:bg-mag-grey text-gay-700 dark:text-white focus:ring-lc-yellow focus:border-lc-yellow w-full border-gray-300 dark:border-gray-500 rounded-md"
                  //onChange={(e) => setAddress(e.target.value)}
                  {...register("streetAddress", { required: true })}
                ></input>
                {errors.streetAddress && (
                  <div className="flex items-center pt-1">
                    <ExclamationCircleIcon
                      className="h-5 w-5 text-red-600 ml-0"
                      aria-hidden="true"
                    />
                    <span className="text-sm text-red-600 font-medium pl-1">
                      Street Address is required
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-0 grid grid-cols-1 gap-y-0 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-100"
                >
                  City *
                </label>
                <div className="mt-1 mb-2">
                  <input
                    id="city"
                    name="city"
                    type="text"
                    //value={truckNumber}
                    placeholder="City"
                    className="block bg-white dark:bg-mag-grey text-gay-700 dark:text-white focus:ring-lc-yellow focus:border-lc-yellow w-full border-gray-300 dark:border-gray-500 rounded-md"
                    //onChange={(e) => setTruckNumber(e.target.value)}
                    {...register("city", { required: true })}
                  ></input>
                  {errors.city && (
                    <div className="flex items-center pt-1">
                      <ExclamationCircleIcon
                        className="h-5 w-5 text-red-600 ml-0"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-red-600 font-medium pl-1">
                        City is required
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="province"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-100"
                >
                  Province *
                </label>
                <div className="mt-1 mb-2">
                  <input
                    id="province"
                    name="province"
                    type="text"
                    //value={truckNumber}
                    placeholder="Province"
                    className="block bg-white dark:bg-mag-grey text-gay-700 dark:text-white focus:ring-lc-yellow focus:border-lc-yellow w-full border-gray-300 dark:border-gray-500 rounded-md"
                    //onChange={(e) => setTruckNumber(e.target.value)}
                    {...register("province", { required: true })}
                  ></input>
                  {errors.province && (
                    <div className="flex items-center pt-1">
                      <ExclamationCircleIcon
                        className="h-5 w-5 text-red-600 ml-0"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-red-600 font-medium pl-1">
                        Province is required
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="postal-code"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-100"
                >
                  Postal Code *
                </label>
                <div className="mt-1 mb-2">
                  <input
                    id="postal-code"
                    name="postal-code"
                    type="text"
                    //value={truckNumber}
                    placeholder="Postal Code"
                    className="block bg-white dark:bg-mag-grey text-gay-700 dark:text-white focus:ring-lc-yellow focus:border-lc-yellow w-full border-gray-300 dark:border-gray-500 rounded-md"
                    //onChange={(e) => setTruckNumber(e.target.value)}
                    {...register("postalCode", {
                      required: true,
                      pattern: {
                        value:
                          /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i,
                      },
                    })}
                  ></input>
                  {errors.postalCode && (
                    <div className="flex items-center pt-1">
                      <ExclamationCircleIcon
                        className="h-5 w-5 text-red-600 ml-0"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-red-600 font-medium pl-1">
                        Postal Code is required
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <label
                htmlFor="contact"
                className="block text-sm font-medium text-gray-700 dark:text-gray-100"
              >
                Principle Contact *
              </label>
              <div className="mt-1 mb-2">
                <input
                  id="contact"
                  name="contact"
                  type="text"
                  //value={truckNumber}
                  placeholder="Principle Contact"
                  className="block bg-white dark:bg-mag-grey text-gay-700 dark:text-white focus:ring-lc-yellow focus:border-lc-yellow w-full border-gray-300 dark:border-gray-500 rounded-md"
                  //onChange={(e) => setTruckNumber(e.target.value)}
                  {...register("contact", { required: true })}
                ></input>
                {errors.contact && (
                  <div className="flex items-center pt-1">
                    <ExclamationCircleIcon
                      className="h-5 w-5 text-red-600 ml-0"
                      aria-hidden="true"
                    />
                    <span className="text-sm text-red-600 font-medium pl-1">
                      Principle Contact is required
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-0 grid grid-cols-1 gap-y-0 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="office-phone"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-100"
                >
                  Office Phone *
                </label>
                <div className="mt-1 mb-2">
                  <input
                    id="office-phone"
                    name="office-phone"
                    type="text"
                    //value={truckNumber}
                    placeholder="Office Phone"
                    className="block bg-white dark:bg-mag-grey text-gay-700 dark:text-white focus:ring-lc-yellow focus:border-lc-yellow w-full border-gray-300 dark:border-gray-500 rounded-md"
                    //onChange={(e) => setTruckNumber(e.target.value)}
                    {...register("officePhone", {
                      required: true,
                      pattern: {
                        value:
                          /^[+]?(\d{1,2})?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
                      },
                    })}
                  ></input>
                  {errors.officePhone && (
                    <div className="flex items-center pt-1">
                      <ExclamationCircleIcon
                        className="h-5 w-5 text-red-600 ml-0"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-red-600 font-medium pl-1">
                        Valid office phone number is required
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="mobile-phone"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-100"
                >
                  Mobile Phone *
                </label>
                <div className="mt-1 mb-2">
                  <input
                    id="mobile-phone"
                    name="mobile-phone"
                    type="text"
                    //value={truckNumber}
                    placeholder="Mobile Phone"
                    className="block bg-white dark:bg-mag-grey text-gay-700 dark:text-white focus:ring-lc-yellow focus:border-lc-yellow w-full border-gray-300 dark:border-gray-500 rounded-md"
                    //onChange={(e) => setTruckNumber(e.target.value)}
                    {...register("mobilePhone", {
                      required: true,
                      pattern: {
                        value:
                          /^[+]?(\d{1,2})?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
                      },
                    })}
                  ></input>
                  {errors.mobilePhone && (
                    <div className="flex items-center pt-1">
                      <ExclamationCircleIcon
                        className="h-5 w-5 text-red-600 ml-0"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-red-600 font-medium pl-1">
                        Valid mobile phone number is required
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-100"
              >
                Email Address *
              </label>
              <div className="mt-1 mb-2">
                <input
                  id="email"
                  name="email"
                  type="text"
                  //value={truckNumber}
                  placeholder="Email Address"
                  className="block bg-white dark:bg-mag-grey text-gay-700 dark:text-white focus:ring-lc-yellow focus:border-lc-yellow w-full border-gray-300 dark:border-gray-500 rounded-md"
                  //onChange={(e) => setTruckNumber(e.target.value)}
                  {...register("email", {
                    required: true,
                    pattern: {
                      value:
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    },
                  })}
                ></input>
                {errors.email && (
                  <div className="flex items-center pt-1">
                    <ExclamationCircleIcon
                      className="h-5 w-5 text-red-600 ml-0"
                      aria-hidden="true"
                    />
                    <span className="text-sm text-red-600 font-medium pl-1">
                      Valid email address is required
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className="items-center pt-4 mb-4" aria-hidden="true">
                <div className="w-full border-t border-gray-200" />
              </div>
              <h3 className="text-xl leading-6 font-medium text-gray-900">
                About Your Business
              </h3>
              <p className="mt-1 pb-2 text-sm text-gray-500">
                Please tell us some more about your business
              </p>
            </div>

            <div>
              <label
                htmlFor="gst"
                className="block text-sm font-medium text-gray-700 dark:text-gray-100"
              >
                GST Number *
              </label>
              <div className="mt-1 mb-2">
                <input
                  id="gst"
                  name="gst"
                  type="text"
                  //value={truckNumber}
                  placeholder="GST Number"
                  className="block bg-white dark:bg-mag-grey text-gay-700 dark:text-white focus:ring-lc-yellow focus:border-lc-yellow w-full border-gray-300 dark:border-gray-500 rounded-md"
                  //onChange={(e) => setTruckNumber(e.target.value)}
                  {...register("gst", {
                    required: true,
                    pattern: {
                      value:
                        /^(\d{5})[\s.-]?(\d{4})[\s.-]?[RCMPT]{2}[\s.-]?\d{4}$/i,
                    },
                  })}
                ></input>
                <p className="mt-1 pb-2 text-xs text-gray-400">
                  Example: 12345 6789 RT 0001
                </p>
                {errors.gst && (
                  <div className="flex items-center pt-1">
                    <ExclamationCircleIcon
                      className="h-5 w-5 text-red-600 ml-0"
                      aria-hidden="true"
                    />
                    <span className="text-sm text-red-600 font-medium pl-1">
                      A valid GST Number is required
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-100">
                Business Type *
              </label>
              <p className="text-gray-500 text-xs pb-2">Check all that apply</p>
              <div>
                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="landscape-maintenace"
                      name="landscape-maintenace"
                      type="checkbox"
                      className="focus:ring-lc-yellow h-4 w-4 text-lc-yellow border-gray-300 rounded"
                      {...register("type.landscapeMaintenance")}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="landscape-maintenace"
                      className="font-medium text-gray-700"
                    >
                      Landscape Maintenance
                    </label>
                    {/* <p className="text-gray-500">
                      Get notified when a candidate accepts or rejects an offer.
                    </p> */}
                  </div>
                </div>
              </div>
              <div>
                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="landscape-contractor"
                      name="landscape-contractor"
                      type="checkbox"
                      className="focus:ring-lc-yellow h-4 w-4 text-lc-yellow border-gray-300 rounded"
                      {...register("type.landscapeContractor")}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="landscape-contractor"
                      className="font-medium text-gray-700"
                    >
                      Landscape Contractor
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="landscape-designer"
                      name="landscape-designer"
                      type="checkbox"
                      className="focus:ring-lc-yellow h-4 w-4 text-lc-yellow border-gray-300 rounded"
                      {...register("type.landscapeDesigner")}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="landscape-designer"
                      className="font-medium text-gray-700"
                    >
                      Landscape Designer
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="general-contractor"
                      name="general-contractor"
                      type="checkbox"
                      className="focus:ring-lc-yellow h-4 w-4 text-lc-yellow border-gray-300 rounded"
                      {...register("type.generalContactor")}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="general-contractor"
                      className="font-medium text-gray-700"
                    >
                      General Contractor
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="home-builder"
                      name="home-builder"
                      type="checkbox"
                      className="focus:ring-lc-yellow h-4 w-4 text-lc-yellow border-gray-300 rounded"
                      {...register("type.homeBuilder")}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="home-builder"
                      className="font-medium text-gray-700"
                    >
                      Home Builder
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="mason"
                      name="mason"
                      type="checkbox"
                      className="focus:ring-lc-yellow h-4 w-4 text-lc-yellow border-gray-300 rounded"
                      {...register("type.mason")}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="mason"
                      className="font-medium text-gray-700"
                    >
                      Mason
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="contractor"
                      name="contactor"
                      type="checkbox"
                      className="focus:ring-lc-yellow h-4 w-4 text-lc-yellow border-gray-300 rounded"
                      {...register("type.contractor")}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="contractor"
                      className="font-medium text-gray-700"
                    >
                      Contractor
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="other"
                      name="other"
                      type="checkbox"
                      className="focus:ring-lc-yellow h-4 w-4 text-lc-yellow border-gray-300 rounded"
                      {...register("type.other")}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="offers"
                      className="font-medium text-gray-700"
                    >
                      Other
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label
                htmlFor="if-other"
                className="block text-sm font-medium text-gray-700 dark:text-gray-100"
              >
                If Other Please Provide Details
              </label>
              <div className="mt-1 mb-2">
                <input
                  id="if-other"
                  name="if-other"
                  type="text"
                  //value={truckNumber}
                  placeholder="Other"
                  className="block bg-white dark:bg-mag-grey text-gay-700 dark:text-white focus:ring-lc-yellow focus:border-lc-yellow w-full border-gray-300 dark:border-gray-500 rounded-md"
                  //onChange={(e) => setTruckNumber(e.target.value)}
                  {...register("ifother", { required: false })}
                ></input>
                {errors.ifOther && (
                  <div className="flex items-center pt-1">
                    <ExclamationCircleIcon
                      className="h-5 w-5 text-red-600 ml-0"
                      aria-hidden="true"
                    />
                    <span className="text-sm text-red-600 font-medium pl-1">
                      ...
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="supplier"
                className="block text-sm font-medium text-gray-700 dark:text-gray-100"
              >
                Current Supplier
              </label>
              <div className="mt-1 mb-2">
                <input
                  id="supplier"
                  name="supplier"
                  type="text"
                  //value={truckNumber}
                  placeholder="Current Supplier"
                  className="block bg-white dark:bg-mag-grey text-gay-700 dark:text-white focus:ring-lc-yellow focus:border-lc-yellow w-full border-gray-300 dark:border-gray-500 rounded-md"
                  //onChange={(e) => setTruckNumber(e.target.value)}
                  {...register("supplier", { required: false })}
                ></input>
                {errors.supplier && (
                  <div className="flex items-center pt-1">
                    <ExclamationCircleIcon
                      className="h-5 w-5 text-red-600 ml-0"
                      aria-hidden="true"
                    />
                    <span className="text-sm text-red-600 font-medium pl-1">
                      ...
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 dark:text-gray-100"
              >
                Notes
              </label>
              <div className="mt-1 mb-2">
                <textarea
                  id="notes"
                  name="notes"
                  rows="3"
                  //value={truckNumber}
                  placeholder="Notes"
                  className="block bg-white dark:bg-mag-grey text-gay-700 dark:text-white focus:ring-lc-yellow focus:border-lc-yellow w-full border-gray-300 dark:border-gray-500 rounded-md"
                  //onChange={(e) => setTruckNumber(e.target.value)}
                  {...register("notes", { required: false })}
                ></textarea>
                {errors.notes && (
                  <div className="flex items-center pt-1">
                    <ExclamationCircleIcon
                      className="h-5 w-5 text-red-600 ml-0"
                      aria-hidden="true"
                    />
                    <span className="text-sm text-red-600 font-medium pl-1">
                      ...
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className="items-center pt-4 mb-4" aria-hidden="true">
                <div className="w-full border-t border-gray-200" />
              </div>
              <h3 className="text-xl leading-6 font-medium text-gray-900">
                Attachments
              </h3>
              <p className="mt-1 pb-2 text-sm text-gray-500">
                Please attach copies of the following documents.
              </p>
            </div>
            <ul>
              <li key="bus-lic">
                <div>
                  <label
                    htmlFor="business-license"
                    className="block text-sm font-medium text-gray-700 mt-2"
                  >
                    Business License
                  </label>
                  <div className="mt-1 mb-0 border rounded-md border-gray-200 bg-white">
                    <div className="flex-1 flex items-top justify-between">
                      {uploadUrl !== "" && (
                        <Image
                          className="border rounded-md border-gray-200 bg-white"
                          src={uploadUrl}
                          alt="business license"
                          width={imgW1}
                          height={imgH1}
                          layout="intrinsic"
                          id="business-license"
                        />
                      )}
                      {uploadUrl == "" && (
                        <Image
                          className="border rounded-md border-gray-200 bg-white"
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
                          <span className="sr-only">Business License</span>
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
                  <ImageUploader
                    key="100"
                    passUploadUrl={setUploadUrl}
                    setW={setImgW1}
                    folder={cn}
                    fileType={"BusinessLicense"}
                    uid={"1z"}
                    title="Upload Business License Image"
                  />
                </div>
              </li>
              <li key="void-cheq">
                <div>
                  <label
                    htmlFor="void-cheque"
                    className="block text-sm font-medium text-gray-700 mt-2"
                  >
                    Void Cheque
                  </label>
                  <div
                    id="22"
                    className="mt-1 mb-0 border rounded-md border-gray-200 bg-white"
                  >
                    <div className="flex-1 flex items-top justify-between">
                      {uploadUrl2 !== "" && (
                        <Image
                          className="border rounded-md border-gray-200 bg-white"
                          src={uploadUrl2}
                          alt="void cheque"
                          width={imgW2}
                          height={imgH2}
                          layout="intrinsic"
                          id="void-cheque"
                        />
                      )}
                      {uploadUrl2 == "" && (
                        <Image
                          className="border rounded-md border-gray-200 bg-white"
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
                          onClick={(e) => clearImage2(e)}
                        >
                          <span className="sr-only">Void Cheque</span>
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
                  <ImageUploader
                    key="200"
                    passUploadUrl={setUploadUrl2}
                    setW={setImgW2}
                    folder={cn}
                    fileType={"VoidCheque"}
                    uid={"2z"}
                    title="Upload Void Cheque Image"
                  />
                </div>
              </li>
            </ul>
            <input
              type="submit"
              className="inline-flex justify-center md:w-1/4 w-full rounded-md border border-transparent cursor-pointer shadow-md px-4 py-2 bg-lc-green text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lc-yellow"
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default cashForm;
