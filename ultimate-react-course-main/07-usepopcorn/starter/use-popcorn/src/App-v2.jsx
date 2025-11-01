import { useEffect, useRef, useState } from 'react'

import StarRating from './components/StarRating'
import { useMovies } from './useMovies'
import { useLocalStorageState } from './useLocalStorageState'
import { useKey } from './useKey'

const KEY = 'be7a2e1b'

function Logo() {
    return (
        <div className="logo">
            <span role="img">🍿</span>
            <h1>usePopcorn</h1>
        </div>
    )
}

function Search({ query, setQuery }) {
    // useEffect(function () {
    //     const el = document.querySelector('.search')
    //     console.log(el)
    //     el.focus()
    // }, [])

    const inputEl = useRef(null)

    useKey('Enter', function () {
        if (document.activeElement === inputEl.current) return
        inputEl.current.focus()
        setQuery('')
    })

    return (
        <input
            ref={inputEl}
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

// const average = arr => arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0)
const average = arr => (arr.length ? arr.reduce((acc, cur) => acc + cur, 0) / arr.length : 0)

export default function App() {
    const [query, setQuery] = useState('')
    const [selectedId, setSelectedId] = useState(null)

    const { movies, isLoading, error } = useMovies(query)
    const [watched, setWatched] = useLocalStorageState([], [])

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

    const countRef = useRef(0)
    let count = 0

    useEffect(
        function () {
            if (userRating) countRef.current++
        },
        [userRating]
    )

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

    // if (imdbRating > 8) [isTop, setIsStop] = useState(true)
    // if (imdbRating > 8) return <p>Greatest ever!</p>

    // const [isTop, setIsTop] = useState(true)
    // console.log(isTop)
    // useEffect(
    //     function () {
    //         setIsTop(Number(imdbRating) > 8)
    //     },
    //     [imdbRating]
    // )
    // console.log(isTop)

    const [avgRating, setAvgRating] = useState(0)

    function handleAdd() {
        const newWatchedMovie = {
            imdbID: selectedId,
            title,
            year,
            poster,
            imdbRating: Number(imdbRating),
            runtime: Number(runtime.split(' ').at(0)),
            userRating,
            countRatingDecisions: countRef.current,
            count,
        }
        onAddWatched(newWatchedMovie)
        onCloseMovie()
        // setAvgRating(Number(imdbRating))
        // setAvgRating(avgRating => (avgRating + userRating) / 2)
    }

    useKey('Escape', onCloseMovie)

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

    useEffect(
        function () {
            if (!title) return
            document.title = `Movie | ${title}`
            return () => {
                document.title = 'usePopcorn'
            }
        },
        [title]
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
                    {/* <p>{avgRating}</p> */}
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
            {watched.map((movie, i) => (
                <WatchedMovie key={movie.imdbID + i} movie={movie} onDeleteWatched={onDeleteWatched} />
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
                    <span>{movie.imdbRating?.toFixed(2) ?? '—'}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{movie.userRating?.toFixed(2) ?? '—'}</span>
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
