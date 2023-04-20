// IMPORTS -
import React, { useState } from "react";
import { auth, googleProvider, db, storage } from "../config/firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import toast from "react-hot-toast";
import { addDoc, collection } from "firebase/firestore";
import "../styles/Auth.css";
import { ref, uploadBytes } from "firebase/storage";

const Auth = () => {
  // STATES -
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newMovie, setNewMovie] = useState("");
  const [newRelease, setnewRelease] = useState(0);
  const [fileUpload, setFileUpload] = useState(null);

  // LOGIN WITH EMAIL AND PASSWORD -
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Logged in");
    } catch (err) {
      console.error(err);
    }
  };
  console.log(auth?.currentUser);
  // LOGIN WITH GOOGLE -
  const googleHandler = async (e) => {
    e.preventDefault();

    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Logged in");
    } catch (err) {
      console.error(err);
    }
  };

  // LOGOUT -
  const SignOutHandler = async (e) => {
    e.preventDefault();

    try {
      await signOut(auth);
      toast.success("Logged out");
    } catch (err) {
      console.error(err);
    }
  };

  // ADD MOVIES -
  const movieHandler = async (e) => {
    e.preventDefault();

    try {
      if (auth?.currentUser === null) {
        toast.error("Please login to add a movie");
      } else {
        await addDoc(collection(db, "movies"), {
          title: newMovie,
          releaseDate: newRelease,
          userId: auth?.currentUser?.uid,
        });

        toast.success("Movie added");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // UPLOAD FILE -
  const setUploadHandler = async (e) => {
    e.preventDefault();

    try {
      if (!fileUpload) {
        toast.error("Please upload a file");
      } else if (auth?.currentUser === null) {
        toast.error("Please login to add a movie");
      } else {
        const filesFolder = ref(storage, `projectFolder/${fileUpload.name}`);
        await uploadBytes(filesFolder, fileUpload);
        toast.success("File uploaded");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="container-fluid auth__wrapper">
        <div className="row auth__row">
          {/* AUTH FORM */}
          <div className="col-lg auth__col">
            <form className="shadow">
              <div class="input-field">
                <input
                  id="email"
                  type="email"
                  class="validate"
                  autoComplete="off"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label for="email">Email</label>
              </div>
              <div class="input-field">
                <input
                  id="password"
                  type="password"
                  class="validate"
                  autoComplete="off"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label for="password">Password</label>
              </div>
              <div className="d-flex justify-content-around flex-wrap btn__wrapper">
                <button
                  className="btn waves-effect waves-light btn-primary"
                  type="submit"
                  name="action"
                  onClick={submitHandler}
                >
                  Sign In
                </button>
                <button
                  className="btn waves-effect waves-light btn-danger"
                  type="submit"
                  name="action"
                  onClick={googleHandler}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-google"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
                  </svg>
                </button>
                <button
                  className="btn waves-effect waves-light btn-primary"
                  type="submit"
                  name="action"
                  onClick={SignOutHandler}
                >
                  Sign Out
                </button>
              </div>
            </form>
          </div>
          {/* ADD MOVIES */}
          <div className="crud__movies col-lg auth__col">
            <form className="shadow" onSubmit={movieHandler}>
              <div class="input-field">
                <input
                  id="movie"
                  type="text"
                  autoComplete="off"
                  onChange={(e) => setNewMovie(e.target.value)}
                />
                <label for="movie">Title</label>
              </div>
              <div class="input-field">
                <input
                  id="date"
                  type="number"
                  autoComplete="off"
                  onChange={(e) => setnewRelease(e.target.value)}
                />
                <label for="date">Release date</label>
              </div>
              <div className="d-flex justify-content-around flex-wrap btn__wrapper">
                <button
                  className="btn waves-effect waves-light btn-primary"
                  type="submit"
                  name="action"
                >
                  Add movie
                </button>
              </div>
            </form>
            {/* UPLOAD FILE */}
            <div class="file-field input-field d-flex flex-column gap-3 overflow-hidden w-50">
              <div className="mt-0 pt-0 bg-warning btn text-white mb-0">
                <span>Add file</span>
                <input
                  type="file"
                  onChange={(e) => setFileUpload(e.target.files[0])}
                />
              </div>
              <div class="file-path-wrapper overflow-hidden p-0">
                <input
                  class="file-path validate"
                  type="text"
                  placeholder="Upload one or more files"
                />

                <button
                  className="btn waves-effect waves-light btn-primary mt-0 pt-0 w-100"
                  type="submit"
                  name="action"
                  onClick={setUploadHandler}
                >
                  Upload file
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
