import { AuthProvider } from "./context/AuthContext";
import { Route } from "./routes/index";


function App() {

  return (
    <AuthProvider>
      <Route/>
    </AuthProvider>
  )
}

export default App
