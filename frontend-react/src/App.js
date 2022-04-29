import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useMoralis } from "react-moralis";

import "bulma/css/bulma.css";
import "./App.css";
import Navbar from "./components/Navbar";
import About from "./components/About";
import Mint from "./components/mint/Mint";
import Gallery from "./components/gallery/Gallery";
import ConnectWalletModal from "./components/connectWallet/ConnectWalletModal";
import DisconnectModal from "./components/connectWallet/DisconnectModal";
import NewDerpieModal from "./components/mint/NewDerpieModal";
import AccountChangedWarning from "./components/alerts/AccountChangedWarning";
import WrongChainWarning from "./components/alerts/WrongChainWarning";
import ErrorMessage from "./components/alerts/ErrorMessage";

import { CORRECT_CHAIN_ID, DERPIES_ADDRESS, MESSAGE_DELAY_MS, DERPIE_PRICE_IN_ETH } from "./lib/constants";
import range from "./lib/range";
import delay from "./lib/delay";

import Derpies from "./contracts/WhoopsieDerpies.json";

function App() {
  const { enableWeb3, isWeb3Enabled, chainId, account, Moralis } = useMoralis();

  const [selectedTab, setSelectedTab] = useState("About");

  // wallet loading state
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [isMetamaskLoading, setIsMetamaskLoading] = useState(false);
  const [isWalletConnectLoading, setIsWalletConnectLoading] = useState(false);

  // minting state
  const [showMintModal, setShowMintModal] = useState(false);
  const [showNewDerpieModal, setShowNewDerpieModal] = useState(false);
  const [existingDerpiesSupply, setExistingDerpieSupply] = useState(null);
  const [walletWaitingOnUser, setWalletWaitingOnUser] = useState(false);
  const [awaitingBlockConfirmation, setAwaitingBlockConfirmation] = useState(false);
  const [awaitingNewlyMintedDerpie, setAwaitingNewlyMintedDerpie] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);
  const [mintedDerpieDetails, setMintedDerpieDetails] = useState(null);

  // gallery state
  const [gettingUserDerpies, setGettingUserDerpies] = useState(false);
  const [userDerpieDetails, setUserDerpieDetails] = useState([]);
  const [showNoDerpiesNotification, setShowNoDerpiesNotification] = useState(false);

  // warning and error state
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false);
  const [showAccountChangedWarning, setShowAccountChangedWarning] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Check for metamask on page load
  useEffect(() => {
    if (!window.ethereum) {
      console.log("no metamask detected");
      setIsMetamaskInstalled(true);
    }
  }, []);

  async function handleConnectMetaMask() {
    try {
      setIsMetamaskLoading(true);
      const web3Provider = await enableWeb3();
      console.log(web3Provider);
      setIsMetamaskLoading(false);

      await delay(1500); // allows user to see that they are connected
      setShowWalletModal(false);
    } catch (error) {
      console.log(error);
      setIsMetamaskLoading(false);
      setErrorMessage(error);
    }
  }

  async function handleWalletConnect() {
    try {
      setIsWalletConnectLoading(true);
      const web3Provider = enableWeb3({
        provider: "walletconnect",
        mobileLinks: ["rainbow", "metamask"],
      });
      console.log(web3Provider);
      setIsWalletConnectLoading(false);
      setShowWalletModal(false);
    } catch (error) {
      setIsWalletConnectLoading(false);
      setErrorMessage(error);
    }
  }

  // update existing supply of each token when user connects wallet
  useEffect(() => {
    if (!isWeb3Enabled) return;
    if (chainId !== CORRECT_CHAIN_ID) return;
    getExistingTokenSupply();
  }, [isWeb3Enabled, chainId]);

  async function getExistingTokenSupply() {
    try {
      const options = {
        contractAddress: DERPIES_ADDRESS,
        abi: Derpies.abi,
      };

      let existingSupply = [];
      for await (const derpie of range(0, 20)) {
        const numMinted = await Moralis.executeFunction({
          ...options,
          functionName: "tokenIdToExistingSupply",
          params: { "": derpie },
        });
        existingSupply.push(numMinted.toString());
      }
      setExistingDerpieSupply(existingSupply);
    } catch (error) {
      console.log(error);
      setErrorMessage(error);
    }
  }

  // listen for EIP-1193 events
  useEffect(() => {
    // Other events: onWeb3Enabled, onDisconnect

    Moralis.onChainChanged((result) => {
      console.log(result);
      setUserDerpieDetails([]);
      clearErrorMessages();
    });

    Moralis.onWeb3Deactivated((result) => {
      // console.log(result);
      setUserDerpieDetails([]);
      clearErrorMessages();
    });

    Moralis.onAccountChanged((result) => {
      // console.log(result);
      setUserDerpieDetails([]);
      clearErrorMessages();
      setShowAccountChangedWarning(true);
      setTimeout(() => {
        setShowAccountChangedWarning(false);
      }, MESSAGE_DELAY_MS);
    });
  });

  async function fetchMetadata(uri) {
    try {
      const response = await fetch(uri);

      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(response);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function mint(id, numDerpies) {
    try {
      const ethToPay = DERPIE_PRICE_IN_ETH * numDerpies; // to fixed?

      const options = {
        contractAddress: DERPIES_ADDRESS,
        abi: Derpies.abi,
      };

      setWalletWaitingOnUser(true);
      const mintTx = await Moralis.executeFunction({
        ...options,
        functionName: "mint",
        params: { _id: id, _amount: numDerpies },
        msgValue: ethers.utils.parseEther(ethToPay.toString()),
      });
      setWalletWaitingOnUser(false);
      setTransactionHash(mintTx.hash);

      setAwaitingBlockConfirmation(true);
      // await delay(10000); // delete for production
      const mintTxReceipt = await mintTx.wait();
      await getExistingTokenSupply(); // update existing supply on mint page
      setAwaitingBlockConfirmation(false);

      // TODO - show fetching notification!
      setAwaitingNewlyMintedDerpie(true);
      // console.log(mintTxReceipt);
      const tokenId = mintTxReceipt.events[0].args[3];
      // console.log(tokenId.toString());
      // console.log(`you minted ${numDerpies} of token Id ${id}`);

      // store newly minted derpie details to state
      const tokenUri = await Moralis.executeFunction({
        ...options,
        functionName: "uri",
        params: { "": tokenId.toString() },
      });

      const tokenUriHttps = `https://ipfs.io/ipfs/${tokenUri.split("").splice(7).join("")}`;
      const uri = tokenUriHttps.replace("{id}", `${parseInt(tokenId).toString(16).padStart(64, "0")}`);
      const uriJSON = await fetchMetadata(uri);

      const amountOwned = await Moralis.executeFunction({
        ...options,
        functionName: "balanceOf",
        params: {
          account: account,
          id: parseInt(tokenId.toString()),
        },
      });
      const amountOwnedInt = parseInt(amountOwned.toString());

      setMintedDerpieDetails({ tokenId: parseInt(tokenId.toString()), amount: amountOwnedInt, uriJSON });

      setShowMintModal(false);
      setAwaitingNewlyMintedDerpie(false);
      setShowNewDerpieModal(true);
    } catch (error) {
      clearErrorMessages();
      setErrorMessage(error);
    }
  }

  // TODO - separate from mint function
  async function renderNewlyMintedDerpie() {
    console.log("rendering");
    try {
    } catch (error) {}
  }

  async function getOwnerDerpies() {
    try {
      // useMoralis() includes account and provider
      setGettingUserDerpies(true);

      const options = {
        contractAddress: DERPIES_ADDRESS,
        abi: Derpies.abi,
      };

      const baseURI = await Moralis.executeFunction({
        ...options,
        functionName: "uri",
        params: { "": "0" },
      });

      let ownerDerpies = [];
      for await (const derpie of range(0, 20)) {
        const numDerpies = await Moralis.executeFunction({
          ...options,
          functionName: "balanceOf",
          params: {
            account: account,
            id: derpie,
          },
        });
        const numDerpiesInt = parseInt(numDerpies.toString());
        console.log(numDerpies.toString());

        // get token uri
        if (numDerpiesInt > 0) {
          const uri = `https://ipfs.io/ipfs/${baseURI
            .split("")
            .splice(7)
            .join("")
            .replace("{id}", derpie.toString(16).padStart(64, "0"))}`;

          const uriJSON = await fetchMetadata(uri);

          ownerDerpies.push({ tokenId: derpie, amount: numDerpiesInt, uriJSON });
        }
      }

      setUserDerpieDetails(ownerDerpies);
      if (ownerDerpies.length === 0) setShowNoDerpiesNotification(true);
      setGettingUserDerpies(false);
    } catch (error) {
      setGettingUserDerpies(false);
      clearErrorMessages();
      setErrorMessage(error);
    }
  }

  function clearErrorMessages() {
    setErrorMessage(null);
    setShowNoDerpiesNotification(false);
    setWalletWaitingOnUser(false);
    setAwaitingBlockConfirmation(false);
  }

  useEffect(() => {
    clearErrorMessages();
  }, [selectedTab]);

  return (
    <>
      <Navbar
        setSelectedTab={setSelectedTab}
        setShowWalletModal={setShowWalletModal}
        setShowDisconnectModal={setShowDisconnectModal}
      />

      {/* start of modals and notifications */}
      {isWeb3Enabled && chainId !== CORRECT_CHAIN_ID && <WrongChainWarning />}
      {showAccountChangedWarning && <AccountChangedWarning />}
      {errorMessage && <ErrorMessage errorMessage={errorMessage} setErrorMessage={setErrorMessage} />}
      {showWalletModal && (
        <ConnectWalletModal
          showWalletModal={showWalletModal}
          isMetamaskInstalled={isMetamaskInstalled}
          isMetamaskLoading={isMetamaskLoading}
          isWalletConnectLoading={isWalletConnectLoading}
          handleConnectMetaMask={handleConnectMetaMask}
          handleWalletConnect={handleWalletConnect}
          handleClose={() => setShowWalletModal(false)}
        />
      )}
      {showDisconnectModal && <DisconnectModal handleClose={() => setShowDisconnectModal(false)} />}

      {showNewDerpieModal && (
        <NewDerpieModal
          mintedDerpieDetails={mintedDerpieDetails}
          transactionHash={transactionHash}
          handleClose={() => setShowNewDerpieModal(false)}
        />
      )}
      {/* end of modals and notifications */}

      {selectedTab === "About" && <About setSelectedTab={setSelectedTab} />}
      {selectedTab === "Mint" && (
        <Mint
          setShowWalletModal={setShowWalletModal}
          showMintModal={showMintModal}
          setShowMintModal={setShowMintModal}
          walletWaitingOnUser={walletWaitingOnUser}
          awaitingBlockConfirmation={awaitingBlockConfirmation}
          awaitingNewlyMintedDerpie={awaitingNewlyMintedDerpie}
          transactionHash={transactionHash}
          existingDerpiesSupply={existingDerpiesSupply}
          mint={mint}
        />
      )}
      {selectedTab === "Gallery" && (
        <Gallery
          setShowWalletModal={setShowWalletModal}
          getOwnerDerpies={getOwnerDerpies}
          gettingUserDerpies={gettingUserDerpies}
          userDerpieDetails={userDerpieDetails}
          showNoDerpiesNotification={showNoDerpiesNotification}
        />
      )}
    </>
  );
}

export default App;
