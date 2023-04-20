// IMPORTS -
import React, { useEffect, useState } from "react";
import "../styles/Movies.css";
import { auth, db } from "../config/firebase-config";
import {
  getDocs,
  collection,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import toast from "react-hot-toast";

const Movies = () => {
  // STATES -
  const [movieList, setMovieList] = useState([]);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    let mount = true;
    const getMovieList = async () => {
      try {
        const data = await getDocs(collection(db, "movies"));
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setMovieList(filteredData);

        mount = false;
      } catch (err) {
        console.error(err);
      }
    };

    if (mount) {
      getMovieList();
    }
  }, [movieList]);

  // DELETE MOVIE -
  const deleteMovie = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await deleteDoc(movieDoc);
    toast.success("Movie deleted");
  };

  // UPDATE MOVIE -
  const updateMovieTitle = async (movieID) => {
    const movieDoc = doc(db, "movies", movieID);
    await updateDoc(movieDoc, { title: newTitle });
    toast.success("Movie updated");
  };

  return (
    <>
      <div className="container-fluid movies__wrapper">
        <div className="row movies__row__wrapper">
          <div className="col-md movies__col__wrapper">
            {/* FETCHING DATA */}
            {auth?.currentUser &&
              movieList?.map((item) => {
                return (
                  <div className="card__check card p-3 w-50 bg-secondary text-white d-flex flex-wrap shadow">
                    <h3>
                      Title: {item.title} - {item.releaseDate}
                    </h3>
                    <div>
                      <button
                        className="btn btn-danger"
                        type="submit"
                        onClick={() => deleteMovie(item.id)}
                      >
                        delete
                      </button>
                    </div>

                    <div>
                      <input
                        id="email"
                        type="email"
                        class="validate text-white"
                        autoComplete="off"
                        placeholder="New title"
                        onChange={(e) => setNewTitle(e.target.value)}
                      />
                      <button
                        className="btn btn-danger"
                        type="submit"
                        onClick={() => updateMovieTitle(item.id)}
                      >
                        Update
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Movies;
