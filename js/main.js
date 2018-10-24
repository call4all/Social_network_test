$.getJSON('data.json', function(data) {

    //get group of people from data.json and show them in select value property
    function getGroup() {

        for(var i = 0; i < data.length; i++) {

            $('<option value=' + data[i].id + '>' + data[i].firstName + ' ' + data[i].surname + '</option>').appendTo("#friendPicker");
        }

    }

    getGroup();

    var friends = [];
    var friend;
    var arrWithDuplicates = [];
    var arrWithoutDuplicates = [];

    //get id of selected person
    function getPersonIndex() {
        var selectValue = $("#friendPicker option:selected").val();
        for(var i = 0; i < data.length; i++) {

            var id = data[i].id;

            if(id == selectValue){
                return id;
            }
        }
    }

    //for selected person return friends []
    function getDirectFriendsArray() {
        var selectedPersonId = getPersonIndex();

        friends = data[selectedPersonId - 1].friends;

        return friends;
    }

    //return array of friends of friends with duplicate values
    function getfriendsOfFriendsArrayWithDuplicates() {
        getDirectFriendsArray();
        arrWithDuplicates = [];

        for(var i = 0; i < friends.length; i++) {

            friend = friends[i];
            var myFriendObj = data[friend - 1];

            for(var index in myFriendObj) {

                if(index == "friends"){
                    var friendsArray = myFriendObj[index];

                    for(var j = 0; j < friendsArray.length; j++) {
                        if(getPersonIndex() != friendsArray[j]){
                            arrWithDuplicates.push(friendsArray[j]);
                        }

                    }

                }
            }

        }
        return arrWithDuplicates;
    }

    //get friends of friends array without duplicates and return friends []
    function getFriendsOfFriendsArray() {
        getDirectFriendsArray();
        getfriendsOfFriendsArrayWithDuplicates();

        //remove duplicates
        arrWithoutDuplicates = arrWithDuplicates.filter(function(item, pos) {
            return arrWithDuplicates.indexOf(item) == pos;
        });

        friends = arrWithoutDuplicates;
        return friends;
    }

    //get suggested friends array and return friends []
    function getSuggestedFriendsArray() {
        getDirectFriendsArray();
        getfriendsOfFriendsArrayWithDuplicates();

        var sorted_arr = arrWithDuplicates.slice().sort();
        var suggestedFriendsArray = [];

        //find duplicates in sorted_arr and insert in suggestedFriendsArray []
        for(var i = 0; i < sorted_arr.length - 1; i++) {
            if(sorted_arr[i + 1] === sorted_arr[i]){
                suggestedFriendsArray.push(sorted_arr[i]);
            }
        }

        //check for direct friends in suggestedFriendsArray [] and remove element
        for(var i = 0; i < friends.length; i++) {
            for(var j = 0; j < suggestedFriendsArray.length; j++) {
                if(friends[i] === suggestedFriendsArray[j]){
                    suggestedFriendsArray.splice(j, 1);
                }
            }

        }

        friends = suggestedFriendsArray;

        return friends;
    }

    //use array friends [] to display table of friends
    function showFriends() {
        $('#tableid').html('');
        $('#tableid').append('<tr><th>First name</th><th>Surname</th><th>Age</th><th>Gender</th></tr>');

        for(var i = 0; i < friends.length; i++) {

            friend = friends[i];
            var myFriendObj = data[friend - 1];

            for(var index in myFriendObj) {

                if(index == 'firstName'){
                    $('#tableid').append('<tr>');

                    $('#tableid').append('<td>' + myFriendObj[index] + '</td>');
                }
                if(index == 'surname'){

                    $('#tableid').append('<td>' + myFriendObj[index] + '</td>');
                    $('#tableid').append('</tr>');
                }
                if(index == 'age'){

                    $('#tableid').append('<td>' + myFriendObj[index] + '</td>');
                    $('#tableid').append('</tr>');
                }
                if(index == 'gender'){

                    $('#tableid').append('<td>' + myFriendObj[index] + '</td>');
                    $('#tableid').append('</tr>');
                }
            }
        }
    }

    function getDirectFriends() {
        getDirectFriendsArray();
        showFriends();
    }

    function getFriendsOfFriends() {
        getFriendsOfFriendsArray();
        showFriends();
    }

    function getSuggestedFriends() {

        getSuggestedFriendsArray();
        showFriends();
    }

    $('#directFriends').click(getDirectFriends);
    $('#friendsOfFriends').click(getFriendsOfFriends);
    $("#suggestedFriends").click(getSuggestedFriends);

});
