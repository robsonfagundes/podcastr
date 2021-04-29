
export default function Home(props) {

  console.log(props.episodes)

  /**
   * Consumindo uma API com next
   * SPA - Single Page App
   */

  // useEffect(() => {
  //   fetch('http://localhost:3333/episodes')
  //     .then(response => response.json())
  //     .then(data => console.log(data))
  // }, []);

  return (
    <div>
      <h1>Index</h1>
      
      {/* show api result */}
      <p>{JSON.stringify(props.episodes)}</p>

    </div>
  )

}


/**
 * Consumindo uma API com next
 * SSR - Server Side Render
 */
// export  async function getServerSideProps() {
//   const response = await fetch('http://localhost:3333/episodes')
//   const data = await response.json();

//   return {
//     props: {
//       episodes: data,
//     }
//   }
// }


/**
 * Consumindo uma API com next
 * SSG - Static Side Generation 
 */
export async function getStaticProps() {
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json();

  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8,
  }
}