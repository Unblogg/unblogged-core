// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./ERC721A.sol";
import "./ITablelandTables.sol";

contract UnbloggedNFT is ERC721A, Ownable {
    // Our will be pulled from the network
    string private _baseURIString =
        "https://testnet.tableland.network/query?s=";

    ITablelandTables private _tableland;
    string private _metadataTable;
    uint256 private _metadataTableId;
    string private _tablePrefix = "canvas";

    // Called only when the smart contract is created
    constructor(address registry) ERC721A("UnbloggedNFT", "UBG") {
        // Setup steps in our smart contract
        _tableland = ITablelandTables(registry); // Polygon Mumbai Registry: 0x4b48841d4b32C4650E4ABc117A03FE8B51f38F68

        // Stores the unique ID for the newly created table
        // On tags: https://stackoverflow.com/questions/2885564/ways-to-implement-tags-pros-and-cons-of-each
        _metadataTableId = _tableland.createTable(
            address(this),
            string.concat(
                "CREATE TABLE unblogged_hackfs_",
                Strings.toString(block.chainid),
                " (articleId int, title text, tag_1 text, tag_2 text, tag_3 text, author text, ipfsCid text);"
            )
        );
    }

    /**
     * @dev safeMint allows anyone to mint a token in this project.
     * Any time a token is minted, a new row of metadata will be
     * dynamically inserted into the metadata table.
     */
    function safeMint() public {
        /* Any table updates will go here */
        _safeMint(msg.sender, 1);
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseURIString;
    }

    /**
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
