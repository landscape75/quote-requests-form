import { useState } from 'react';
import { auth, storage, STATE_CHANGED } from "../lib/firebase";
import { Line, Circle } from 'rc-progress';
//import Loader from './Loader';

// Uploads images to Firebase Storage
export default function ImageUploader(props) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(null);
  //const [w, setW] = useState(250);
  //const [h, setH] = useState(150);

  // Creates a Firebase Upload Task
  const uploadFile = async (e) => {
    // Get the file
    const file = Array.from(e.target.files)[0];
    const extension = file.type.split('/')[1];

    const f = file
    await getSize(f)

    // Makes reference to the storage bucket location
    const ref = storage.ref(`uploads/photos/${Date.now()}.${extension}`);
    setUploading(true);

    // Starts the upload
    const task = ref.put(file);

    // Listen to updates to upload task
    task.on(STATE_CHANGED, (snapshot) => {
      const pct = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
      setProgress(pct);

      // Get downloadURL AFTER task resolves (Note: this is not a native Promise)
      task
        .then((d) => ref.getDownloadURL())
        .then((url) => {
          setDownloadURL(url);
          setUploading(false);
          props.passUploadUrl(url)
          
        });
    });
  };

  ////////////////////////////////////////////////

  async function getSize(input) {

      var reader = new FileReader();
      reader.onload = async function (e) {
        var img = new Image;
        img.onload = await function() {
          console.log("The width of the image is " + img.width + "px.");
          console.log("The height of the image is " + img.height + "px.");
          //setW(img.width)
          //setH(img.height)
          props.setW(150 * (img.width / img.height))
          //props.setH(150)
        };
        img.src = reader.result;
      };
      await reader.readAsDataURL(input);

  }

  ////////////////////////////////////////////////

  return (
    <div className="pt-1">
      {uploading && <Line percent={progress} strokeWidth="2" strokeColor="#029BDF" />}
      {uploading && <label className="block text-xs pt-1 font-medium text-gray-700 dark:text-gray-100">{progress}%</label>}

      {!uploading && (
        <>
          <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-mag-blue hover:text-mag-blue-400 focus-within:outline-none">
            <span>Upload Photo</span>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/x-png,image/gif,image/jpeg" onChange={uploadFile}/>
          </label>
        </>
      )}

      {/* {downloadURL && <code>{downloadURL}</code>} */}
    </div>
  );
}