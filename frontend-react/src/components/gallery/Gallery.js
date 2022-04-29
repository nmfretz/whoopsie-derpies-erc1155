import { useMoralis } from "react-moralis";
import GettingUserDerpiesNotification from "../alerts/GettingUserDerpiesNotification";

import NoDerpiesNotification from "../alerts/NoDerpiesNotification";
import DerpieCard from "../derpieCard/DerpieCard";

const Gallery = (props) => {
  const { setShowWalletModal, getOwnerDerpies, gettingUserDerpies, userDerpieDetails, showNoDerpiesNotification } =
    props;

  const { isWeb3Enabled } = useMoralis();

  return (
    <div className="background">
      <section className="section pt-3 has-text-centered">
        <h1 className="shizuru pb-5">YOUR DERPIES GALLERY</h1>
        <h2 className="subtitle custom-mobile-subtitle mb-5">All your Derpies in one place!</h2>

        {!isWeb3Enabled && (
          <button className="button mb-5" onClick={() => setShowWalletModal(true)}>
            Connect Wallet
          </button>
        )}

        <div>
          {isWeb3Enabled && (
            <button className={`button mb-5 ${gettingUserDerpies ? "is-loading" : ""}`} onClick={getOwnerDerpies}>
              {userDerpieDetails.length === 0 ? "See Your Derpies" : "Refresh Your Derpies"}
            </button>
          )}
        </div>

        {gettingUserDerpies && <GettingUserDerpiesNotification />}

        {userDerpieDetails.length > 0 && (
          <div className="custom-mint-card-div">
            {userDerpieDetails.map((derpie, index) => (
              <DerpieCard key={index} derpieDetails={derpie} />
            ))}
          </div>
        )}

        {isWeb3Enabled && showNoDerpiesNotification && <NoDerpiesNotification />}
      </section>
    </div>
  );
};

export default Gallery;
