const genres = {
    "Action": false,
    "Adventure": false,
    "Comedy": false,
    "Drama": false,
    "Ecchi": false,
    "Fantasy": false,
    "Horror": false,
    "Mahou Shoujo": false,
    "Mecha": false,
    "Music": false,
    "Mystery": false,
    "Psychological": false,
    "Romance": false,
    "Sci-Fi": false,
    "Slice of Life": false,
    "Sports": false,
    "Supernatural": false,
    "Thriller": false,
};

var anime_data = [];

function search(input) {
    const searchInput = input.toLowerCase();
    const searchResults = [];

    // Filter genres based on search input and value
    for (const genre in genres) {
        if (genres.hasOwnProperty(genre) && !genres[genre] && genre.toLowerCase().includes(searchInput)) {
            searchResults.push(genre);
        }
    }

    return searchResults;
}



// only show year in date selection calendar
$(function () {
    $('.date-picker-year').datepicker({
        changeYear: true,
        showButtonPanel: true,
        dateFormat: 'yy',
        onClose: function (dateText, inst) {
            var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
            $(this).datepicker('setDate', new Date(year, 1));
        }
    });
    $(".date-picker-year").focus(function () {
        $(".ui-datepicker-month").hide();
    });
});



// function to handel suggestion box
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search_genres');
    const suggestionBox = document.getElementById('suggestionBox');

    // Function to show the suggestion box
    function showSuggestions() {
        suggestionBox.style.display = 'block';
        suggestionBox.style.top = (searchInput.offsetTop + searchInput.offsetHeight) + 'px';
        suggestionBox.style.left = searchInput.offsetLeft + 'px';
        const input = searchInput.value.trim();
        const results = search(input);
        suggestionBox.innerHTML = '';
        for (let i = 0; i < results.length && i < 5; i++) {
            ele = document.createElement('div');
            ele.classList.add('suggestion');
            ele.addEventListener('click', function () {
                addsuggestion(results[i]);
            });
            ele.innerHTML = results[i];
            suggestionBox.appendChild(ele);
        }
    }

    // Function to add suggestion to the input field
    function addsuggestion(suggestion) {
        hideSuggestions();
        searchInput.value = '';
        container = document.getElementById('genre-container');
        if (container.innerHTML.trim() == 'No genres selected') {
            container.innerHTML = '';
        }
        ele = document.createElement('div');
        ele.classList.add('genre');
        ele.id = suggestion;
        ele.innerHTML = suggestion;
        ele.addEventListener('click', function () {
            removegenre(suggestion);
        });
        genres[suggestion] = true;
        container.appendChild(ele);
    }

    // Function to remove genre from the input field
    function removegenre(suggestion) {
        const genre = document.getElementById(suggestion);
        genre.remove();
        genres[genre.innerHTML] = false;
        container = document.getElementById('genre-container');
        console.log(container.innerHTML);
        if (container.innerHTML.trim() == '') {
            container.innerHTML = 'No genres selected';
        }
    }

    // Function to hide the suggestion box
    function hideSuggestions() {
        suggestionBox.style.display = 'none';
    }

    // Event listener for input field to show suggestion box
    searchInput.addEventListener('input', showSuggestions);

    // Event listener to hide suggestion box when user clicks outside
    document.addEventListener('click', function (event) {
        const targetElement = event.target;

        // Check if the click target is the search input or inside the suggestion box
        if (targetElement !== searchInput && !suggestionBox.contains(targetElement)) {
            hideSuggestions();
        }
    });
});


function get_data() {
    var data = {};
    data['genres'] = [];
    for (const genre in genres) {
        if (genres.hasOwnProperty(genre) && genres[genre]) {
            data['genres'].push(genre);
        }
    }
    if (data['genres'].length == 0) {
        alert('Please select atleast one genre');
        return;
    }
    start_year = document.getElementById('startYear').value;
    end_year = document.getElementById('endYear').value;
    data['years'] = [];
    if (start_year == '' || end_year == '' || start_year > end_year || start_year < 1924 || end_year > new Date().getFullYear()) {
        alert('Please select proper start and end year');
        return;
    }
    for (var i = start_year; i <= end_year; i++) {
        data['years'].push(i);
    }
    data['rating'] = { 'start': document.getElementById('startRating').value, 'end': document.getElementById('endRating').value };
    if (data['rating']['start'] == '' || data['rating']['end'] == '' || parseInt(data['rating']['start']) > parseInt(data['rating']['end']) || data['rating']['start'] < 0 || data['rating']['end'] > 100) {
        alert('Please select proper start and end rating');
        return;
    }
    // data['search'] = document.getElementById('search').value;
    // data['page'] = 1;
    // console.log(data);

    // send data to server
    $(".loading").show();
    setRequestHeader();
    $.ajax({
        dataType: 'json',
        type: 'POST',
        url: "/getanime/",
        data: data,
        success: function (data) {
            data = data['anime'];
            console.log(data);
            document.getElementById('result-container').innerHTML = '';
            anime_data = data.slice();
            data.forEach(function (item, index) {
                // Create div element with class "anime-card"
                var animeCard = document.createElement('div');
                animeCard.classList.add('anime-card');
                animeCard.addEventListener('click', function () {
                    document.getElementById('display-container').style.display = 'flex';
                    displayAnime(index);
                });
                // Create img element with class "left"
                var img = document.createElement('img');
                img.src = item.cover_image; // Set image source from item in dictionary
                img.classList.add('left');
                animeCard.appendChild(img); // Append img to animeCard

                // Create div element with class "right" and "info"
                var rightDiv = document.createElement('div');
                rightDiv.classList.add('right', 'info');

                // Create h3 element with class "title"
                var title = document.createElement('h3');
                title.textContent = item.name_romaji + " | " + item.name_english; // Set title text from item in dictionary
                rightDiv.appendChild(title); // Append title to rightDiv

                // Create div element with class "description"
                var description = document.createElement('div');
                description.innerHTML = item.desc; // Set description text from item in dictionary
                rightDiv.appendChild(description); // Append description to rightDiv

                // Append rightDiv to animeCard
                animeCard.appendChild(rightDiv);

                // Append animeCard to container element
                document.getElementById('result-container').appendChild(animeCard);
            });
            $(".loading").hide();
        },
        error: function (data) {
            $(".loading").hide();
            alert("Error:", data);
        }
    });
}


function displayAnime(index) {
    var item = anime_data[index];
    if (item.banner_image != null) {
        document.getElementById('anime_cover').src = item.banner_image;
        document.getElementById('anime-cover-container').style.backgroundImage = "url('" + item.banner_image + "')";
    }
    console.log(item);
}

function closeAnimeBox() {
    document.getElementById('display-container').style.display = 'none';
}