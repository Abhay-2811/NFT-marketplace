import { ConnectButton } from '@rainbow-me/rainbowkit';
import { NavLink } from 'react-router-dom';
import './navbar.css'



const Navbar = ()=>{
    return(
        <nav>
            <h2>NFT-Marketplace</h2>
            <div className='nav-list'>
            <ul><NavLink exact to='/'>Home</NavLink></ul>
            <ul><NavLink exact to='/sell'>Sell NFT</NavLink></ul>
            <ul><NavLink exact to='/marketplace'>Marketplace</NavLink></ul>
            <ul><NavLink exact to='/profile'>Profile</NavLink></ul>
            </div>
            <ConnectButton showBalance={false} chainStatus="icon"/>
        </nav>

    )
}

export default Navbar