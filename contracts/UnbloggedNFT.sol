// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./ERC721A.sol";
import "./ITablelandTables.sol";
import "./Base64.sol";

contract UnbloggedNFT is ERC721A, Ownable {
    using Strings for uint256;
    // Our will be pulled from the network
    string private _baseURIString =
        "https://testnet.tableland.network/query?s=";

    ITablelandTables private _tableland;
    string private _metadataTable;
    uint256 private _metadataTableId;
    string private _tablePrefix = "unblogged_hackfs_";
    string private _defaultNFTImage;
    mapping(string => bool) private cidMinted;

    // Called only when the smart contract is created
    constructor(address registry, string memory defaultImage)
        ERC721A("UnbloggedNFT", "UBG")
    {
        // Setup steps in our smart contract
        _tableland = ITablelandTables(registry); // Polygon Mumbai Registry: 0x4b48841d4b32C4650E4ABc117A03FE8B51f38F68

        // Stores the unique ID for the newly created table
        // On tags: https://stackoverflow.com/questions/2885564/ways-to-implement-tags-pros-and-cons-of-each
        _metadataTableId = _tableland.createTable(
            address(this),
            string.concat(
                "CREATE TABLE ",
                _tablePrefix,
                Strings.toString(block.chainid),
                " (articleId int, title text, tag_1 text, tag_2 text, tag_3 text, author text, ipfsCid text, timestamp int);"
            )
        );

        // Stores the full tablename for the new table. {prefix}_{chainid}_{tableid}
        _metadataTable = string.concat(
            _tablePrefix,
            Strings.toString(block.chainid),
            "_",
            Strings.toString(_metadataTableId)
        );

        _defaultNFTImage = defaultImage;
    }

    /**
     * @dev mint allows anyone to mint a token in this project.
     * Any time a token is minted, a new row of metadata will be
     * dynamically inserted into the metadata table.
     */
    function mint(
        string memory title,
        string memory tag_1,
        string memory tag_2,
        string memory tag_3,
        string memory ipfsCid
    ) public {
        require(
            !cidMinted[ipfsCid],
            "UnbloggedNFT: CID has already been minted!"
        );
        uint256 _nextTokenId;
        /* Any table updates will go here */
        _tableland.runSQL(
            address(this),
            _metadataTableId,
            string.concat(
                "INSERT INTO ",
                _metadataTable,
                " (articleId, title, tag_1, tag_2, tag_3, author, ipfsCid) VALUES (",
                Strings.toString(_nextTokenId),
                ", '",
                title,
                "', '",
                tag_1,
                "', '",
                tag_2,
                "', '",
                tag_3,
                "', '",
                Strings.toHexString(uint256(uint160(msg.sender)), 20),
                "', '",
                ipfsCid,
                "', '",
                Strings.toString(block.timestamp),
                "')"
            )
        );
        _safeMint(msg.sender, 1);
        cidMinted[ipfsCid] = true;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseURIString;
    }

    function metadataURI() public view returns (string memory) {
        string memory base = _baseURI();
        return string.concat(base, "SELECT%20*%20FROM%20", _metadataTable);
    }

    /**
     * @dev tokenURI is an example of how to turn a row in your table back into
     * erc721 compliant metadata JSON. Here, we do a simple SELECT statement
     * with function that converts the result into json.
     */
    // Fitted for OPENSEA VIEWING
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

        bytes memory m1 = abi.encodePacked(
            '{"name":"Unblogged Article #',
            Strings.toString(tokenId),
            '", "description":"Unblogged Article #', //TODO: Link to article
            Strings.toString(tokenId),
            '", "image": "',
            _defaultNFTImage,
            '"}'
        );

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(bytes.concat(m1))
                )
            );

        // /* We will give token viewers a way to get at our table metadata */
        // return;
    }

    /**
     * @notice Get the URL String of the tableland query
     */
    function tablelandURI(uint256 tokenId) public view returns (string memory) {
        require(
            _exists(tokenId),
            "ERC721URIStorage: URI query for nonexistent token"
        );
        string memory base = _baseURI();
        string memory query = string.concat(
            "SELECT%20*%20FROM%20",
            _metadataTable,
            "%20WHERE%20articleId=",
            Strings.toString(tokenId)
        );

        return string.concat(base, query);
    }
}
