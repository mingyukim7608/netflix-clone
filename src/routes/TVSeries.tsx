import styled from "styled-components";
import { useTVSeriesQuery } from "../API";
import Loader from "../components/Loader";
import { getImagePath } from "../utils";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Outlet, useMatch } from "react-router-dom";
import TVSeriresSlider from "../components/TVSeriesSlider";

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

export default function TVSeries() {
  const airingTodayTVSeriesQuery = useTVSeriesQuery("airing_today");
  const onTheAirTVSeriesQuery = useTVSeriesQuery("on_the_air");
  const popularTVSeiresQuery = useTVSeriesQuery("popular");
  const topRatedTVSeriesQuery = useTVSeriesQuery("top_rated");

  const navigate = useNavigate();
  const tvSeriesDetailsMatch = useMatch("/tvSeries/:tvSeriesId");

  const goBackToTv = () => {
    navigate("/tvSeries");
  };

  return (
    <Wrapper>
      {airingTodayTVSeriesQuery.data ? (
        <>
          <Banner
            $backdropImgPath={getImagePath(
              airingTodayTVSeriesQuery.data.results[0].backdrop_path || ""
            )}
            onClick={() => {
              navigate(
                `/tvSeries/${airingTodayTVSeriesQuery.data.results[0].id}`
              );
            }}
          >
            <Title>{airingTodayTVSeriesQuery.data.results[0].name}</Title>
            <Overview>
              {airingTodayTVSeriesQuery.data.results[0].overview}
            </Overview>
          </Banner>

          <TVSeriresSlider
            tvSeries={airingTodayTVSeriesQuery.data?.results}
            tvSeriesState="airing_today"
          />
          <TVSeriresSlider
            tvSeries={onTheAirTVSeriesQuery.data?.results}
            tvSeriesState="on_the_air"
          />
          <TVSeriresSlider
            tvSeries={popularTVSeiresQuery.data?.results}
            tvSeriesState="popular"
          />
          <TVSeriresSlider
            tvSeries={topRatedTVSeriesQuery.data?.results}
            tvSeriesState="top_rated"
          />

          <AnimatePresence>
            {tvSeriesDetailsMatch ? (
              <Overlay
                onClick={goBackToTv}
                initial={{ backgroundColor: "rgba(0,0,0,0)" }}
                animate={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                exit={{ backgroundColor: "rgba(0,0,0,0)" }}
              />
            ) : null}
          </AnimatePresence>

          <Outlet />
        </>
      ) : (
        <Loader />
      )}
    </Wrapper>
  );
}
