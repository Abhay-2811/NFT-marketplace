import { useEffect, useState } from 'react'
import { ethers,parseEther,parseUnits } from 'ethers'
import { address, abi } from '../constants/contract'
import './card.css'
export const NFTCard = props => {
  const alchemyKey = process.env.REACT_APP_ALCHEMY_API_KEY
  const privateKey = process.env.REACT_APP_WALLET_PRIVATE_KEY
  const provider = new ethers.AlchemyProvider('maticmum', alchemyKey)
  const signer = new ethers.Wallet(privateKey, provider)
  const contract = new ethers.Contract(address, abi, signer)

  const [salePrice, setSalePrice] = useState()
  const [royalty, setRoyalty] = useState()
  const buyNFT = async (buyerAdd,amount) => {
    const amountWEI = parseUnits(amount,18);
    console.log(amountWEI);
    await contract.buyNFT(props.asset.tokenId,buyerAdd,{value: String(amountWEI)});
  }
  
  const payWithMetamask = async (receiver, strEther) => {
    const _provider = new ethers.BrowserProvider(window.ethereum)
    const _signer = await _provider.getSigner()
    const currentAdd = _signer.address;

    console.log(
      `payWithMetamask(receiver=${receiver}, sender=${_signer.address}, strEther=${strEther})`
    )

    const tx = {
      from: currentAdd,
      to: receiver,
      value: parseEther(strEther),
      nonce: await _provider.getTransactionCount(currentAdd, 'latest')
    }

    const transaction = await _signer.sendTransaction(tx).then(transaction => {
      _provider.once(transaction.hash, async transaction => {
        buyNFT(currentAdd,strEther);
      })
    })
  }

  useEffect(() => {
    // contract interactions
    const getSalePrice = async tokenId => {
      await contract.salePrice(tokenId).then(res => {
        setSalePrice(Number(res) / 1000000000000000000)
        getRoyalty(tokenId, res)
      })
    }
    const getRoyalty = async (tokenId, salep) => {
      await contract.royaltyInfo(tokenId, salep).then(res => {
        setRoyalty(Number(res[1]) / 1000000000000000000)
      })
    }
    getSalePrice(props.asset.tokenId)
  }, [])
  return (
    <div className='nft-container'>
      {/* <img src={asset.metadata?.image} style={{width:'100px'}}></img> */}
      <img src={props.asset.metadata?.image}></img>
      <p>
        <b>Name: </b>
        {props.asset.metadata?.name}
      </p>
      <p>
        <b>TokenId: </b>
        {props.asset.tokenId}
      </p>
      <p>
        <b>Sale Price: </b>
        {salePrice?.toString()}{' '}
        <img
          src='matic-logo.svg'
          style={{
            width: '18px',
            border: 'none',
            justifyContent: 'center',
            padding: '2px'
          }}
        />
      </p>
      <p>
        <b>Royalty: </b>
        {royalty?.toString()}{' '}
        <img
          src='matic-logo.svg'
          style={{
            width: '18px',
            border: 'none',
            justifyContent: 'center',
            padding: '2px'
          }}
        />
      </p>
      <p>
        <b>Total: </b>
        {(royalty + salePrice)?.toString()}{' '}
        <img
          src='matic-logo.svg'
          style={{
            width: '18px',
            border: 'none',
            justifyContent: 'center',
            padding: '2px'
          }}
        />
      </p>
      <button onClick={()=>payWithMetamask('0x63DAc31bF8c2C972903f2bc303a502587268954d',String(royalty + salePrice))}>Buy NFT</button>
    </div>
  )
}
