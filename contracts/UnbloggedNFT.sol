// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./ERC721A.sol";
import "./ITablelandTables.sol";

contract CanvasGame is ERC721A, Ownable {
    // Our will be pulled from the network
    string private _baseURIString =
        "https://testnet.tableland.network/query?s=";

    // Called only when the smart contract is created
    constructor() ERC721A("Pixel", "ITM") {
        // Setup steps in our smart contract
    }

    /*
     * @dev safeMint allows anyone to mint a token in this project.
     * Any time a token is minted, a new row of metadata will be
     * dynamically inserted into the metadata table.
     */
    function safeMint(address to) public returns (uint256) {
        uint256 newItemId = _tokenIds.current();

        /* Any table updates will go here */

        _safeMint(to, newItemId, "");
        _tokenIds.increment();
        return newItemId;
    }

    /*
     * @dev makeMove is an example of how to encode gameplay into both the
     * smart contract and the metadata. Whenever a token owner calls
     * make move, they can supply a new x,y coordinate and update
     * their token metadata.
     */
    function makeMove(
        uint256 tokenId,
        uint256 x,
        uint256 y
    ) public {
        // Check token ownership
        require(this.ownerOf(tokenId) == msg.sender, "Invalid owner");
        // Simple on-chain gameplay enforcement
        require(x < 512 && 0 <= x, "Out of bounds");
        require(y < 512 && 0 <= y, "Out of bounds");

        /* Any table updates will go here */
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseURIString;
    }

    /*
     * @dev tokenURI is an example of how to turn a row in your table back into
     * erc721 compliant metadata JSON. Here, we do a simple SELECT statement
     * with function that converts the result into json.
     */
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721URIStorage: URI query for nonexistent token"
        );
        string memory base = _baseURI();

        /* We will give token viewers a way to get at our table metadata */
        return;
    }
}
