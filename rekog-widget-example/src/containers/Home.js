import React from "react";
import "./Home.css";
import { Auth } from 'aws-amplify';
import NavBar from '../components/NavBar';
import { RekogWidget } from '../components/RekogWidget';

export default function HomePage(props) {

    const handleLogout = async event => {
      await Auth.signOut();
    };

    const RenderWidgets = () => {
        return (
          <div>
            <NavBar logout={handleLogout}/>
            <div className="container">
              <RekogWidget appsyncClient={props.appsyncClient}/>
            </div>
          </div>
        );
    }

    return (
        <div class="Home">
            <RenderWidgets />
        </div>
    );
}
