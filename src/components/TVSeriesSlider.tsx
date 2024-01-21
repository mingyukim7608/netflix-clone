import { motion, AnimatePresence, Variants } from "framer-motion";
import styled from "styled-components";
import { useState } from "react";
import { fetchTVSeriesDetail } from "../API";
import Loader from "./Loader";
import { getImagePath } from "../utils";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ITVSeries, TTVSeriesState } from "../types";

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
  cursor: pointer;
  height: 150px;
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
  z-index: 100;
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
`;

export default function MoviesSlider({
  tvSeries,
  tvSeriesState,
}: {
  tvSeries?: ITVSeries[];
  tvSeriesState: TTVSeriesState;
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [sliderPage, setSliderPage] = useState(0);
  const [isPageGoingForward, setIsPageGoingForward] = useState(true);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const tvSeriesPerSliderPage = 6;
  const increaseSliderPage = () => {
    if (isAnimating) return;
    if (tvSeries) {
      const totalTVSeriesInSlider = tvSeries.length - 1;
      const lastSliderPage =
        Math.floor(totalTVSeriesInSlider / tvSeriesPerSliderPage) - 1;
      setIsPageGoingForward(true);
      setSliderPage(sliderPage === lastSliderPage ? 0 : sliderPage + 1);
      setIsAnimating(true);
      return;
    }
  };
  const decreaseSliderPage = () => {
    if (isAnimating) return;
    if (tvSeries) {
      const totalTVSeriesInSlider = tvSeries.length - 1;
      const lastSliderPage =
        Math.floor(totalTVSeriesInSlider / tvSeriesPerSliderPage) - 1;
      setIsPageGoingForward(false);
      setSliderPage(sliderPage === 0 ? lastSliderPage : sliderPage - 1);
      setIsAnimating(true);
      return;
    }
  };
  const prefetchTVSeriesDetail = (tvSeriesId: number) => {
    queryClient.prefetchQuery({
      queryKey: ["tvSeries", tvSeriesId.toString()],
      queryFn: () => fetchTVSeriesDetail(tvSeriesId),
    });
  };

  const handleSliderElementClick = (tvSeriesId: number) => {
    navigate(`/tvSeries/${tvSeriesId}?tvSeriesState=${tvSeriesState}`);
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
      <StateTitle>{tvSeriesState}</StateTitle>
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
          {tvSeries ? (
            tvSeries
              .slice(1)
              .slice(
                tvSeriesPerSliderPage * sliderPage,
                tvSeriesPerSliderPage * (sliderPage + 1)
              )
              .map((tvSeries, index) => (
                <SliderItem
                  key={tvSeriesState + tvSeries.id.toString()}
                  $posterPath={getImagePath(tvSeries.poster_path, "w342")}
                  variants={sliderItemVariants}
                  initial="initial"
                  whileHover="whileHover"
                  transition={{ type: "tween", duration: 0.2 }}
                  onClick={() => handleSliderElementClick(tvSeries.id)}
                  onMouseOver={() => prefetchTVSeriesDetail(tvSeries.id)}
                  layoutId={tvSeriesState + tvSeries.id.toString()}
                  style={{
                    originX:
                      index === 0
                        ? 0
                        : index === tvSeriesPerSliderPage - 1
                        ? 1
                        : 0.5,
                  }}
                >
                  <MovieInfoBox variants={movieInfoBoxVariants}>
                    <h4>{tvSeries.name}</h4>
                    <p>{tvSeries.overview.slice(0, 100) + "..."}</p>
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
