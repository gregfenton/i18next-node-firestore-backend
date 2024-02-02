import { ScreenDisplayer } from './components/ScreenDisplayer.jsx';
import { AuthProvider } from './providers/AuthProvider.jsx';
import { FirebaseProvider } from './providers/FirebaseProvider.jsx';

const App = () => {
  return (
    <div className='div-app'>
      <FirebaseProvider>
        <AuthProvider>
          <ScreenDisplayer />
        </AuthProvider>
      </FirebaseProvider>
    </div>
  );
};

export default App;
