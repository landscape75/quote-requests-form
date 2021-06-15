import { useState } from "react";
import { auth, storage, STATE_CHANGED } from "../lib/firebase";
import { Line, Circle } from "rc-progress";

export default function FileUploader(props) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (e) => {

    const file = Array.from(e.target.files)[0];
    const extension =  file.type.split("/")[1];
    const fname = file.name

    const f = file;
    //await getSize(f);

    // Makes reference to the storage bucket location
    const ref = storage.ref(`uploads/quotes/${props.folder}/${fname}-${Date.now()}.${extension}`);
    setUploading(true);

    // Starts the upload
    const task = ref.put(file);

    // Listen to updates to upload task
    task.on(STATE_CHANGED, (snapshot) => {
      const pct = (
        (snapshot.bytesTransferred / snapshot.totalBytes) *
        100
      ).toFixed(0);
      setProgress(pct);

      // Get downloadURL AFTER task resolves (Note: this is not a native Promise)
      task
        .then((d) => ref.getDownloadURL())
        .then((url) => {
          setUploading(false);
          props.addFile(fname, url);
        });
    });
  };

  ////////////////////////////////////////////////

  return (
    <div className="pt-0">
      {uploading && (
        <Line percent={progress} strokeWidth="1" strokeColor="#029BDF" />
      )}
      {uploading && (
        <label className="block text-xs pt-1 font-medium text-gray-700 dark:text-gray-100">
          {progress}%
        </label>
      )}

      {!uploading && (
        <>
          <label
            htmlFor="file-upload"
            className="relative cursor-pointer text-sm bg-transparent rounded-md font-medium text-mag-blue hover:text-mag-blue-400 focus-within:outline-none"
          >
            <span>{props.title}</span>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only text-white mt-2"
              accept="image/x-png,image/gif,image/jpeg,image/jpg, application/pdf, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={uploadFile}
            />
          </label>
        </>
      )}
    </div>
  );
}
