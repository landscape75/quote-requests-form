import { useCollection } from 'react-firebase-hooks/firestore';
import { firestore } from '../lib/firebase';

export default function SigItems() {
    const [value, loading, error] = useCollection(
      firestore.collection('sigs'),
      {
        snapshotListenOptions: { includeMetadataChanges: true },
      }
    );
    //console.log(value?.docs)
    const sigs = value //|| props.value

    return (
      <div id="fsdfsdfs5fds54fds54f">
        <p>
          {error && <strong>Error: {JSON.stringify(error)}</strong>}
          {loading && <span className="flex-1 px-3 py-1 text-md truncate text-gray-900 dark:text-white font-bold">Loading signatures...</span>}
        </p>
          {sigs && (
            <ul className="fadein mt-3 grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-3">
              {sigs.docs.map((doc) => (
                <li id={doc.id} key={doc.id} className="col-span-1 flex shadow-sm rounded-md">
                <div className="flex-shrink-0 flex items-center justify-center w-16 bg-yellow-600 text-white text-lg font-bold rounded-l-md">
                  {doc.data().truckNumber}
                </div>
                <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-300 dark:border-gray-500 bg-white dark:bg-mag-grey rounded-r-md truncate">
                  <div className="flex-1 px-3 py-1 text-md truncate text-gray-900 dark:text-white font-bold">
                    {doc.data(0).orderNumber}
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {doc.data().customerName}
                    </p>
                  </div>
                  <div className="flex-shrink-0 pr-2">
                    <button
                      className="w-8 h-8 bg-white dark:bg-mag-grey inline-flex items-center justify-center text-gray-400 rounded-full bg-transparent hover:text-gray-500 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-gray-500"
                      onClick={() => loadSavedSig(doc.id)}
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
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
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
  };