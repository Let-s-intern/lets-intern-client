// Environment: server

export { data };

import fetch from 'node-fetch';
import { PageContextServer } from 'vike/types';

async function data(pageContext: PageContextServer) {
  const { id } = pageContext.routeParams;
  const response = await fetch(
    `https://star-wars.brillout.com/api/films/${id}.json`,
  );

  let movie = (await response.json()) as {
    title: string;
    release_date: string;
  };
  // `movie` is serialized and passed to the client. Therefore, we pick only the
  // data the client needs in order to minimize what is sent over the network.
  movie = { title: movie.title, release_date: movie.release_date };

  // data() runs only on the server-side by default, we can therefore use ORM/SQL queries.
  /* With an ORM:
  const movies = await Movie.findAll({ select: ['title', 'release_date'] }) */
  /* With SQL:
  const movies = await sql.run('SELECT { title, release_date } FROM movies;') */

  return {
    movie,
  };
}
