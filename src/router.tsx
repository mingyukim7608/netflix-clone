import { createBrowserRouter } from "react-router-dom";
import MainFrame from "./components/MainFrame";
import Browse from "./routes/Browse";
import Movies from "./routes/Movies";
import TVSeries from "./routes/TVSeries";
import Search from "./routes/Search";
import MovieDetails from "./routes/MovieDetails";
import TVSeriesDetails from "./routes/TVSeriesDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainFrame />,
    children: [
      {
        index: true,
        element: <Browse />,
      },
      {
        path: "movies",
        element: <Movies />,
        children: [{ path: ":movieId", element: <MovieDetails /> }],
      },

      {
        path: "tvSeries",
        element: <TVSeries />,
        children: [{ path: ":tvSeriesId", element: <TVSeriesDetails /> }],
      },
      {
        path: "search",
        element: <Search />,
        children: [
          { path: "movies/:movieId", element: <MovieDetails /> },
          { path: "tvSeries/:tvSeriesId", element: <TVSeriesDetails /> },
        ],
      },
    ],
  },
]);

export default router;
