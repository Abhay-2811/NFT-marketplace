import React from 'react'
import { useNavigate } from 'react-router-dom'
import './home.css'
const Home = () => {
  const navigate = useNavigate();
  return (
    <div className='home-page'>
      <h1>NFT Marketplace</h1>
      <h2>Buy or Sell NFT</h2>
      <div>
      <button onClick={()=>navigate('/marketplace')}>
        Marketplace
      </button>
      <button onClick={()=>navigate('/sell')}>
        Sell
      </button>
      </div>
    </div>
  )
}

export default Home