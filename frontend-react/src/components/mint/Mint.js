import { useState } from "react";
import { useMoralis } from "react-moralis";

import { derpieInfo } from "../../lib/derpieInfo";

import MintCard from "../derpieCard/MintCard";
import MintModal from "./MintModal";
import { DERPIES_ADDRESS, ETHERSCAN_URL } from "../../lib/constants";
import BatchMintModal from "./BatchMintModal";

const Mint = (props) => {
  const {
    setShowWalletModal,
    showMintModal,
    setShowMintModal,
    walletWaitingOnUser,
    awaitingBlockConfirmation,
    awaitingNewlyMintedDerpie,
    transactionHash,
    existingDerpiesSupply,
    mint,
  } = props;

  const { isWeb3Enabled } = useMoralis();

  const [selectedDerpie, setSelectedDerpie] = useState(null);
  const [showBatchMintInfo, setShowBatchMintInfo] = useState(false);

  return (
    <>
      {showBatchMintInfo && <BatchMintModal handleClose={() => setShowBatchMintInfo(false)} />}

      {showMintModal && (
        <MintModal
          derpie={derpieInfo[selectedDerpie]}
          numAlreadyMinted={existingDerpiesSupply[selectedDerpie]}
          mint={mint}
          walletWaitingOnUser={walletWaitingOnUser}
          awaitingBlockConfirmation={awaitingBlockConfirmation}
          awaitingNewlyMintedDerpie={awaitingNewlyMintedDerpie}
          transactionHash={transactionHash}
          handleClose={() => setShowMintModal(false)}
        />
      )}
      <div className="background">
        <section className="section pt-3 has-text-centered">
          <h1 className="shizuru pb-5">MINT</h1>
          <h2 className="subtitle custom-mobile-subtitle mb-2">
            Mint your Derpies here! Each Derpie costs 0.01 ETH + gas.
          </h2>
          {/* <p className="custom-smaller-mobile-text mb-5">
            <span>
              Are you a smart contract pro? You can batch mint multiple <strong>different</strong> Derpies in a single
              transaction using the verified contract on etherscan{" "}
            </span>
            <a href={`${ETHERSCAN_URL}/address/${DERPIES_ADDRESS}`} target="_blank" rel="no-referrer">
              here
            </a>
            <span>
              . This is more gas efficient when 5 or more <strong>different</strong> Derpies are minted at once.
            </span>
          </p> */}
          <p className="custom-smaller-mobile-text mb-5">
            Are you a smart contract pro? Click <a onClick={() => setShowBatchMintInfo(true)}>here</a> for batch minting
            info.
          </p>
          {!isWeb3Enabled && (
            <button className="button mb-5" onClick={() => setShowWalletModal(true)}>
              Connect Wallet
            </button>
          )}

          <div className="custom-mint-card-div">
            {derpieInfo.map((derpie, index) => (
              <MintCard
                key={index}
                derpie={derpie}
                existingDerpiesSupply={existingDerpiesSupply}
                setSelectedDerpie={setSelectedDerpie}
                setShowMintModal={setShowMintModal}
              />
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default Mint;
