import { Link } from 'react-router-dom'

const HomePage = () => (
  <main className="home-page">
    <section className="home-hero">
      <div className="home-hero__copy">
        <p className="section-kicker">A little more considered</p>
        <h1>Good things, chosen well.</h1>
        <p>Everyday finds for the way you live, picked for quality, usefulness and lasting appeal.</p>
        <Link className="button button--primary home-hero__action" to="/products">
          Explore the collection <span aria-hidden="true">→</span>
        </Link>
      </div>
      <div aria-label="Common Goods, useful by nature" className="home-hero__mark">
        <span aria-hidden="true">CG</span>
        <div><span>Useful by nature</span><span>Made for every day</span></div>
      </div>
    </section>
    <section aria-label="What makes Common Goods different" className="home-values">
      <article>  <h2>Useful by nature</h2><p>Thoughtful things that earn their place in your everyday.</p></article>
      <article> <h2>Chosen with care</h2><p>Quality, function and a fair price come first.</p></article>
      <article> <h2>Made to stay</h2><p>Good design should feel right today and for years to come.</p></article>
    </section>
  </main>
)

export default HomePage