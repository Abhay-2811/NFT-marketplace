import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Sell from './Pages/Sell';
import Marketplace from './Pages/Marketplace';
import Profile from './Pages/Profile';
import Navbar from './Components/Navbar';
import '@rainbow-me/rainbowkit/styles.css';
import { WagmiConfig, createConfig, configureChains, mainnet } from 'wagmi'
import { polygon,polygonMumbai } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import {
  getDefaultWallets,
  RainbowKitProvider,
  midnightTheme
} from '@rainbow-me/rainbowkit';

function App() {
  const { chains, publicClient, webSocketPublicClient } = configureChains(
    [mainnet,polygon,polygonMumbai],
    [publicProvider()],
  )
  const { connectors } = getDefaultWallets({
    chains
  });
   
  const config = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    webSocketPublicClient,
  })
  return (
    <BrowserRouter>
     <WagmiConfig config={config}>
     <RainbowKitProvider chains={chains} theme={midnightTheme({accentColor: 'rgb(11, 83, 238)'})} coolMode>
      <Navbar />
      <Routes>
        <Route exact path='/' element={<Home />}></Route>
        <Route exact path='/sell' element={<Sell />}></Route>
        <Route exact path='/marketplace' element={<Marketplace />}></Route>
        <Route exact path='/profile' element={<Profile />}></Route>
      </Routes>
      </RainbowKitProvider>
      </WagmiConfig>
    </BrowserRouter>
  );
}

export default App;
