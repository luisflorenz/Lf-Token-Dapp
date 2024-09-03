// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenCounter;

    constructor() ERC721("MyNFT", "MNFT") Ownable(msg.sender) {
        _tokenCounter = 0;
    }

    function mintNFT(address recipient, string memory tokenURI) public onlyOwner {
        uint256 newItemId = _tokenCounter;
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        _tokenCounter++;
    }
}
