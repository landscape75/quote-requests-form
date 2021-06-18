import { useState } from "react";
import uuid from "react-uuid";
import toast from "react-hot-toast";
import { firestore, serverTimestamp } from "../lib/firebase";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import FileUploader from "./FileUploader";
import LineItem from "./LineItem";
import { useForm } from "react-hook-form";
import {
  ExclamationCircleIcon,
  UserCircleIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/solid";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { PlusCircleIcon, ShoppingCartIcon } from "@heroicons/react/outline";

////////////////////////////////////////////////////////////

function QuoteForm() {
  const { user, username } = useContext(UserContext);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [files, setFiles] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [lineItems, setLineItems] = useState([
    { description: "", quantity: "", unit: "" },
  ]);

  /////////////////////////////////////////////////////////////

  let cn = "";
  let dr = false;
  if (!failed) {
    cn = watch("name", "").replace(/\s/g, "");
    dr = watch("deliveryRequired", false);
  }

  /////////////////////////////////////////////////////////////

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(lineItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setLineItems(items);
  }

  /////////////////////////////////////////////////////////////

  const onSubmit = (data) => saveData(data);
  //console.log(cn)
  async function saveData(d) {
    const id = uuid();
    //const date = new Date();
    try {
      await firestore
        .collection("quotes")
        .doc(id)
        .set({
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          userId: user.uid,
          files: files,
          formData: d,
          lineItems: lineItems,
          read: false,
        })
        .then(async () => {
          //await sendMail(d);
          setSubmitted(true);
          setFailed(false);
          toast.success("Quote request submitted.", {
            duration: 4000,
          });
        });
    } catch (e) {
      setFailed(true);
      toast.error("Failed to submit quote request. - " + e, {
        duration: 6000,
      });
    }
  }

  //////////////////////////////////////////////////////////////

  const handleAddFile = (fName, fUrl) => {
    let newFile = { fileName: fName, fileUrl: fUrl };
    setFiles([...files, newFile]);
    console.log(files);
  };

  //////////////////////////////////////////////////////////////

  const handleLineItemChange = (elementIndex) => (event) => {
    let lineItems2 = lineItems.map((item, i) => {
      if (elementIndex !== i) return item;
      return { ...item, [event.target.name]: event.target.value };
    });
    //console.log(lineItems2)
    setLineItems(lineItems2);
  };

  //////////////////////////////////////////////////////////////

  const handleAddLineItem = (event) => {
    setLineItems(
      lineItems.concat([{ description: "", quantity: "", unit: "" }])
    );
    console.log(lineItems);
  };

  //////////////////////////////////////////////////////////////

  const handleRemoveLineItem = (elementIndex) => (event) => {
    setLineItems(
      lineItems.filter((item, i) => {
        return elementIndex !== i;
      })
    );
    //console.log('delete')
  };

  //////////////////////////////////////////////////////////////

  const handleFocusSelect = (event) => {
    event.target.select();
  };

  /////////////////////////////////////////////////////////////

  async function sendMail(d) {
    console.log("emailing");
    let response = await fetch(
      `https://cash-account-form.vercel.app/api/email`,
      {
        method: "POST",
        body: JSON.stringify({
          name: d.name,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "https://cash-account-form.vercel.app",
        },
      }
    );
    let data = await response.json();

    console.log(data);
    return data;
  }

  /////////////////////////////////////////////////////////////

  /*   function reset() {
    setUploadUrl("");
    setUploadUrl2("");
    setUploadUrl3("");
    setSubmitted(false);
    setImgW1(250);
    setImgH1(150);
    setImgW2(250);
    setImgH2(150);
  } */

  /////////////////////////////////////////////////////////////

  if (submitted) {
    return (
      <div className="relative mt-4 w-full z--10 rounded-lg shadow-md border border-gray-300 bg-white opcity-50 p-3 sm:p-6 flex flex-col justify-items-center">
        <div className="mx-auto mb-4">
          <CheckCircleIcon
            className="h-10 sm:h-16 w-10 sm:w-16 text-lc-green ml-0"
            aria-hidden="true"
          />
        </div>
        <h1 className="sm:text-2xl text-md font-medium text-gray-900 text-center">
          Thank you. Your Landscape Centre Inc. quote request has been
          submitted.
        </h1>
        <p className="sm:text-lg text-sm font-medium text-gray-500 text-center mt-4 mb-2">
          We will get back to you within 48 hours. We will email you if we
          require more information.
        </p>
      </div>
    );
  }

  if (failed) {
    return (
      <div className="relative mt-4 w-full z--10 rounded-lg shadow-md border border-gray-300 bg-white opcity-50 p-3 sm:p-6 flex flex-col justify-items-center">
        <div className="mx-auto mb-4">
          <ExclamationCircleIcon
            className="h-10 sm:h-16 w-10 sm:w-16 text-red-600 ml-0"
            aria-hidden="true"
          />
        </div>
        <h1 className="sm:text-2xl text-md font-bold text-gray-900 text-center">
          Your Landscape Centre Inc. Quote request was not submitted.
        </h1>
        <p className="sm:text-sm text-xs font-medium text-gray-500 text-center mt-4 mb-2">
          Please refresh the page and try again or email
          sales@landscapecentre.com.
        </p>
      </div>
    );
  }

  return (
    <div className="">
      <div className="relative mt-4 w-full z--10 rounded-lg shadow-md border border-gray-300 bg-white opcity-50 p-3 sm:p-6">
        <div className="w-full space-y-4">
          <div className="flex items-center space-x-5">
            <div className="flex-shrink-0">
              <div className="relative">
                <CurrencyDollarIcon
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
                Quote Request
              </h1>
              <p className="sm:text-sm text-xs font-medium text-gray-500">
                If you have any questions, please email
                sales@landscapecentre.com or call 604-540-0333
              </p>
            </div>
          </div>
          <div className="items-center pt-2 pb-0" aria-hidden="true">
            <div className="w-full border-t border-gray-400" />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Fields marked with * must be filled in.
          </p>
          <div className="items-center pt-1 pb-1" aria-hidden="true">
            <div className="w-full border-t border-gray-200" />
          </div>
          <form className="space-y-2 pt-0" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <h3 className="text-xl leading-6 font-medium text-gray-900">
                Contact Information
              </h3>
              <p className="mt-1 pb-2 text-sm text-gray-500">
                Please provide name, contact info, and address if you require
                delivery
              </p>
            </div>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name *
              </label>
              <div className="mt-1 mb-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="bg-white text-gray-700 placeholder-gray-500 placeholder-opacity-25 focus:ring-lc-yellow focus:border-lc-yellow w-full border-gray-300 rounded-md"
                  placeholder="Name"
                  //onChange={(e) => setTruckNumber(e.target.value)}
                  {...register("name", { required: true })}
                ></input>
                {errors.name && (
                  <div className="flex items-center pt-1">
                    <ExclamationCircleIcon
                      className="h-5 w-5 text-red-600 ml-0"
                      aria-hidden="true"
                    />
                    <span className="text-sm text-red-600 font-medium pl-1">
                      Name is required
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="company-name"
                className="text-sm font-medium text-gray-700 dark:text-gray-100"
              >
                Company Name
              </label>
              <div className="mt-1 mb-2">
                <input
                  id="company-name"
                  name="company-name"
                  type="text"
                  //value={companyName}
                  placeholder="Company Name (optional)"
                  className="block bg-white text-gray-700 placeholder-gray-500 placeholder-opacity-25 focus:ring-lc-yellow focus:border-lc-yellow w-full border-gray-300 rounded-md required"
                  //onChange={(e) => setCompanyName(e.target.value)}
                  {...register("companyName", { required: false })}
                ></input>
              </div>
            </div>
            <div>
              <div className="relative flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="delivery-required"
                    name="delivery-required"
                    type="checkbox"
                    className="focus:ring-lc-yellow h-4 w-4 text-lc-yellow border-gray-300 rounded"
                    {...register("deliveryRequired")}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="delivery-required"
                    className="font-medium text-gray-700"
                  >
                    Delivery Required
                  </label>
                  {/* <p className="text-gray-500">
                      Get notified when a candidate accepts or rejects an offer.
                    </p> */}
                </div>
              </div>
            </div>
            {dr && (
              <>
                <div className="mt-0 grid grid-cols-1 gap-y-0 gap-x-4 sm:grid-cols-4">
                  <div className="sm:col-span-2">
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
                        className="bg-white text-gray-700 placeholder-gray-500 placeholder-opacity-25 focus:ring-lc-yellow focus:border-lc-yellow w-full border-gray-300 rounded-md"
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

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700"
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
                        className="bg-white text-gray-700 placeholder-gray-500 placeholder-opacity-25 focus:ring-lc-yellow focus:border-lc-yellow w-full border-gray-300 rounded-md"
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
                </div>
              </>
            )}
            <div className="mt-0 grid grid-cols-1 gap-y-0 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone *
                </label>
                <div className="mt-1 mb-2">
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    //value={truckNumber}
                    placeholder="Phone"
                    className="block bg-white text-gray-700 placeholder-gray-500 placeholder-opacity-25 focus:ring-lc-yellow focus:border-lc-yellow w-full border-gray-300 rounded-md"
                    //onChange={(e) => setTruckNumber(e.target.value)}
                    {...register("phone", {
                      required: true,
                      pattern: {
                        value:
                          /^[+]?(\d{1,2})?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
                      },
                    })}
                  ></input>
                  {errors.phone && (
                    <div className="flex items-center pt-1">
                      <ExclamationCircleIcon
                        className="h-5 w-5 text-red-600 ml-0"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-red-600 font-medium pl-1">
                        Valid phone number is required
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="sm:col-span-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
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
                    className="block bg-white text-gray-700 placeholder-gray-500 placeholder-opacity-25 focus:ring-lc-yellow focus:border-lc-yellow w-full border-gray-300 rounded-md"
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
            </div>

            <div>
              <div className="items-center pt-4 mb-4" aria-hidden="true">
                <div className="w-full border-t border-gray-200" />
              </div>
              <h3 className="text-xl leading-6 font-medium text-gray-900">
                Quote Details
              </h3>
              <p className="mt-1 pb-2 text-sm text-gray-500">
                Please list the materials and quantities you want us to quote.
                Please make sure to include the colour and size in the
                description if applicable. Only include one product per row.
                Click the + button to add a new row.
              </p>
            </div>
            <div className="border border-gray-200 rounded-md">
              <DragDropContext onDragEnd={handleOnDragEnd}>
                <table id="line-items" className="w-full">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="w-1/12 px-2 py-2 text-center text-sm font-medium text-gray-700 tracking-wider border border-t-0 border-b-1 border-l-0 border-r-0"
                      >
                        #
                      </th>
                      <th
                        scope="col"
                        className="w-7/12 px-2 py-2 text-left text-sm font-medium text-gray-700 tracking-wider border border-t-0 border-b-1 border-l-1 border-r-1"
                      >
                        Description
                      </th>
                      <th
                        scope="col"
                        className="w-1/12 px-2 py-2 text-center text-sm font-medium text-gray-700 tracking-wider border border-t-0 border-b-1 border-l-0 border-r-1"
                      >
                        Quantity
                      </th>
                      <th
                        scope="col"
                        className="w-2/12 px-2 py-2 text-left text-sm font-medium text-gray-700 tracking-wider border border-t-0 border-b-1 border-l-0 border-r-1"
                      >
                        Unit
                      </th>
                      <th
                        scope="col"
                        className="w-1/12 px-2 py-2 text-center text-sm font-medium text-gray-700 tracking-wider border border-t-0 border-b-1 border-l-0 border-r-0"
                      >
                        <button
                          type="button"
                          className="bg-gray-0 text-lc-yellow relative inline-flex items-center px-1 py-1 rounded-md border border-gray-200 text-sm hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-0 focus:ring-white"
                          onClick={handleAddLineItem}
                        >
                          <span></span>
                          <PlusCircleIcon
                            className="h-6 w-6 ml-0"
                            aria-hidden="true"
                          />
                        </button>
                      </th>
                    </tr>
                  </thead>

                  <Droppable droppableId="line-items2">
                    {(provided, snapshot) => (
                      <tbody
                        className="divide-y divide-gray-100"
                        {...provided.droppableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                      >
                        {lineItems.map((item, i) => (
                          <LineItem
                            key={i}
                            item={item}
                            id={i}
                            index={i}
                            handleLineItemChange={handleLineItemChange}
                            handleRemoveLineItem={handleRemoveLineItem}
                            itemCount={lineItems.length}
                          />
                        ))}
                        {provided.placeholder}
                      </tbody>
                    )}
                  </Droppable>
                </table>
              </DragDropContext>
            </div>

            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700"
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
                  className="block bg-white text-gray-700 placeholder-gray-500 placeholder-opacity-25 focus:ring-lc-yellow focus:border-lc-yellow w-full border-gray-300 rounded-md"
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
                Optionally attach files including images, PDFs or Excel files.
              </p>
            </div>
            <div>
              <div>
                <div className="mt-1 mb-0 border rounded-md border-gray-200 bg-white">
                  <div className="divide-y divide-gray-100">
                    {files.map((item, i) => (
                      <div key={i} id={i} className="text-sm text-gray-700 p-2">
                        {i + 1} - {item.fileName}
                      </div>
                    ))}
                  </div>
                </div>
                {cn !== "" ? (
                  <FileUploader
                    addFile={handleAddFile}
                    folder={cn}
                    title="Upload File"
                  />
                ) : (
                  <div className="flex items-center pt-1">
                    <ExclamationCircleIcon
                      className="h-5 w-5 text-red-600 ml-0"
                      aria-hidden="true"
                    />
                    <span className="text-sm text-red-600 font-medium pl-1">
                      You must enter your name first
                    </span>
                  </div>
                )}
              </div>
            </div>

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

export default QuoteForm;