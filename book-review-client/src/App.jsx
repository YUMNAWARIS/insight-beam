import './App.css'
import useAuth from './hooks/auth'
import Nav from './components/Nav'
import Section from './components/Section'
import Footer from './components/Footer'

function App() {
  const { getToken, getUser } = useAuth()
  const token = getToken();
  const user = getUser();
  return (
    <div className="App">
      <Nav user={user} token={token}></Nav>
      <Section user={user} token={token} ></Section>
      <Footer user={user} token={token}></Footer>
    </div>
  )
}

export default App
