import Logo from "../../img/Logo.png";
import DerpieAttribute from "./DerpieAttribute";

import beaver from "../../img/derpie_img/beaver.png";
import bunny from "../../img/derpie_img/bunny.png";
import kitty from "../../img/derpie_img/kitty.png";
import cheetah from "../../img/derpie_img/cheetah.png";
import elephant from "../../img/derpie_img/elephant.png";
import flamingo from "../../img/derpie_img/flamingo.png";
import fox from "../../img/derpie_img/fox.png";
import giraffe from "../../img/derpie_img/giraffe.png";
import hedgie from "../../img/derpie_img/hedgie.png";
import horsie from "../../img/derpie_img/horsie.png";
import lemur from "../../img/derpie_img/lemur.png";
import llama from "../../img/derpie_img/llama.png";
import narwhal from "../../img/derpie_img/narwhal.png";
import octopus from "../../img/derpie_img/octopus.png";
import orca from "../../img/derpie_img/orca.png";
import piggie from "../../img/derpie_img/piggie.png";
import rhinoceros from "../../img/derpie_img/rhinoceros.png";
import sandpiper from "../../img/derpie_img/sandpiper.png";
import shark from "../../img/derpie_img/shark.png";
import squirrel from "../../img/derpie_img/squirrel.png";
import { DERPIES_ADDRESS, OPENSEA_URL } from "../../lib/constants";

const fallBackImages = {
  beaver,
  bunny,
  kitty,
  cheetah,
  elephant,
  flamingo,
  fox,
  giraffe,
  hedgie,
  horsie,
  lemur,
  llama,
  narwhal,
  octopus,
  orca,
  piggie,
  rhinoceros,
  sandpiper,
  shark,
  squirrel,
};

const DerpieCard = ({ derpieDetails }) => {
  const imgURI = `https://ipfs.io/ipfs/${derpieDetails.uriJSON.image.split("").splice(7).join("")}`;
  const style = { backgroundColor: `#${derpieDetails.uriJSON.background_color}` };
  return (
    <>
      <div className="card custom-card">
        <div className="card-image">
          <figure style={style} className="image is-4by4">
            {/*onError in case ipfs img url does not work */}
            <img
              src={imgURI}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = fallBackImages[derpieDetails.uriJSON.name];
              }}
            />
          </figure>
          <p className="custom-num-minted">You own {derpieDetails.amount}</p>
        </div>
        <div className="card-content">
          <div className="media">
            <div className="media-left">
              <figure className="image is-48x48">
                <img src={Logo} alt="Whoosie Derpies Logo" />
              </figure>
            </div>
            <div className="media-left has-text-left">
              <p className="title is-4 mb-0 is-capitalized">{derpieDetails.uriJSON.name}</p>
              <p className="">{`Token ID: ${derpieDetails.tokenId}`}</p>
            </div>
          </div>

          <p className="has-text-left mt-0 mb-3 is-size-7">{derpieDetails.uriJSON.description}</p>
          <div className="content field is-grouped is-flex">
            <DerpieAttribute metadata={derpieDetails.uriJSON} traitNum={0} />
            <DerpieAttribute metadata={derpieDetails.uriJSON} traitNum={1} />
            <DerpieAttribute metadata={derpieDetails.uriJSON} traitNum={2} />
          </div>
          <a
            href={`${OPENSEA_URL}/assets/${DERPIES_ADDRESS}/${derpieDetails.tokenId}`}
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

export default DerpieCard;
