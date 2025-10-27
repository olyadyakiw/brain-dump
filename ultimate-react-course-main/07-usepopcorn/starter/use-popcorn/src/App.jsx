import { useEffect, useState } from 'react'

import StarRating from './components/StarRating'

const tempMovieData = [
    {
        imdbID: 'tt1375666',
        Title: 'Inception',
        Year: '2010',
        Poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
    },
    {
        imdbID: 'tt0133093',
        Title: 'The Matrix',
        Year: '1999',
        Poster: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
    },
    {
        imdbID: 'tt6751668',
        Title: 'Parasite',
        Year: '2019',
        Poster: 'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg',
    },
]

const tempWatchedData = [
    {
        imdbID: 'tt1375666',
        Title: 'Inception',
        Year: '2010',
        Poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
        runtime: 148,
        imdbRating: 8.8,
        userRating: 10,
    },
    {
        imdbID: 'tt0088763',
        Title: 'Back to the Future',
        Year: '1985',
        Poster: 'https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
        runtime: 116,
        imdbRating: 8.5,
        userRating: 9,
    },
]

function Logo() {
    return (
        <div className="logo">
            <span role="img">🍿</span>
            <h1>usePopcorn</h1>
        </div>
    )
}

function Search({ query, setQuery }) {
    return (
        <input
            className="search"
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={e => setQuery(e.target.value)}
        />
    )
}

function NumResults({ movies }) {
    return (
        <p className="num-results">
            Found <strong>{movies.length}</strong> results
        </p>
    )
}

function Navbar({ children }) {
    return (
        <nav className="nav-bar">
            <Logo />
            {children}
        </nav>
    )
}

function Main({ children }) {
    return <main className="main">{children}</main>
}

const average = arr => arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0)

const KEY = 'be7a2e1b'

export default function App() {
    const [movies, setMovies] = useState([])
    const [watched, setWatched] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [query, setQuery] = useState('inception')
    const [selectedId, setSelectedId] = useState(null)

    const tempQuery = 'interstellar'

    // useEffect(function () {
    //     console.log('initial render')
    // }, [])

    // useEffect(function () {
    //     console.log('every render')
    // })

    // useEffect(
    //     function () {
    //         console.log('D')
    //     },
    //     [query]
    // )

    // console.log('during')

    function handleSelectMovie(id) {
        setSelectedId(selectedId => (id === selectedId ? null : id))
    }

    function handleCLoseMovie() {
        setSelectedId(null)
    }

    function handleAddWatched(movie) {
        setWatched(watched => [...watched, movie])
    }

    function handleDeleteWatched(id) {
        setWatched(watched => watched.filter(movie => movie.imdbID !== id))
    }

    useEffect(
        function () {
            async function fetchMovies() {
                try {
                    setIsLoading(true)
                    setError('')
                    const res = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${KEY}`)

                    if (!res.ok) throw new Error('Something went wrong with fwtching movies')

                    const data = await res.json()
                    if (data.Response === 'False') throw new Error('Movie not found!')
                    setMovies(data.Search)
                } catch (err) {
                    setError(err.message)
                } finally {
                    setIsLoading(false)
                }
            }
            if (query.length < 3) {
                setMovies([])
                setError('')
                return
            }
            fetchMovies()
        },
        [query]
    )

    return (
        <>
            <Navbar>
                <Search query={query} setQuery={setQuery} />
                <NumResults movies={movies} />
            </Navbar>

            <Main>
                <Box>
                    {isLoading && <Loader />}
                    {!isLoading && !error && <MovieList movies={movies} onSelectMovie={handleSelectMovie} />}
                    {error && <ErrorMessage message={error} />}
                </Box>

                <Box>
                    {selectedId ? (
                        <MovieDetails
                            onAddWatched={handleAddWatched}
                            onCloseMovie={handleCLoseMovie}
                            selectedId={selectedId}
                            watched={watched}
                        />
                    ) : (
                        <>
                            <WatchedSummary watched={watched} />
                            <WatchedMovieList onDeleteWatched={handleDeleteWatched} watched={watched} />
                        </>
                    )}
                </Box>
            </Main>
        </>
    )

    // const [movieRating, setMovieRating] = useState(0)

    // return (
    //     <div>
    //         <StarRating
    //             maxRating={5}
    //             color="red"
    //             messages={['Terrible', 'Bad', 'Okay', 'Good', 'Amazing']}
    //             onSetRating={setMovieRating}
    //         />
    //         <p>My score is {movieRating}</p>
    //     </div>
    // )
}

function Loader() {
    return <p className="loader">Loading...</p>
}

function ErrorMessage({ message }) {
    return (
        <p className="error">
            <span>❌</span> {message}
        </p>
    )
}

function Box({ children }) {
    const [isOpen, setIsOpen] = useState(true)

    return (
        <div className="box">
            <button className="btn-toggle" onClick={() => setIsOpen(open => !open)}>
                {isOpen ? '–' : '+'}
            </button>
            {isOpen && children}
        </div>
    )
}

// function WatchedBox() {
//     const [isOpen2, setIsOpen2] = useState(true)

//     return (
//         <div className="box">
//             <button className="btn-toggle" onClick={() => setIsOpen2(open => !open)}>
//                 {isOpen2 ? '–' : '+'}
//             </button>
//             {isOpen2 && (
//                 <>
//                     <WatchedSummary watched={watched} />
//                     <WatchedMovieList watched={watched} />
//                 </>
//             )}
//         </div>
//     )
// }

function MovieList({ movies, onSelectMovie }) {
    return (
        <ul className="list list-movies">
            {movies?.map(movie => (
                <Movie key={movie.imdbID} movie={movie} onSelectMovie={onSelectMovie} />
            ))}
        </ul>
    )
}

function Movie({ movie, onSelectMovie }) {
    return (
        <li onClick={() => onSelectMovie(movie.imdbID)} key={movie.imdbID}>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <h3>{movie.Title}</h3>
            <div>
                <p>
                    <span>🗓</span>
                    <span>{movie.Year}</span>
                </p>
            </div>
        </li>
    )
}

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
    const [movie, setMovie] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [userRating, setUserRating] = useState(0)

    const isWatched = watched.map(movie => movie.imdbID).includes(selectedId)
    const watchedUserRating = watched.find(movie => movie.imdbID === selectedId)?.userRating

    const {
        Title: title,
        Poster: poster,
        Year: year,
        Runtime: runtime,
        imdbRating,
        Plot: plot,
        Released: released,
        Actors: actors,
        Director: director,
        Genre: genre,
    } = movie

    function handleAdd() {
        const newWatchedMovie = {
            imdbID: selectedId,
            title,
            year,
            poster,
            imdbRating: Number(imdbRating),
            runtime: Number(runtime.split(' ').at(0)),
            userRating,
        }
        onAddWatched(newWatchedMovie)
        onCloseMovie()
    }

    useEffect(
        function () {
            async function getMovieDetails() {
                setIsLoading(true)
                const res = await fetch(`https://www.omdbapi.com/?i=${selectedId}&apikey=${KEY}`)
                const data = await res.json()
                setMovie(data)
                setIsLoading(false)
            }
            getMovieDetails()
        },
        [selectedId]
    )
    return (
        <div className="details">
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <header>
                        <button className="btn-back" onClick={onCloseMovie}>
                            ←
                        </button>
                        <img src={poster} alt={`Poster of ${movie}`} />
                        <div className="details-overview">
                            <h2>{title}</h2>
                            <p>
                                {released} - {runtime}
                            </p>
                            <p>{genre}</p>
                            <p>
                                <span>⭐️</span>
                                {imdbRating} IMDb rating
                            </p>
                        </div>
                    </header>
                    <section>
                        <div className="rating">
                            {!isWatched ? (
                                <>
                                    <StarRating maxRating={10} size={24} onSetRating={setUserRating} />
                                    {userRating > 0 && (
                                        <button className="btn-add" onClick={handleAdd}>
                                            + Add to list
                                        </button>
                                    )}
                                </>
                            ) : (
                                <p>Your rated with movie ⭐️{watchedUserRating}</p>
                            )}
                        </div>
                        <p>
                            <em>{plot}</em>
                        </p>
                        <p>Starring {actors}</p>
                        <p>Directed by {director}</p>
                    </section>
                </>
            )}
        </div>
    )
}

function WatchedSummary({ watched }) {
    const avgImdbRating = average(watched.map(movie => movie.imdbRating))
    const avgUserRating = average(watched.map(movie => movie.userRating))
    const avgRuntime = average(watched.map(movie => movie.runtime))

    return (
        <div className="summary">
            <h2>Movies you watched</h2>
            <div>
                <p>
                    <span>#️⃣</span>
                    <span>{watched.length} movies</span>
                </p>
                <p>
                    <span>⭐️</span>
                    <span>{avgImdbRating}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{avgUserRating}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{avgRuntime} min</span>
                </p>
            </div>
        </div>
    )
}

function WatchedMovieList({ watched, onDeleteWatched }) {
    return (
        <ul className="list">
            {watched.map(movie => (
                <WatchedMovie key={movie.imdbID} movie={movie} onDeleteWatched={onDeleteWatched} />
            ))}
        </ul>
    )
}

function WatchedMovie({ movie, onDeleteWatched }) {
    return (
        <li key={movie.imdbID}>
            <img src={movie.poster} alt={`${movie.title} poster`} />
            <h3>{movie.title}</h3>
            <div>
                <p>
                    <span>⭐️</span>
                    <span>{movie.imdbRating.toFixed(2)}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{movie.userRating.toFixed(2)}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{movie.runtime} min</span>
                </p>
                <button className="btn-delete" onClick={() => onDeleteWatched(movie.imdbID)}>
                    X
                </button>
            </div>
        </li>
    )
}
