import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import useAuth from '../contexts/useAuth'

const LoginPage = () => {
  const [usernameInput, setUsernameInput] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const { signIn, username } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const destination = location.state?.from || '/products'

  const submit = (event) => {
    event.preventDefault()
    const cleanUsername = usernameInput.trim()
    if (!cleanUsername || !password) {
      setMessage('Enter both your username and password to continue.')
      return
    }
    signIn(cleanUsername)
    navigate(destination, { replace: true })
  }

  return (
    <main className="login-page">
      <section className="login-panel">
        <Link className="login-panel__back" to="/">← Back to Common Goods</Link>
        <div className="login-panel__form-wrap">
          <p className="section-kicker">Your Common Goods account</p>
          <h1>{username ? 'Welcome back.' : 'Good to see you.'}</h1>
          <p className="login-panel__intro">Sign in with your username to continue shopping.</p>
          <form className="login-form" onSubmit={submit}>
            <label htmlFor="username">Username</label>
            <input
              autoComplete="username"
              autoFocus
              id="username"
              onChange={(event) => setUsernameInput(event.target.value)}
              placeholder="Your username"
              required
              value={usernameInput}
            />
            <label htmlFor="password">Password</label>
            <input
              autoComplete="current-password"
              id="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Your password"
              required
              type="password"
              value={password}
            />
            {message && <p aria-live="polite" className="login-form__message" role="alert">{message}</p>}
            <Button className="login-form__submit" type="submit">Continue</Button>
          </form>
          <p className="login-panel__footnote">Demo sign-in only. Your username stays in this browser session; your password is not saved.</p>
        </div>
      </section>
      <aside className="login-brand" aria-label="Common Goods">
        <span className="login-brand__word">common<br />goods<span>.</span></span>
        <div className="login-brand__note"><span>Useful by nature</span><span>01 / 03</span></div>
      </aside>
    </main>
  )
}

export default LoginPage