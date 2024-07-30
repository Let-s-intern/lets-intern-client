export function Page(props: any) {
  const data = props.data;
  return (
    <div>
      <h2>Test Blog {data.movie.title} page</h2>
      <p>release date: {data.movie.release_date}</p>
    </div>
  );
}
