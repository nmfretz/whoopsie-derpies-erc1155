const { expect } = require("chai");
const { ethers } = require("hardhat");
require("dotenv").config();

const price = process.env.DERPIE_PRICE_IN_ETH;

describe("WhoopsieDerpies", () => {
  let DerpiesFactory, derpiesContract;
  let deployer, addr1, addr2, addrs;

  beforeEach(async () => {
    DerpiesFactory = await ethers.getContractFactory("WhoopsieDerpies");
    derpiesContract = await DerpiesFactory.deploy();
    await derpiesContract.deployed();

    [deployer, addr1, addr2, ...addrs] = await ethers.getSigners();
  });

  describe("Deployment", () => {
    it("Should set owner of the contract to the deployer address", async () => {
      expect(await derpiesContract.owner()).to.equal(deployer.address);
    });

    it("should set the correct contract uri", async () => {
      expect(await derpiesContract.contractURI()).to.equal(
        process.env.CONTRACT_METADATA_URI
      );
    });

    it("set correct uri", async () => {
      expect(await derpiesContract.uri(0)).to.equal(process.env.URI);
    });

    it("should mint one of each derpie to owner address", async () => {
      for (let i = 0; i < 20; i++) {
        expect(await derpiesContract.balanceOf(deployer.address, i)).to.equal(
          1
        );
      }
    });

    it("should return the correct price", async () => {
      for (let i = 0; i < 20; i++) {
        expect(await derpiesContract.DERPIE_PRICE()).to.equal(
          ethers.utils.parseEther(price)
        );
      }
    });

    it("should return the correct existing supply of a token - OpenSea function", async () => {
      expect(await derpiesContract.totalSupply(1)).to.equal(1);
    });
  });

  describe("Mint Transactions", () => {
    it("Should allow minting of a derpie with correct ether sent", async () => {
      const id = 3;
      const mintTx = await derpiesContract.mint(id, 8, {
        value: ethers.utils.parseEther((price * 8).toString()),
      });
      await mintTx.wait();

      const amountOwned = await derpiesContract.balanceOf(deployer.address, id);
      const amountOwnedInt = parseInt(amountOwned.toString());
      expect(amountOwnedInt).to.equal(9);
    });

    it("Should revert if incorrect eth sent with mint function", async () => {
      await expect(
        derpiesContract.mint(1, 1, {
          value: ethers.utils.parseEther("0.011"),
        })
      ).to.be.revertedWith("incorrect ETH");
    });

    it("Should revert if calling mint function above max supply", async () => {
      const id = 0;
      const maxSupplyPlusOne = await derpiesContract.tokenIdToMaxSupplyPlusOne(
        id
      );
      const maxSupplyPlusOneInt = parseInt(maxSupplyPlusOne.toString()) - 1; // 1 already minted to contract owner in constructor
      const eth = price * maxSupplyPlusOneInt;

      await expect(
        derpiesContract.mint(id, maxSupplyPlusOneInt, {
          value: ethers.utils.parseEther(eth.toString()),
        })
      ).to.be.revertedWith("supply exceeded");
    });

    it("Should allow owner to mint with ownerMint", async () => {
      const id = 15;
      const num = 3;
      const mintTx = await derpiesContract.ownerMint(deployer.address, id, num);
      await mintTx.wait();

      const amountOwned = await derpiesContract.balanceOf(deployer.address, id);
      const amountOwnedInt = parseInt(amountOwned.toString());
      expect(amountOwnedInt).to.equal(num + 1);
    });

    it("should revert if non-owner tries to mint with ownerMint", async () => {
      const id = 15;
      const num = 3;

      await expect(
        derpiesContract.connect(addr1).ownerMint(addr1.address, id, num)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should revert if calling ownerMint function above max supply", async () => {
      const id = 3;
      const maxSupplyPlusOne = await derpiesContract.tokenIdToMaxSupplyPlusOne(
        id
      );
      const maxSupplyPlusOneInt = parseInt(maxSupplyPlusOne.toString()) - 1; // 1 already minted to owner in constructor

      await expect(
        derpiesContract.ownerMint(addr1.address, id, maxSupplyPlusOneInt)
      ).to.be.revertedWith("supply exceeded");
    });

    it("should allow user to mintBatch with correct eth", async () => {
      const ids = [1, 2, 3, 4, 5, 6, 7];
      const amounts = [3, 1, 4, 9, 7, 3, 2];
      const eth = amounts.reduce((prev, curr) => prev + curr, 0) * price;

      const mintTx = await derpiesContract
        .connect(addr1)
        .mintBatch(ids, amounts, {
          value: ethers.utils.parseEther(eth.toString()),
        });
      await mintTx.wait();

      for (let i = 0; i < ids.length; i++) {
        expect(await derpiesContract.balanceOf(addr1.address, ids[i])).to.equal(
          amounts[i]
        );
      }
    });

    it("should revert if user calls mintBatch with incorrect eth", async () => {
      const ids = [1, 2, 3, 4, 5, 6, 7];
      const amounts = [3, 1, 4, 9, 7, 3, 2];
      const eth = amounts.reduce((prev, curr) => prev + curr, 0) * price + 0.01;

      await expect(
        derpiesContract.connect(addr1).mintBatch(ids, amounts, {
          value: ethers.utils.parseEther(eth.toString()),
        })
      ).to.be.revertedWith("incorrect ETH");
    });

    it("should revert if user calls mintBatch above max supply", async () => {
      const ids = [1, 2, 3, 4, 5, 6, 7];
      const amounts = [3, 1, 4, 9, 7, 3, 20]; // id = 7 has 20 max supply and 1 already minted to contract owner in constructor
      const totalAmount = amounts.reduce((prev, curr) => prev + curr, 0);
      const eth = (totalAmount * price).toFixed(2);

      await expect(
        derpiesContract.connect(addr1).mintBatch(ids, amounts, {
          value: ethers.utils.parseEther(eth.toString()),
        })
      ).to.be.revertedWith("supply exceeded");
    });

    it("should allow owner to call ownerMintBatch", async () => {
      const ids = [1, 2, 3, 4, 5, 6, 7];
      const amounts = [3, 1, 4, 9, 7, 3, 2];

      const mintTx = await derpiesContract.ownerMintBatch(ids, amounts);
      await mintTx.wait();

      for (let i = 0; i < ids.length; i++) {
        expect(
          await derpiesContract.balanceOf(deployer.address, ids[i])
        ).to.equal(amounts[i] + 1);
      }
    });

    it("should revert if non-owner calls ownerMintBatch", async () => {
      const ids = [1, 2, 3, 4, 5, 6, 7];
      const amounts = [3, 1, 4, 9, 7, 3, 2];

      await expect(
        derpiesContract.connect(addr1).ownerMintBatch(ids, amounts)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should revert if owner calls ownerMintBatch above max supply", async () => {
      const ids = [1, 2, 3, 4, 5, 6, 7];
      const amounts = [3, 1, 4, 9, 7, 3, 20]; // id = 7 has 20 max supply and 1 already minted to contract owner in constructor

      await expect(
        derpiesContract.ownerMintBatch(ids, amounts)
      ).to.be.revertedWith("supply exceeded");
    });
  });

  describe("Transfer Transactions", () => {
    it("Should allow an address to call safeTransferFrom with a token that it owns and contract should emit event", async () => {
      const id = 3;
      const amount = 2;
      const eth = amount * price;
      const mintTx = await derpiesContract.connect(addr1).mint(id, amount, {
        value: ethers.utils.parseEther(eth.toString()),
      });
      await mintTx.wait();

      const transferTx = await derpiesContract
        .connect(addr1)
        .safeTransferFrom(addr1.address, deployer.address, id, 1, "0x00");
      await transferTx.wait();

      expect(await derpiesContract.balanceOf(deployer.address, id)).to.equal(2);

      // emit event
      await expect(
        derpiesContract
          .connect(addr1)
          .safeTransferFrom(addr1.address, deployer.address, id, 1, "0x00")
      )
        .to.emit(derpiesContract, "TransferSingle")
        .withArgs(addr1.address, addr1.address, deployer.address, id, 1);
    });

    it("Should revert if an address calls safeTransferFrom with a token it does not own", async () => {
      const id = 3;
      const amount = 2;
      const eth = amount * price;
      const mintTx = await derpiesContract.connect(addr1).mint(id, amount, {
        value: ethers.utils.parseEther(eth.toString()),
      });
      await mintTx.wait();

      await expect(
        derpiesContract.safeTransferFrom(
          addr1.address,
          deployer.address,
          id,
          1,
          "0x00"
        )
      ).to.be.revertedWith("ERC1155: caller is not owner nor approved");
    });

    it("Should allow an address to call safeBatchTransferFrom with tokens that it owns and contract should emit event", async () => {
      let ids = [0, 1, 2, 3, 4];
      let amounts = [1, 1, 1, 1, 1];
      // already minted to contract owner in constructor
      const transferTx = await derpiesContract.safeBatchTransferFrom(
        deployer.address,
        addr1.address,
        ids,
        amounts,
        "0x00"
      );
      await transferTx.wait();

      for (let i = 0; i < ids.length; i++) {
        expect(await derpiesContract.balanceOf(addr1.address, ids[i])).to.equal(
          amounts[i]
        );
      }

      // emit event
      ids = [6, 7, 8];
      amounts = [1, 1, 1];
      await expect(
        derpiesContract.safeBatchTransferFrom(
          deployer.address,
          addr1.address,
          ids,
          amounts,
          "0x00"
        )
      )
        .to.emit(derpiesContract, "TransferBatch")
        .withArgs(
          deployer.address,
          deployer.address,
          addr1.address,
          ids,
          amounts
        );
    });

    it("Should revert if an address calls safeBatchTransferFrom with tokens it does not own", async () => {
      let ids = [0, 1, 2, 3, 4];
      let amounts = [1, 1, 1, 1, 1];
      // already minted 1 of each to contract owner in constructor

      await expect(
        derpiesContract
          .connect(addr1)
          .safeBatchTransferFrom(
            addr1.address,
            deployer.address,
            ids,
            amounts,
            "0x00"
          )
      ).to.be.revertedWith("ERC1155: insufficient balance for transfer");
    });
  });

  describe("Set URI Transactions", () => {
    it("should return correct contract uri after calling setContractURI", async () => {
      const newURIString = "ipfs://newURI";
      await derpiesContract.setContractURI(newURIString);

      expect(await derpiesContract.contractURI()).to.equal(newURIString);
    });

    it("should revert if non-owner calls setContractURI", async () => {
      const newURIString = "ipfs://newURI";

      await expect(
        derpiesContract.connect(addr1).setContractURI(newURIString)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    // it("should return correct uri after calling setURI", async () => {
    //   const newURIString = "ipfs://newURI/{id}.json";
    //   await derpiesContract.setURI(newURIString);

    //   expect(await derpiesContract.uri(0)).to.equal(newURIString);
    // });

    // it("should revert if non-owner calls setURI", async () => {
    //   const newURIString = "ipfs://newURI/{id}.json";
    //   await expect(
    //     derpiesContract.connect(addr1).setURI(newURIString)
    //   ).to.be.revertedWith("Ownable: caller is not the owner");
    // });
  });

  describe("Withdraw Transactions", () => {
    it("Should allow owner to withdraw funds", async () => {
      const provider = ethers.provider;

      const ids = [1, 2, 3, 4, 5, 6, 7];
      const amounts = [3, 1, 4, 9, 7, 3, 2];
      const eth = amounts.reduce((prev, curr) => prev + curr, 0) * price;

      const mintTx = await derpiesContract
        .connect(addr1)
        .mintBatch(ids, amounts, {
          value: ethers.utils.parseEther(eth.toString()),
        });
      await mintTx.wait();

      const beforeBalance = await provider.getBalance(deployer.address);

      const withdrawTx = await derpiesContract.withdraw();
      await withdrawTx.wait();

      const afterBalance = await provider.getBalance(deployer.address);

      expect(parseFloat(afterBalance.toString())).to.be.greaterThan(
        parseFloat(beforeBalance.toString())
      );
    });

    it("should revert if non-owner tries to withdraw funds", async () => {
      await expect(
        derpiesContract.connect(addr1).withdraw()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
