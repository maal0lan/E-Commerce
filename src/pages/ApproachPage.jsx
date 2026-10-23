import { Link } from 'react-router-dom'

const ApproachPage = () => (
  <main className="approach-page">
    <section className="approach-hero">
      <div className="approach-hero__copy">
        <p className="section-kicker">Our approach</p>
        <h1>Less browsing. Better everyday choices.</h1>
        <p>
          Common Goods is a small, considered collection of useful things for everyday life.
          We keep the shop focused so it is easier to find what you came for.
        </p>
        <Link className="button button--primary approach-hero__action" to="/">
          Browse the collection
        </Link>
      </div>
      <div aria-hidden="true" className="approach-hero__word">
        <span>common</span>
        <span>goods.</span>
      </div>
    </section>

    <section className="approach-principles">
      <div className="approach-section-heading">
        <h2>How we choose.</h2>
        <p>A useful point of view, from first browse to the things you keep.</p>
      </div>
      <div className="approach-principle-list">
        <article className="approach-principle">
          <h3>Useful comes first.</h3>
          <p>
            We start with what an item does for everyday life. The collection spans practical
            essentials and small details worth keeping close.
          </p>
        </article>
        <article className="approach-principle">
          <h3>A focused collection.</h3>
          <p>
            Categories make it simple to browse, compare prices and get to the details before
            deciding what belongs in your bag.
          </p>
        </article>
        <article className="approach-principle">
          <h3>Clear from the start.</h3>
          <p>
            Product descriptions, ratings and straightforward totals help you make an informed
            choice without guesswork.
          </p>
        </article>
      </div>
    </section>

    <section className="approach-close">
      <div>
        <h2>Find your next everyday favourite.</h2>
        <p>Take a look through the collection and see what feels right for you.</p>
      </div>
      <Link className="text-link" to="/">Shop the collection <span aria-hidden="true">→</span></Link>
    </section>
  </main>
)

export default ApproachPage
