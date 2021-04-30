import { Draggable } from "react-beautiful-dnd";

function Movie({ movie, index }) {
    return (
        <Draggable draggableId={movie.imdbID} index={index}>
            {(provided) => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    class="shadow-lg rounded-2xl border-2 border-gray-100 w-full bg-white relative overflow-hidden mb-8">
                    <img
                        alt="poster"
                        src={movie.Poster}
                        class="absolute -right-10 top-0 -bottom-8 h-full w-1/3 mb-4 object-cover"
                    />
                    <div class="w-3/4 p-4">
                        <p class="text-gray-600 text-2xl font-black">
                            {movie.Title} <span class="text-gray-400 text-xs font-medium mb-2">({movie.Year})</span>
                        </p>
                        <p class="text-gray-400 text-xs font-medium mb-2">{movie.Runtime}</p>
                        <p class="text-gray-400 text-xs mb-2">
                            Directed by <span class="font-bold">{movie.Director}</span>
                        </p>
                        <p class="text-gray-400 text-xs mb-2 line-clamp-3">{movie.Plot}</p>
                        {movie.Ratings[0] === undefined ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-200 text-gray-800">
                                n/a
                            </span>
                        ) : (
                            Rating(parseFloat(movie.Ratings[0].Value).toFixed(1))
                        )}
                    </div>
                </div>
            )}
        </Draggable>
    );
}

const Rating = (rating) =>
    rating >= 7.0 ? (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-200 text-indigo-800">
            {rating}
        </span>
    ) : rating >= 4.0 ? (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-200 text-yellow-800">
            {rating}
        </span>
    ) : (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-200 text-red-800">
            {rating}
        </span>
    );
export default Movie;
