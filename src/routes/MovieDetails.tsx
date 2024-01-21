import { motion } from "framer-motion";
import styled from "styled-components";
import { useParams, useSearchParams } from "react-router-dom";
import { useMovieDetailsQuery } from "../API";
import Loader from "../components/Loader";
import { getImagePath } from "../utils";

const DetailsWrapper = styled(motion.div)`
  width: 50vw;
  height: calc(100vh - 100px);
  overflow: scroll;
  background-color: ${(props) => props.theme.black.lighter};
  position: fixed;
  right: 25vw;
  top: 80px;
  box-sizing: border-box;
  border-radius: 10px;
  z-index: 3;
`;

const Poster = styled.div<{ $backdropPath: string }>`
  width: 50vw;
  height: 33.75vw;
  background-image: linear-gradient(
      to bottom,
      transparent,
      ${(props) => props.theme.black.lighter}
    ),
    url(${(props) => props.$backdropPath});
  background-size: cover;
`;

const Description = styled.div`
  padding: 10px;
  span:first-child {
    color: #afacac;
  }
`;

const MovieTitle = styled.h2`
  font-size: 50px;
  font-weight: 500;
  text-align: center;
  margin: 20px auto;
`;

const P = styled.p`
  margin-bottom: 20px;
  font-size: 20px;
`;

export default function MovieDetails() {
  const params = useParams();
  const movieId = params.movieId as string;
  const movieDetailsQuery = useMovieDetailsQuery(movieId);
  const { data } = movieDetailsQuery;

  return (
    <DetailsWrapper
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {data ? (
        <>
          <Poster
            $backdropPath={
              data.backdrop_path
                ? getImagePath(data.backdrop_path)
                : "https://image.tmdb.org/t/p/w500/wwemzKWzjKYJFfCeiB57q3r4Bcm.png"
            }
          />
          <Description>
            <MovieTitle>{data.title}</MovieTitle>
            <P>
              <span>Genres: </span>
              {data.genres.map((genre) => genre.name).join(", ")}
            </P>
            <P>
              <span>Runtime: </span>
              <span>{data.runtime} minutes</span>
            </P>
            <P>
              <span>Production companies: </span>
              {data.production_companies
                .map((company) => company.name)
                .join(", ")}
            </P>
            <P>{data.overview}</P>
          </Description>
        </>
      ) : (
        <Loader />
      )}
    </DetailsWrapper>
  );
}
