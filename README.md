# Whoopsie Derpies ERC1155 - Ethereum Mainnet

Whoopsie Derpies is a hand-drawn art collection that lives on the Ethereum blockchain as ERC1155 tokens. Inspired by drawing animals for our twin toddlers whilst getting bumped around and receiving conflicting requests. The animals are cute and just a little bit derpy.

There are 20 unique animals that are possible to mint, each with their own description, preferred name, and level of derpiness. Each animal has a certain number of copies for a total of 267 Whoopsie Derpies (what a silly number!).

Front end currently deployed at https://whoopsiederpies.xyz.

Smart contract deployed to Ethereum Mainnet at contract address 0x833696cc64e68A7cf5A045256420bF7dF3bA8bB6. View verified contract at https://etherscan.io/address/0x833696cc64e68A7cf5A045256420bF7dF3bA8bB6

View minted Derpies collection at https://opensea.io/collection/whoopsiederpies.

<kbd> 
<img src="https://user-images.githubusercontent.com/85373263/166078318-e70dba64-3c47-47fa-b083-3c2269ea3c05.png"/>
</kbd>
<br />
<br />
<kbd> 
<img src="https://user-images.githubusercontent.com/85373263/166078325-413790dc-7bbd-409d-babc-cb819407baaa.png"/>
</kbd>

### Features & Design

#### Frontend

- React for frontend build.
- Bulma.io CSS framework
- Moralis and ethers.js library for interacting with Ethereum.
- Error handling and notifications to help the user navigate the wait-times associated with blockchains and oracles.

#### Smart Contract

- Written in Solidity.
- Follows the ERC1155 Multi Token Standard.
- Inherits from OpenZeppelin's ERC1155 and Ownable contracts and interfaces.
- The contract was written with high network fees in mind. Effort was made to lower the gas cost to mint, while maintaining security with battle-tested contracts. Minting a single Derpie costs approximately 38,000 gas compared to contracts like Bored Ape Yacht Club that cost approximately 150,000 gas. Plus, minting multiple copies of the same Derpie in a single transaction costs the same gas as minting a single Derpie!
- Metadata and images are stored on IPFS and pinned using Pinata.
- Hardhat development environment used for compiling, testing, and deployment.

### TODOS

#### Frontend

- [ ] add WalletConnect functionality for mobile or RainbowKit when available.

#### Smart Contract

- [ ] ...

# Screenshots

<kbd> 
<img src="https://user-images.githubusercontent.com/85373263/166078318-e70dba64-3c47-47fa-b083-3c2269ea3c05.png"/>
</kbd>
<br />
<br />
<img src="https://user-images.githubusercontent.com/85373263/166078331-bafe9901-e024-4fed-ad49-bd046784a1c9.png"/>
</kbd>
<br />
<br />
<kbd> 
<img src="https://user-images.githubusercontent.com/85373263/166078325-413790dc-7bbd-409d-babc-cb819407baaa.png"/>
</kbd>
<br />
<br />
<kbd>
<br />
<br />
<kbd> 
<img src="https://user-images.githubusercontent.com/85373263/166078336-94fcb310-bf29-461d-8a49-e78293ffad85.png"/>
</kbd>
