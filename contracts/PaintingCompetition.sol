pragma solidity ^0.4.24;

contract PaintingCompetition {

    struct Artist {
        string name;
        string email;
        string painting_url;
        bool is_certified;
        uint votes;
    }

    mapping(address => Artist) public artists;

    uint256 public registration_fee;
    uint256 public registration_deadline;
    uint256 public voting_deadline;

    address public certifier;

    address[] public certified_artists;
    address[] public registered_artists;

    address public winner;

    modifier _onlyCertifier {
        require(msg.sender == certifier);
        _;
    }

    modifier _onlyWhenRegistrationOpen {
      require(block.timestamp <= registration_deadline, "Registration deadline is over");
      _;
    }

    constructor(uint256 _registration_fee, uint256 _registration_deadline, uint256 _voting_deadline) public {
        registration_fee = _registration_fee;
        registration_deadline = _registration_deadline;
        voting_deadline = _voting_deadline;
        certifier = msg.sender;
    }

    event RegistrationCompleted(string _name, string _email, string _url);
    event ArtistCertified(address _artist, string _url, bool _is_certified);
    event ArtistVoted(address _artist, address _voter);

    function registerArtist(string _name, string _email, string _url) public _onlyWhenRegistrationOpen payable {
        require(msg.value >= registration_fee, "Registration fee is not enough");

        artists[msg.sender] = Artist(_name, _email, _url, false, 0);
        registered_artists.push(msg.sender);
        emit RegistrationCompleted(_name, _email, _url);

    }

    function certifyPainting(address _artist) public _onlyCertifier {
        require(block.timestamp <= registration_deadline, "Voting has started");
        require(!artists[_artist].is_certified, "Artist Certified Already")
        artists[_artist].is_certified = true;
        certified_artists.push(_artist);
        emit ArtistCertified(_artist, artists[_artist].painting_url, artists[_artist].is_certified);
    }

    function vote(address _artist) public {
        require(block.timestamp >= registration_deadline, "Registrations are still active");
        require(block.timestamp <= voting_deadline, "Voting deadline is over");
        require(artists[_artist].is_certified, "Artist in not certified");

        artists[_artist].votes += 1;
        emit ArtistVoted(_artist, msg.sender);
    }

    function getWinner() public _onlyCertifier returns(address _winner){
        require(block.timestamp >= registration_deadline, "Registrations are still active");
        require(block.timestamp >= voting_deadline, "Voting is still active");
        require(winner == 0x0, "Winner Already Choosen");
        address most_voted = 0x0;
        uint most_votes = 0;
        for(uint i=0; i<certified_artists.length; i++){
            if(artists[certified_artists[i]].votes > most_votes){
                most_voted = certified_artists[i];
                most_votes = artists[certified_artists[i]].votes;
            }
        }
        if(most_voted != 0x0) {
            most_voted.transfer(address(this).balance);
        }
        winner = most_voted;

        return winner;
    }

    function getArtistDetails(address _artist) public view returns(string _name, string _email, string _url, uint _votes, bool _is_certified, address _address) {
        Artist storage artist = artists[_artist];
        return(artist.name, artist.email, artist.painting_url, artist.votes, artist.is_certified, _artist);
    }

    function getCertifiedArtists() public view returns(address[]) {
        return certified_artists;
    }

    function getRegisteredArtists() public view returns(address[]) {
        return registered_artists;
    }
}
