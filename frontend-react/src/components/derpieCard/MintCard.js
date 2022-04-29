import { useMoralis } from "react-moralis";

import Logo from "../../img/Logo.png";
import DerpieAttribute from "./DerpieAttribute";

import { CORRECT_CHAIN_ID, DERPIES_ADDRESS, OPENSEA_URL } from "../../lib/constants";

const MintCard = ({ derpie, existingDerpiesSupply, setSelectedDerpie, setShowMintModal }) => {
  const style = { backgroundColor: `#${derpie.metadata.background_color}` };

  const { isWeb3Enabled, chainId } = useMoralis();

  function handleMintClick() {
    if (!isWeb3Enabled) return;
    setSelectedDerpie(derpie.tokenId);
    setShowMintModal(true);
  }

  return (
    <>
      <div className={`card custom-card`}>
        <div className={`card-image`}>
          <figure
            style={style}
            className={`image is-4by4 ${
              existingDerpiesSupply && existingDerpiesSupply[derpie.tokenId] - derpie.maxSupply === 0
                ? "custom-sold-out"
                : ""
            }`}
          >
            <img src={derpie.image} />
          </figure>

          {isWeb3Enabled &&
            chainId === CORRECT_CHAIN_ID &&
            (existingDerpiesSupply ? (
              <button
                className="button custom-mint-button"
                disabled={existingDerpiesSupply[derpie.tokenId] - derpie.maxSupply === 0}
                onClick={handleMintClick}
              >
                {existingDerpiesSupply[derpie.tokenId] - derpie.maxSupply === 0 ? "sold out" : "mint me"}
              </button>
            ) : (
              <button className="button custom-mint-button is-loading">loading...</button>
            ))}

          {!isWeb3Enabled && <p className="custom-num-minted">connect to see availability and mint</p>}

          {isWeb3Enabled &&
            (chainId !== CORRECT_CHAIN_ID ? (
              <p className="custom-num-minted">connect to see availability and mint</p>
            ) : existingDerpiesSupply ? (
              <p className="custom-num-minted">
                {existingDerpiesSupply[derpie.tokenId]} / {derpie.maxSupply} minted
              </p>
            ) : (
              <p className="custom-num-minted">loading...</p>
            ))}
        </div>
        <div className="card-content">
          <div className="media">
            <div className="media-left">
              <figure className="image is-48x48">
                <img src={Logo} alt="Whoosie Derpies Logo" />
              </figure>
            </div>
            <div className="media-left has-text-left">
              <p className="title is-4 mb-0 is-capitalized">{derpie.metadata.name}</p>
              <p className="">{`Token ID: ${derpie.tokenId}`}</p>
            </div>
          </div>

          <p className="has-text-left mt-0 mb-3 is-size-7">{derpie.metadata.description}</p>

          <div className="content field is-grouped is-flex">
            <DerpieAttribute metadata={derpie.metadata} traitNum={0} />
            <DerpieAttribute metadata={derpie.metadata} traitNum={1} />
            <DerpieAttribute metadata={derpie.metadata} traitNum={2} />
          </div>
          <a
            href={`${OPENSEA_URL}/assets/${DERPIES_ADDRESS}/${derpie.tokenId}`}
            target="_blank"
            rel="no-referrer"
            className="custom-opensea-link"
          >
            view on opensea
          </a>
        </div>
      </div>
    </>
  );
};

export default MintCard;
