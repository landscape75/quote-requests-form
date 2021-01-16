import Nav from '../nav'
import Footer from '../footer'
function Layout({ user, setUser, children }) {
  return (
    <>
    <div className="container mx-auto">
      <Nav user={user} setUser={setUser} />
      {children}
      <Footer />
    </div>
    
    </>
  )
}

export default Layout
