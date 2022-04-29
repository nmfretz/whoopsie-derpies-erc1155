import { DERPIES_ADDRESS, ETHERSCAN_URL, OPENSEA_URL } from "../lib/constants";
import { derpieInfo } from "../lib/derpieInfo";

const About = ({ setSelectedTab }) => {
  function mintPageHandler() {
    setSelectedTab("Mint");
    document.body.scrollTop = 0; // Safari
    document.documentElement.scrollTop = 0; // Chrome, Firefox, IE, Opera
  }

  return (
    <div className="background">
      <section className="section has-text-centered pt-3 pb-0 container">
        {/* <h1 className="shizuru pb-5">ABOUT</h1> */}
        <h1 className="shizuru pb-5">WHOOPSIE DERPIES</h1>

        <h2 className="subtitle pb-6 mb-0 custom-smaller-padding-mobile custom-smaller-mobile-text">
          Whoopsie Derpies is a hand-drawn art collection that lives on the Ethereum blockchain as ERC1155 tokens.
          Inspired by drawing animals for our twin toddlers whilst getting bumped around and receiving conflicting
          requests. The animals are cute and just a little bit derpy.
        </h2>

        <div className="is-flex is-flex-wrap-wrap is-justify-content-center custom-mobile-margin">
          {derpieInfo.map((derpie, index) => (
            <img className="custom-about-reel-img" key={index} src={derpie.image} alt="" />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="is-flex is-justify-content-center is-align-items-center is-flex-wrap-wrap">
          <div>
            <figure className="image custom-about-img is-hidden-mobile">
              <img src={derpieInfo[2].image} alt="" />
            </figure>
          </div>
          <div className="custom-about-text p-5">
            <h1 className="title is-size-4-mobile">Derpies Details</h1>
            <p className="pb-4 custom-smaller-mobile-text">
              There are 20 unique animals that are possible to mint, each with their own description, preferred name,
              and level of derpiness. Each animal has a certain number of copies as shown below (for example, there are
              12 copies of Sandpiper that are possible to mint). There are 267 Whoopsie Derpies in total (what a silly
              number!).
            </p>

            <div className="custom-about-supply-div">
              {derpieInfo.map((derpie, index) => (
                <div key={index} className="custom-about-supply">
                  <p>{derpie.metadata.name}</p>
                  <p>{derpie.maxSupply}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="is-flex is-justify-content-center is-align-items-center is-flex-wrap-wrap">
          <div className="custom-about-text p-5">
            <h1 className="title is-size-4-mobile">Development Details</h1>
            <p className="pb-2 custom-smaller-mobile-text">
              The Whoopsie Derpies smart contract follows the ERC1155 Multi Token Standard. Development details are as
              follows:
            </p>
            <ul className="pb-2 custom-details-list custom-smaller-mobile-text">
              <li>Inherits from OpenZeppelin's ERC1155 and Ownable contracts and interfaces.</li>
              <li>
                The contract was written with high network fees in mind. Effort was made to lower the gas cost to mint,
                while maintaining security with battle-tested contracts. Minting a single Derpie costs approximately
                38,000 gas compared to contracts like Bored Ape Yacht Club that cost approximately 150,000 gas. Plus,
                minting multiple copies of the same Derpie in a single transaction costs the same gas as minting a
                single Derpie!
              </li>
              <li>Metadata and images are stored on IPFS and pinned using Pinata.</li>
            </ul>
            <p className="custom-smaller-mobile-text">
              View the entire project code at this
              <a href="https://github.com/nmfretz" target="_blank" rel="noreferrer">
                {" "}
                github repository.
              </a>{" "}
              Verified smart contract code is also viewable on Etherscan{" "}
              <a href={`${ETHERSCAN_URL}/address/${DERPIES_ADDRESS}`} target="_blank" rel="noreferrer">
                here
              </a>
              .
            </p>
          </div>

          <div>
            <figure className="image custom-about-img is-hidden-mobile">
              <img src={derpieInfo[7].image} alt="" />
            </figure>
          </div>
        </div>

        <div className="is-flex is-justify-content-center">
          <button className="button" onClick={mintPageHandler}>
            Ready to Mint a Whoospie Derpie?
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;
