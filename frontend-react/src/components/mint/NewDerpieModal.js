import React from "react";
import DerpieCard from "../derpieCard/DerpieCard";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const NewDerpieModal = ({ mintedDerpieDetails, transactionHash, handleClose }) => {
  return (
    <>
      <div id="modal" className="modal is-active">
        <div className="modal-background" onClick={handleClose}></div>
        <div className="modal-content custom-reveal-animation ">
          <div className="box is-flex is-justify-content-center ">
            <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center new-derpie-background custom-new-derpie-mobile">
              <p className="is-size-4 is-uppercase mb-2 is-hidden-mobile">
                <FontAwesomeIcon className="fas fa-2x fa-solid is-size-3  " icon={faStar} /> a new derpie is born!{" "}
                <FontAwesomeIcon className="fas fa-2x fa-solid is-size-3 " icon={faStar} />
              </p>
              <DerpieCard derpieDetails={mintedDerpieDetails} />
              <p className="is-size-7 pt-3 is-hidden-mobile">Transaction Hash:</p>
              <p className="is-size-7 is-hidden-mobile">{transactionHash}</p>
            </div>
          </div>
        </div>
        <button className="modal-close is-large" aria-label="close" onClick={handleClose}></button>
      </div>
    </>
  );
};

export default NewDerpieModal;
