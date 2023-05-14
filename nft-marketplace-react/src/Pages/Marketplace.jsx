import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ethers } from 'ethers'
import { address, abi } from '../constants/contract'
import './marketplace.css'
import {NFTCard} from '../Components/Card'

const Marketplace = () => {
  const [assets,setAssets] = useState();
  useEffect(()=>{
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://nft.api.infura.io/networks/80001/nfts/${address}/tokens/?resyncMetadata=false`,
      headers: { 
        'Authorization': 'Basic OWZlNDJiMTNkOTY4NDUyNDhiM2M4MWFhMmFlMmI4ODI6YjlmM2Q3NTBmMzUwNDcxZmEwMWQyYmU1MTk0Zjg2NGM='
      }
    };
    
    axios.request(config)
    .then((response) => {
      setAssets(response.data.assets)
    })
    .catch((error) => {
      console.log(error);
    });
  },[])
  return (
    <div className='nft-grid'>
      {
        assets?.map((Asset,index)=>(
          <NFTCard asset={Asset}/>
        ))
      }
    
    </div>
  )
}

export default Marketplace