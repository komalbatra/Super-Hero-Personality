$(document).ready(function(){
    $('.results-page').hide();
    $('.card-deck').hide();
    $('#lock-btn').prop('disabled', false);

    //decalre local variables
    var userAge, userGender, heroMatchName, 
    heroMatchPhoto, heroMatchInt, heroMatchStr, 
    heroMatchSpd, heroMatchDur, heroMatchPow, heroMatchCmb, timeStamp;

    var database = firebase.database();
    var dbRecord;

    var userName = $('#name-input').val();
    var userIntInput = parseInt($('#intel-value').text());
    var userStrInput = parseInt($('#stren-value').text());
    var userSpdInput = parseInt($('#speed-value').text());
    var userDurInput = parseInt($('#durab-value').text());
    var userPowInput = parseInt($('#power-value').text());
    var userCmbInput = parseInt($('#combat-value').text());

    var timerId;
    var createUserResult;
    
    /******************************************************/
    // Lock button Click
    $('#lock-btn').on('click', function (event) {
        
        event.preventDefault();

        // Log input values
        userName = $('#name-input').val();
        userIntInput = parseInt($('#intel-value').text());
        userStrInput = parseInt($('#stren-value').text());
        userSpdInput = parseInt($('#speed-value').text());
        userDurInput = parseInt($('#durab-value').text());
        userPowInput = parseInt($('#power-value').text());
        userCmbInput = parseInt($('#combat-value').text());

        console.log("User Name = " + userName);
        console.log("Int = " + userIntInput);
        console.log("Str = " + userStrInput);
        console.log("Spd = " + userSpdInput);
        console.log("Dur = " + userDurInput);
        console.log("Pow 5 = " + userPowInput);
        console.log("Com 6 = " + userCmbInput);

        $('#lock-btn').prop('disabled', true);
    });

    /******************************************************/
    // Submit button Click

    // Render results on Submit
    $('#submit-btn').on('click', function (event) {
        event.preventDefault();

        $('.results-page').show();
	    $('.card-deck').show();

        timerId = setTimeout(createUserResult, 5000);

        // Create Chart.js Results
        createChartJS(userIntInput, userStrInput, userSpdInput, userDurInput, userPowInput, userCmbInput);

        /******************************************************/
        // Database Listener and creating Friend Cards
        database.ref().on("child_added", function (snapshot) {
            record = snapshot.val();
                
            // Pulling data from Db 
            userName = record.userNameDb;
            userAge = record.userAgeDb;
            userGender =  record.userGenderDb;
            heroMatchName = record.heroMatchNameDb;
            heroMatchPhoto = record.heroMatchPhotoDb;
            heroMatchInt = record.heroMatchIntDb;
            heroMatchStr = record.heroMatchStrDb;
            heroMatchSpd = record.heroMatchSpdDb;
            heroMatchDur = record.heroMatchDurDb;
            heroMatchPow = record.heroMatchPowDb;
            heroMatchCmb = record.heroMatchCmbDb;
            timeStamp = record.userTimeStampDb;
            
            // Take Db data and turning into card
            dbRecord = userName, userAge, userGender, heroMatchName, heroMatchPhoto, heroMatchInt, heroMatchStr, heroMatchSpd, heroMatchDur, heroMatchPow, heroMatchCmb, timeStamp;

            // Create friend card
            createFriendCard(dbRecord);
            console.log(timeStamp);
        });
    });

    /**********************************************/
    // Function to create user Match and append to DOM
    createUserResult = function(userName, $heroIntValue, $heroStrValue, $heroSpdValue, $heroDurValue, $heroPowValue, $heroCmbValue, $heroName, $heroPhoto){
        
        // PULL HERO RESULTS FROM lock-btn
        var $heroName = $('#lock-btn').attr('hero-name-data');
        console.log("Hero Name = "+ $heroName);
        var $heroPhoto = $('#lock-btn').attr('hero-photo-data');
        console.log("Hero PHOTO = "+ $heroPhoto);
        var $heroIntValue = $('#lock-btn').attr('hero-int-data');
        console.log("Hero INT = "+ $heroIntValue);
        var $heroStrValue = $('#lock-btn').attr('hero-str-data');
        console.log("Hero STR = "+ $heroStrValue);
        var $heroSpdValue = $('#lock-btn').attr('hero-spd-data');
        console.log("Hero SPD = "+ $heroSpdValue);
        var $heroDurValue = $('#lock-btn').attr('hero-dur-data');
        console.log("Hero DUR = "+ $heroDurValue);
        var $heroPowValue = $('#lock-btn').attr('hero-pow-data');
        console.log("Hero POW = "+ $heroPowValue);
        var $heroCmbValue = $('#lock-btn').attr('hero-cmb-data');
        console.log("Hero CMB = "+ $heroCmbValue);
        
        // Creating Card Elements
        var resultsBody = $('<div>', {id:'results-body', class:'card-body row'});
        var heroesPicsDiv = $('<img>', {id:'heroes-pics-div', class:'text-center'});
        var matchedStatsDiv = $('<div>', {id:'matched-stats-div'});
        var ol = $('<ol>', {class:'list'});
        var li1 = $('<li>', {id:'li-1', class:'card-text'});
        var li2 = $('<li>', {id:'li-2', class:'card-text'});
        var li3 = $('<li>', {id:'li-3', class:'card-text'});
        var li4 = $('<li>', {id:'li-4', class:'card-text'});
        var li5 = $('<li>', {id:'li-5', class:'card-text'});
        var li6 = $('<li>', {id:'li-6', class:'card-text'});

        // Adding data and attributes to card
        $('#results-title').attr('friend-name', userName);
        $('#results-title').text('Your Matched Hero: ' + $heroName);
        heroesPicsDiv.attr('src', $heroPhoto);

        li1.text('Intelligence: ' + $heroIntValue);
        li2.text('Strength: ' + $heroStrValue);
        li3.text('Speed: ' + $heroSpdValue);
        li4.text('Durability: ' + $heroDurValue);
        li5.text('Power: ' + $heroPowValue);
        li6.text('Combat: ' + $heroCmbValue);

        // Append card to DOM
        $('#matched-hero').append(resultsBody);
        resultsBody.append(heroesPicsDiv, matchedStatsDiv);
        matchedStatsDiv.append(ol);
        ol.append(li1, li2, li3, li4, li5, li6);

        // Adding Chart.js to render user and hero results
        var ctx = document.getElementById("myChart").getContext('2d');
        var myRadarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ["Intelligence", "Strength", "Speed", "Durability", "Power", "Combat"],
            datasets: [
                {
                    label: 'You',
                    backgroundColor: 'rgba(255, 0, 0, 0.2)',
                    borderColor: 'rgba(255, 0, 0, 1)',
                    borderWidth: 4,
                    data: [userIntInput, userStrInput, userSpdInput, userDurInput, userPowInput, userCmbInput],
                    pointRadius: 6,
                    pointBackgroundColor: 'rgba(255, 0, 0, 1)'           
                }, {
                    label: 'Your Hero',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 4,
                    data: [$heroIntValue, $heroStrValue, $heroSpdValue, $heroDurValue, $heroPowValue, $heroCmbValue],
                    pointRadius: 6, 
                    pointBackgroundColor: 'rgba(54, 162, 235, 1)'
                }]
            },
        });

        //clear timer
        clearInterval(timerId);
    };
    
    /******************************************************/
    // Function to create friend cards and append to DOM
    function createFriendCard(dbRecord) {
        //console.log('createCards', dbRecord);
        $('.card-deck').show();
        // Creating Card Elements
        var friendsCard = $('<div>', {id:'friends-card', class:'card'});
        var heroTopImageDiv = $('<img>', {id:'hero-top-image', class:'card-img-top'});
        var cardBody = $('<div>', {class:'card-body'});
        var cardTitle = $('<h5>', {class:'card-title'});
        var cardText = $('<h6>', {class:'card-text'});
        var ol = $('<ol>', {class:'list'});
        var li1 = $('<li>', {id:'li-1', class:'card-text'});
        var li2 = $('<li>', {id:'li-2', class:'card-text'});
        var li3 = $('<li>', {id:'li-3', class:'card-text'});
        var li4 = $('<li>', {id:'li-4', class:'card-text'});
        var li5 = $('<li>', {id:'li-5', class:'card-text'});
        var li6 = $('<li>', {id:'li-6', class:'card-text'});
        var cardFooter = $('<div>', {class:'card-footer'});
        var dateFooter = $('<small>', {id:'date', class:'text-muted'});

        // Adding data and attributes to card
        cardTitle.attr('friend-name', userName);
        cardTitle.text(userName);

        heroTopImageDiv.attr('src', heroMatchPhoto)

        cardText.text(userName + ' (' + userGender + ', ' + userAge + '), matched with: ' + heroMatchName);

        li1.text('Intelligence: ' + heroMatchInt);
        li2.text('Strength: ' + heroMatchStr);
        li3.text('Speed: ' + heroMatchSpd);
        li4.text('Durability: ' + heroMatchDur);
        li5.text('Power: ' + heroMatchPow);
        li6.text('Combat: ' + heroMatchCmb);

        dateFooter.text('Date added: ' + timeStamp);

        // Append card to DOM
        $('#friend-results').prepend(friendsCard);
        friendsCard.append(heroTopImageDiv, cardBody, cardFooter);
        cardBody.append(cardTitle, cardText, ol);
        ol.append(li1, li2, li3, li4, li5, li6);
        cardFooter.append(dateFooter);
    };

    /******************************************************/
    // ChartJS function
    function createChartJS (userIntInput, userStrInput, userSpdInput, userDurInput, userPowInput, userCmbInput, $heroIntValue, $heroStrValue, $heroSpdValue, $heroDurValue, $heroPowValue, $heroCmbValue) {
        var ctx = document.getElementById("myChart").getContext('2d');
        var myRadarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ["Intelligence", "Strength", "Speed", "Durability", "Power", "Combat"],
            datasets: [
                {
                    label: 'You',
                    backgroundColor: 'rgba(255, 0, 0, 0.2)',
                    borderColor: 'rgba(255, 0, 0, 1)',
                    borderWidth: 4,
                    data: [userIntInput, userStrInput, userSpdInput, userDurInput, userPowInput, userCmbInput],
                    pointRadius: 6,
                    pointBackgroundColor: 'rgba(255, 0, 0, 1)'           
                }]
            },
        });
    };

});