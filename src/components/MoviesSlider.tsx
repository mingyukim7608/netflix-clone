import { motion, AnimatePresence, Variants } from "framer-motion";
import styled from "styled-components";
import { useState } from "react";
import { fetchMovieDetail } from "../API";
import Loader from "./Loader";
import { getImagePath } from "../utils";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { IMovie, TMovieState } from "../types";

const SliderWrapper = styled.div`
  position: relative;
  height: 200px;
  margin-bottom: 20px;
`;

const StateTitle = styled.h2`
  font-size: 30px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  position: absolute;
  width: 100%;
  top: 50px;
`;

const SliderItem = styled(motion.div)<{ $posterPath: string }>`
  background-color: ${(props) => props.theme.black.lighter};
  background-image: url(${(props) => props.$posterPath});
  background-size: cover;
  background-position: center center;
  height: 150px;
  cursor: pointer;
  position: relative;
`;

const MovieInfoBox = styled(motion.div)`
  display: none;
  opacity: 0;
  padding: 20px;
  background-color: ${(props) => props.theme.black.lighter};

  width: 100%;
  box-sizing: border-box;
  margin-top: 150px;

  h4 {
    text-align: center;
  }
  p {
    margin-top: 10px;
    font-size: 12px;
  }
`;

const NextPageArrow = styled(motion.div)`
  width: 40px;
  height: 150px;
  cursor: pointer;

  position: absolute;

  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  font-weight: 500;
  z-index: 2;
  top: 50px;
`;

const PrevPageArrow = styled(motion.div)`
  width: 40px;
  height: 150px;
  cursor: pointer;

  position: absolute;
  top: auto;
  bottom: auto;
  left: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  font-weight: 500;
  top: 50px;
  z-index: 2;
`;

export default function MoviesSlider({
  movies,
  movieState,
}: {
  movies?: IMovie[];
  movieState: TMovieState;
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [sliderPage, setSliderPage] = useState(0);
  const [isPageGoingForward, setIsPageGoingForward] = useState(true);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const moviesPerSliderPage = 6;
  const increaseSliderPage = () => {
    if (isAnimating) return;
    if (movies) {
      const totalMoviesInSlider = movies.length - 1;
      const lastSliderPage =
        Math.floor(totalMoviesInSlider / moviesPerSliderPage) - 1;
      setIsPageGoingForward(true);
      setSliderPage(sliderPage === lastSliderPage ? 0 : sliderPage + 1);
      setIsAnimating(true);
      return;
    }
  };
  const decreaseSliderPage = () => {
    if (isAnimating) return;
    if (movies) {
      const totalMoviesInSlider = movies.length - 1;
      const lastSliderPage =
        Math.floor(totalMoviesInSlider / moviesPerSliderPage) - 1;
      setIsPageGoingForward(false);
      setSliderPage(sliderPage === 0 ? lastSliderPage : sliderPage - 1);
      setIsAnimating(true);
      return;
    }
  };
  const prefetchMovieDetail = (movieId: number) => {
    queryClient.prefetchQuery({
      queryKey: ["movies", movieId.toString()],
      queryFn: () => fetchMovieDetail(movieId),
    });
  };

  const handleSliderElementClick = (movieId: number) => {
    navigate(`/movies/${movieId}?movieState=${movieState}`);
  };

  const rowVariants: Variants = {
    initial: (isPageGoingForward) => ({
      x: isPageGoingForward
        ? window.outerWidth + 10
        : -(window.outerWidth + 10),
    }),
    animate: { x: 0 },
    exit: (isPageGoingForward) => ({
      x: isPageGoingForward
        ? -(window.outerWidth + 10)
        : window.outerWidth + 10,
    }),
  };

  const sliderItemVariants: Variants = {
    whileHover: {
      scale: 1.3,
      y: -50,
      transition: { type: "tween", delay: 0.3 },
      zIndex: 1,
    },
  };

  const movieInfoBoxVariants: Variants = {
    whileHover: {
      display: "block",
      opacity: 1,
      transition: {
        delay: 0.3,
      },
    },
  };

  return (
    <SliderWrapper>
      <StateTitle>{movieState}</StateTitle>
      <AnimatePresence
        initial={false}
        onExitComplete={() => setIsAnimating(false)}
        custom={isPageGoingForward}
      >
        <Row
          key={sliderPage}
          variants={rowVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          custom={isPageGoingForward}
          transition={{ type: "tween", duration: 0.5 }}
        >
          {movies ? (
            movies
              .slice(1)
              .slice(
                moviesPerSliderPage * sliderPage,
                moviesPerSliderPage * (sliderPage + 1)
              )
              .map((movie, index) => (
                <SliderItem
                  key={movieState + movie.id.toString()}
                  $posterPath={getImagePath(movie.poster_path, "w342")}
                  variants={sliderItemVariants}
                  initial="initial"
                  whileHover="whileHover"
                  transition={{ type: "tween", duration: 0.2 }}
                  onClick={() => handleSliderElementClick(movie.id)}
                  onMouseOver={() => prefetchMovieDetail(movie.id)}
                  layoutId={movieState + movie.id.toString()}
                  style={{
                    originX:
                      index === 0
                        ? 0
                        : index === moviesPerSliderPage - 1
                        ? 1
                        : 0.5,
                  }}
                >
                  <MovieInfoBox variants={movieInfoBoxVariants}>
                    <h4>{movie.title}</h4>
                    <p>{movie.overview.slice(0, 100) + "..."}</p>
                  </MovieInfoBox>
                </SliderItem>
              ))
          ) : (
            <Loader />
          )}
        </Row>
      </AnimatePresence>
      <NextPageArrow onClick={increaseSliderPage}>&rarr;</NextPageArrow>
      <PrevPageArrow onClick={decreaseSliderPage}>&larr;</PrevPageArrow>
    </SliderWrapper>
  );
}
