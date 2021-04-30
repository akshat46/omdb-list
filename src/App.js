import logo from "./logo.svg";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import "./App.css";
import Movie from "./components/table";
import { useState, useCallback } from "react";

const API_CALL = "http://www.omdbapi.com/?apikey=95aea5b8&type=movie&";
const COLUMNS = { MYLIST: "my-list", DATABASE: "movie-database" };

function App() {
    const [data, setData] = useState([]);
    const [myList, setMyList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    function fetchMovies(str) {
        setIsLoading(true);
        setData([]);
        fetch(API_CALL + "s=" + str)
            .then((response) => response.json())
            // promises[list] with async task: api calls for each movie's details
            .then((response) => {
                if (!response.Search) throw new Error("no matching results");
                return response.Search.map(
                    async (movie) => await fetch(API_CALL + "i=" + movie.imdbID)
                );
            })
            .then((promises) =>
                Promise.all(promises)
                    // promises[list] with async task: each response to json
                    .then((response) => response.map(async (res) => await res.json().then(data)))
                    // set data after all promises resolved
                    .then((promisesJSON) =>
                        Promise.all(promisesJSON).then((result) => setData(result))
                    )
                    .finally(setIsLoading(false))
            )
            .catch((e) => {
                console.log("Error:", e);
                setIsLoading(false);
            });
    }
    const onDragEnd = ({ destination, source }) => {
        console.log("destination: ", destination);
        if (
            !destination ||
            (destination.droppableId === source.droppableId && destination.index === source.index)
        )
            return;

        let newData = Array.from(data);
        let newMyList = Array.from(myList);
        if (source.droppableId === COLUMNS.DATABASE && destination.droppableId === COLUMNS.MYLIST) {
            // dragging from database list to my list
            // if (myList.filter((movie) => movie.imdbID === data[source.index]).length > 0) return;
            newData.splice(source.index, 1);
            newMyList.splice(destination.index, 0, data[source.index]);
            setData(newData);
            setMyList(newMyList);
            return;
        }
        if (source.droppableId === COLUMNS.MYLIST) {
            if (destination.droppableId === COLUMNS.MYLIST) {
                // dragging from my list to my list
                newMyList.splice(source.index, 1);
                newMyList.splice(destination.index, 0, myList[source.index]);
                setMyList(newMyList);
                return;
            } else {
                newMyList.splice(source.index, 1);
                setMyList(newMyList);
                return;
            }
        }
    };
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="max-w-6xl flex items-start m-auto mt-4">
                <div className="flex-1 border-2 rounded-md border-green-400 p-8">
                    <p class="text-gray-800 text-4xl font-black mb-4 text-green-400">My List</p>
                    <Droppable droppableId={COLUMNS.MYLIST}>
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
                <div className="p-8 flex-1">
                    <p class="text-gray-800 text-4xl font-black mb-4 text-indigo-600">
                        Movie Database
                    </p>
                    <input
                        type="text"
                        className="rounded-lg mb-4 border-transparent appearance-none border border-gray-300 py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                        placeholder="Search Movie"
                        onKeyPress={(e) => {
                            if (e.key === "Enter") fetchMovies(e.target.value);
                        }}
                    />
                    {isLoading ? (
                        <p class="text-indigo-400 text-md font-medium mb-2">Loading...</p>
                    ) : (
                        <Droppable droppableId={COLUMNS.DATABASE}>
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {data.map((m, i) => (
                                        <Movie movie={m} index={i} key={m.imdbID} />
                                    ))}
                                </div>
                            )}
                        </Droppable>
                    )}
                </div>
            </div>
        </DragDropContext>
    );
}

export default App;
//<Movie movie={m} index={i} key={m.imdbID} />
