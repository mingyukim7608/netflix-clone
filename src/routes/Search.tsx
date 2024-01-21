import { useMatch, useNavigate, useSearchParams } from "react-router-dom";
import { useInfiniteSearchQuery } from "../API";
import {
  motion,
  Variants,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import styled from "styled-components";
import Loader from "../components/Loader";
import { getImagePath } from "../utils";
import { useQueryClient } from "@tanstack/react-query";
import { fetchMovieDetail, fetchTVSeriesDetail } from "../API";
import { Outlet } from "react-router-dom";
import { Fragment } from "react";

const Wrapper = styled.div`
  width: 100vw;
  box-sizing: border-box;
  margin-top: 100px;
  color: ${(props) => props.theme.white.lighter};
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
`;

const Item = styled(motion.div)<{ $posterPath: string }>`
  background-color: ${(props) => props.theme.black.lighter};
  background-image: url(${(props) => props.$posterPath});
  background-size: cover;
  background-position: center center;
  height: 150px;
  cursor: pointer;
`;

const InfoBox = styled(motion.div)`
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

const Overlay = styled(motion.div)`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
`;

const ItemVariants: Variants = {
  whileHover: {
    scale: 1.3,
    y: -50,
    transition: { type: "tween", delay: 0.3 },
    zIndex: 1,
  },
};

const InfoBoxVariants: Variants = {
  whileHover: {
    display: "block",
    opacity: 1,
    transition: {
      delay: 0.3,
    },
  },
};

export default function Search() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");
  const { data, fetchNextPage } = useInfiniteSearchQuery(keyword);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const movieDetailsMatch = useMatch("/search/movies/:movieId");
  const tvSeriesDetailsMatch = useMatch("/search/tvSeries/:tvSeriesId");

  useMotionValueEvent(scrollYProgress, "change", (scrollYProgress) => {
    if (scrollYProgress < 0.9) return;
    fetchNextPage();
  });

  const handleMovieItemClick = (movieId: number) => {
    navigate(`/search/movies/${movieId}?movieState=search`);
  };

  const handleTVSeriesItemClick = (tvSeriesId: number) => {
    navigate(`/search/tvSeries/${tvSeriesId}?tvSeriesState=search`);
  };

  const prefetchMovieDetail = (movieId: number) => {
    queryClient.prefetchQuery({
      queryKey: ["movies", movieId.toString()],
      queryFn: () => fetchMovieDetail(movieId),
    });
  };

  const prefetchTVSeriesDetail = (tvSeriesId: number) => {
    queryClient.prefetchQuery({
      queryKey: ["tvSeries", tvSeriesId.toString()],
      queryFn: () => fetchTVSeriesDetail(tvSeriesId),
    });
  };

  const goBackToSearch = () => {
    navigate("/search");
  };

  return (
    <Wrapper>
      {data ? (
        data.pages.map((page, index) => (
          <Fragment key={index}>
            {page.results.map((program, index) =>
              program.media_type === "person" ? null : program.media_type ===
                "movie" ? (
                <Item
                  $posterPath={
                    program.poster_path
                      ? getImagePath(program.poster_path, "w342")
                      : "https://image.tmdb.org/t/p/w342/wwemzKWzjKYJFfCeiB57q3r4Bcm.png"
                  }
                  variants={ItemVariants}
                  initial="initial"
                  whileHover="whileHover"
                  transition={{ type: "tween", duration: 0.2 }}
                  onClick={() => handleMovieItemClick(program.id)}
                  onMouseOver={() => prefetchMovieDetail(program.id)}
                  layoutId={"search" + program.id.toString()}
                  key={"search" + program.id.toString()}
                  id={"search" + program.id.toString()}
                  style={{
                    originX: index % 6 === 0 ? 0 : index % 6 === 5 ? 1 : 0.5,
                  }}
                >
                  <InfoBox variants={InfoBoxVariants}>
                    <h4>{program.title}</h4>
                    <p>{program.overview.slice(0, 100) + "..."}</p>
                  </InfoBox>
                </Item>
              ) : (
                <Item
                  $posterPath={
                    program.poster_path
                      ? getImagePath(program.poster_path, "w342")
                      : "https://image.tmdb.org/t/p/w342/wwemzKWzjKYJFfCeiB57q3r4Bcm.png/"
                  }
                  variants={ItemVariants}
                  initial="initial"
                  whileHover="whileHover"
                  transition={{ type: "tween", duration: 0.2 }}
                  onClick={() => handleTVSeriesItemClick(program.id)}
                  onMouseOver={() => prefetchTVSeriesDetail(program.id)}
                  layoutId={"search" + program.id.toString()}
                  key={"search" + program.id.toString()}
                  id={"search" + program.id.toString()}
                  style={{
                    originX: index % 6 === 0 ? 0 : index % 6 === 5 ? 1 : 0.5,
                  }}
                >
                  <InfoBox variants={InfoBoxVariants}>
                    <h4>{program.name}</h4>
                    <p>{program.overview.slice(0, 100) + "..."}</p>
                  </InfoBox>
                </Item>
              )
            )}
          </Fragment>
        ))
      ) : (
        <Loader />
      )}
      <AnimatePresence>
        {movieDetailsMatch || tvSeriesDetailsMatch ? (
          <Overlay
            onClick={goBackToSearch}
            initial={{ backgroundColor: "rgba(0,0,0,0)" }}
            animate={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            exit={{ backgroundColor: "rgba(0,0,0,0)" }}
          />
        ) : null}
      </AnimatePresence>
      <Outlet />
    </Wrapper>
  );
}
