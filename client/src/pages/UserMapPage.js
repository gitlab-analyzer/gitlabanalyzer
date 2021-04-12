import React from 'react';
import Logo from '../components/Logo';
import UserMap from '../components/UserMap';

const UserMapPage = () => {
    return (
        <div className="mapping_main">
           <Logo />
            <div>
                 <UserMap />
            </div> 
        </div>
    )
}

export default UserMapPage