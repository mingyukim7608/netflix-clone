import styled from "styled-components";
import { useMoviesQuery } from "../API";
import Loader from "../components/Loader";
import { getImagePath } from "../utils";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Outlet, useMatch, useParams } from "react-router-dom";
import Slider from "../components/MoviesSlider";

const Wrapper = styled.div``;
const Banner = styled.div<{ $backdropImgPath: string }>`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8)),
    url(${(props) => props.$backdropImgPath});
  background-size: cover;
  box-sizing: border-box;
  cursor: pointer;
`;

const Title = styled.h2`
  font-size: 50px;
  margin-bottom: 30px;
`;

const Overview = styled.p`
  font-size: 20px;
  width: 600px;
`;

const Overlay = styled(motion.div)`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
`;

export default function Movies() {
  const nowPlayingMoviesQuery = useMoviesQuery("now_playing");
  const popularMoviesQuery = useMoviesQuery("popular");
  const topRatedMoviesQuery = useMoviesQuery("top_rated");
  const upcomingMoviesQuery = useMoviesQuery("upcoming");

  const navigate = useNavigate();

  const movieDetailsMatch = useMatch("/movies/:movieId");

  const goBackToMovies = () => {
    navigate("/movies");
  };

  return (
    <Wrapper>
      {nowPlayingMoviesQuery.data ? (
        <>
          <Banner
            $backdropImgPath={getImagePath(
              nowPlayingMoviesQuery.data.results[0].backdrop_path || ""
            )}
            onClick={() => {
              navigate(`/movies/${nowPlayingMoviesQuery.data.results[0].id}`);
            }}
          >
            <Title>{nowPlayingMoviesQuery.data.results[0].title}</Title>
            <Overview>
              {nowPlayingMoviesQuery.data.results[0].overview}
            </Overview>
          </Banner>

          <Slider
            movies={nowPlayingMoviesQuery.data?.results}
            movieState="now_playing"
          />
          <Slider
            movies={popularMoviesQuery.data?.results}
            movieState="popular"
          />
          <Slider
            movies={topRatedMoviesQuery.data?.results}
            movieState="top_rated"
          />
          <Slider
            movies={upcomingMoviesQuery.data?.results}
            movieState="upcoming"
          />

          <AnimatePresence>
            {movieDetailsMatch ? (
              <>
                <Overlay
                  onClick={goBackToMovies}
                  initial={{ backgroundColor: "rgba(0,0,0,0)" }}
                  animate={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                  exit={{ backgroundColor: "rgba(0,0,0,0)" }}
                />
              </>
            ) : null}
          </AnimatePresence>
        </>
      ) : (
        <Loader />
      )}
      <Outlet />
    </Wrapper>
  );
}
