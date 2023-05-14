import React, { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import axios from 'axios'
import { NFTCard } from '../Components/Card'
import './marketplace.css'
const Profile = () => {
  const { address, isConnecting, isDisconnected } = useAccount();
  const[assets,setAssets] = useState();

  useEffect(()=>{
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://nft.api.infura.io/networks/80001/accounts/${address}/assets/nfts`,
      headers: { 
        'Authorization': 'Basic OWZlNDJiMTNkOTY4NDUyNDhiM2M4MWFhMmFlMmI4ODI6YjlmM2Q3NTBmMzUwNDcxZmEwMWQyYmU1MTk0Zjg2NGM='
      }
    };
    
    axios.request(config)
    .then((response) => {
      setAssets(response.data.assets);
      console.log(response.data.assets);
    })
    .catch((error) => {
      console.log(error);
    });
  },[])
  return (
    <div>
      <h1>NFT's Owned By You</h1>
      <div className='nft-grid'>
      {
        assets?.map((Asset,index)=>(
          <img src={Asset?.metadata?.image} style={{width:'200px',border: '1px solid gray'}} />
        ))
      }
    
    </div>
    </div>
  )
}

export default Profile