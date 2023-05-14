import lighthouse from '@lighthouse-web3/sdk'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { abi, address } from '../constants/contract'
import './sell.css'

const Sell = () => {
  const [imgLink, setImgLink] = useState()
  const [mdInputF, setmdInputF] = useState([{ Key: '', Value: '' }])
  const [mdLink, setmdLink] = useState()
  const [royalty, setRoyalty] = useState(0)
  const [royaltyAdd, setroyaltyAdd] = useState()
  const [salePrice, setSalePrice] = useState()

  const handleMDchange = (index, event) => {
    let data = [...mdInputF]
    data[index][event.target.name] = event.target.value
    setmdInputF(data)
  }

  // helper function for upload img function
  const progressCallback = progressData => {
    let percentageDone =
      100 - (progressData?.total / progressData?.uploaded)?.toFixed(2)
    console.log(percentageDone)
  }
  const uploadImage = async e => {
    const output = await lighthouse.upload(
      e,
      process.env.REACT_APP_LHAPI,
      progressCallback
    )
    console.log('File Status:', output)
    console.log(
      'Visit at https://gateway.lighthouse.storage/ipfs/' + output.data.Hash
    )
    const link = 'https://gateway.lighthouse.storage/ipfs/' + output.data.Hash
    setImgLink(link)
  }

  // on submit create a json formatted metadata to upload to ipfs and set NFT uri
  const handleSubmit = async (e) => {
    e.preventDefault()
    let obj = JSON.stringify(Object.assign({}, mdInputF))
    let metadata = {
      image: imgLink,
      name: 'NFT',
      attributes: JSON.stringify(mdInputF)
    }
    console.log(metadata)
    //uploading metadata to ipfs
    const mdUpload = lighthouse
      .uploadText(JSON.stringify(metadata), process.env.REACT_APP_LHAPI)
      .then(res => {
        console.log(res.data.Hash)
        const link = 'https://gateway.lighthouse.storage/ipfs/' + res.data.Hash
        setmdLink(link)
        mintNFT();
      });
    
  }

  // contract interaction
  const mintNFT = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(address, abi, signer)
    console.log(typeof(salePrice));
    await contract.mintNFTWithRoyalty(
      signer.address,
      mdLink,
      royaltyAdd,
      royalty,
      String(salePrice)
    )
  }

  useEffect(() => {
    // console.log(mdInputF);
  })

  return (
    <form
      action=''
      onSubmit={e => {
        handleSubmit(e)
      }}
      className='sell-nft'
    >
      <input
        type='file'
        name='image'
        id='NFTimg'
        onChange={e => {
          e.preventDefault()
          uploadImage(e)
        }}
      />
      <input type='text' placeholder='NFT name' />
      {mdInputF.map((inputF, index) => {
        return (
          <>
            <div key={index} className='metadata'>
              <input
                type='text'
                name='Key'
                placeholder='Metadata Key'
                onChange={event => {
                  handleMDchange(index, event)
                }}
              />
              <input
                type='text'
                name='Value'
                placeholder='Metadata Value'
                onChange={event => {
                  handleMDchange(index, event)
                }}
              />
            </div>
            <button
              onClick={e => {
                e.preventDefault()
                let newField = { Key: '', Value: '' }
                setmdInputF([...mdInputF, newField])
              }}
            >
              +
            </button>
          </>
        )
      })}
      <input
        type='text'
        placeholder='Royalty Reciever'
        onChange={e => {
          e.preventDefault()
          setroyaltyAdd(e.target.value)
        }}
      />

      <input
        type='number'
        min='0'
        max='99'
        name='royalty'
        placeholder='Royalty in (%)'
        onChange={e => {
          e.preventDefault()
          setRoyalty(e.target.value * 100)
        }}
      />
      <input
        type='number'
        name='salePrice'
        placeholder='salePrice'
        step='any'
        onChange={e => {
          e.preventDefault()
          setSalePrice(e.target.value * 1000000000000000000)
        }}
      />
      <button type='submit'>Create NFT</button>
    </form>
  )
}
export default Sell
