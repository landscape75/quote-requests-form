import { useCollection } from "react-firebase-hooks/firestore";
import { firestore } from "../lib/firebase";

export default function SigItems(props) {
  const [value, loading, error] = useCollection(
    firestore.collection("sigs").orderBy("createdAt", "desc").limit(100),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  //console.log(value?.docs)
  const sigs = value; //|| props.value

  return (
    <div id="sig-list">
      <p>
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && (
          <span className="flex-1 px-3 py-1 text-md truncate text-gray-900 dark:text-white font-bold">
            Loading signatures...
          </span>
        )}
      </p>
      {sigs && (
        <ul className="fadein mt-3 grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-3">
          {sigs.docs.map((doc) => (
            <li
              id={doc.id}
              key={doc.id}
              className="col-span-1 flex shadow-sm rounded-md cursor-pointer"
              onClick={() => props.loadSavedSig(doc.id)}
            >
              {doc.data().noSig &&
                <div className="flex-shrink-0 flex items-center justify-center w-16 bg-yellow-600 text-white text-lg font-bold rounded-l-md">
                  {doc.data().truckNumber}
                </div>
              }
              {!doc.data().noSig &&
                <div className="flex-shrink-0 flex items-center justify-center w-16 bg-mag-blue text-white text-lg font-bold rounded-l-md">
                  {doc.data().truckNumber}
                </div>
              }         
              
              <div tabIndex="0" className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-300 dark:border-gray-500 bg-gray-50 hover:bg-gray-100 focus:bg-gray-200 dark:bg-mag-grey dark:hover:bg-mag-grey-400 dark:focus:bg-mag-grey-300 rounded-r-md truncate focus:outline-none">
                <div className="flex-1 px-3 py-1 text-md truncate text-gray-900 dark:text-white font-bold">
                  {doc.data(0).orderNumber}
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {doc.data().customerName}
                  </p>
                </div>
                <div className="flex-shrink-0 pr-2">
                  <button
                    className="w-8 h-8 inline-flex items-center justify-center text-gray-400 rounded-full bg-transparent hover:text-mag-blue focus:outline-none"
                    onClick={() => props.deleteSig(doc.id)}
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
