import logo from "./logo.svg";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import "./App.css";
import Movie from "./components/table";
import { useState } from "react";

const apiKey = "http://www.omdbapi.com/?apikey=95aea5b8&type=movie&";

function App() {
    const [data, setData] = useState([]);
    const [myList, setMyList] = useState([]);
    const [loading, setLoading] = useState(false);
    function fetchMovies(str) {
        setLoading(true);
        setData([]);
        fetch(apiKey + "s=" + str)
            .then((response) => response.json())
            // promises[list] with async task: api calls for each movie's details
            .then((response) => response.Search.map(async (movie) => await fetch(apiKey + "i=" + movie.imdbID)))
            .then((promises) =>
                Promise.all(promises)
                    // promises[list] with async task: each response to json
                    .then((response) => response.map(async (res) => await res.json().then(data)))
                    // set data after all promises resolved
                    .then((promisesJSON) => Promise.all(promisesJSON).then((result) => setData(result)))
            )
            .finally(setLoading(false))
            .catch((e) => {
                console.log("Error:", e);
            });
    }
    const onDragEnd = useCallback(() => {
        // the only one that is required
    }, []);
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="max-w-6xl grid grid-cols-5 gap-4 m-auto mt-4">
                <div className="col-span-2 border-2 rounded-md border-green-400 p-8">
                    <p class="text-gray-800 text-4xl font-black mb-4 text-green-400">My List</p>
                    <Droppable droppableId="my-list">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {myList.map((m, i) => (
                                    <Movie movie={m} index={i} />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
                <div className="p-8 col-span-3" key="movie-database">
                    <p class="text-gray-800 text-4xl font-black mb-4 text-indigo-600">Movie Database</p>
                    <input
                        type="text"
                        className="rounded-lg mb-4 border-transparent appearance-none border border-gray-300 py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                        placeholder="Search Movie"
                        onKeyPress={(e) => {
                            if (e.key === "Enter") fetchMovies(e.target.value);
                        }}
                    />
                    <Droppable droppableId="movie-database">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {data.map((m, i) => (
                                    <Movie movie={m} index={i} key={m.imdbID} />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            </div>
        </DragDropContext>
    );
}

export default App;
//<Movie movie={m} index={i} key={m.imdbID} />
